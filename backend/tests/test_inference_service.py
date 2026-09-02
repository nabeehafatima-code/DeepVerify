from app.services.inference_service import _normalize_label_scores


def test_exact_real_fake_mapping_uses_model_labels():
    outputs = [
        {'label': 'Real', 'score': 0.8},
        {'label': 'Fake', 'score': 0.2},
    ]

    normalized = _normalize_label_scores(outputs, {'0': 'Real', '1': 'Fake'})

    assert normalized['real_probability'] == 0.8
    assert normalized['fake_probability'] == 0.2
    assert normalized['prediction'] == 'authentic'
    assert normalized['confidence'] == 0.8


def test_numeric_model_labels_are_mapped_without_fuzzy_string_matching():
    outputs = [
        {'label': '0', 'score': 0.9},
        {'label': '1', 'score': 0.1},
    ]

    normalized = _normalize_label_scores(outputs, {'0': 'Real', '1': 'Fake'})

    assert normalized['real_probability'] == 0.9
    assert normalized['fake_probability'] == 0.1
    assert normalized['prediction'] == 'authentic'
