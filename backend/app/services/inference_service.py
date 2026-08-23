from functools import lru_cache

from PIL import Image

from app.core.config import settings


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

    def predict(self, image: Image.Image) -> dict:
        classifier = self._load_classifier()
        outputs = classifier(image, top_k=10)
        probabilities = {str(item['label']).lower(): float(item['score']) for item in outputs}
        deepfake_probability = sum(
            score for label, score in probabilities.items()
            if any(token in label for token in ('fake', 'deepfake', 'synthetic', 'manipulated'))
        )
        authentic_probability = sum(
            score for label, score in probabilities.items()
            if any(token in label for token in ('real', 'authentic', 'genuine'))
        )
        total = deepfake_probability + authentic_probability
        if total <= 0:
            raise RuntimeError(
                'The configured detector returned labels that could not be mapped to '
                'deepfake/authentic classes.'
            )
        deepfake_probability /= total
        authentic_probability /= total
        prediction = 'deepfake' if deepfake_probability >= authentic_probability else 'authentic'
        confidence = max(deepfake_probability, authentic_probability)
        return {
            'prediction': prediction,
            'deepfake_probability': deepfake_probability,
            'authentic_probability': authentic_probability,
            'confidence': confidence,
            'raw_outputs': outputs,
        }


@lru_cache(maxsize=1)
def get_inference_service() -> ImageInferenceService:
    return ImageInferenceService(settings.deepfake_model_id)
