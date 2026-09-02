from functools import lru_cache
from typing import TYPE_CHECKING

import torch
from PIL import Image

from app.core.config import settings


def _softmax(logits: torch.Tensor) -> torch.Tensor:
    return torch.softmax(logits, dim=-1)


def _normalize_label_scores(outputs: list[dict], id2label: dict | None = None) -> dict:
    id2label = id2label or {}
    normalized: dict[str, float] = {}
    for item in outputs:
        label = str(item.get('label', '')).strip()
        score = float(item.get('score', 0.0))
        if not label:
            continue
        normalized[label.lower()] = normalized.get(label.lower(), 0.0) + score

    if id2label:
        real_key = None
        fake_key = None
        for _, value in id2label.items():
            label_text = str(value).strip().lower()
            if label_text.startswith('real'):
                real_key = label_text
            if label_text.startswith('fake'):
                fake_key = label_text
        real_probability = normalized.get(real_key, 0.0) if real_key else 0.0
        fake_probability = normalized.get(fake_key, 0.0) if fake_key else 0.0
        if real_probability + fake_probability > 0:
            real_probability = real_probability / (real_probability + fake_probability)
            fake_probability = fake_probability / (real_probability + fake_probability)
            prediction = 'deepfake' if fake_probability >= real_probability else 'authentic'
            confidence = max(real_probability, fake_probability)
            return {
                'prediction': prediction,
                'real_probability': real_probability,
                'fake_probability': fake_probability,
                'confidence': confidence,
            }

    real_probability = normalized.get('real', 0.0) + normalized.get('authentic', 0.0) + normalized.get('genuine', 0.0)
    fake_probability = normalized.get('fake', 0.0) + normalized.get('deepfake', 0.0) + normalized.get('synthetic', 0.0) + normalized.get('manipulated', 0.0)
    if real_probability + fake_probability <= 0:
        for item in outputs:
            label = str(item.get('label', '')).strip().lower()
            if label in {'0', '1'}:
                numeric_index = int(label)
                if numeric_index == 0:
                    real_probability = float(item.get('score', 0.0))
                elif numeric_index == 1:
                    fake_probability = float(item.get('score', 0.0))
        if real_probability + fake_probability <= 0:
            raise RuntimeError('The configured detector returned labels that could not be mapped to deepfake/authentic classes.')

    real_probability = real_probability / (real_probability + fake_probability)
    fake_probability = fake_probability / (real_probability + fake_probability)
    prediction = 'deepfake' if fake_probability >= real_probability else 'authentic'
    confidence = max(real_probability, fake_probability)
    return {
        'prediction': prediction,
        'real_probability': real_probability,
        'fake_probability': fake_probability,
        'confidence': confidence,
    }

if TYPE_CHECKING:
    from transformers import ImageClassificationPipeline


class ModelNotConfiguredError(RuntimeError):
    pass


class ImageInferenceService:
    """Model boundary: preprocessing and HTTP routes do not know model details."""

    def __init__(self, model_id: str):
        self.model_id = model_id
        self._classifier = None

    def _load_classifier(self):
        if not self.model_id:
            raise ModelNotConfiguredError(
                'No image detector is configured. Set DEEPFAKE_MODEL_ID to a reviewed '
                'image-classification checkpoint before running analysis.'
            )
        if self._classifier is None:
            try:
                from transformers import pipeline
            except ImportError as exc:
                raise ModelNotConfiguredError(
                    'The detector runtime is missing. Install backend/requirements.txt.'
                ) from exc
            self._classifier = pipeline(
                'image-classification', model=self.model_id, device=-1
            )
        return self._classifier

    def predict(self, image: Image.Image, include_debug: bool = False) -> dict:
        classifier = self._load_classifier()
        from transformers import AutoImageProcessor

        processor = AutoImageProcessor.from_pretrained(self.model_id)
        inputs = processor(images=image, return_tensors='pt')
        with torch.no_grad():
            logits = classifier.model(**inputs).logits
        probs = _softmax(logits[0]).cpu().tolist()
        id2label = getattr(classifier.model.config, 'id2label', None) or {}
        label_scores = []
        for index, label_name in id2label.items():
            label_scores.append({'label': str(label_name), 'score': float(probs[int(index)] if int(index) < len(probs) else 0.0)})
        normalized = _normalize_label_scores(label_scores, id2label)
        normalized['deepfake_probability'] = normalized['fake_probability']
        normalized['authentic_probability'] = normalized['real_probability']
        normalized['raw_outputs'] = label_scores
        normalized['raw_logits'] = logits[0].cpu().tolist() if hasattr(logits, 'cpu') else logits.tolist()
        normalized['threshold'] = 0.5
        normalized['preprocessing'] = {
            'height': int(getattr(processor, 'size', {}).get('height', 224)),
            'width': int(getattr(processor, 'size', {}).get('width', 224)),
            'input_format': 'RGB',
            'normalization_mean': getattr(processor, 'image_mean', [0.5, 0.5, 0.5]),
            'normalization_std': getattr(processor, 'image_std', [0.5, 0.5, 0.5]),
        }
        if include_debug:
            normalized['debug'] = {
                'filename': getattr(image, 'filename', 'unknown'),
                'predicted_class': normalized['prediction'],
                'real_probability': normalized['real_probability'],
                'fake_probability': normalized['fake_probability'],
                'threshold': 0.5,
                'preprocessing_dimensions': {
                    'height': normalized['preprocessing']['height'],
                    'width': normalized['preprocessing']['width'],
                },
                'label_mapping': {str(key): str(value) for key, value in id2label.items()},
                'raw_logits': normalized['raw_logits'],
            }
        return normalized

    def model_metadata(self) -> dict:
        try:
            classifier = self._load_classifier()
            config = getattr(classifier.model, 'config', None)
            architectures = getattr(config, 'architectures', None) if config else None
            architecture = architectures[0] if architectures else type(classifier.model).__name__
        except Exception:
            architecture = 'Unknown (see checkpoint model card)'
        return {'checkpoint': self.model_id, 'architecture': architecture}


@lru_cache(maxsize=1)
def get_inference_service() -> ImageInferenceService:
    return ImageInferenceService(settings.deepfake_model_id)