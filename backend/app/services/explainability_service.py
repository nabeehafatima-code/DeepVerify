from __future__ import annotations

from pathlib import Path
from typing import Optional
from uuid import uuid4

import cv2
import numpy as np
import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

from app.core.config import settings

GRID_SIZE = 4
TOP_REGIONS = 3


def _predicted_class_index(model, prediction: dict) -> int:
    labels = getattr(model.config, 'id2label', {}) or {}
    target_prediction = prediction.get('prediction')
    for index, label in labels.items():
        normalized = str(label).strip().lower()
        is_fake = normalized in {'fake', 'deepfake', 'synthetic', 'manipulated', 'artificial', 'generated', 'ai'}
        is_real = normalized in {'real', 'authentic', 'genuine', 'human'}
        if target_prediction == 'deepfake' and is_fake:
            return int(index)
        if target_prediction == 'authentic' and is_real:
            return int(index)
    raise ValueError(f'Could not map predicted class {target_prediction!r} to the model labels.')


def _swin_grad_cam(model, pixel_values: torch.Tensor, prediction: dict) -> np.ndarray:
    target_layer = model.swin.encoder.layers[-1].blocks[-1].output
    activation: torch.Tensor | None = None

    def capture_activation(_module, _inputs, output):
        nonlocal activation
        activation = output
        activation.retain_grad()

    hook = target_layer.register_forward_hook(capture_activation)
    try:
        model.eval()
        model.zero_grad(set_to_none=True)
        outputs = model(pixel_values=pixel_values, return_dict=True)
        class_index = _predicted_class_index(model, prediction)
        outputs.logits[0, class_index].backward()
        if activation is None or activation.grad is None:
            raise ValueError('The Swin target layer did not produce gradients.')

        activations = activation[0]
        gradients = activation.grad[0]
        weights = gradients.mean(dim=0)
        cam = torch.relu((activations * weights).sum(dim=-1))
        grid_size = int(np.sqrt(cam.shape[0]))
        if grid_size * grid_size != cam.shape[0]:
            raise ValueError(f'Unexpected Swin token count: {cam.shape[0]}.')
        return cam.reshape(grid_size, grid_size).detach().cpu().numpy()
    finally:
        hook.remove()


def _normalize_heatmap(heatmap: np.ndarray) -> np.ndarray:
    heatmap = heatmap.astype(np.float32)
    heatmap_min = float(heatmap.min())
    heatmap_max = float(heatmap.max())
    if heatmap_max - heatmap_min < 1e-6:
        return np.zeros_like(heatmap)
    return (heatmap - heatmap_min) / (heatmap_max - heatmap_min)


def _build_regions_from_attention(attention_map: np.ndarray, prediction: dict) -> list[dict]:
    score_scale = float(prediction.get('deepfake_probability', 0.0))
    if score_scale <= 0:
        return []

    height, width = attention_map.shape
    cell_h = height / GRID_SIZE
    cell_w = width / GRID_SIZE
    regions: list[dict] = []

    for row in range(GRID_SIZE):
        for col in range(GRID_SIZE):
            y0 = int(row * cell_h)
            y1 = int((row + 1) * cell_h)
            x0 = int(col * cell_w)
            x1 = int((col + 1) * cell_w)
            cell_score = float(attention_map[y0:y1, x0:x1].mean())
            if cell_score <= 0.15:
                continue
            regions.append({
                'score': cell_score,
                'box': {
                    'x': round(col / GRID_SIZE * 100, 2),
                    'y': round(row / GRID_SIZE * 100, 2),
                    'width': round(100 / GRID_SIZE, 2),
                    'height': round(100 / GRID_SIZE, 2),
                },
            })

    regions.sort(key=lambda entry: entry['score'], reverse=True)
    selected: list[dict] = []
    labels = [
        ('High Model Attention', 'Regions with the strongest contribution to the model prediction for this image.'),
        ('Moderate Model Attention', 'These areas contributed to the classifier output but were less dominant.'),
        ('Low Model Attention', 'Lower saliency regions are shown in cooler colors and are less influential.')
    ]
    for index, region in enumerate(regions[:TOP_REGIONS]):
        label, description = labels[min(index, len(labels) - 1)]
        confidence = round(min(0.99, 0.35 + 0.65 * region['score'] + 0.1 * score_scale), 4)
        selected.append({
            'id': f'rollout-{uuid4().hex[:8]}',
            'type': label,
            'label': label,
            'description': description,
            'confidence': confidence,
            'box': region['box'],
        })
    return selected


def generate_heatmap(image: Image.Image, prediction: dict, verification_id: str | None = None) -> tuple[Optional[Path], list[dict], dict]:
    model_id = settings.deepfake_model_id
    if not model_id:
        return None, [], {'status': 'unavailable', 'method': 'attention-rollout', 'summary': {'low': 0, 'moderate': 0, 'high': 0}}

    try:
        processor = AutoImageProcessor.from_pretrained(model_id)
        model = AutoModelForImageClassification.from_pretrained(model_id)
        model.to('cpu')

        inputs = processor(images=image, return_tensors='pt')
        pixel_values = inputs['pixel_values']
        attention_map = _swin_grad_cam(model, pixel_values, prediction)
        normalized = _normalize_heatmap(attention_map)

        heatmap_resized = cv2.resize((normalized * 255).astype(np.uint8), (image.width, image.height), interpolation=cv2.INTER_LINEAR)
        heatmap_color = cv2.applyColorMap(heatmap_resized, cv2.COLORMAP_JET)
        image_bgr = cv2.cvtColor(np.array(image.convert('RGB')), cv2.COLOR_RGB2BGR)
        overlay = cv2.addWeighted(image_bgr, 0.65, heatmap_color, 0.35, 0)

        heatmap_path: Optional[Path] = None
        try:
            safe_id = ''.join(character for character in (verification_id or uuid4().hex) if character.isalnum() or character in {'-', '_'})
            filename = f'heatmap_{safe_id}.png'
            candidate_path = settings.uploads_dir / filename
            if cv2.imwrite(str(candidate_path), overlay):
                heatmap_path = candidate_path
        except Exception:
            heatmap_path = None

        low_count = int(np.mean(normalized < 0.35) * 100)
        moderate_count = int(np.mean((normalized >= 0.35) & (normalized < 0.7)) * 100)
        high_count = int(np.mean(normalized >= 0.7) * 100)
        summary = {'low': low_count, 'moderate': moderate_count, 'high': high_count}
        suspicious_regions = _build_regions_from_attention(normalized, prediction)
        return heatmap_path, suspicious_regions, {
            'status': 'available',
            'method': 'swin-grad-cam',
            'summary': summary,
        }
    except Exception as exc:
        return None, [], {'status': 'unavailable', 'method': 'swin-grad-cam', 'summary': {'low': 0, 'moderate': 0, 'high': 0}, 'error': str(exc)}
