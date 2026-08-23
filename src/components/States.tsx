import React from 'react';
import { 
  FileQuestion, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Verification Reports Found',
  description = 'No media verification records match your active search and filter criteria.',
  actionText = 'Analyze New Media',
  actionHref = '/analyze',
  onAction,
  icon: Icon = FileQuestion
}) => {
  return (
    <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-8 h-8 text-cyan-400" />
      </div>
      <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      ) : (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Verification Processing Error',
  message = 'An unexpected issue occurred while querying the verification model pipeline.',
  onRetry
}) => {
  return (
    <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 sm:p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-rose-200 mt-1 mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-rose-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-slate-800/60 rounded-xl w-1/3" />
      <div className="h-44 bg-slate-900/60 rounded-2xl border border-slate-800" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-28 bg-slate-900/60 rounded-2xl border border-slate-800" />
        <div className="h-28 bg-slate-900/60 rounded-2xl border border-slate-800" />
        <div className="h-28 bg-slate-900/60 rounded-2xl border border-slate-800" />
      </div>
    </div>
  );
};
