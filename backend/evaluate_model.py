from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from PIL import Image

from app.core.config import settings
from app.services.inference_service import get_inference_service


LABEL_NORMALIZATION = {
    'real': 'authentic',
    'authentic': 'authentic',
    'genuine': 'authentic',
    'fake': 'deepfake',
    'deepfake': 'deepfake',
    'synthetic': 'deepfake',
    'manipulated': 'deepfake',
    '0': 'authentic',
    '1': 'deepfake',
}


def _normalize_label(value: str) -> str:
    return LABEL_NORMALIZATION.get(str(value).strip().lower(), str(value).strip().lower())


def _load_dataset(csv_path: Path) -> list[dict]:
    rows: list[dict] = []
    with csv_path.open('r', encoding='utf-8', newline='') as handle:
        reader = csv.DictReader(handle)
        required = {'image_path', 'label'}
        missing = required - set(reader.fieldnames or [])
        if missing:
            raise ValueError(f'CSV missing required columns: {sorted(missing)}')
        for row in reader:
            image_path = (csv_path.parent / row['image_path']).resolve()
            label = _normalize_label(row['label'])
            if label not in {'authentic', 'deepfake'}:
                raise ValueError(f'Unsupported label {row["label"]!r} for {image_path}. Use authentic or deepfake.')
            rows.append({'image_path': image_path, 'label': label})
    return rows


def _compute_metrics(y_true: list[int], y_pred: list[int], probabilities: list[float]) -> dict:
    total = len(y_true)
    correct = sum(int(a == b) for a, b in zip(y_true, y_pred))
    tp = sum(1 for a, b in zip(y_true, y_pred) if a == 1 and b == 1)
    tn = sum(1 for a, b in zip(y_true, y_pred) if a == 0 and b == 0)
    fp = sum(1 for a, b in zip(y_true, y_pred) if a == 0 and b == 1)
    fn = sum(1 for a, b in zip(y_true, y_pred) if a == 1 and b == 0)
    accuracy = correct / total if total else 0.0
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0

    positive_scores = [probabilities[i] for i, label in enumerate(y_true) if label == 1]
    negative_scores = [probabilities[i] for i, label in enumerate(y_true) if label == 0]
    try:
        from sklearn.metrics import roc_auc_score
        roc_auc = roc_auc_score(y_true, probabilities)
    except Exception:
        roc_auc = None

    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1,
        'tp': tp,
        'tn': tn,
        'fp': fp,
        'fn': fn,
        'confusion_matrix': {'tn': tn, 'fp': fp, 'fn': fn, 'tp': tp},
        'roc_auc': roc_auc,
    }


def _evaluate_thresholds(dataset: list[dict], thresholds: list[float]) -> list[dict]:
    service = get_inference_service()
    records: list[dict] = []
    for entry in dataset:
        image_path = Path(entry['image_path'])
        if not image_path.exists():
            raise FileNotFoundError(f'Missing dataset image: {image_path}')
        image = Image.open(image_path).convert('RGB')
        prediction = service.predict(image)
        score = float(prediction.get('deepfake_probability', 0.0))
        records.append({
            'image_path': str(image_path),
            'expected': 1 if entry['label'] == 'deepfake' else 0,
            'score': score,
            'predicted_label': 'deepfake' if score >= 0.5 else 'authentic',
        })

    results = []
    for threshold in thresholds:
        preds = [1 if record['score'] >= threshold else 0 for record in records]
        truth = [record['expected'] for record in records]
        metrics = _compute_metrics(truth, preds, [record['score'] for record in records])
        results.append({
            'threshold': threshold,
            **metrics,
        })
    return results


def main() -> None:
    parser = argparse.ArgumentParser(description='Evaluate the configured DeepVerify image detector on a labeled image set.')
    parser.add_argument('--csv', required=True, type=Path, help='CSV file with columns: image_path,label')
    parser.add_argument('--thresholds', nargs='*', default=[0.5, 0.6, 0.7, 0.8, 0.9], type=float, help='Thresholds to evaluate.')
    parser.add_argument('--output', type=Path, default=None, help='Optional JSON output path to save metrics.')
    args = parser.parse_args()

    dataset = _load_dataset(args.csv)
    if not dataset:
        raise ValueError('The dataset CSV is empty.')

    results = _evaluate_thresholds(dataset, sorted(set(args.thresholds)))
    best = max(results, key=lambda item: item['f1'])
    print('Evaluation results:')
    for result in results:
        print(
            f"threshold={result['threshold']:.2f} | accuracy={result['accuracy']:.4f} | "
            f"precision={result['precision']:.4f} | recall={result['recall']:.4f} | "
            f"f1={result['f1']:.4f} | confusion={result['confusion_matrix']}"
        )
    print(f'Best F1 threshold: {best["threshold"]:.2f} with F1={best["f1"]:.4f}')

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        payload = {'best_threshold': best['threshold'], 'best_f1': best['f1'], 'results': results}
        args.output.write_text(json.dumps(payload, indent=2), encoding='utf-8')
        print(f'Metrics saved to {args.output}')


if __name__ == '__main__':
    main()
