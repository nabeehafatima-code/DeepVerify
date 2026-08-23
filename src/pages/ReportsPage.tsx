import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  Layers, 
  Activity, 
  RotateCcw, 
  Download, 
  Trash2,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import { VerificationReport, FilterOptions, StatsSummary, MediaType, PredictionResult, RiskLevel } from '../types';
import * as reportsApi from '../services/reportsApi';
import { ReportTable, ReportCardList } from '../components/ReportTable';
import { EmptyState, LoadingSkeleton, ErrorState } from '../components/States';
import { DownloadReportModal } from '../components/DownloadReportModal';
import { useToast } from '../context/ToastContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<VerificationReport[]>([]);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaFilter, setMediaFilter] = useState<'all' | MediaType>('all');
  const [predictionFilter, setPredictionFilter] = useState<'all' | PredictionResult>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest_confidence' | 'lowest_confidence'>('newest');

  const [selectedReportForDownload, setSelectedReportForDownload] = useState<VerificationReport | null>(null);
  const { success } = useToast();

  const loadData = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const filters: FilterOptions = {
        searchQuery,
        mediaType: mediaFilter,
        prediction: predictionFilter,
        riskLevel: riskFilter,
        sortBy
      };

      const [loadedReports, loadedStats] = await Promise.all([
        reportsApi.getReports(filters),
        reportsApi.getStats()
      ]);

      setReports(loadedReports);
      setStats(loadedStats);
      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to load verification reports.');
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, mediaFilter, predictionFilter, riskFilter, sortBy]);

  const handleDeleteReport = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete verification report ${id}?`)) {
      await reportsApi.deleteReport(id);
      success('Report Deleted', `Report ${id} has been removed.`);
      loadData();
    }
  };

  const handleDownload = (report: VerificationReport) => {
    setSelectedReportForDownload(report);
  };

  // Recharts data for media breakdown
  const chartData = [
    { name: 'Images', count: stats?.imagesAnalyzed || 0, color: '#06b6d4' },
    { name: 'Videos', count: stats?.videosAnalyzed || 0, color: '#a855f7' },
    { name: 'Audio', count: stats?.audiosAnalyzed || 0, color: '#f59e0b' }
  ];

  return (
    <div className="min-h-screen py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Forensic Audit Repository
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            Verification Reports
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1">
            Review, audit, and export previous deepfake media verification assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:border-slate-700 transition-all"
            title="Refresh reports from the API"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Refresh Reports</span>
          </button>

          <Link
            to="/analyze"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Verification</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Summary Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Total Analyses
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white font-mono">{stats.totalAnalyses}</span>
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Logged across sessions</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-rose-400 uppercase tracking-wider block">
              Deepfakes Detected
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-rose-400 font-mono">{stats.deepfakesDetected}</span>
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">High risk synthetic flags</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">
              Likely Authentic
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-emerald-400 font-mono">{stats.likelyAuthentic}</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Intact sensor & light metrics</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
              Avg. Model Confidence
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-cyan-400 font-mono">
                {(stats.averageConfidence * 100).toFixed(1)}%
              </span>
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Ensemble calibration</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by file name or verification ID (e.g. DV-2026)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-sans text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Filter Dropdowns / Quick Selects */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            
            {/* Media Type Filter */}
            <select
              value={mediaFilter}
              onChange={(e) => setMediaFilter(e.target.value as 'all' | MediaType)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Media (Types)</option>
              <option value="image">Images Only</option>
              <option value="video">Videos Only</option>
              <option value="audio">Audio Only</option>
            </select>

            {/* Prediction Filter */}
            <select
              value={predictionFilter}
              onChange={(e) => setPredictionFilter(e.target.value as 'all' | PredictionResult)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Predictions</option>
              <option value="deepfake">Likely Deepfake</option>
              <option value="authentic">Likely Authentic</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'highest_confidence' | 'lowest_confidence')}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest_confidence">Sort: Highest Confidence</option>
              <option value="lowest_confidence">Sort: Lowest Confidence</option>
            </select>

          </div>
        </div>
      </div>

      {/* Reports Table / Card View */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : errorMsg ? (
        <ErrorState message={errorMsg} onRetry={loadData} />
      ) : reports.length === 0 ? (
        <EmptyState
          title="No Matching Verification Reports"
          description="No records match your active query. Try adjusting your filters or upload a new media file to analyze."
          actionText="Analyze New Media"
          actionHref="/analyze"
        />
      ) : (
        <div className="space-y-6">
          <div className="hidden md:block">
            <ReportTable
              reports={reports}
              onDeleteReport={handleDeleteReport}
              onDownloadReport={handleDownload}
            />
          </div>

          <ReportCardList
            reports={reports}
            onDeleteReport={handleDeleteReport}
            onDownloadReport={handleDownload}
          />
        </div>
      )}

      {/* Download Modal if active */}
      {selectedReportForDownload && (
        <DownloadReportModal
          report={selectedReportForDownload}
          isOpen={!!selectedReportForDownload}
          onClose={() => setSelectedReportForDownload(null)}
        />
      )}

    </div>
  );
};
