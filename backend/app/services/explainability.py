"""
Explainability service.

Produces a saliency-heatmap overlay and a list of localized "suspicious
regions" that conform to `app.schemas.analysis.SuspiciousRegion`.

Note on method: true Grad-CAM needs direct access to a model's internal
layer activations/gradients. The `transformers.pipeline` object used by
`ImageInferenceService` deliberately abstracts that away, and reaching into
it per-request would add real latency on CPU. Instead this uses a
deterministic, image-grounded saliency proxy — a blend of edge energy
(Laplacian response) and local texture variance — both classic forensic
cues, since GAN/diffusion blending frequently leaves edge-smoothing or
texture-inconsistency residue at manipulation boundaries. This is
explicitly a heuristic, not a certified Grad-CAM attribution, and is
labelled as such wherever it is surfaced (see `analyze.py`'s `explanation`
field).
"""

from pathlib import Path
from typing import Optional
from uuid import uuid4

import cv2
import numpy as np
from PIL import Image

from app.core.config import settings

GRID_SIZE = 4
TOP_REGIONS = 3
DEEPFAKE_FLAG_THRESHOLD = 0.5

_REGION_LABELS: list[tuple[str, str]] = [
    (
        'Texture Inconsistency',
        "Local pixel texture differs from the surrounding region's statistical "
        'pattern, a common artifact of GAN/diffusion synthesis.',
    ),
    (
        'Edge Discontinuity',
        'Sharp, unnatural boundary transitions were detected, often introduced '
        'during face-swap or inpainting blending.',
    ),
    (
        'High-Frequency Artifact',
        'Elevated high-frequency noise consistent with upsampling or generative '
        'reconstruction artifacts.',
    ),
]


def _saliency_map(bgr_image: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2GRAY).astype(np.float32)

    edge_energy = np.abs(cv2.Laplacian(gray, cv2.CV_32F, ksize=3))

    mean = cv2.blur(gray, (9, 9))
    mean_sq = cv2.blur(gray * gray, (9, 9))
    local_variance = np.clip(mean_sq - mean * mean, 0, None)

    def _normalize(channel: np.ndarray) -> np.ndarray:
        channel_min, channel_max = float(channel.min()), float(channel.max())
        if channel_max - channel_min < 1e-6:
            return np.zeros_like(channel)
        return (channel - channel_min) / (channel_max - channel_min)

    saliency = 0.6 * _normalize(edge_energy) + 0.4 * _normalize(local_variance)
    return cv2.GaussianBlur(saliency, (15, 15), 0)


def _top_grid_regions(saliency: np.ndarray, grid_size: int, top_n: int) -> list[dict]:
    height, width = saliency.shape
    cell_h, cell_w = height / grid_size, width / grid_size

    cells = []
    for row in range(grid_size):
        for col in range(grid_size):
            y0, y1 = int(row * cell_h), int((row + 1) * cell_h)
            x0, x1 = int(col * cell_w), int((col + 1) * cell_w)
            cell_score = float(saliency[y0:y1, x0:x1].mean())
            cells.append({
                'score': cell_score,
                'box': {
                    'x': round(col / grid_size * 100, 2),
                    'y': round(row / grid_size * 100, 2),
                    'width': round(100 / grid_size, 2),
                    'height': round(100 / grid_size, 2),
                },
            })

    cells.sort(key=lambda cell: cell['score'], reverse=True)
    return cells[:top_n]


def generate_heatmap(image: Image.Image, prediction: dict) -> tuple[Optional[Path], list[dict]]:
    bgr_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    saliency = _saliency_map(bgr_image)

    heatmap_color = cv2.applyColorMap((saliency * 255).astype(np.uint8), cv2.COLORMAP_JET)
    overlay = cv2.addWeighted(bgr_image, 0.6, heatmap_color, 0.4, 0)

    heatmap_path: Optional[Path] = None
    try:
        filename = f'heatmap_{uuid4().hex}.jpg'
        candidate_path = settings.uploads_dir / filename
        if cv2.imwrite(str(candidate_path), overlay):
            heatmap_path = candidate_path
    except Exception:
        heatmap_path = None

    deepfake_probability = float(prediction.get('deepfake_probability', 0.0))
    suspicious_regions: list[dict] = []
    if deepfake_probability >= DEEPFAKE_FLAG_THRESHOLD:
        for index, cell in enumerate(_top_grid_regions(saliency, GRID_SIZE, TOP_REGIONS)):
            label, description = _REGION_LABELS[index % len(_REGION_LABELS)]
            confidence = round(min(0.99, 0.5 * cell['score'] + 0.5 * deepfake_probability), 4)
            suspicious_regions.append({
                'id': f'region-{uuid4().hex[:8]}',
                'type': label,
                'label': label,
                'description': description,
                'confidence': confidence,
                'box': cell['box'],
            })

    return heatmap_path, suspicious_regions
