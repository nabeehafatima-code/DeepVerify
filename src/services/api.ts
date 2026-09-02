import { AnalysisProgressEvent, MediaType, VerificationReport } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

type BackendAnalysisResponse = {
  verification_id: string;
  media_type: MediaType;
  filename: string;
  file_size: string;
  file_size_bytes: number;
  file_type: string;
  prediction: VerificationReport['prediction'];
  deepfake_probability: number;
  authentic_probability: number;
  confidence: number;
  risk_level: VerificationReport['riskLevel'];
  explanation: string[];
  detailed_findings: VerificationReport['detailedFindings'];
  suspicious_regions: NonNullable<VerificationReport['suspiciousRegions']>;
  frame_analyses?: VerificationReport['frameAnalyses'];
  spectral_anomalies?: VerificationReport['spectralAnomalies'];
  duration?: string;
  resolution?: string;
  sample_rate?: string;
  timestamp: string;
  model_version: string;
  model_details: VerificationReport['modelDetails'] & { heatmapUrl?: string };
  heatmap_url?: string | null;
  status: 'completed';
};

function toVerificationReport(data: BackendAnalysisResponse, previewUrl: string): VerificationReport {
  const rawHeatmapUrl = (data.heatmap_url || data.model_details?.heatmapUrl || '').trim();
  const heatmapUrl = rawHeatmapUrl
    ? rawHeatmapUrl.startsWith('http')
      ? rawHeatmapUrl
      : `${API_BASE_URL}${rawHeatmapUrl.startsWith('/') ? rawHeatmapUrl : `/${rawHeatmapUrl}`}`
    : undefined;

  return {
    verificationId: data.verification_id,
    filename: data.filename,
    fileSize: data.file_size,
    fileSizeBytes: data.file_size_bytes,
    fileType: data.file_type,
    mediaType: data.media_type,
    prediction: data.prediction,
    deepfakeProbability: data.deepfake_probability,
    authenticProbability: data.authentic_probability,
    confidence: data.confidence,
    riskLevel: data.risk_level,
    explanation: data.explanation,
    detailedFindings: data.detailed_findings,
    suspiciousRegions: data.suspicious_regions,
    frameAnalyses: data.frame_analyses,
    spectralAnomalies: data.spectral_anomalies,
    duration: data.duration,
    resolution: data.resolution,
    sampleRate: data.sample_rate,
    timestamp: data.timestamp,
    modelVersion: data.model_version,
    modelDetails: data.model_details,
    mediaPreviewUrl: previewUrl,
    heatmapUrl: heatmapUrl,
    status: data.status,
  };
}

async function postFile(
  endpoint: string,
  file: File,
  onProgress: ((event: AnalysisProgressEvent) => void) | undefined,
  stepName: string,
): Promise<BackendAnalysisResponse> {
  onProgress?.({ stepIndex: 1, totalSteps: 3, stepName: `Uploading ${stepName}`, progressPercent: 15, telemetryMessage: 'Sending file to the FastAPI inference gateway...' });
  const formData = new FormData();
  formData.append('file', file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST', body: formData });
  } catch (cause) {
    const reason = cause instanceof Error ? ` (${cause.message})` : '';
    throw new Error(
      `Unable to reach the DeepVerify API at ${API_BASE_URL}. Start FastAPI on that URL and verify the backend is running.${reason}`
    );
  }

  onProgress?.({ stepIndex: 2, totalSteps: 3, stepName: `AI ${stepName} Analysis`, progressPercent: 65, telemetryMessage: 'The configured detector is processing the upload...' });
  if (!response.ok) {
    let message = `${stepName} analysis failed (${response.status}).`;
    try {
      const error = await response.json() as { detail?: string };
      message = error.detail || message;
    } catch {
      // Keep the HTTP status message when the backend did not return JSON.
    }
    throw new Error(message);
  }

  const data = await response.json() as BackendAnalysisResponse;
  onProgress?.({ stepIndex: 3, totalSteps: 3, stepName: 'Verification Complete', progressPercent: 100, telemetryMessage: 'Backend inference completed and returned a structured report.' });
  return data;
}

export async function analyzeImage(file: File, onProgress?: (event: AnalysisProgressEvent) => void): Promise<VerificationReport> {
  const data = await postFile('/api/analyze/image', file, onProgress, 'Image');
  return toVerificationReport(data, URL.createObjectURL(file));
}

export async function analyzeVideo(file: File, onProgress?: (event: AnalysisProgressEvent) => void): Promise<VerificationReport> {
  const data = await postFile('/api/analyze/video', file, onProgress, 'Video');
  return toVerificationReport(data, URL.createObjectURL(file));
}

export async function analyzeAudio(file: File, onProgress?: (event: AnalysisProgressEvent) => void): Promise<VerificationReport> {
  const data = await postFile('/api/analyze/audio', file, onProgress, 'Audio');
  return toVerificationReport(data, URL.createObjectURL(file));
}