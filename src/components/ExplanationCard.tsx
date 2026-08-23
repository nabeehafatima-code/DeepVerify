import React from 'react';
import { 
  AlertTriangle, 
  Eye, 
  Layers, 
  Sun, 
  Clock, 
  Volume2, 
  Cpu, 
  FileCheck, 
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { DetailedFinding } from '../types';

interface ExplanationCardProps {
  findings: DetailedFinding[];
  simpleExplanations: string[];
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  findings,
  simpleExplanations
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'visual':
        return Eye;
      case 'temporal':
        return Clock;
      case 'spectral':
        return Volume2;
      case 'biometric':
        return Sparkles;
      case 'metadata':
        return FileCheck;
      default:
        return Cpu;
    }
  };

  const getSeverityStyle = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-slate-800/40 border border-slate-800 border-l-2 border-l-rose-500 text-rose-300',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          scoreBar: 'bg-gradient-to-r from-rose-600 to-orange-500'
        };
      case 'medium':
        return {
          bg: 'bg-slate-800/40 border border-slate-800 border-l-2 border-l-orange-500 text-amber-300',
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          scoreBar: 'bg-orange-500'
        };
      case 'low':
        return {
          bg: 'bg-slate-800/40 border border-slate-800 border-l-2 border-l-cyan-500 text-cyan-300',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          scoreBar: 'bg-cyan-500'
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Flagged Reasons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {simpleExplanations.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5">
              <span className="font-mono font-bold text-xs">0{idx + 1}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 leading-snug">
                {item}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Technical Findings breakdown */}
      {findings && findings.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Analysis Flags & Neural Anomaly Metrics
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Explainable AI (XAI) Attribution
            </span>
          </div>

          <div className="space-y-3">
            {findings.map((finding) => {
              const Icon = getCategoryIcon(finding.category);
              const styles = getSeverityStyle(finding.severity);

              return (
                <div
                  key={finding.id}
                  className={`p-3.5 rounded-xl transition-all ${styles.bg}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold text-white tracking-tight uppercase">
                        {finding.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${styles.badge}`}>
                        {finding.severity}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {finding.score}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {finding.description}
                  </p>

                  {/* Progress Indicator Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${styles.scoreBar}`}
                      style={{ width: `${finding.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
