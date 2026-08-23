from io import BytesIO

import cv2
import numpy as np
from PIL import Image, UnidentifiedImageError


SUPPORTED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/webp'}
SUPPORTED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}


def decode_image(contents: bytes) -> Image.Image:
    try:
        image = Image.open(BytesIO(contents))
        image.load()
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError('The uploaded file is not a readable image.') from exc

    if image.format not in {'JPEG', 'PNG', 'WEBP'}:
        raise ValueError('Only JPG, JPEG, PNG, and WEBP images are supported.')
    return image.convert('RGB')


def validate_image_pixels(image: Image.Image) -> None:
    pixels = np.asarray(image)
    if pixels.ndim != 3 or pixels.shape[2] != 3:
        raise ValueError('The image must contain three color channels.')
    if image.width < 32 or image.height < 32:
        raise ValueError('The image must be at least 32 x 32 pixels.')

    # OpenCV verifies that the decoded payload is usable by downstream CV code.
    if cv2.cvtColor(pixels, cv2.COLOR_RGB2BGR).size == 0:
        raise ValueError('The image contains no pixel data.')
