"""
Video sampling utilities for deepfake analysis.

Video frames are decoded with OpenCV and each sampled frame is scored by the
same image classifier used for standalone image uploads
(`ImageInferenceService`) — there is no dedicated temporal/video deepfake
model configured. This keeps the video path honest about what it actually
does: per-frame image classification aggregated over time, not a certified
video-specific detector (see backend/MODEL_SELECTION.md).
"""

from pathlib import Path

import cv2
from PIL import Image


class VideoDecodeError(ValueError):
    pass


def probe_and_sample_frames(video_path: Path, max_frames: int = 8) -> tuple[list[tuple[int, float, Image.Image]], dict]:
    """
    Returns (frames, metadata).

    frames: list of (frame_number, timestamp_seconds, PIL.Image) evenly
    spaced across the video, capped at `max_frames` to bound latency.
    metadata: {'fps', 'frame_count', 'duration_seconds', 'width', 'height'}
    """
    capture = cv2.VideoCapture(str(video_path))
    if not capture.isOpened():
        raise VideoDecodeError('The uploaded file could not be read as a video.')

    try:
        fps = capture.get(cv2.CAP_PROP_FPS) or 0.0
        frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
        height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)

        if fps <= 0 or frame_count <= 0:
            raise VideoDecodeError('The video has no readable frames.')

        duration_seconds = frame_count / fps
        sample_count = max(1, min(max_frames, frame_count))
        target_frame_indices = [
            int(round(index * (frame_count - 1) / max(1, sample_count - 1)))
            for index in range(sample_count)
        ]

        frames: list[tuple[int, float, Image.Image]] = []
        for frame_number in target_frame_indices:
            capture.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
            success, bgr_frame = capture.read()
            if not success:
                continue
            rgb_frame = cv2.cvtColor(bgr_frame, cv2.COLOR_BGR2RGB)
            frames.append((frame_number, frame_number / fps, Image.fromarray(rgb_frame)))

        if not frames:
            raise VideoDecodeError('No frames could be decoded from the video.')

        metadata = {
            'fps': fps,
            'frame_count': frame_count,
            'duration_seconds': duration_seconds,
            'width': width,
            'height': height,
        }
        return frames, metadata
    finally:
        capture.release()