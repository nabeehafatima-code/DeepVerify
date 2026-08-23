export type MediaType = 'image' | 'video' | 'audio';

export type PredictionResult = 'deepfake' | 'authentic' | 'inconclusive';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface SuspiciousRegion {
  id: string;
  type: string; // e.g., 'Face Boundary Artefact', 'Texture Blending', 'Lighting Inconsistency', 'Eye Reflection'
  box?: {
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    width: number; // percentage (0-100)
    height: number; // percentage (0-100)
  };
  confidence: number;
  label: string;
  description: string;
  timestamp?: number;
}

export interface FrameAnalysis {
  frameNumber: number;
  timestamp: number;
  timestampFormatted: string;
  confidence: number;
  deepfakeScore: number;
  isSuspicious: boolean;
  anomalyType?: string;
  previewUrl?: string;
}

export interface SpectralAnomaly {
  timeStart: number; // seconds
  timeEnd: number;
  frequencyBand: string; // e.g. "4.2kHz - 6.8kHz"
  anomalyScore: number;
  description: string;
  type: 'robotic_artifacts' | 'frequency_cutoff' | 'phase_inconsistency' | 'synthetic_vocoder';
}

export interface DetailedFinding {
  id: string;
  title: string;
  description: string;
  score: number; // 0 to 100
  severity: 'low' | 'medium' | 'high';
  category: 'visual' | 'temporal' | 'spectral' | 'metadata' | 'biometric';
}

export interface ModelDetails {
  name: string;
  architecture: string;
  modelVersion: string;
  latencyMs: number;
  sha256Checksum: string;
  datasetTrained: string;
}

export interface VerificationReport {
  verificationId: string;
  filename: string;
  fileSize: string;
  fileSizeBytes: number;
  fileType: string;
  mediaType: MediaType;
  prediction: PredictionResult;
  deepfakeProbability: number; // 0.0 - 1.0
  authenticProbability: number; // 0.0 - 1.0
  confidence: number; // 0.0 - 1.0
  riskLevel: RiskLevel;
  explanation: string[];
  detailedFindings: DetailedFinding[];
  suspiciousRegions?: SuspiciousRegion[];
  frameAnalyses?: FrameAnalysis[];
  spectralAnomalies?: SpectralAnomaly[];
  timestamp: string;
  modelVersion: string;
  modelDetails: ModelDetails;
  mediaPreviewUrl?: string;
  duration?: string;
  resolution?: string;
  sampleRate?: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface AnalysisProgressEvent {
  stepIndex: number;
  totalSteps: number;
  stepName: string;
  progressPercent: number;
  telemetryMessage: string;
}

export interface FilterOptions {
  searchQuery?: string;
  mediaType?: 'all' | MediaType;
  prediction?: 'all' | PredictionResult;
  riskLevel?: 'all' | RiskLevel;
  sortBy?: 'newest' | 'oldest' | 'highest_confidence' | 'lowest_confidence';
}

export interface StatsSummary {
  totalAnalyses: number;
  deepfakesDetected: number;
  likelyAuthentic: number;
  inconclusiveCount: number;
  averageConfidence: number;
  imagesAnalyzed: number;
  videosAnalyzed: number;
  audiosAnalyzed: number;
}
