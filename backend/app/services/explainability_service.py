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


def _attention_rollout(model, pixel_values: torch.Tensor) -> np.ndarray:
    model.eval()
    with torch.no_grad():
        outputs = model(
            pixel_values=pixel_values,
            output_attentions=True,
            return_dict=True,
        )

    attentions = outputs.attentions
    if not attentions:
        raise ValueError('The model did not return attention tensors.')

    rollout = np.eye(attentions[0].shape[-1], dtype=np.float32)
    for attention in attentions:
        layer_attention = attention[0].detach().cpu().numpy()
        layer_attention = layer_attention.mean(axis=0)
        layer_attention = layer_attention + np.eye(layer_attention.shape[0], dtype=np.float32)
        layer_attention = layer_attention / np.clip(layer_attention.sum(axis=-1, keepdims=True), 1e-8, None)
        rollout = layer_attention @ rollout

    class_attention = rollout[0, 1:]
    grid_size = int(np.sqrt(class_attention.shape[0]))
    if grid_size * grid_size != class_attention.shape[0]:
        raise ValueError('Unexpected ViT patch count for attention rollout.')

    patch_attention = class_attention.reshape(grid_size, grid_size)
    patch_attention = patch_attention / np.clip(patch_attention.max(), 1e-8, None)
    return patch_attention


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


def generate_heatmap(image: Image.Image, prediction: dict) -> tuple[Optional[Path], list[dict], dict]:
    model_id = settings.deepfake_model_id
    if not model_id:
        return None, [], {'status': 'unavailable', 'method': 'attention-rollout', 'summary': {'low': 0, 'moderate': 0, 'high': 0}}

    try:
        processor = AutoImageProcessor.from_pretrained(model_id)
        model = AutoModelForImageClassification.from_pretrained(model_id)
        model.to('cpu')

        inputs = processor(images=image, return_tensors='pt')
        pixel_values = inputs['pixel_values']
        attention_map = _attention_rollout(model, pixel_values)
        normalized = _normalize_heatmap(attention_map)

        heatmap_resized = cv2.resize((normalized * 255).astype(np.uint8), (image.width, image.height), interpolation=cv2.INTER_LINEAR)
        heatmap_color = cv2.applyColorMap(heatmap_resized, cv2.COLORMAP_JET)
        image_bgr = cv2.cvtColor(np.array(image.convert('RGB')), cv2.COLOR_RGB2BGR)
        overlay = cv2.addWeighted(image_bgr, 0.65, heatmap_color, 0.35, 0)

        heatmap_path: Optional[Path] = None
        try:
            filename = f'heatmap_{uuid4().hex}.jpg'
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
            'method': 'attention-rollout',
            'summary': summary,
        }
    except Exception as exc:
        return None, [], {'status': 'unavailable', 'method': 'attention-rollout', 'summary': {'low': 0, 'moderate': 0, 'high': 0}, 'error': str(exc)}
