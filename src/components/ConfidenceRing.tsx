import React from 'react';
import { motion } from 'motion/react';
import { PredictionResult } from '../types';

interface ConfidenceRingProps {
  confidence: number; // 0.0 to 1.0 or 0 to 100
  prediction: PredictionResult;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showProbabilities?: boolean;
  deepfakeProb?: number;
  authenticProb?: number;
}

export const ConfidenceRing: React.FC<ConfidenceRingProps> = ({
  confidence,
  prediction,
  size = 200,
  strokeWidth = 14,
  label = 'Model Confidence',
  sublabel,
  showProbabilities = false,
  deepfakeProb,
  authenticProb
}) => {
  // Normalize to 0-100
  const normalizedConfidence = confidence > 1 ? confidence : Math.round(confidence * 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedConfidence / 100) * circumference;

  const isDeepfake = prediction === 'deepfake';
  const isAuthentic = prediction === 'authentic';

  // Dynamic colors based on prediction and confidence
  const gradientId = `confidence-grad-${Math.random().toString(36).substr(2, 6)}`;
  const startColor = isDeepfake ? '#f43f5e' : (isAuthentic ? '#10b981' : '#f59e0b');
  const endColor = isDeepfake ? '#e11d48' : (isAuthentic ? '#059669' : '#d97706');
  const glowColor = isDeepfake ? 'rgba(244, 63, 94, 0.25)' : (isAuthentic ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)');

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div 
        className="relative flex items-center justify-center rounded-full p-2"
        style={{
          boxShadow: `0 0 45px ${glowColor}`
        }}
      >
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 origin-center"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
            <filter id={`glow-${gradientId}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-800/80"
          />

          {/* Animated Value Arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
            filter={`url(#glow-${gradientId})`}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-baseline justify-center"
          >
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
              {normalizedConfidence}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-400 ml-0.5">%</span>
          </motion.div>
          
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1 max-w-[120px] truncate">
            {label}
          </span>
          {sublabel && (
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {showProbabilities && deepfakeProb !== undefined && authenticProb !== undefined && (
        <div className="w-full mt-5 grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-center">
            <span className="block text-[11px] font-medium text-rose-300">Deepfake Prob</span>
            <span className="text-lg font-bold font-mono text-rose-400">
              {(deepfakeProb * 100).toFixed(1)}%
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="block text-[11px] font-medium text-emerald-300">Authentic Prob</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {(authenticProb * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
