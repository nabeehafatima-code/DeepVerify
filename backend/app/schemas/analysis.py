from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class SuspiciousRegion(BaseModel):
    id: str
    type: str
    label: str
    description: str
    confidence: float = Field(ge=0, le=1)
    box: dict[str, float] | None = None


class AnalysisResponse(BaseModel):
    verification_id: str
    media_type: Literal['image', 'video', 'audio']
    filename: str
    file_size: str
    file_size_bytes: int
    file_type: str
    prediction: Literal['deepfake', 'authentic', 'inconclusive']
    deepfake_probability: float = Field(ge=0, le=1)
    authentic_probability: float = Field(ge=0, le=1)
    confidence: float = Field(ge=0, le=1)
    risk_level: Literal['low', 'medium', 'high']
    explanation: list[str]
    detailed_findings: list[dict]
    suspicious_regions: list[SuspiciousRegion]
    frame_analyses: list[dict] | None = None
    spectral_anomalies: list[dict] | None = None
    duration: str | None = None
    resolution: str | None = None
    sample_rate: str | None = None
    timestamp: datetime
    model_version: str
    model_details: dict
    media_preview_url: str | None = None
    heatmap_url: str | None = None
    explainability_method: str | None = None
    explainability_status: Literal['available', 'unavailable'] = 'unavailable'
    attention_summary: dict | None = None
    status: Literal['completed'] = 'completed'