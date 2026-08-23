import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Music as AudioIcon, 
  FileText, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  FileCheck,
  Film,
  Volume2
} from 'lucide-react';
import { MediaType } from '../types';
import { DEMO_PRESETS, DemoPreset } from '../services/mockApi';

interface UploadZoneProps {
  mediaType: MediaType;
  onMediaTypeChange: (type: MediaType) => void;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onPresetSelect?: (preset: DemoPreset) => void;
  selectedPreset?: DemoPreset | null;
  validationError?: string | null;
  onClearError?: () => void;
  onValidationError?: (message: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  mediaType,
  onMediaTypeChange,
  selectedFile,
  onFileSelect,
  onPresetSelect,
  selectedPreset,
  validationError,
  onClearError,
  onValidationError
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSpecs = {
    image: {
      accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
      extensions: 'JPG, JPEG, PNG, WEBP',
      maxSizeMb: 25,
      maxSizeBytes: 25 * 1024 * 1024,
      icon: ImageIcon,
      label: 'Image Verification'
    },
    video: {
      accept: '.mp4,.mov,.avi,.mkv,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska',
      extensions: 'MP4, MOV, AVI, MKV',
      maxSizeMb: 100,
      maxSizeBytes: 100 * 1024 * 1024,
      icon: VideoIcon,
      label: 'Video Temporal Verification'
    },
    audio: {
      accept: '.mp3,.wav,.m4a,.flac,audio/mpeg,audio/wav,audio/mp4,audio/flac',
      extensions: 'MP3, WAV, M4A, FLAC',
      maxSizeMb: 50,
      maxSizeBytes: 50 * 1024 * 1024,
      icon: AudioIcon,
      label: 'Audio Spectral Verification'
    }
  };

  const currentSpec = formatSpecs[mediaType];

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndProcessFile = (file: File) => {
    if (onClearError) onClearError();

    // Check size
    if (file.size > currentSpec.maxSizeBytes) {
      onFileSelect(null);
      onValidationError?.(`File size exceeds the ${currentSpec.maxSizeMb} MB limit for ${mediaType} files.`);
      return;
    }

    // Check type match
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const validExts = currentSpec.extensions.toLowerCase().split(', ');
    const isMimeMatch = file.type.startsWith(mediaType);

    if (!validExts.includes(ext) && !isMimeMatch) {
      onFileSelect(null);
      onValidationError?.(`Unsupported file format. Please upload ${currentSpec.extensions}.`);
      return;
    }

    // Create preview
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    if (mediaType === 'image' || mediaType === 'video' || mediaType === 'audio') {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredPresets = DEMO_PRESETS.filter(p => p.mediaType === mediaType);

  return (
    <div className="w-full space-y-6">
      
      {/* Media Type Selector Tabs */}
      <div className="flex items-center justify-center">
        <div 
          id="media-type-selector"
          role="tablist"
          className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl"
        >
          {(['image', 'video', 'audio'] as MediaType[]).map((type) => {
            const isSelected = mediaType === type;
            const Icon = type === 'image' ? ImageIcon : (type === 'video' ? VideoIcon : AudioIcon);
            const label = type.toUpperCase();

            return (
              <button
                key={type}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  if (type !== mediaType) {
                    handleRemoveFile();
                    onMediaTypeChange(type);
                  }
                }}
                id={`media-tab-${type}`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Demo Preset Quick Picker for Hackathon Demonstration */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Demo Test Samples ({mediaType.toUpperCase()})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click any test sample for instant SIH demonstration
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredPresets.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;
            const isDeepfake = preset.expectedResult === 'deepfake';

            return (
              <button
                key={preset.id}
                onClick={() => onPresetSelect && onPresetSelect(preset)}
                className={`text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-200 truncate">{preset.name}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      isDeepfake 
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' 
                        : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    }`}>
                      {isDeepfake ? 'Fake Case' : 'Auth Case'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{preset.description}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 self-center">
                  {preset.fileSize}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={currentSpec.accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload-input"
      />

      {/* Main Drag-and-Drop Area */}
      {!selectedFile && !selectedPreset ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          id="dropzone-area"
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group ${
            isDragging
              ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01] shadow-2xl shadow-cyan-500/20'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/60'
          }`}
        >
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            id="dropzone-area"
            className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group ${
              isDragging
                ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01] shadow-2xl shadow-cyan-500/20'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/60'
            }`}
          >
            <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-4">
            
            {/* Animated Cyber Upload Icon */}
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center shadow-xl group-hover:scale-105 group-hover:border-cyan-500/50 transition-all">
              <UploadCloud className="w-9 h-9 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Drag & drop your {mediaType} file here
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                or <span className="text-cyan-400 font-semibold underline underline-offset-4 group-hover:text-cyan-300">browse files</span> from your local drive
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
                Formats: {currentSpec.extensions}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
                Max Size: {currentSpec.maxSizeMb} MB
              </span>
            </div>
            </div>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 min-w-0">
              {/* Media Thumbnail / Icon */}
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                {filePreview && mediaType === 'image' ? (
                  <img 
                    src={filePreview} 
                    alt="Uploaded media preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : filePreview && mediaType === 'video' ? (
                  <video src={filePreview} className="w-full h-full object-cover" muted aria-label="Uploaded video preview" />
                ) : filePreview && mediaType === 'audio' ? (
                  <AudioIcon className="w-7 h-7 text-cyan-400" aria-label="Uploaded audio preview" />
                ) : selectedPreset?.previewUrl ? (
                  <img 
                    src={selectedPreset.previewUrl} 
                    alt="Preset preview" 
                    className="w-full h-full object-cover" 
                  />
                ) : mediaType === 'video' ? (
                  <Film className="w-7 h-7 text-cyan-400" />
                ) : mediaType === 'audio' ? (
                  <Volume2 className="w-7 h-7 text-cyan-400" />
                ) : (
                  <ImageIcon className="w-7 h-7 text-cyan-400" />
                )}
              </div>

              {/* Details */}
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-[240px] sm:max-w-md">
                    {selectedFile?.name || selectedPreset?.name || 'Selected File'}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold shrink-0">
                    Ready to scan
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span>
                    {selectedFile 
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` 
                      : selectedPreset?.fileSize || 'Standard'}
                  </span>
                  <span>•</span>
                  <span className="uppercase">{mediaType} format</span>
                  {selectedPreset?.duration && (
                    <>
                      <span>•</span>
                      <span>{selectedPreset.duration}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Remove / Replace Button */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                id="replace-file-button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/30 transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Replace File</span>
              </button>
              <button
                onClick={handleRemoveFile}
                id="remove-file-button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-all"
              >
                <X className="w-4 h-4" />
                <span>Remove File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Message */}
      {validationError && (
        <div role="alert" className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
