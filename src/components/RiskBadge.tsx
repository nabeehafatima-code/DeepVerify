import React from 'react';
import { ShieldAlert, ShieldCheck, HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PredictionResult, RiskLevel } from '../types';

interface PredictionBadgeProps {
  prediction: PredictionResult;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const PredictionBadge: React.FC<PredictionBadgeProps> = ({ 
  prediction, 
  size = 'md', 
  showIcon = true 
}) => {
  const configs = {
    deepfake: {
      label: 'LIKELY DEEPFAKE',
      bg: 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 shadow-rose-950/20',
      dot: 'bg-rose-500 animate-pulse',
      icon: ShieldAlert
    },
    authentic: {
      label: 'LIKELY AUTHENTIC',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-emerald-950/20',
      dot: 'bg-emerald-500',
      icon: ShieldCheck
    },
    inconclusive: {
      label: 'INCONCLUSIVE',
      bg: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-amber-950/20',
      dot: 'bg-amber-500',
      icon: HelpCircle
    }
  };

  const current = configs[prediction] || configs.inconclusive;
  const IconComponent = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5 font-semibold',
    md: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
    lg: 'text-base px-4 py-2 gap-2.5 font-extrabold tracking-wide'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span className={`inline-flex items-center rounded-full border shadow-sm tracking-wide ${sizeClasses[size]} ${current.bg}`}>
      {showIcon && <IconComponent className={iconSizes[size]} />}
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
};

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const configs = {
    high: {
      label: 'HIGH RISK',
      classes: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    },
    medium: {
      label: 'MEDIUM RISK',
      classes: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    },
    low: {
      label: 'LOW RISK',
      classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    }
  };

  const config = configs[level] || configs.low;

  return (
    <span className={`inline-flex items-center font-mono uppercase tracking-wider rounded-md border ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1 font-semibold'} ${config.classes}`}>
      {config.label}
    </span>
  );
};
