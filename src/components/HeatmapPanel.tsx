import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  Flame, 
  Target, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Info,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { SuspiciousRegion } from '../types';

interface HeatmapPanelProps {
  imageUrl?: string;
  suspiciousRegions?: SuspiciousRegion[];
  filename?: string;
  isDeepfake?: boolean;
}

export const HeatmapPanel: React.FC<HeatmapPanelProps> = ({
  imageUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  suspiciousRegions = [],
  filename = 'sample.jpg',
  isDeepfake = true
}) => {
  const [activeTab, setActiveTab] = useState<'original' | 'analysis' | 'heatmap'>('analysis');
  const [selectedRegion, setSelectedRegion] = useState<SuspiciousRegion | null>(null);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.75);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
      
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Spatial Manipulation & Grad-CAM Heatmap
            </h3>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
              LAYER FORENSICS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect model attention activations and localized pixel boundary anomalies
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveTab('original')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'original'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Original</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'analysis'
                ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>AI Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'heatmap'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>
        </div>
      </div>

      {/* Main Image Display Viewport */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Canvas Area */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="relative w-full aspect-square max-h-[460px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
            
            {/* Base Image */}
            <img
              src={imageUrl}
              alt="Media scan item"
              className="w-full h-full object-cover select-none"
            />

            {/* Heatmap Overlay Shader (Grad-CAM simulated layer) */}
            {(activeTab === 'heatmap' || activeTab === 'analysis') && isDeepfake && (
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  opacity: activeTab === 'heatmap' ? heatmapOpacity : 0.45,
                  mixBlendMode: 'color-dodge',
                  background: 'radial-gradient(ellipse at 50% 35%, rgba(244, 63, 94, 0.9) 0%, rgba(245, 158, 11, 0.7) 28%, rgba(16, 185, 129, 0.4) 55%, rgba(6, 182, 212, 0.1) 80%, transparent 100%)'
                }}
              />
            )}

            {/* Authenticity Verified Green Overlay if authentic */}
            {(activeTab === 'heatmap' || activeTab === 'analysis') && !isDeepfake && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  opacity: 0.35,
                  mixBlendMode: 'screen',
                  background: 'radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.6) 0%, rgba(6, 182, 212, 0.3) 50%, transparent 85%)'
                }}
              />
            )}

            {/* Suspicious Bounding Regions Overlays */}
            {activeTab === 'analysis' && suspiciousRegions.map((region) => {
              if (!region.box) return null;
              const isSelected = selectedRegion?.id === region.id;

              return (
                <div
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  className={`absolute cursor-pointer border-2 transition-all rounded-lg ${
                    isSelected
                      ? 'border-rose-400 bg-rose-500/25 shadow-lg shadow-rose-500/40 z-20 scale-[1.02]'
                      : 'border-cyan-400 bg-cyan-500/15 hover:border-rose-400 hover:bg-rose-500/20 z-10'
                  }`}
                  style={{
                    left: `${region.box.x}%`,
                    top: `${region.box.y}%`,
                    width: `${region.box.width}%`,
                    height: `${region.box.height}%`
                  }}
                >
                  <span className="absolute -top-6 left-0 bg-slate-950/90 border border-slate-700 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded text-cyan-300 shadow whitespace-nowrap">
                    {region.label} ({(region.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
              );
            })}

            {/* Subtle Scanning Grid Line Animation in analysis mode */}
            {activeTab === 'analysis' && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 animate-scan-line pointer-events-none" />
            )}

            {/* Mode Badge in Corner */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 backdrop-blur-md">
              Mode: <span className="text-cyan-400 font-bold uppercase">{activeTab}</span>
            </div>
          </div>

          {/* Heatmap Opacity Slider (when heatmap active) */}
          {activeTab === 'heatmap' && (
            <div className="mt-3 flex items-center justify-between gap-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">Heatmap Layer Opacity:</span>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={heatmapOpacity}
                  onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                  className="accent-rose-500 w-32 cursor-pointer"
                />
                <span className="text-slate-200 font-mono text-[11px]">
                  {Math.round(heatmapOpacity * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Region & Legend Inspector Sidebar */}
        <div className="flex flex-col justify-between space-y-4">
          
          {/* Suspicious Regions List */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Detected Focal Anomalies
            </h4>

            {suspiciousRegions.length > 0 ? (
              <div className="space-y-2">
                {suspiciousRegions.map((region) => {
                  const isSelected = selectedRegion?.id === region.id;
                  return (
                    <div
                      key={region.id}
                      onClick={() => setSelectedRegion(region)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-rose-500/15 border-rose-500/50 shadow-md shadow-rose-950/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{region.label}</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                          {(region.confidence * 100).toFixed(0)}% ANOMALY
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {region.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                No localized deepfake boundary seams detected in facial regions.
              </div>
            )}
          </div>

          {/* Attention Intensity Legend */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Grad-CAM Activation Legend
            </span>

            <div className="h-3 rounded-full bg-gradient-to-r from-blue-600 via-emerald-500 via-amber-400 to-rose-600 shadow-inner" />

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Low Attention</span>
              <span>Moderate Attention</span>
              <span className="text-rose-400 font-bold">High Attention (Deepfake)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
