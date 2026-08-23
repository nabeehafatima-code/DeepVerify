import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Film, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { FrameAnalysis } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

interface VideoTimelineProps {
  frames?: FrameAnalysis[];
  videoUrl?: string;
  duration?: string;
  isDeepfake?: boolean;
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({
  frames = [],
  videoUrl,
  duration = '00:32',
  isDeepfake = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(2); // Default to a suspicious frame if available
  const [playbackTime, setPlaybackTime] = useState<number>(frames[2]?.timestamp || 3.0);

  const selectedFrame = frames[selectedFrameIndex] || frames[0];

  const chartData = frames.map((f, idx) => ({
    frame: `F#${f.frameNumber}`,
    frameNumber: f.frameNumber,
    timestamp: f.timestampFormatted,
    score: Math.round(f.deepfakeScore * 100),
    confidence: Math.round(f.confidence * 100),
    isSuspicious: f.isSuspicious,
    anomaly: f.anomalyType || 'Normal Temporal Coherence',
    idx
  }));

  const handleFrameClick = (index: number) => {
    setSelectedFrameIndex(index);
    if (frames[index]) {
      setPlaybackTime(frames[index].timestamp);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Temporal Frame Consistency & Timeline
            </h3>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
              FRAME-BY-FRAME FORENSICS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sampled video frames evaluated for inter-frame landmark jitter, optical flow, and lip-sync anomalies
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Total Duration: <strong className="text-slate-200">{duration}</strong>
          </span>
        </div>
      </div>

      {/* Video Simulation Display & Frame Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Mock Video Preview Window */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
            
            {/* Background Simulated Video Frame */}
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
              alt="Video frame preview"
              className="w-full h-full object-cover select-none"
            />

            {/* Suspicious Frame Visual Tag Overlay */}
            {selectedFrame?.isSuspicious && (
              <div className="absolute inset-0 bg-rose-950/20 border-4 border-rose-500/60 pointer-events-none transition-all" />
            )}

            {/* Floating Telemetry Box */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 backdrop-blur-md flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-slate-300 font-bold">FRAME #{selectedFrame?.frameNumber || 105}</span>
              <span className="text-slate-400">({selectedFrame?.timestampFormatted || '00:03.5'})</span>
            </div>

            {/* Anomaly Callout Overlay if suspicious */}
            {selectedFrame?.isSuspicious && (
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-rose-950/90 border border-rose-500/60 text-xs backdrop-blur-md flex items-center justify-between text-rose-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-bold">{selectedFrame.anomalyType}</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-rose-300">
                  {Math.round(selectedFrame.deepfakeScore * 100)}% Anomalous
                </span>
              </div>
            )}

            {/* Play/Pause Button Overlay */}
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-slate-900/80 hover:bg-cyan-500 hover:text-slate-950 text-white border border-slate-700 hover:border-cyan-400 flex items-center justify-center shadow-xl transition-all active:scale-90"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
          </div>

          {/* Timeline Quick Navigation Bar */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="text-cyan-400 font-semibold">
              Scrubber: {selectedFrame?.timestampFormatted || '00:00.0'} / {duration}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Suspicious Frames Flagged:</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                {frames.filter(f => f.isSuspicious).length}
              </span>
            </div>
          </div>
        </div>

        {/* Selected Frame Detail Inspector */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Frame Inspector Data
              </h4>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                selectedFrame?.isSuspicious 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {selectedFrame?.isSuspicious ? 'ANOMALY FLAGGED' : 'TEMPORAL COHERENT'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Frame Index</span>
                <span className="text-white font-bold text-sm">#{selectedFrame?.frameNumber}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Timestamp</span>
                <span className="text-cyan-400 font-bold text-sm">{selectedFrame?.timestampFormatted}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Deepfake Score</span>
                <span className={`font-bold text-sm ${selectedFrame?.isSuspicious ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedFrame ? Math.round(selectedFrame.deepfakeScore * 100) : 0}%
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px] block">Confidence</span>
                <span className="text-white font-bold text-sm">
                  {selectedFrame ? Math.round(selectedFrame.confidence * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold block mb-1">Anomaly Diagnosis:</span>
              <p className="text-slate-200 leading-relaxed">
                {selectedFrame?.isSuspicious
                  ? `High frequency of ${selectedFrame.anomalyType}. Spatial gradient dissimilarity across landmark points detected.`
                  : 'Normal optical flow vector and landmark kinetics. No facial boundary distortion present in this sampled frame.'}
              </p>
            </div>
          </div>

          {/* Quick Jump Frame Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Sampled Video Keyframes
            </span>
            <div className="grid grid-cols-4 gap-2">
              {frames.map((frame, idx) => (
                <button
                  key={frame.frameNumber}
                  onClick={() => handleFrameClick(idx)}
                  className={`p-2 rounded-xl text-center border transition-all text-xs font-mono ${
                    selectedFrameIndex === idx
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                      : frame.isSuspicious
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block text-[11px]">#{frame.frameNumber}</span>
                  <span className="text-[10px] opacity-75">{frame.timestampFormatted}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Frame-by-Frame Anomaly Confidence Chart */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Temporal Anomaly Probability Curve (Across Keyframes)
          </span>
          <span className="text-[11px] font-mono text-rose-400">
            Threshold &gt; 50% = Suspicious
          </span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="frame" stroke="#475569" fontSize={11} tickLine={false} />
              <YAxis stroke="#475569" fontSize={11} domain={[0, 100]} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc'
                }}
              />
              <ReferenceLine y={50} stroke="#f43f5e" strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="score"
                name="Deepfake Anomaly Score"
                stroke="#f43f5e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
