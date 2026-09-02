import { FilterOptions, StatsSummary, VerificationReport } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

type BackendReport = {
  verification_id: string;
  media_type: VerificationReport['mediaType'];
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
  timestamp: string;
  model_version: string;
  model_details: Partial<VerificationReport['modelDetails']> & { heatmapUrl?: string };
  media_preview_url?: string;
  heatmap_url?: string | null;
  status: VerificationReport['status'];
};

function mapReport(data: BackendReport): VerificationReport {
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
    detailedFindings: data.detailed_findings || [],
    suspiciousRegions: data.suspicious_regions || [],
    timestamp: data.timestamp,
    modelVersion: data.model_version,
    modelDetails: {
      name: data.model_details?.name || data.model_version,
      architecture: data.model_details?.architecture || 'Configured detector',
      modelVersion: data.model_details?.modelVersion || data.model_version,
      latencyMs: data.model_details?.latencyMs || 0,
      sha256Checksum: data.model_details?.sha256Checksum || 'Not provided by backend',
      datasetTrained: data.model_details?.datasetTrained || 'Not provided by backend',
    },
    mediaPreviewUrl: data.media_preview_url,
    heatmapUrl: data.heatmap_url
      ? (data.heatmap_url.startsWith('http') || data.heatmap_url.startsWith('/')
          ? data.heatmap_url
          : `${API_BASE_URL}${data.heatmap_url.startsWith('/') ? data.heatmap_url : `/${data.heatmap_url}`}`)
      : (data.model_details?.heatmapUrl
          ? (data.model_details.heatmapUrl.startsWith('http') || data.model_details.heatmapUrl.startsWith('/')
              ? data.model_details.heatmapUrl
              : `${API_BASE_URL}${data.model_details.heatmapUrl.startsWith('/') ? data.model_details.heatmapUrl : `/${data.model_details.heatmapUrl}`}`)
          : undefined),
    status: data.status,
  };
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_BASE_URL}${path}`, init);
  } catch (cause) {
    const reason = cause instanceof Error ? ` (${cause.message})` : '';
    throw new Error(`Unable to reach the DeepVerify API at ${API_BASE_URL}.${reason}`);
  }
}

async function readError(response: Response, fallback: string): Promise<never> {
  try {
    const payload = await response.json() as { detail?: string };
    throw new Error(payload.detail || fallback);
  } catch (error) {
    if (error instanceof Error && error.message !== fallback) throw error;
    throw new Error(fallback);
  }
}

export async function getReports(filters?: FilterOptions): Promise<VerificationReport[]> {
  const response = await request('/api/reports');
  if (!response.ok) return readError(response, `Unable to load reports (${response.status}).`);
  let reports = (await response.json() as BackendReport[]).map(mapReport);
  const query = filters?.searchQuery?.trim().toLowerCase();
  if (query) reports = reports.filter(report => report.filename.toLowerCase().includes(query) || report.verificationId.toLowerCase().includes(query));
  if (filters?.mediaType && filters.mediaType !== 'all') reports = reports.filter(report => report.mediaType === filters.mediaType);
  if (filters?.prediction && filters.prediction !== 'all') reports = reports.filter(report => report.prediction === filters.prediction);
  if (filters?.riskLevel && filters.riskLevel !== 'all') reports = reports.filter(report => report.riskLevel === filters.riskLevel);
  if (filters?.sortBy === 'oldest') reports.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
  if (filters?.sortBy === 'highest_confidence') reports.sort((a, b) => b.confidence - a.confidence);
  if (filters?.sortBy === 'lowest_confidence') reports.sort((a, b) => a.confidence - b.confidence);
  return reports;
}

export async function getReportById(id: string): Promise<VerificationReport | null> {
  const response = await request(`/api/reports/${encodeURIComponent(id)}`);
  if (response.status === 404) return null;
  if (!response.ok) return readError(response, `Unable to load report (${response.status}).`);
  return mapReport(await response.json() as BackendReport);
}

export async function getStats(): Promise<StatsSummary> {
  const reports = await getReports();
  const total = reports.length;
  return {
    totalAnalyses: total,
    deepfakesDetected: reports.filter(report => report.prediction === 'deepfake').length,
    likelyAuthentic: reports.filter(report => report.prediction === 'authentic').length,
    inconclusiveCount: reports.filter(report => report.prediction === 'inconclusive').length,
    averageConfidence: total ? reports.reduce((sum, report) => sum + report.confidence, 0) / total : 0,
    imagesAnalyzed: reports.filter(report => report.mediaType === 'image').length,
    videosAnalyzed: reports.filter(report => report.mediaType === 'video').length,
    audiosAnalyzed: reports.filter(report => report.mediaType === 'audio').length,
  };
}

export async function downloadReport(id: string): Promise<void> {
  const response = await request(`/api/reports/${encodeURIComponent(id)}/download`);
  if (!response.ok) return readError(response, `Unable to download report (${response.status}).`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `DeepVerify_Report_${id}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function deleteReport(id: string): Promise<void> {
  const response = await request(`/api/reports/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!response.ok) return readError(response, `Unable to delete report (${response.status}).`);
}
