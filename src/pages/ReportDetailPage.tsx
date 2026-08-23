import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  Share2, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Terminal, 
  Cpu, 
  FileText, 
  Sparkles,
  HelpCircle,
  ExternalLink,
  Layers
} from 'lucide-react';
import { VerificationReport } from '../types';
import { getReportById } from '../services/reportsApi';
import { ConfidenceRing } from '../components/ConfidenceRing';
import { PredictionBadge, RiskBadge } from '../components/RiskBadge';
import { ExplanationCard } from '../components/ExplanationCard';
import { HeatmapPanel } from '../components/HeatmapPanel';
import { VideoTimeline } from '../components/VideoTimeline';
import { AudioWaveform } from '../components/AudioWaveform';
import { ShareModal } from '../components/ShareModal';
import { DownloadReportModal } from '../components/DownloadReportModal';
import { EmptyState, LoadingSkeleton } from '../components/States';
import { useToast } from '../context/ToastContext';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      setIsLoading(true);
      const found = await getReportById(id);
      setReport(found);
      setIsLoading(false);
    };

    fetchReport();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EmptyState
          title="Verification Report Not Found"
          description={`No record matches the ID ${id}. It may have been cleared from local storage or expired.`}
          actionText="View All Reports"
          actionHref="/reports"
        />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Link to="/reports" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> All Reports
          </Link>
          <span>/</span>
          <span className="text-slate-300 font-bold">{report.verificationId}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:border-slate-700 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:border-slate-700 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <button
            onClick={() => setDownloadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Container */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
        
        {/* Certificate Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">DeepVerify</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                  OFFICIAL VERIFICATION CERTIFICATE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographic Media Forensics & Neural Authenticity Certificate
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs space-y-0.5">
            <div className="text-slate-400">Verification ID:</div>
            <div className="text-cyan-400 font-bold text-base">{report.verificationId}</div>
            <div className="text-slate-400 text-[11px]">
              {new Date(report.timestamp).toUTCString()}
            </div>
          </div>
        </div>

        {/* Primary Verdict & Confidence Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 rounded-3xl bg-slate-950/60 border border-slate-800">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <PredictionBadge prediction={report.prediction} size="lg" />
              <RiskBadge level={report.riskLevel} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {report.prediction === 'deepfake'
                ? 'High Risk Synthetic Media Discrepancies Detected'
                : 'Intact Physical Sensor and Biological Signatures'}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Target payload <strong className="text-white">{report.filename}</strong> has been audited across spatial-frequency domains, neural Grad-CAM attention layers, and temporal landmark kinetics.
            </p>

            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Deepfake Probability</span>
                <span className="text-lg font-bold text-rose-400">
                  {(report.deepfakeProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Authentic Probability</span>
                <span className="text-lg font-bold text-emerald-400">
                  {(report.authenticProbability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Model Latency</span>
                <span className="text-lg font-bold text-cyan-400">
                  {report.modelDetails.latencyMs} ms
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <ConfidenceRing
              confidence={report.confidence}
              prediction={report.prediction}
              size={190}
              strokeWidth={13}
              label="Model Confidence"
              showProbabilities={true}
              deepfakeProb={report.deepfakeProbability}
              authenticProb={report.authenticProbability}
            />
          </div>

        </div>

        {/* File & Payload Specifications */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Payload Metadata
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">File Name:</span>
              <span className="text-white font-bold truncate block">{report.filename}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Payload Size:</span>
              <span className="text-white font-bold">{report.fileSize}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Media Category:</span>
              <span className="text-cyan-400 font-bold uppercase">{report.mediaType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Resolution / Specs:</span>
              <span className="text-white font-bold">{report.resolution || report.sampleRate || 'Standard Codec'}</span>
            </div>
          </div>
        </div>

        {/* Explainability Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Diagnostic Explanation & Signal Findings
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {report.explanation.length} Signals Cataloged
            </span>
          </div>

          <ExplanationCard
            findings={report.detailedFindings}
            simpleExplanations={report.explanation}
          />
        </div>

        {/* Visual Inspection Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Forensic Visual / Temporal Layer
          </h3>

          {report.mediaType === 'image' && (
            <HeatmapPanel
              imageUrl={report.mediaPreviewUrl}
              suspiciousRegions={report.suspiciousRegions}
              filename={report.filename}
              isDeepfake={report.prediction === 'deepfake'}
            />
          )}

          {report.mediaType === 'video' && (
            <VideoTimeline
              frames={report.frameAnalyses}
              videoUrl={report.mediaPreviewUrl}
              duration={report.duration}
              isDeepfake={report.prediction === 'deepfake'}
            />
          )}

          {report.mediaType === 'audio' && (
            <AudioWaveform
              spectralAnomalies={report.spectralAnomalies}
              duration={report.duration}
              sampleRate={report.sampleRate}
              isDeepfake={report.prediction === 'deepfake'}
            />
          )}
        </div>

        {/* Technical Specification & Cryptographic Checksum */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">Engine Specifications & Audit Trail</span>
            </div>
            <span className="text-emerald-400 font-bold">DIGITALLY SIGNED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            <div>
              <span className="text-slate-400 block text-[10px]">Inference Engine:</span>
              <span>{report.modelDetails.name} ({report.modelVersion})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Neural Architecture:</span>
              <span>{report.modelDetails.architecture}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Training Datasets:</span>
              <span>{report.modelDetails.datasetTrained}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">SHA-256 Checksum:</span>
              <span className="text-cyan-300 break-all">{report.modelDetails.sha256Checksum}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <strong>Mandatory AI Disclaimer:</strong> AI-assisted verification results are probabilistic assessments generated by deep learning models trained on benchmark forensic datasets. They should be evaluated alongside contextual provenance, chains of custody, and human journalistic oversight.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80 no-print">
          <Link
            to="/analyze"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-md shadow-cyan-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Another File</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Share Verification</span>
            </button>

            <button
              onClick={() => setDownloadModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Certificate</span>
            </button>
          </div>
        </div>

      </div>

      {/* Modals */}
      <ShareModal
        report={report}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <DownloadReportModal
        report={report}
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />

    </div>
  );
};
