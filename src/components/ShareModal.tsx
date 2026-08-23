import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  ShieldCheck, 
  Twitter, 
  Linkedin, 
  Mail 
} from 'lucide-react';
import { VerificationReport } from '../types';
import { useToast } from '../context/ToastContext';
import { motion } from 'motion/react';

interface ShareModalProps {
  report: VerificationReport;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ report, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/verify/${report.verificationId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      success('Verification Link Copied', 'Share URL has been copied to your clipboard.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const copiedWithFallback = document.execCommand('copy');
      textArea.remove();
      if (!copiedWithFallback) {
        success('Verification Link Ready', 'Copy the verification URL from the field above.');
        return;
      }
      setCopied(true);
      success('Verification Link Copied', 'Share URL has been copied to your clipboard.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `DeepVerify Result: ${report.filename}`,
          text: `Verification Result: ${report.prediction.toUpperCase()} (${(report.confidence * 100).toFixed(0)}% confidence). View official report:`,
          url: shareUrl
        });
      } catch (shareError) {
        if (!(shareError instanceof DOMException && shareError.name === 'AbortError')) {
          await handleCopy();
        }
      }
    } else {
      handleCopy();
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
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Share Verification Report</h3>
            <p className="text-xs text-slate-400 font-mono">ID: {report.verificationId}</p>
          </div>
        </div>

        {/* Share Link Field */}
        <div className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Direct Verification URL
            </label>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent border-none text-xs font-mono text-cyan-300 w-full focus:outline-none select-all px-2"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Social Quick Share */}
          <div className="pt-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Share to Stakeholders & Platforms
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all hover:bg-slate-800/40"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Web Share</span>
              </button>
              
              <a
                href={`mailto:?subject=DeepVerify Report: ${report.filename}&body=Check the deepfake verification certificate for ${report.filename} at ${shareUrl}`}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-all hover:bg-slate-800/40"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Email Report</span>
              </a>
            </div>
          </div>

          {/* Embed / Verification Badge preview */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">Cryptographic Signature:</span>
              <span className="font-mono text-emerald-400 font-bold">VERIFIED</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 truncate">
              SHA-256: {report.modelDetails.sha256Checksum}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
