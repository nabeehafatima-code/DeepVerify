import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2, Lock, Cpu, Github, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <footer className={`no-print border-t ${isDarkMode ? 'border-slate-800 bg-[#0a0c14] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'} text-sm`}>
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

            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-sm leading-relaxed max-w-sm`}>
              State-of-the-art AI-powered deepfake detection and media verification system. Defending digital truth across images, video, and audio through explainable AI forensics.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${isDarkMode ? 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300' : 'bg-cyan-100 border-cyan-300 text-cyan-700'} border`}>
                <Cpu className="w-3.5 h-3.5" /> Neural Engine v4.0.2
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium ${isDarkMode ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-700'} border`}>
                <Lock className="w-3.5 h-3.5" /> End-to-End Cryptographic Proof
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-200' : 'text-slate-700'} mb-4`}>
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className={`${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-600'} transition-colors`}>Home</Link>
              </li>
              <li>
                <Link to="/analyze" className={`${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-600'} transition-colors`}>Analyze Media</Link>
              </li>
              <li>
                <Link to="/reports" className={`${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-600'} transition-colors`}>Verification Reports</Link>
              </li>
              <li>
                <Link to="/how-it-works" className={`${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-600'} transition-colors`}>How It Works</Link>
              </li>
              <li>
                <Link to="/about" className={`${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-600'} transition-colors`}>About & Mission</Link>
              </li>
            </ul>
          </div>

          {/* Forensic Modalities */}
          <div>
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-200' : 'text-slate-700'} mb-4`}>
              Modalities
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/analyze?type=image" className={`${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-600'} transition-colors`}>Image Forensics</Link>
              </li>
              <li>
                <Link to="/analyze?type=video" className={`${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-600'} transition-colors`}>Video Temporal Analysis</Link>
              </li>
              <li>
                <Link to="/analyze?type=audio" className={`${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-600'} transition-colors`}>Voice & Audio Spectrogram</Link>
              </li>
              <li>
                <Link to="/how-it-works" className={`${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-600'} transition-colors`}>Grad-CAM Heatmaps</Link>
              </li>
              <li>
                <Link to="/how-it-works" className={`${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-600'} transition-colors`}>Spectral FFT Fingerprints</Link>
              </li>
            </ul>
          </div>

          {/* Use Cases & Trust */}
          <div>
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-200' : 'text-slate-700'} mb-4`}>
              Trust & Sector
            </h4>
            <ul className="space-y-2.5">
              <li>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Journalism & Fact Checking</span>
              </li>
              <li>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Public Safety & Defense</span>
              </li>
              <li>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Cybersecurity Operations</span>
              </li>
              <li>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Academic Forensics</span>
              </li>
              <li>
                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>Content Moderation</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-300'} flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-600'} uppercase tracking-widest font-mono`}>
          <div>
            DeepVerify &copy; {new Date().getFullYear()} &bull; Neural Verification Engine v4.0.2
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <span>System Status: <strong className="text-emerald-400 font-semibold">Optimal</strong></span>
            <span>API Latency: <strong className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'} font-semibold`}>22ms</strong></span>
            <span className="text-cyan-400 font-semibold">Secure Analysis Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
