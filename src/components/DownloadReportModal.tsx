import React from 'react';
import { 
  X, 
  Download, 
  FileText, 
  FileCode, 
  Printer, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { VerificationReport } from '../types';
import { mockApiService } from '../services/mockApi';
import { downloadReport } from '../services/reportsApi';
import { useToast } from '../context/ToastContext';
import { motion } from 'motion/react';

interface DownloadReportModalProps {
  report: VerificationReport;
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadReportModal: React.FC<DownloadReportModalProps> = ({ report, isOpen, onClose }) => {
  const { success, error } = useToast();
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!isOpen) return null;

  const handleDownloadJson = () => {
    mockApiService.exportReportAsJson(report);
    success('JSON Export Downloaded', `Saved DeepVerify_Report_${report.verificationId}.json`);
    onClose();
  };

  const handleDownloadText = () => {
    mockApiService.exportReportAsText(report);
    success('Text Summary Downloaded', `Saved DeepVerify_Report_${report.verificationId}.txt`);
    onClose();
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await downloadReport(report.verificationId);
      success('PDF Report Downloaded', `Saved DeepVerify_Report_${report.verificationId}.pdf`);
      onClose();
    } catch (downloadError: unknown) {
      error('PDF Download Failed', downloadError instanceof Error ? downloadError.message : 'Unable to download the PDF report.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl text-slate-100"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Export Verification Certificate</h3>
            <p className="text-xs text-slate-400 font-mono">ID: {report.verificationId}</p>
          </div>
        </div>

        {/* Format Options */}
        <div className="mt-6 space-y-3">
          
          {/* PDF Certificate Option */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="w-full text-left p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-cyan-300">
                  Download PDF Certificate
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Official high-resolution verification document suitable for legal, academic, and journalistic dossiers.
              </p>
            </div>
          </button>

          {/* JSON Export Option */}
          <button
            onClick={handleDownloadJson}
            className="w-full text-left p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-emerald-300">
                  Export Structured JSON
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  .JSON
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Complete raw API payload with full model weights metadata, frame arrays, and anomaly scores.
              </p>
            </div>
          </button>

          {/* Plain-Text Summary Option */}
          <button
            onClick={handleDownloadText}
            className="w-full text-left p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">
                  Plain-Text Forensic Briefing
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  .TXT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Clean text executive briefing for rapid copy-pasting into security incident logs or emails.
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
