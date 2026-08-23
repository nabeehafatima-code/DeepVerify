import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  FileText, 
  HelpCircle, 
  Info, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Server, 
  Terminal,
  Activity,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Reports', path: '/reports' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="no-print sticky top-0 z-40 w-full border-b border-slate-800 bg-[#020617]/85 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
            id="brand-logo-link"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all">
              <ShieldCheck className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-lg bg-cyan-400/20 animate-ping opacity-0 group-hover:opacity-100 pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white uppercase font-sans">
                  Deep<span className="text-cyan-400">Verify</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                  SIH'26
                </span>
              </div>
              <span className="text-[9px] tracking-widest text-slate-500 font-semibold uppercase -mt-0.5 hidden sm:block">
                DETECT · VERIFY · TRUST
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/60 rounded-full px-3 py-1 shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    active
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* FastAPI / System Specs Modal Trigger */}
            <button
              onClick={() => setApiModalOpen(true)}
              id="api-status-button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
              title="FastAPI & System Architecture Status"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Server className="w-3.5 h-3.5 hidden sm:inline" />
              <span className="hidden lg:inline">FastAPI Mock Engine</span>
              <span className="lg:hidden">API</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              aria-label="Toggle Theme"
              className="p-2 rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Main Primary CTA button */}
            <Link
              to="/analyze"
              id="header-analyze-cta"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Media</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              id="mobile-menu-toggle-btn"
              aria-label="Open navigation menu"
              className="md:hidden p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-2"
            >
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span>{link.name}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-slate-800/80">
                <Link
                  to="/analyze"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Media Now</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* System & FastAPI Specs Modal */}
      <AnimatePresence>
        {apiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl text-slate-200"
            >
              <button
                onClick={() => setApiModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">System & FastAPI Integration Architecture</h3>
                  <p className="text-xs text-slate-400 font-mono">Service Layer: /src/services/mockApi.ts</p>
                </div>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono">
                  <div className="flex items-center justify-between text-slate-400 mb-1.5">
                    <span>Backend Status:</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Ready for FastAPI Endpoints
                    </span>
                  </div>
                  <div className="text-slate-400">Target Endpoints:</div>
                  <ul className="text-cyan-300 space-y-1 mt-1 pl-2">
                    <li>• POST <span className="text-white">/api/analyze/image</span> (Multipart FormData)</li>
                    <li>• POST <span className="text-white">/api/analyze/video</span> (Frame Sampling & Bi-LSTM)</li>
                    <li>• POST <span className="text-white">/api/analyze/audio</span> (RawNet3 & Spectrogram STFT)</li>
                    <li>• GET <span className="text-white">/api/reports</span> & <span className="text-white">/api/reports/{'{id}'}</span></li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="block text-slate-400 font-semibold mb-1">SIH AI Pipeline</span>
                    <span className="text-slate-200">ResNeXt-50 + Grad-CAM Attention & LFCC-GMM Audio Engine</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="block text-slate-400 font-semibold mb-1">Explainability</span>
                    <span className="text-slate-200">Spatio-Temporal heatmaps, facial bounding seams & FFT spectrum</span>
                  </div>
                </div>

                <p className="text-slate-400 leading-relaxed">
                  All UI actions, file drag-and-drops, report generation, and visualizations are fully interactive in this mock service layer. Simply replace the endpoint routes when linking with Python FastAPI.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setApiModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all"
                >
                  Close Architecture View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
