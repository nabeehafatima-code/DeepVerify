from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.core.config import settings
from app.schemas.analysis import AnalysisResponse
from app.services.inference_service import ModelNotConfiguredError, get_inference_service
from app.services.preprocessing import decode_image, validate_image_pixels
from app.services.report_service import save_report

router = APIRouter(tags=['analysis'])


@router.post('/analyze/image', response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)) -> AnalysisResponse:
    extension = Path(file.filename or '').suffix.lower()
    content_type = (file.content_type or '').lower()
    if extension not in {'.jpg', '.jpeg', '.png', '.webp'} and content_type not in {
        'image/jpeg', 'image/png', 'image/webp'
    }:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail='Only JPG, JPEG, PNG, and WEBP images are supported.')

    contents = await file.read()
    max_size = settings.max_image_size_mb * 1024 * 1024
    if not contents or len(contents) > max_size:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=f'Image must be between 1 byte and {settings.max_image_size_mb} MB.')

    try:
        image = decode_image(contents)
        validate_image_pixels(image)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    stored_path = settings.uploads_dir / f'{uuid4().hex}{extension or ".img"}'
    stored_path.write_bytes(contents)

    try:
        prediction = get_inference_service().predict(image)
    except ModelNotConfiguredError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    probability = prediction['deepfake_probability']
    risk_level = 'high' if probability >= 0.8 else 'medium' if probability >= 0.5 else 'low'
    explanation = [
        'Classification probability returned by the configured image detector.',
        'No localization findings were returned by the configured model.'
    ]
    report = AnalysisResponse(
        verification_id=f'DV-{datetime.now(timezone.utc).year}-{uuid4().hex[:8].upper()}',
        media_type='image',
        filename=file.filename or 'uploaded-image',
        file_size=f'{len(contents) / (1024 * 1024):.2f} MB',
        file_size_bytes=len(contents),
        file_type=content_type or 'image/unknown',
        prediction=prediction['prediction'],
        deepfake_probability=prediction['deepfake_probability'],
        authentic_probability=prediction['authentic_probability'],
        confidence=prediction['confidence'],
        risk_level=risk_level,
        explanation=explanation,
        detailed_findings=[],
        suspicious_regions=[],
        timestamp=datetime.now(timezone.utc),
        model_version=settings.model_version,
        model_details={'name': settings.deepfake_model_id, 'raw_outputs': prediction['raw_outputs']},
    )
    save_report(report)
    return report


@router.post('/analyze/video', status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def analyze_video() -> None:
    raise HTTPException(status_code=501, detail='Video inference is not implemented yet.')


@router.post('/analyze/audio', status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def analyze_audio() -> None:
    raise HTTPException(status_code=501, detail='Audio inference is not implemented yet.')
