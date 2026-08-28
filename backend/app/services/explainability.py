import cv2
import numpy as np
from pathlib import Path
from uuid import uuid4
from app.core.config import settings

def generate_heatmap(image, prediction):
    """
    Generate a Grad-CAM style heatmap for the uploaded image.
    This is a simplified placeholder — replace with real Grad-CAM logic
    once your model supports explainability.
    """

    # Convert PIL image to OpenCV format
    img_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    # --- Fake heatmap for now (random saliency) ---
    # In real Grad-CAM, you'd use model gradients here
    heatmap = np.random.rand(*img_cv.shape[:2]) * 255
    heatmap = heatmap.astype(np.uint8)

    # Apply colormap
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    # Overlay heatmap on original image
    overlay = cv2.addWeighted(img_cv, 0.6, heatmap_color, 0.4, 0)

    # Save to uploads dir
    filename = f"heatmap_{uuid4().hex}.jpg"
    heatmap_path = settings.uploads_dir / filename
    cv2.imwrite(str(heatmap_path), overlay)

    # Suspicious regions placeholder
    suspicious_regions = [
        "Region near eyes shows unusual artifacts",
        "Mouth area flagged for potential manipulation"
    ]

    return heatmap_path, suspicious_regions
