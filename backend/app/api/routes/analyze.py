import hashlib
import time
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.core.config import settings
from app.schemas.analysis import AnalysisResponse
from app.services.inference_service import ModelNotConfiguredError, get_inference_service
from app.services.preprocessing import decode_image, validate_image_pixels
from app.services.report_service import save_report
from app.services.explainability_service import generate_heatmap
from app.services.video_service import VideoDecodeError, probe_and_sample_frames
from app.services.audio_service import AudioDecodeError, analyze_spectral_artifacts, decode_wav

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

    sha256_checksum = hashlib.sha256(contents).hexdigest()

    try:
        image = decode_image(contents)
        validate_image_pixels(image)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    stored_path = settings.uploads_dir / f'{uuid4().hex}{extension or ".img"}'
    stored_path.write_bytes(contents)

    inference_service = get_inference_service()
    try:
        started_at = time.perf_counter()
        prediction = inference_service.predict(image)
        latency_ms = int(round((time.perf_counter() - started_at) * 1000))
    except ModelNotConfiguredError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    metadata = inference_service.model_metadata()

    probability = prediction['deepfake_probability']
    risk_level = 'high' if probability >= 0.8 else 'medium' if probability >= 0.5 else 'low'

    try:
        heatmap_path, suspicious_regions, explainability = generate_heatmap(image, prediction)
    except Exception as exc:
        heatmap_path, suspicious_regions, explainability = None, [], {
            'status': 'unavailable',
            'method': 'attention-rollout',
            'summary': {'low': 0, 'moderate': 0, 'high': 0},
            'error': str(exc),
        }
        print(f'Heatmap generation failed: {exc}')

    heatmap_url = f'/uploads/{heatmap_path.name}' if heatmap_path else None
    explainability_status = explainability.get('status', 'unavailable')
    explainability_method = explainability.get('method', 'attention-rollout')
    attention_summary = explainability.get('summary', {'low': 0, 'moderate': 0, 'high': 0})

    explanation = [
        'Classification probability returned by the configured image detector.',
        'Suspicious regions localized using an edge/texture saliency heuristic '
        '(not a certified Grad-CAM attribution).'
        if suspicious_regions
        else 'No localized anomalies were flagged for this image.',
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
        suspicious_regions=suspicious_regions,
        model_details={
            'name': settings.deepfake_model_id,
            'architecture': metadata.get('architecture', 'Unknown'),
            'modelVersion': settings.model_version,
            'latencyMs': latency_ms,
            'sha256Checksum': sha256_checksum,
            'datasetTrained': settings.model_dataset_label,
            'raw_outputs': prediction.get('raw_outputs'),
            'raw_logits': prediction.get('raw_logits'),
            'debug': prediction.get('debug'),
            'heatmap_path': str(heatmap_path) if heatmap_path else None,
            'heatmapUrl': heatmap_url,
            'explainability_status': explainability_status,
            'explainability_method': explainability_method,
            'attention_summary': attention_summary,
            'threshold': prediction.get('threshold', 0.5),
            'preprocessing': prediction.get('preprocessing'),
        },
        timestamp=datetime.now(timezone.utc),
        model_version=settings.model_version,
        heatmap_url=heatmap_url,
        explainability_method=explainability_method,
        explainability_status=explainability_status,
        attention_summary=attention_summary,
    )
    save_report(report)
    return report


