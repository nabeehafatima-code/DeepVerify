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
import { useTheme } from '../context/ThemeContext';

interface HeatmapRegion {
  id: string | number;
  label: string;
  confidence: number;
  description: string;
  box?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface HeatmapPanelProps {
  imageUrl?: string;
  heatmapUrl?: string;
  suspiciousRegions?: HeatmapRegion[];
  filename?: string;
  isDeepfake?: boolean;
}

export const HeatmapPanel: React.FC<HeatmapPanelProps> = ({
  imageUrl,
  heatmapUrl,
  suspiciousRegions = [],
  filename = 'uploaded-image',
  isDeepfake = true
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'original' | 'analysis' | 'heatmap'>('analysis');
  const [selectedRegion, setSelectedRegion] = useState<HeatmapRegion | null>(null);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.75);

  const isDarkMode = theme === 'dark';
  const showHeatmapUnavailable = activeTab === 'heatmap' && !heatmapUrl && isDeepfake;

  return (
    <div className={`rounded-3xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'} p-5 sm:p-6 shadow-2xl ${isDarkMode ? 'backdrop-blur-md' : ''}`}>
      
      {/* Header with Mode Switcher */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>
              Spatial Manipulation & Heatmap Analysis
            </h3>
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${isDarkMode ? 'bg-cyan-950 border-cyan-800/60 text-cyan-300' : 'bg-cyan-100 border-cyan-300 text-cyan-700'} border`}>
              EXPLAINABILITY
            </span>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>
            Inspect edge/texture saliency heatmap and localized region anomalies
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className={`inline-flex p-1 rounded-xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'} border`}>
          <button
            onClick={() => setActiveTab('original')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'original'
                ? isDarkMode ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm border border-slate-300'
                : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Original</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'analysis'
                ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/20 font-bold'
                : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
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
                : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
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
          <div className={`relative w-full aspect-square max-h-[460px] rounded-2xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'} border overflow-hidden flex items-center justify-center group shadow-inner`}>
            
            {/* Display appropriate image based on tab */}
            {activeTab === 'original' && imageUrl && (
              <img
                src={imageUrl}
                alt="Original uploaded image"
                className="w-full h-full object-cover select-none"
              />
            )}

            {activeTab === 'analysis' && imageUrl && (
              <img
                src={imageUrl}
                alt="Media scan item"
                className="w-full h-full object-cover select-none"
              />
            )}

            {activeTab === 'heatmap' && heatmapUrl && (
              <img
                src={heatmapUrl}
                alt="Heatmap overlay"
                className="w-full h-full object-cover select-none"
                style={{ opacity: heatmapOpacity }}
              />
            )}

            {activeTab === 'heatmap' && !heatmapUrl && (
              <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-900/90' : 'bg-slate-100/90'}`}>
                <div className="text-center">
                  <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    Model attention visualization is unavailable for this analysis.
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                    The model could not generate a saliency heatmap for this image, but the prediction still remains available.
                  </p>
                </div>
              </div>
            )}

            {!imageUrl && activeTab !== 'heatmap' && (
              <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-900/90' : 'bg-slate-100/90'}`}>
                <div className="text-center">
                  <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    No image available
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                    Upload and analyze an image to see results
                  </p>
                </div>
              </div>
            )}

            {/* Suspicious Bounding Regions Overlays (on analysis tab) */}
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
                  <span className={`absolute -top-6 left-0 ${isDarkMode ? 'bg-slate-950/90 border-slate-700 text-cyan-300' : 'bg-white border-slate-300 text-cyan-600'} border text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap`}>
                    {region.label} ({(region.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
              );
            })}

            {/* Mode Badge in Corner */}
            <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg ${isDarkMode ? 'bg-slate-950/90 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-300 text-slate-600'} border text-[11px] font-mono ${isDarkMode ? 'backdrop-blur-md' : ''}`}>
              Mode: <span className={`${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} font-bold uppercase`}>{activeTab}</span>
            </div>
          </div>

          {/* Heatmap Opacity Slider (when heatmap active) */}
          {activeTab === 'heatmap' && heatmapUrl && (
            <div className={`mt-3 flex items-center justify-between gap-4 p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'} border text-xs`}>
              <div className="space-y-1">
                <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} font-mono block`}>Heatmap Layer Opacity:</span>
                <span className={`${isDarkMode ? 'text-slate-500' : 'text-slate-500'} text-[10px]`}>Red indicates the strongest model attention for this prediction.</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={heatmapOpacity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHeatmapOpacity(parseFloat(e.target.value))
                  }
                  className="accent-rose-500 w-32 cursor-pointer"
                />
                <span className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'} font-mono text-[11px]`}>
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
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
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
                          ? isDarkMode ? 'bg-rose-500/15 border-rose-500/50 shadow-md shadow-rose-950/30' : 'bg-rose-100 border-rose-300 shadow-md shadow-rose-100'
                          : isDarkMode ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{region.label}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${isDarkMode ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-700'}`}>
                          {(region.confidence * 100).toFixed(0)}% ANOMALY
                        </span>
                      </div>
                      <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                        {region.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-emerald-100 border-emerald-300 text-emerald-700'} border text-xs`}>
                No localized deepfake boundary seams detected in facial regions.
              </div>
            )}
          </div>

          {/* Attention Intensity Legend */}
          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'} border space-y-2.5`}>
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} block`}>
              Saliency Activation Legend
            </span>

            <div className="h-3 rounded-full bg-gradient-to-r from-blue-600 via-emerald-500 via-amber-400 to-rose-600 shadow-inner" />

            <div className={`flex items-center justify-between text-[10px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>Low Attention</span>
              <span>Moderate</span>
              <span className={isDarkMode ? 'text-rose-400 font-bold' : 'text-rose-600 font-bold'}>High Attention</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};