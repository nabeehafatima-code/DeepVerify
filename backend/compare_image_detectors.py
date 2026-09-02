from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path

import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

from app.services.inference_service import get_inference_service


IMAGE_EXTENSIONS = {'.bmp', '.jpeg', '.jpg', '.png', '.webp'}
MODEL_SPECS = {
    'umm-maybe/AI-image-detector': {'fake': {'artificial'}, 'real': {'human'}},
    'Ateeqq/ai-vs-human-image-detector': {'fake': {'ai'}, 'real': {'hum'}},
    'NYUAD-ComNets/NYUAD_AI-generated_images_detector': {'fake': {'dalle', 'sd'}, 'real': {'real'}},
}


def collect_entries(dataset_root: Path) -> list[tuple[Path, str, str]]:
    manifest = json.loads((dataset_root / 'manifest.json').read_text(encoding='utf-8'))
    generator_by_filename = {item['filename']: item['generator'] for item in manifest['records']}
    entries = []
    for folder_name, expected_label in (('real', 'real'), ('fake', 'fake')):
        for image_path in sorted((dataset_root / folder_name).iterdir()):
            if image_path.suffix.lower() in IMAGE_EXTENSIONS:
                entries.append((image_path, expected_label, str(generator_by_filename.get(image_path.name, 'unknown'))))
    if not entries:
        raise ValueError(f'No images found under {dataset_root}.')
    return entries


def metrics(records: list[dict]) -> dict:
    tp = sum(record['expected'] == 'fake' and record['predicted'] == 'fake' for record in records)
    fp = sum(record['expected'] == 'real' and record['predicted'] == 'fake' for record in records)
    tn = sum(record['expected'] == 'real' and record['predicted'] == 'real' for record in records)
    fn = sum(record['expected'] == 'fake' and record['predicted'] == 'real' for record in records)
    total = len(records)
    accuracy = (tp + tn) / total if total else 0.0
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    return {
        'total': total,
        'accuracy': accuracy,
        'fake_precision': precision,
        'fake_recall': recall,
        'f1': f1,
        'true_positives': tp,
        'true_negatives': tn,
        'false_positives': fp,
        'false_negatives': fn,
        'confusion_matrix': {'tn': tn, 'fp': fp, 'fn': fn, 'tp': tp},
    }


def evaluate_current(entries: list[tuple[Path, str, str]]) -> dict:
    service = get_inference_service()
    records = []
    for path, expected, generator in entries:
        with Image.open(path) as image:
            prediction = service.predict(image.convert('RGB'))
        records.append({
            'expected': expected,
            'predicted': 'fake' if prediction['deepfake_probability'] >= 0.5 else 'real',
            'generator': generator,
        })
    return {'model': service.model_id, 'architecture': service.model_metadata()['architecture'], 'metrics': metrics(records), 'generator_metrics': generator_metrics(records)}


def evaluate_candidate(model_id: str, entries: list[tuple[Path, str, str]]) -> dict:
    processor = AutoImageProcessor.from_pretrained(model_id)
    model = AutoModelForImageClassification.from_pretrained(model_id).eval()
    labels = {str(value).strip().lower(): int(key) for key, value in model.config.id2label.items()}
    mapping = MODEL_SPECS[model_id]
    records = []
    for path, expected, generator in entries:
        with Image.open(path) as image:
            inputs = processor(images=image.convert('RGB'), return_tensors='pt')
        with torch.no_grad():
            probabilities = torch.softmax(model(**inputs).logits[0], dim=-1)
        fake_score = sum(float(probabilities[index]) for label, index in labels.items() if label in mapping['fake'])
        real_score = sum(float(probabilities[index]) for label, index in labels.items() if label in mapping['real'])
        records.append({'expected': expected, 'predicted': 'fake' if fake_score >= real_score else 'real', 'generator': generator})
    return {
        'model': model_id,
        'architecture': model.__class__.__name__,
        'labels': model.config.id2label,
        'preprocessing': {'size': processor.size, 'mean': processor.image_mean, 'std': processor.image_std},
        'metrics': metrics(records),
        'generator_metrics': generator_metrics(records),
    }


def generator_metrics(records: list[dict]) -> dict:
    output = {}
    for generator in sorted({record['generator'] for record in records if record['expected'] == 'fake'}):
        fake_records = [record for record in records if record['generator'] == generator and record['expected'] == 'fake']
        output[generator] = {
            'fake_images': len(fake_records),
            'detected_as_fake': sum(record['predicted'] == 'fake' for record in fake_records),
            'fake_recall': sum(record['predicted'] == 'fake' for record in fake_records) / len(fake_records),
        }
    return output


def main() -> None:
    parser = argparse.ArgumentParser(description='Compare image detectors without changing production configuration.')
    parser.add_argument('--dataset', type=Path, default=Path('dataset'))
    parser.add_argument('--output', type=Path, default=Path('results/detector_comparison.json'))
    args = parser.parse_args()
    entries = collect_entries(args.dataset)
    results = {'dataset': str(args.dataset), 'images': len(entries), 'threshold': 0.5, 'models': [evaluate_current(entries)]}
    for model_id in MODEL_SPECS:
        results['models'].append(evaluate_candidate(model_id, entries))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(results, indent=2), encoding='utf-8')
    for result in results['models']:
        print(result['model'], json.dumps(result['metrics']))


if __name__ == '__main__':
    main()