@router.post('/analyze/video', response_model=AnalysisResponse)
async def analyze_video(file: UploadFile = File(...)) -> AnalysisResponse:
    extension = Path(file.filename or '').suffix.lower()
    content_type = (file.content_type or '').lower()
    if extension not in {'.mp4', '.mov', '.webm', '.avi', '.mkv'} and not content_type.startswith('video/'):
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail='Only MP4, MOV, WEBM, AVI, and MKV videos are supported.')

    contents = await file.read()
    max_size = settings.max_video_size_mb * 1024 * 1024
    if not contents or len(contents) > max_size:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=f'Video must be between 1 byte and {settings.max_video_size_mb} MB.')

    sha256_checksum = hashlib.sha256(contents).hexdigest()
    stored_path = settings.uploads_dir / f'{uuid4().hex}{extension or ".mp4"}'
    stored_path.write_bytes(contents)

    inference_service = get_inference_service()
    try:
        started_at = time.perf_counter()
        try:
            sampled_frames, video_meta = probe_and_sample_frames(stored_path, max_frames=8)
        except VideoDecodeError as exc:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

        frame_analyses = []
        frame_predictions = []
        best_frame = None
        best_frame_probability = -1.0

        for frame_number, timestamp_seconds, frame_image in sampled_frames:
            try:
                frame_prediction = inference_service.predict(frame_image)
            except ModelNotConfiguredError as exc:
                raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
            except RuntimeError:
                continue

            frame_predictions.append(frame_prediction)
            deepfake_score = frame_prediction['deepfake_probability']
            is_suspicious = deepfake_score >= 0.5
            minutes, seconds = divmod(int(timestamp_seconds), 60)
            frame_analyses.append({
                'frameNumber': frame_number,
                'timestamp': round(timestamp_seconds, 2),
                'timestampFormatted': f'{minutes}:{seconds:02d}',
                'confidence': frame_prediction['confidence'],
                'deepfakeScore': deepfake_score,
                'isSuspicious': is_suspicious,
                'anomalyType': 'Frame-level texture/edge inconsistency' if is_suspicious else None,
            })

            if deepfake_score > best_frame_probability:
                best_frame_probability = deepfake_score
                best_frame = (frame_image, frame_prediction)

        latency_ms = int(round((time.perf_counter() - started_at) * 1000))

        if not frame_predictions:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail='The detector could not classify any sampled frame from this video.')

        mean_probability = sum(p['deepfake_probability'] for p in frame_predictions) / len(frame_predictions)
        max_probability = max(p['deepfake_probability'] for p in frame_predictions)
        deepfake_probability = round(0.6 * mean_probability + 0.4 * max_probability, 4)
        authentic_probability = round(1.0 - deepfake_probability, 4)
        confidence = max(deepfake_probability, authentic_probability)
        prediction = 'deepfake' if deepfake_probability >= authentic_probability else 'authentic'
        risk_level = 'high' if deepfake_probability >= 0.8 else 'medium' if deepfake_probability >= 0.5 else 'low'

        metadata = inference_service.model_metadata()

        heatmap_path, suspicious_regions = (None, [])
        if best_frame is not None:
            try:
                heatmap_path, suspicious_regions = generate_heatmap(best_frame[0], best_frame[1])
            except Exception as exc:
                print(f'Video heatmap generation failed: {exc}')
        heatmap_url = f'/uploads/{heatmap_path.name}' if heatmap_path else None

        duration_seconds = video_meta['duration_seconds']
        duration_minutes, duration_secs = divmod(int(duration_seconds), 60)

        explanation = [
            f"{len(frame_predictions)} frames were sampled across the video and each was scored by the "
            'same image detector used for standalone photos; there is no dedicated temporal/video model configured.',
            'Suspicious regions shown are localized on the most-flagged sampled frame using an edge/texture '
            'saliency heuristic (not a certified Grad-CAM attribution).'
            if suspicious_regions
            else 'No individual frame crossed the suspicious-region threshold.',
        ]

        report = AnalysisResponse(
            verification_id=f'DV-{datetime.now(timezone.utc).year}-{uuid4().hex[:8].upper()}',
            media_type='video',
            filename=file.filename or 'uploaded-video',
            file_size=f'{len(contents) / (1024 * 1024):.2f} MB',
            file_size_bytes=len(contents),
            file_type=content_type or 'video/unknown',
            prediction=prediction,
            deepfake_probability=deepfake_probability,
            authentic_probability=authentic_probability,
            confidence=confidence,
            risk_level=risk_level,
            explanation=explanation,
            detailed_findings=[],
            suspicious_regions=suspicious_regions,
            frame_analyses=frame_analyses,
            duration=f'{duration_minutes}:{duration_secs:02d}',
            resolution=f"{video_meta['width']}x{video_meta['height']}",
            model_details={
                'name': settings.deepfake_model_id,
                'architecture': metadata.get('architecture', 'Unknown'),
                'modelVersion': settings.model_version,
                'latencyMs': latency_ms,
                'sha256Checksum': sha256_checksum,
                'datasetTrained': settings.model_dataset_label,
                'raw_outputs': None,
                'heatmap_path': str(heatmap_path) if heatmap_path else None,
                'heatmapUrl': heatmap_url,
                'framesSampled': len(frame_predictions),
            },
            timestamp=datetime.now(timezone.utc),
            model_version=settings.model_version,
        )
        save_report(report)
        return report
    finally:
        stored_path.unlink(missing_ok=True)


