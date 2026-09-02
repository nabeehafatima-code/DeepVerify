from __future__ import annotations

import argparse
import json
from pathlib import Path

from datasets import load_dataset


def export_subset(output_root: Path, samples_per_label: int) -> dict:
    output_root.mkdir(parents=True, exist_ok=True)
    for folder_name in ('real', 'fake'):
        (output_root / folder_name).mkdir(parents=True, exist_ok=True)

    dataset = load_dataset(
        'TheKernel01/Tiny-GenImage',
        split='train',
        streaming=True,
    )
    counts = {0: 0, 1: 0}
    records: list[dict] = []

    for row in dataset:
        label = int(row['label'])
        if label not in counts or counts[label] >= samples_per_label:
            if all(count >= samples_per_label for count in counts.values()):
                break
            continue

        counts[label] += 1
        filename = f'tiny_genimage_{label}_{counts[label]:03d}.jpg'
        folder_name = 'real' if label == 0 else 'fake'
        row['image'].convert('RGB').save(output_root / folder_name / filename, quality=95)
        records.append({
            'filename': filename,
            'label': label,
            'generator': int(row['generator']),
        })

    manifest = {
        'source': 'TheKernel01/Tiny-GenImage',
        'split': 'train',
        'label_mapping': {'0': 'real', '1': 'fake'},
        'counts': {'real': counts[0], 'fake': counts[1]},
        'records': records,
    }
    (output_root / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description='Export a small labeled Tiny-GenImage evaluation subset.')
    parser.add_argument('--output', type=Path, default=Path('dataset'))
    parser.add_argument('--samples-per-label', type=int, default=30)
    args = parser.parse_args()
    manifest = export_subset(args.output, args.samples_per_label)
    print(json.dumps(manifest['counts']))


if __name__ == '__main__':
    main()