import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Eye, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  Scan,
  Terminal,
  FileCheck2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalysisProgressEvent } from '../types';

interface AnalysisLoaderProps {
  progressEvent: AnalysisProgressEvent | null;
  filename?: string;
  mediaType: string;
}

const ROTATING_MESSAGES = [
  'Detecting spatial visual artifacts...',
  'Examining facial landmark consistency...',
  'Analyzing micro-texture patterns & specular reflections...',
  'Checking temporal frame consistency & optical flow...',
  'Evaluating audio-visual synchronization & spectral bounds...',
  'Synthesizing explainability attention heatmaps...',
  'Validating photographic metadata & PRNU noise distribution...'
];

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({
  progressEvent,
  filename,
  mediaType
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % ROTATING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { title: 'Uploading & Hashing', icon: FileCheck2 },
    { title: 'Preprocessing', icon: Layers },
    { title: 'AI Model Analysis', icon: Cpu },
    { title: 'Explainability Analysis', icon: Eye },
    { title: 'Confidence Assessment', icon: Activity },
    { title: 'Verification Report', icon: ShieldCheck }
  ];

  const currentStep = progressEvent?.stepIndex || 1;
  const progressPercent = progressEvent?.progressPercent || 15;

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-6 sm:p-10 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl relative overflow-hidden">
      
      {/* Background Cyber Grid & Radar Effect */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none animate-pulse" />

      {/* Header */}
      <div className="relative text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          <span>NEURAL FORENSIC SCANNER IN PROGRESS</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          DeepVerify is analyzing your {mediaType}…
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 font-mono">
          Target File: <span className="text-slate-200">{filename || 'media_payload'}</span>
        </p>
      </div>

      {/* Central Visual Radar Scanner */}
      <div className="relative my-8 flex items-center justify-center">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-cyan-500/30 bg-slate-950/80 flex items-center justify-center shadow-inner">
          
          {/* Concentric Radar Rings */}
          <div className="absolute w-36 h-36 rounded-full border border-cyan-500/20" />
          <div className="absolute w-24 h-24 rounded-full border border-cyan-500/20" />
          
          {/* Radar Sweep Line */}
          <div 
            className="absolute inset-0 rounded-full animate-radar origin-center pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.3) 0deg, transparent 60deg)'
            }}
          />

          {/* Center Scan percentage */}
          <div className="relative z-10 text-center flex flex-col items-center">
            <Scan className="w-8 h-8 text-cyan-400 mb-1 animate-pulse" />
            <span className="text-3xl sm:text-4xl font-mono font-black text-white">
              {progressPercent}%
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 mt-0.5">
              Analyzing
            </span>
          </div>

          {/* Crosshair grid lines */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20 pointer-events-none" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20 pointer-events-none" />
        </div>
      </div>

      {/* Progress Steps Timeline */}
      <div className="relative my-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center gap-2 ${
                  isDone
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : isCurrent
                    ? 'bg-cyan-950/40 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 scale-105'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCurrent
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <span className="text-[11px] font-bold tracking-tight line-clamp-1">
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Rotating Telemetry Feed */}
      <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
            Live AI Telemetry Stream
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-cyan-200 truncate"
            >
              {progressEvent?.telemetryMessage || ROTATING_MESSAGES[currentMessageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
