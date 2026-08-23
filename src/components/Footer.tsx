import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2, Lock, Cpu, Github, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print border-t border-slate-800 bg-[#0a0c14] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white uppercase">
                Deep<span className="text-cyan-400">Verify</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              State-of-the-art AI-powered deepfake detection and media verification system. Defending digital truth across images, video, and audio through explainable AI forensics.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
                <Cpu className="w-3.5 h-3.5" /> Neural Engine v4.0.2
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
                <Lock className="w-3.5 h-3.5" /> End-to-End Cryptographic Proof
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/analyze" className="hover:text-cyan-400 transition-colors">Analyze Media</Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-cyan-400 transition-colors">Verification Reports</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">About & Mission</Link>
              </li>
            </ul>
          </div>

          {/* Forensic Modalities */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-4">
              Modalities
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/analyze?type=image" className="hover:text-cyan-400 transition-colors">Image Forensics</Link>
              </li>
              <li>
                <Link to="/analyze?type=video" className="hover:text-cyan-400 transition-colors">Video Temporal Analysis</Link>
              </li>
              <li>
                <Link to="/analyze?type=audio" className="hover:text-cyan-400 transition-colors">Voice & Audio Spectrogram</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-cyan-400 transition-colors">Grad-CAM Heatmaps</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-cyan-400 transition-colors">Spectral FFT Fingerprints</Link>
              </li>
            </ul>
          </div>

          {/* Use Cases & Trust */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-4">
              Trust & Sector
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-slate-400">Journalism & Fact Checking</span>
              </li>
              <li>
                <span className="text-slate-400">Public Safety & Defense</span>
              </li>
              <li>
                <span className="text-slate-400">Cybersecurity Operations</span>
              </li>
              <li>
                <span className="text-slate-400">Academic Forensics</span>
              </li>
              <li>
                <span className="text-slate-400">Content Moderation</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          <div>
            DeepVerify &copy; {new Date().getFullYear()} &bull; Neural Verification Engine v4.0.2
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span>System Status: <strong className="text-emerald-400 font-semibold">Optimal</strong></span>
            <span>API Latency: <strong className="text-slate-300 font-semibold">22ms</strong></span>
            <span className="text-cyan-400 font-semibold">Secure Analysis Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
