from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image

from app.services.inference_service import get_inference_service


IMAGE_EXTENSIONS = {'.bmp', '.jpeg', '.jpg', '.png', '.webp'}


def collect_images(dataset_root: Path) -> list[tuple[Path, str]]:
    entries: list[tuple[Path, str]] = []
    for folder_name, expected_label in (('real', 'authentic'), ('fake', 'deepfake')):
        folder = dataset_root / folder_name
        for image_path in sorted(folder.iterdir() if folder.exists() else []):
            if image_path.is_file() and image_path.suffix.lower() in IMAGE_EXTENSIONS:
                entries.append((image_path, expected_label))
    if not entries:
        raise ValueError(f'No supported images found below {dataset_root / "real"} and {dataset_root / "fake"}.')
    return entries


def run_diagnostic(dataset_root: Path, output_path: Path) -> dict:
    service = get_inference_service()
    records = []
    for image_path, expected_label in collect_images(dataset_root):
        with Image.open(image_path) as image:
            prediction = service.predict(image.convert('RGB'), include_debug=True)
        records.append({
            'filename': str(image_path),
            'expected_label': expected_label,
            'raw_logits': prediction.get('raw_logits'),
            'real_probability': prediction['real_probability'],
            'fake_probability': prediction['fake_probability'],
            'prediction': prediction['prediction'],
            'confidence': prediction['confidence'],
            'threshold': prediction['threshold'],
            'preprocessing': prediction['preprocessing'],
        })

    payload = {
        'model': service.model_id,
        'architecture': service.model_metadata().get('architecture'),
        'probability_method': 'softmax(raw_logits)',
        'label_mapping': {'0': 'Real/authentic', '1': 'Fake/deepfake'},
        'records': records,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2), encoding='utf-8')
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description='Run the configured image detector on a labeled diagnostic set.')
    parser.add_argument('--dataset', type=Path, default=Path('dataset'))
    parser.add_argument('--output', type=Path, default=Path('results/image_model_diagnostic.json'))
    args = parser.parse_args()
    payload = run_diagnostic(args.dataset, args.output)
    print(f"model={payload['model']} | images={len(payload['records'])} | output={args.output}")
    for record in payload['records']:
        print(
            f"{record['filename']} | logits={record['raw_logits']} | "
            f"real={record['real_probability']:.6f} | fake={record['fake_probability']:.6f} | "
            f"prediction={record['prediction']} | confidence={record['confidence']:.6f}"
        )


if __name__ == '__main__':
    main()