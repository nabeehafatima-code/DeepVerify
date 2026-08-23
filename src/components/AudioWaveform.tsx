import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  Waves,
  Zap
} from 'lucide-react';
import { SpectralAnomaly } from '../types';

interface AudioWaveformProps {
  spectralAnomalies?: SpectralAnomaly[];
  duration?: string;
  sampleRate?: string;
  isDeepfake?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  spectralAnomalies = [],
  duration = '00:18',
  sampleRate = '44.1 kHz, 16-bit Mono',
  isDeepfake = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAnomalyIndex, setActiveAnomalyIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(1.8);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Generate 48 mock waveform bars with dynamic heights
  const bars = Array.from({ length: 48 }, (_, i) => {
    const isAnomalousZone = isDeepfake && (i >= 8 && i <= 18 || i >= 26 && i <= 36);
    const baseHeight = Math.sin(i * 0.35) * 40 + 50 + (i % 5) * 8;
    return {
      id: i,
      height: Math.max(15, Math.min(95, baseHeight)),
      isAnomalous: isAnomalousZone,
      freqText: `${(i * 0.45).toFixed(1)}k`
    };
  });

  const togglePlayback = () => {
    if (!isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioContextRef.current = new AudioCtx();
          const osc = audioContextRef.current.createOscillator();
          const gain = audioContextRef.current.createGain();
          osc.type = isDeepfake ? 'sawtooth' : 'sine';
          osc.frequency.setValueAtTime(isDeepfake ? 440 : 523.25, audioContextRef.current.currentTime);
          gain.gain.setValueAtTime(0.08, audioContextRef.current.currentTime);
          osc.connect(gain);
          gain.connect(audioContextRef.current.destination);
          osc.start();
          setTimeout(() => {
            try {
              osc.stop();
              audioContextRef.current?.close();
            } catch {}
          }, 3500);
        }
      } catch (err) {
        console.log('Audio preview note:', err);
      }
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3500);
    } else {
      setIsPlaying(false);
      try {
        audioContextRef.current?.close();
      } catch {}
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Acoustic Waveform & Spectral Forensics
            </h3>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
              LFCC-GMM ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Short-time Fourier transform (STFT) spectrogram and neural vocoder synthesis signature analysis
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <span>Sampling: <strong className="text-slate-200">{sampleRate}</strong></span>
          <span>•</span>
          <span>Duration: <strong className="text-cyan-400">{duration}</strong></span>
        </div>
      </div>

      {/* Main Waveform Canvas Section */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden space-y-4">
        
        {/* Top Control Strip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayback}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                isPlaying
                  ? 'bg-rose-500 text-white shadow-rose-500/30'
                  : 'bg-cyan-500 text-slate-950 shadow-cyan-500/20 hover:bg-cyan-400'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Playing Synthetic Audio' : 'Play Audio Sample'}</span>
            </button>

            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              00:0{currentTime.toFixed(1)}s / {duration}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Vocoder Phase Distortion
            </span>
            <span className="flex items-center gap-1 text-cyan-400 hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Normal Glottal Spectrum
            </span>
          </div>
        </div>

        {/* Animated Waveform Visualizer Bars */}
        <div className="h-32 flex items-end justify-between gap-1 pt-4 pb-2 border-b border-slate-800/80 px-2 relative">
          
          {/* Waveform Bars */}
          {bars.map((bar) => (
            <div
              key={bar.id}
              className="flex-1 flex flex-col items-center justify-end h-full group"
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-200 ${
                  bar.isAnomalous
                    ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-sm shadow-rose-500/40'
                    : 'bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-cyan-400'
                }`}
                style={{
                  height: `${bar.height}%`,
                  opacity: isPlaying ? (bar.id % 2 === 0 ? 0.9 : 0.6) : 0.8
                }}
              />
            </div>
          ))}

          {/* Scrubber needle */}
          <div 
            className="absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none"
            style={{ left: `${(currentTime / 18) * 100}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-white -ml-[3px] -mt-1 shadow-md shadow-cyan-400" />
          </div>
        </div>

        {/* Spectrogram Frequency Axis Labels */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-2">
          <span>0 Hz</span>
          <span>2.0 kHz</span>
          <span>4.5 kHz (Vocoder Cutoff)</span>
          <span>8.0 kHz</span>
          <span>16.0 kHz</span>
          <span>20.0 kHz</span>
        </div>
      </div>

      {/* Spectrogram Heatmap Tile View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            2D Spectrogram STFT Energy Heatmap
          </span>
          <span className="text-[11px] font-mono text-cyan-400">
            High Energy (White/Cyan) → Low Energy (Dark Slate)
          </span>
        </div>

        <div className="h-20 w-full rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
          {/* Simulated Spectrogram Heatmap Pattern */}
          <div 
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage: isDeepfake 
                ? 'linear-gradient(90deg, #09203f 0%, #537895 20%, #e11d48 40%, #09203f 60%, #e11d48 80%, #09203f 100%)'
                : 'linear-gradient(90deg, #09203f 0%, #06b6d4 30%, #10b981 60%, #09203f 100%)',
              mixBlendMode: 'screen'
            }}
          />
          <div className="relative z-10 text-center font-mono text-xs text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            {isDeepfake 
              ? '⚠️ Phase Cancellation and High-Frequency Energy Drop Detected above 7.8 kHz' 
              : '✓ Full Harmonic Spectrum Intact up to 20 kHz'}
          </div>
        </div>
      </div>

      {/* Spectral Anomalies List */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Identified Acoustic Anomalies
        </h4>

        {spectralAnomalies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {spectralAnomalies.map((anomaly, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    {anomaly.frequencyBand}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400">
                    {Math.round(anomaly.anomalyScore * 100)}% Anomalous
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {anomaly.description}
                </p>

                <div className="text-[10px] font-mono text-slate-400">
                  Window: {anomaly.timeStart}s — {anomaly.timeEnd}s
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            No synthetic vocoder signatures or artificial frequency ceilings detected.
          </div>
        )}
      </div>
    </div>
  );
};
