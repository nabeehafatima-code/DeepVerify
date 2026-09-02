from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from PIL import Image

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


def _collect_dataset_entries(dataset_root: Path) -> list[dict]:
    dataset_root = Path(dataset_root)
    entries: list[dict] = []
    for label_dir in ['real', 'fake']:
        folder = dataset_root / label_dir
        if not folder.exists():
            continue
        for image_path in sorted(folder.iterdir()):
            if not image_path.is_file() or image_path.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp', '.bmp'}:
                continue
            expected_label = 'authentic' if label_dir == 'real' else 'deepfake'
            entries.append({
                'image_path': image_path,
                'expected_label': expected_label,
            })
    if not entries:
        raise ValueError(f'No image files found in {dataset_root / "real"} and {dataset_root / "fake"}.')
    return entries


def _evaluate_thresholds(records: list[dict], thresholds: list[float]) -> list[dict]:
    results: list[dict] = []
    for threshold in thresholds:
        tp = fp = tn = fn = 0
        for record in records:
            expected_label = record['expected_label']
            predicted_label = 'deepfake' if record['score'] >= threshold else 'authentic'
            if expected_label == 'deepfake' and predicted_label == 'deepfake':
                tp += 1
            elif expected_label == 'authentic' and predicted_label == 'deepfake':
                fp += 1
            elif expected_label == 'authentic' and predicted_label == 'authentic':
                tn += 1
            elif expected_label == 'deepfake' and predicted_label == 'authentic':
                fn += 1
        total = tp + fp + tn + fn
        accuracy = (tp + tn) / total if total else 0.0
        precision = tp / (tp + fp) if (tp + fp) else 0.0
        recall = tp / (tp + fn) if (tp + fn) else 0.0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0
        results.append({
            'threshold': threshold,
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1,
            'tp': tp,
            'fp': fp,
            'tn': tn,
            'fn': fn,
            'false_positives': fp,
            'false_negatives': fn,
            'confusion_matrix': {'tn': tn, 'fp': fp, 'fn': fn, 'tp': tp},
        })
    return results


def _compute_roc_auc(records: list[dict]) -> float | None:
    try:
        from sklearn.metrics import roc_auc_score
    except Exception:
        return None
    y_true = [1 if record['expected_label'] == 'deepfake' else 0 for record in records]
    scores = [float(record['score']) for record in records]
    return float(roc_auc_score(y_true, scores))


def _run_evaluation(dataset_root: Path, thresholds: list[float], output_csv: Path | None = None, output_json: Path | None = None) -> dict:
    entries = _collect_dataset_entries(dataset_root)
    service = get_inference_service()
    records: list[dict] = []

    for entry in entries:
        image_path = Path(entry['image_path'])
        if not image_path.exists():
            raise FileNotFoundError(f'Missing dataset image: {image_path}')

        image = Image.open(image_path).convert('RGB')
        prediction = service.predict(image)
        score = float(prediction.get('fake_probability', 0.0))
        predicted_label = 'deepfake' if score >= 0.5 else 'authentic'
        correct = predicted_label == entry['expected_label']
        records.append({
            'image_path': str(image_path),
            'expected_label': entry['expected_label'],
            'predicted_label': predicted_label,
            'real_probability': float(prediction.get('real_probability', 0.0)),
            'fake_probability': float(prediction.get('fake_probability', 0.0)),
            'confidence': float(prediction.get('confidence', 0.0)),
            'correct': correct,
            'score': score,
        })

    thresholds = sorted(set(float(t) for t in thresholds))
    threshold_results = _evaluate_thresholds(records, thresholds)
    roc_auc = _compute_roc_auc(records)

    if output_csv:
        output_csv.parent.mkdir(parents=True, exist_ok=True)
        with output_csv.open('w', encoding='utf-8', newline='') as handle:
            writer = csv.DictWriter(
                handle,
                fieldnames=[
                    'image_path',
                    'expected_label',
                    'predicted_label',
                    'real_probability',
                    'fake_probability',
                    'confidence',
                    'correct',
                ],
            )
            writer.writeheader()
            for record in records:
                writer.writerow({
                    'image_path': record['image_path'],
                    'expected_label': record['expected_label'],
                    'predicted_label': record['predicted_label'],
                    'real_probability': f"{record['real_probability']:.8f}",
                    'fake_probability': f"{record['fake_probability']:.8f}",
                    'confidence': f"{record['confidence']:.8f}",
                    'correct': record['correct'],
                })

    payload = {
        'dataset_root': str(dataset_root),
        'total_images': len(records),
        'threshold_results': threshold_results,
        'roc_auc': roc_auc,
    }

    if output_json:
        output_json.parent.mkdir(parents=True, exist_ok=True)
        output_json.write_text(json.dumps(payload, indent=2), encoding='utf-8')

    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description='Evaluate the configured image detector on a labeled real/fake dataset.')
    parser.add_argument('--dataset', required=True, type=Path, help='Path to dataset root containing real/ and fake/ folders.')
    parser.add_argument('--thresholds', nargs='*', default=[0.5, 0.6, 0.7, 0.8, 0.9], type=float, help='Thresholds to evaluate.')
    parser.add_argument('--csv-output', type=Path, default=None, help='Optional CSV file for per-image predictions.')
    parser.add_argument('--json-output', type=Path, default=None, help='Optional JSON file for threshold summary.')
    args = parser.parse_args()

    results = _run_evaluation(args.dataset, args.thresholds, args.csv_output, args.json_output)
    best = max(results['threshold_results'], key=lambda item: item['f1'])
    print('Dataset evaluation summary:')
    for item in results['threshold_results']:
        print(
            f"threshold={item['threshold']:.2f} | "
            f"accuracy={item['accuracy']:.4f} | precision={item['precision']:.4f} | "
            f"recall={item['recall']:.4f} | f1={item['f1']:.4f} | "
            f"fp={item['false_positives']} | fn={item['false_negatives']}"
        )
    print(f"best_f1_threshold={best['threshold']:.2f} | f1={best['f1']:.4f}")
    if results['roc_auc'] is not None:
        print(f"roc_auc={results['roc_auc']:.4f}")
    if args.csv_output:
        print(f'CSV written to {args.csv_output}')
    if args.json_output:
        print(f'JSON written to {args.json_output}')


if __name__ == '__main__':
    main()
