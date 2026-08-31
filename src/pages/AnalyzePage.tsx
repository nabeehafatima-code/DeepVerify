import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  UploadCloud, 
  RefreshCw, 
  Download, 
  Share2, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Layers, 
  Info, 
  FileText, 
  CheckCircle2, 
  ArrowLeft,
  ChevronRight,
  Terminal,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { MediaType, VerificationReport, AnalysisProgressEvent } from '../types';
import { mockApiService, DEMO_PRESETS, DemoPreset } from '../services/mockApi';
import { analyzeImage, analyzeVideo, analyzeAudio } from '../services/api';
import { UploadZone } from '../components/UploadZone';
import { AnalysisLoader } from '../components/AnalysisLoader';
import { ConfidenceRing } from '../components/ConfidenceRing';
import { PredictionBadge, RiskBadge } from '../components/RiskBadge';
import { ExplanationCard } from '../components/ExplanationCard';
import { HeatmapPanel } from '../components/HeatmapPanel';
import { VideoTimeline } from '../components/VideoTimeline';
import { AudioWaveform } from '../components/AudioWaveform';
import { ShareModal } from '../components/ShareModal';
import { DownloadReportModal } from '../components/DownloadReportModal';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'motion/react';

export const AnalyzePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as MediaType) || 'image';
  const storedResult = sessionStorage.getItem('deepverify_active_result');

  const [mediaType, setMediaType] = useState<MediaType>(initialType);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<DemoPreset | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressEvent, setProgressEvent] = useState<AnalysisProgressEvent | null>(null);
  const [result, setResult] = useState<VerificationReport | null>(() => {
    if (!storedResult) return null;
    try {
      return JSON.parse(storedResult) as VerificationReport;
    } catch {
      sessionStorage.removeItem('deepverify_active_result');
      return null;
    }
  });

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const { success, error, info } = useToast();

  useEffect(() => {
    if (result) {
      sessionStorage.setItem('deepverify_active_result', JSON.stringify(result));
    } else {
      sessionStorage.removeItem('deepverify_active_result');
    }
  }, [result]);

  useEffect(() => {
    const typeParam = searchParams.get('type') as MediaType;
    if (typeParam && ['image', 'video', 'audio'].includes(typeParam) && typeParam !== mediaType) {
      setMediaType(typeParam);
    }
  }, [searchParams]);

  const handleMediaTypeChange = (type: MediaType) => {
    setMediaType(type);
    setSelectedFile(null);
    setSelectedPreset(null);
    setValidationError(null);
    setResult(null);
    sessionStorage.removeItem('deepverify_active_result');
    setSearchParams({ type });
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setSelectedPreset(null);
    setValidationError(null);
  };

  const handlePresetSelect = (preset: DemoPreset) => {
    setSelectedPreset(preset);
    setSelectedFile(null);
    setValidationError(null);
    info('Demo Test Case Loaded', `Selected "${preset.name}". Click 'Analyze Media' to initiate forensic scan.`);
  };

  const handleStartAnalysis = async () => {
    if (mediaType === 'image' && !selectedFile) {
      setValidationError('Please select an image file to send to the FastAPI detector.');
      return;
    }

    if (!selectedFile && !selectedPreset) {
      setValidationError('Please select or upload a media file first.');
      return;
    }

    setIsAnalyzing(true);
    setProgressEvent(null);
    setResult(null);
    setValidationError(null);

    try {
      let filePayload: File | { name: string; size: number; type: string; url?: string };

      if (selectedFile) {
        filePayload = selectedFile;
      } else if (selectedPreset) {
        filePayload = {
          name: `${selectedPreset.name.toLowerCase().replace(/\s+/g, '-')}.${mediaType === 'image' ? 'jpg' : (mediaType === 'video' ? 'mp4' : 'wav')}`,
          size: mediaType === 'image' ? 3400000 : (mediaType === 'video' ? 18600000 : 1200000),
          type: mediaType === 'image' ? 'image/jpeg' : (mediaType === 'video' ? 'video/mp4' : 'audio/wav'),
          url: selectedPreset.previewUrl
        };
      } else {
        throw new Error('No payload available');
      }

            const report = selectedFile
              ? mediaType === 'image'
                ? await analyzeImage(selectedFile, setProgressEvent)
                : mediaType === 'video'
                  ? await analyzeVideo(selectedFile, setProgressEvent)
                  : await analyzeAudio(selectedFile, setProgressEvent)
              : await mockApiService.analyzeMedia(
                  filePayload,
                  mediaType,
                  setProgressEvent,
                  selectedPreset?.expectedResult
               );

      setResult(report);
      setIsAnalyzing(false);
      success(
        'Analysis Complete',
        `Result: ${report.prediction.toUpperCase()} (${(report.confidence * 100).toFixed(0)}% confidence).`
      );

      // Scroll smoothly to results
      window.scrollTo({ top: 300, behavior: 'smooth' });

    } catch (err: unknown) {
      setIsAnalyzing(false);
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      error('Analysis Error', errorMessage);
      setValidationError(errorMessage);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedPreset(null);
    setResult(null);
    setValidationError(null);
    setIsAnalyzing(false);
    setProgressEvent(null);
    sessionStorage.removeItem('deepverify_active_result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Link to="/" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span>/</span>
          <span>Analysis Dashboard</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Analysis Dashboard
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
              <span>DV-2026-8842-X</span>
              <span>•</span>
              <span>Session ID: 499120</span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">Neural Forensics Engine Active</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {result && (
              <Link
                to={`/reports/${result.verificationId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>View Verification Report</span>
              </Link>
            )}
            <Link
              to="/reports"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-all"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Verification History</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Analysis Workflow Container */}
      {!result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Upload Zone & Preset Selection */}
          <UploadZone
            mediaType={mediaType}
            onMediaTypeChange={handleMediaTypeChange}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onPresetSelect={handlePresetSelect}
            selectedPreset={selectedPreset}
            validationError={validationError}
            onClearError={() => setValidationError(null)}
            onValidationError={setValidationError}
          />

          {/* Action Trigger Buttons */}
          {(selectedFile || selectedPreset) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={handleStartAnalysis}
                id="start-analysis-button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Analyze Media Now</span>
              </button>

              <button
                onClick={handleReset}
                id="choose-another-file-button"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-sm font-semibold transition-all"
              >
                Choose Another File
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Full-Screen Analysis Scanning State */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <AnalysisLoader
            progressEvent={progressEvent}
            filename={selectedFile?.name || selectedPreset?.name}
            mediaType={mediaType}
          />
        </motion.div>
      )}

      {/* =========================================================================
          VERIFICATION RESULT DASHBOARD
      ========================================================================= */}
      {result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Result Banner / Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400">Official Forensic Assessment</span>
                <h2 className="text-lg font-bold text-white tracking-tight">Verification Result</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShareModalOpen(true)}
                id="result-share-btn"
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-all"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Share Result</span>
              </button>

              <button
                onClick={() => setDownloadModalOpen(true)}
                id="result-download-btn"
                className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-all shadow-lg shadow-cyan-900/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          {/* Main Primary Result Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Result Badges & Probability breakdown */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <PredictionBadge prediction={result.prediction} size="lg" />
                    <RiskBadge level={result.riskLevel} />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {result.prediction === 'deepfake'
                      ? 'Synthetic Media Artifacts Identified'
                      : 'Media Characteristics Consistent with Authentic Capture'}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {result.prediction === 'deepfake'
                      ? 'The AI verification engine detected multiple spatial, frequency, and biometric inconsistencies indicative of synthetic generative manipulation.'
                      : 'The AI verification engine confirmed sensor noise consistency, natural lighting distribution, and zero synthetic generative fingerprints.'}
                  </p>
                </div>

                {/* Probabilities Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[11px] mb-1">Deepfake Prob</span>
                    <span className="text-xl font-bold text-rose-400">
                      {(result.deepfakeProbability * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[11px] mb-1">Authentic Prob</span>
                    <span className="text-xl font-bold text-emerald-400">
                      {(result.authenticProbability * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[11px] mb-1">Model Latency</span>
                    <span className="text-xl font-bold text-cyan-400">
                      {result.modelDetails.latencyMs} ms
                    </span>
                  </div>
                </div>

                {/* Important Disclaimer Notice */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Notice:</strong> This result represents an AI model statistical assessment and should not be treated as absolute proof of authenticity. Probabilistic deep neural networks evaluate anomaly patterns against known generative distributions.
                  </p>
                </div>
              </div>

              {/* Right Column: Circular Confidence Visualization */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/60 border border-slate-800/80">
                <ConfidenceRing
                  confidence={result.confidence}
                  prediction={result.prediction}
                  size={210}
                  strokeWidth={14}
                  label="Model Confidence"
                  sublabel="Ensemble Calibrated"
                  showProbabilities={true}
                  deepfakeProb={result.deepfakeProbability}
                  authenticProb={result.authenticProbability}
                />
              </div>

            </div>
          </div>

          {/* =========================================================================
              SECTION: WHY WAS THIS FLAGGED?
          ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Why Was This Flagged?
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed breakdown of forensic signals, structural inconsistencies, and neural activations
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                {result.explanation.length} Signals Detected
              </span>
            </div>

            <ExplanationCard
              findings={result.detailedFindings}
              simpleExplanations={result.explanation}
            />
          </div>

          {/* =========================================================================
              SECTION: MANIPULATION ANALYSIS (MODALITY SPECIFIC)
          ========================================================================= */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Forensic Manipulation Analysis
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Interactive spatial Grad-CAM attention, temporal timeline, and spectral frequency inspections
              </p>
            </div>

            {/* If Image */}
            {result.mediaType === 'image' && (
              <HeatmapPanel
                imageUrl={result.mediaPreviewUrl}
                suspiciousRegions={result.suspiciousRegions}
                filename={result.filename}
                isDeepfake={result.prediction === 'deepfake'}
              />
            )}

            {/* If Video */}
            {result.mediaType === 'video' && (
              <VideoTimeline
                frames={result.frameAnalyses}
                videoUrl={result.mediaPreviewUrl}
                duration={result.duration}
                isDeepfake={result.prediction === 'deepfake'}
              />
            )}

            {/* If Audio */}
            {result.mediaType === 'audio' && (
              <AudioWaveform
                spectralAnomalies={result.spectralAnomalies}
                duration={result.duration}
                sampleRate={result.sampleRate}
                isDeepfake={result.prediction === 'deepfake'}
              />
            )}
          </div>

          {/* =========================================================================
              SECTION: ANALYSIS SUMMARY & TECHNICAL METADATA
          ========================================================================= */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Technical Metadata & Audit Log</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Verification ID: <strong className="text-cyan-400">{result.verificationId}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">File Name</span>
                <span className="text-white font-bold truncate block" title={result.filename}>
                  {result.filename}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Payload Size</span>
                <span className="text-white font-bold">{result.fileSize}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Media Type</span>
                <span className="text-cyan-400 font-bold uppercase">{result.mediaType}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Inference Model</span>
                <span className="text-white font-bold truncate block">{result.modelVersion}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Architecture</span>
                <span className="text-white font-bold truncate block">{result.modelDetails.architecture}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Risk Classification</span>
                <span className="text-rose-400 font-bold uppercase">{result.riskLevel} Risk</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Verified Date</span>
                <span className="text-slate-300 font-bold">
                  {new Date(result.timestamp).toLocaleDateString()}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Audit Status</span>
                <span className="text-emerald-400 font-bold">CRYPTOGRAPHICALLY VERIFIED</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400">
              <span>SHA-256 Checksum: </span>
              <span className="text-slate-200 break-all">{result.modelDetails.sha256Checksum}</span>
            </div>
          </div>

          {/* =========================================================================
              SECTION: ACTIONS
          ========================================================================= */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-bold text-white">Need to verify another file?</h4>
              <p className="text-xs text-slate-400">You can test images, video recordings, and audio snippets.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setDownloadModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF Certificate</span>
              </button>

              <button
                onClick={() => setShareModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Result</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Analyze Another File</span>
              </button>
            </div>
          </div>

          {/* Modals */}
          <ShareModal
            report={result}
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
          />

          <DownloadReportModal
            report={result}
            isOpen={downloadModalOpen}
            onClose={() => setDownloadModalOpen(false)}
          />
        </motion.div>
      )}

    </div>
  );
};