@router.post('/analyze/audio', response_model=AnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)) -> AnalysisResponse:
    extension = Path(file.filename or '').suffix.lower()
    if extension != '.wav':
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail='Only WAV audio is currently supported. Convert other formats to PCM WAV before uploading.')

    contents = await file.read()
    max_size = settings.max_audio_size_mb * 1024 * 1024
    if not contents or len(contents) > max_size:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=f'Audio must be between 1 byte and {settings.max_audio_size_mb} MB.')

    sha256_checksum = hashlib.sha256(contents).hexdigest()

    try:
        samples, sample_rate = decode_wav(contents)
    except AudioDecodeError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    started_at = time.perf_counter()
    deepfake_probability, spectral_anomalies = analyze_spectral_artifacts(samples, sample_rate)
    latency_ms = int(round((time.perf_counter() - started_at) * 1000))

    authentic_probability = round(1.0 - deepfake_probability, 4)
    confidence = max(deepfake_probability, authentic_probability)
    prediction = 'deepfake' if deepfake_probability >= authentic_probability else 'authentic'
    risk_level = 'high' if deepfake_probability >= 0.8 else 'medium' if deepfake_probability >= 0.5 else 'low'

    duration_seconds = len(samples) / sample_rate if sample_rate else 0.0
    duration_minutes, duration_secs = divmod(int(duration_seconds), 60)

    explanation = [
        'No dedicated audio deepfake/voice-cloning classifier is configured for this deployment '
        '(see backend/MODEL_SELECTION.md); this result comes from a deterministic spectral-artifact scan, not a trained model.',
        f'{len(spectral_anomalies)} spectral anomaly window(s) were flagged.'
        if spectral_anomalies
        else 'No spectral anomalies crossed the heuristic threshold.',
    ]

    report = AnalysisResponse(
        verification_id=f'DV-{datetime.now(timezone.utc).year}-{uuid4().hex[:8].upper()}',
        media_type='audio',
        filename=file.filename or 'uploaded-audio',
        file_size=f'{len(contents) / (1024 * 1024):.2f} MB',
        file_size_bytes=len(contents),
        file_type=file.content_type or 'audio/wav',
        prediction=prediction,
        deepfake_probability=deepfake_probability,
        authentic_probability=authentic_probability,
        confidence=confidence,
        risk_level=risk_level,
        explanation=explanation,
        detailed_findings=[],
        suspicious_regions=[],
        spectral_anomalies=spectral_anomalies,
        duration=f'{duration_minutes}:{duration_secs:02d}',
        sample_rate=f'{sample_rate} Hz',
        model_details={
            'name': 'heuristic-spectral-scan',
            'architecture': 'Signal-processing heuristic (FFT-based); no trained model configured',
            'modelVersion': settings.model_version,
            'latencyMs': latency_ms,
            'sha256Checksum': sha256_checksum,
            'datasetTrained': 'N/A — not a trained model',
        },
        timestamp=datetime.now(timezone.utc),
        model_version=settings.model_version,
    )
    save_report(report)
    return report