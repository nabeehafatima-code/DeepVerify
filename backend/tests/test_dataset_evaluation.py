from pathlib import Path

from evaluate_dataset import _collect_dataset_entries, _evaluate_thresholds


def test_collect_dataset_entries_supports_real_fake_directory_layout(tmp_path: Path):
    real_dir = tmp_path / 'real'
    fake_dir = tmp_path / 'fake'
    real_dir.mkdir()
    fake_dir.mkdir()

    (real_dir / 'a.png').write_bytes(b'fake-png')
    (fake_dir / 'b.png').write_bytes(b'fake-png')

    entries = _collect_dataset_entries(tmp_path)

    assert {entry['expected_label'] for entry in entries} == {'authentic', 'deepfake'}
    assert {entry['image_path'].parent.name for entry in entries} == {'real', 'fake'}
    assert len(entries) == 2


def test_evaluate_thresholds_returns_tradeoff_counts():
    records = [
        {'expected_label': 'authentic', 'score': 0.10},
        {'expected_label': 'authentic', 'score': 0.80},
        {'expected_label': 'deepfake', 'score': 0.20},
        {'expected_label': 'deepfake', 'score': 0.90},
    ]

    outcomes = _evaluate_thresholds(records, [0.5, 0.7])

    assert len(outcomes) == 2
    assert outcomes[0]['threshold'] == 0.5
    assert outcomes[0]['false_positives'] == 1
    assert outcomes[0]['false_negatives'] == 1
    assert outcomes[0]['precision'] >= 0.0
    assert outcomes[0]['recall'] >= 0.0
