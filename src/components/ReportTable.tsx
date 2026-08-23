import React from 'react';
import { 
  FileText, 
  Search, 
  Trash2, 
  Eye, 
  Download, 
  ExternalLink, 
  ArrowUpDown,
  Image as ImageIcon,
  Video as VideoIcon,
  Music as AudioIcon,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { VerificationReport } from '../types';
import { PredictionBadge, RiskBadge } from './RiskBadge';

interface ReportTableProps {
  reports: VerificationReport[];
  onDeleteReport?: (id: string) => void;
  onDownloadReport?: (report: VerificationReport) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  onDeleteReport,
  onDownloadReport
}) => {
  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-cyan-400" />;
      case 'video':
        return <VideoIcon className="w-4 h-4 text-purple-400" />;
      case 'audio':
        return <AudioIcon className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md shadow-xl">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-950/80 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
          <tr>
            <th className="px-5 py-4">Verification ID</th>
            <th className="px-5 py-4">File Name</th>
            <th className="px-5 py-4">Media</th>
            <th className="px-5 py-4">Assessment</th>
            <th className="px-5 py-4">Confidence</th>
            <th className="px-5 py-4">Risk</th>
            <th className="px-5 py-4">Timestamp</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-sans">
          {reports.map((report) => {
            const formattedDate = new Date(report.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <tr 
                key={report.verificationId}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                {/* ID */}
                <td className="px-5 py-4 font-mono font-bold text-xs text-cyan-400 whitespace-nowrap">
                  <Link 
                    to={`/reports/${report.verificationId}`}
                    className="hover:underline flex items-center gap-1.5"
                  >
                    {report.verificationId}
                  </Link>
                </td>

                {/* File */}
                <td className="px-5 py-4 max-w-[200px]">
                  <div className="font-semibold text-white truncate" title={report.filename}>
                    {report.filename}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {report.fileSize}
                  </span>
                </td>

                {/* Media Type */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono capitalize">
                    {getMediaIcon(report.mediaType)}
                    <span>{report.mediaType}</span>
                  </div>
                </td>

                {/* Prediction Result */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <PredictionBadge prediction={report.prediction} size="sm" />
                </td>

                {/* Confidence */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-xs">
                      {(report.confidence * 100).toFixed(1)}%
                    </span>
                    <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${report.prediction === 'deepfake' ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${report.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Risk */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <RiskBadge level={report.riskLevel} size="sm" />
                </td>

                {/* Date */}
                <td className="px-5 py-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                  {formattedDate}
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/reports/${report.verificationId}`}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-all"
                      title="View Report"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    {onDownloadReport && (
                      <button
                        onClick={() => onDownloadReport(report)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                        title="Download Certificate"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}

                    {onDeleteReport && (
                      <button
                        onClick={() => onDeleteReport(report.verificationId)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-all"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const ReportCardList: React.FC<ReportTableProps> = ({
  reports,
  onDeleteReport,
  onDownloadReport
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {reports.map((report) => (
        <div
          key={report.verificationId}
          className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="font-mono text-xs text-cyan-400 font-bold block">
                {report.verificationId}
              </span>
              <h4 className="font-bold text-white text-sm truncate mt-0.5" title={report.filename}>
                {report.filename}
              </h4>
            </div>

            <PredictionBadge prediction={report.prediction} size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">Media Type</span>
              <span className="text-white font-semibold uppercase">{report.mediaType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Confidence</span>
              <span className="text-white font-semibold">{(report.confidence * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Risk Level</span>
              <span className="text-white font-semibold uppercase">{report.riskLevel}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Date</span>
              <span className="text-slate-300">{new Date(report.timestamp).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <Link
              to={`/reports/${report.verificationId}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Report</span>
            </Link>

            <div className="flex items-center gap-2">
              {onDownloadReport && (
                <button
                  onClick={() => onDownloadReport(report)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  aria-label="Download report"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              {onDeleteReport && (
                <button
                  onClick={() => onDeleteReport(report.verificationId)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400"
                  aria-label="Delete report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
