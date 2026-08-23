import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Layers, 
  Eye, 
  ShieldCheck, 
  Activity, 
  Zap, 
  FileText, 
  Video, 
  Music, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  Server, 
  Terminal, 
  Sparkles,
  Lock,
  GitBranch
} from 'lucide-react';
import { motion } from 'motion/react';

export const HowItWorksPage: React.FC = () => {
  const [activeModality, setActiveModality] = useState<'image' | 'video' | 'audio'>('image');

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
          Architecture & Methodology
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How DeepVerify Works
        </h1>
        <p className="text-base text-slate-300 leading-relaxed font-normal">
          A multi-tiered forensic analysis pipeline combining deep spatial convolutions, temporal recurrent networks, and explainable neural attribution.
        </p>
      </div>

      {/* =========================================================================
          INTERACTIVE ARCHITECTURE FLOW DIAGRAM
      ========================================================================= */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              System Topography
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">End-to-End Pipeline Architecture</h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
            FASTAPI + PYTORCH + XAI
          </span>
        </div>

        {/* Architecture Node Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Node 1 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-cyan-500/50 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              01
            </div>
            <h4 className="text-sm font-bold text-white">Client Ingestion</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Drag-and-drop file ingestion, cryptographic SHA-256 fingerprinting, MIME type verification.
            </p>
          </div>

          {/* Node 2 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-purple-500/50 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-xs">
              02
            </div>
            <h4 className="text-sm font-bold text-white">Preprocessing</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              RetinaFace facial landmark alignment, frame sampling at 30 FPS, and STFT spectrogram synthesis.
            </p>
          </div>

          {/* Node 3 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-blue-500/50 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
              03
            </div>
            <h4 className="text-sm font-bold text-white">Neural Ensemble</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              EfficientNet-B7 + Bi-LSTM TimeSformer + RawNet3 multi-model parallel inference inference.
            </p>
          </div>

          {/* Node 4 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-rose-500/50 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono font-bold text-xs">
              04
            </div>
            <h4 className="text-sm font-bold text-white">Grad-CAM XAI</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Backpropagated gradient activation maps, bounding box localization, and anomaly attribution.
            </p>
          </div>

          {/* Node 5 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-emerald-500/50 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              05
            </div>
            <h4 className="text-sm font-bold text-white">Certified Report</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bayesian confidence calibration, tamper-proof ID generation, downloadable PDF certificates.
            </p>
          </div>

        </div>
      </div>

      {/* =========================================================================
          6-STEP DETAILED PIPELINE BREAKDOWN
      ========================================================================= */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Methodological Rigor
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The 6 Stages of Deep Verification
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-400 text-xs font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                STEP 01
              </span>
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white">Cryptographic Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When media is uploaded, DeepVerify immediately computes a 256-bit SHA checksum. This creates a tamper-proof chain of custody ensuring the payload examined is cryptographically identical to the file in evidence.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-purple-400 text-xs font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-800">
                STEP 02
              </span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Modal Preprocessing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Images and video streams undergo facial landmark alignment with 68-point 3D meshes. Videos are split into temporal keyframes, while audio channels are transformed into short-time Fourier transform (STFT) matrices.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-blue-400 text-xs font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-800">
                STEP 03
              </span>
              <Cpu className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white">Ensemble Model Inference</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deep convolutional backbones (EfficientNet-B7) detect spatial GAN textures, while Bi-directional LSTMs scan for unnatural head movement and eye blink pauses that betray face-swap algorithms.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-rose-400 text-xs font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-800">
                STEP 04
              </span>
              <Eye className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white">Explainability & Grad-CAM</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gradient-weighted Class Activation Mapping calculates the gradients of the deepfake score with respect to the final convolutional feature maps, producing heatmaps of suspicious regions.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-amber-400 text-xs font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                STEP 05
              </span>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white">Calibrated Confidence Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Raw network logits are normalized through temperature scaling and Bayesian calibration, providing reliable confidence probabilities rather than overconfident binary guesses.
            </p>
          </div>

          {/* Step 6 */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-emerald-400 text-xs font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                STEP 06
              </span>
              <ShieldCheck className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white">Official Verification Dossier</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              An immutable verification record is created containing comprehensive findings, timestamped audit data, and printable PDF forensic certificates ready for export.
            </p>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MODALITY-SPECIFIC DEEP DIVE TABS
      ========================================================================= */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Modality Deep Dives
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              How We Analyze Each Media Type
            </h3>
          </div>

          <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setActiveModality('image')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeModality === 'image'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>

            <button
              onClick={() => setActiveModality('video')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeModality === 'video'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>

            <button
              onClick={() => setActiveModality('audio')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeModality === 'audio'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Audio</span>
            </button>
          </div>
        </div>

        {/* Modality Content Panels */}
        {activeModality === 'image' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Spatial & Frequency Domain Examination</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Modern diffusion and GAN models leave subtle spatial noise footprints and abnormal high-frequency spectral roll-offs invisible to the human eye. DeepVerify scans for:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Specular Iris Reflections:</strong> Divergence in virtual light reflections between left and right eyes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Boundary Blending Artifacts:</strong> Color gradient discontinuities along the jawline and hair boundaries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Sensor PRNU Consistency:</strong> Verification of camera sensor photo-response non-uniformity patterns.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
              <div className="text-cyan-400 font-bold border-b border-slate-800 pb-2">
                // Image Analysis Pipeline Config
              </div>
              <div>• Backbone: EfficientNet-B7 + MesoNet-4 Ensemble</div>
              <div>• Attention: Grad-CAM Saliency Layers</div>
              <div>• Resolution: 2048x2048 Multi-Crop Evaluation</div>
              <div>• Latency: ~140ms on NVIDIA A100 Tensor Core</div>
            </div>
          </div>
        )}

        {activeModality === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Temporal Consistency & Biological Kinetics</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Video deepfakes are vulnerable across the time domain. While individual frames may look plausible, inter-frame transitions reveal significant physical flaws:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Eye-Blink Rate Inconsistencies:</strong> Spontaneous blink frequency divergence from healthy human baselines.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Lip-Sync Kinetic Drift:</strong> Phoneme-viseme desynchronization between vocal sounds and mouth shape.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Micro-Expression Jitter:</strong> High-frequency facial jitter caused by frame-by-frame autoencoder synthesis.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
              <div className="text-purple-400 font-bold border-b border-slate-800 pb-2">
                // Video Temporal Pipeline Config
              </div>
              <div>• Model: TimeSformer + Bi-Directional LSTM</div>
              <div>• Sampling: 30 FPS Keyframe Windowing</div>
              <div>• Facial Alignment: RetinaFace 68-Point Mesh</div>
              <div>• Latency: ~380ms for 10-second segment</div>
            </div>
          </div>
        )}

        {activeModality === 'audio' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Neural Vocoder & Harmonic Phase Forensics</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Cloned voices and text-to-speech generators fail to faithfully reproduce human vocal tract glottal flow dynamics:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>High-Frequency Energy Cutoff:</strong> Abrupt spectral dampening above 7.8 kHz or 8.0 kHz vocoder limits.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Phase Inversion & Cancellation:</strong> Phase discontinuities between contiguous harmonic formants.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Respiratory Pause Absence:</strong> Synthetic speech models failing to emulate natural pulmonary inhalation pauses.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3">
              <div className="text-amber-400 font-bold border-b border-slate-800 pb-2">
                // Audio Spectrogram Pipeline Config
              </div>
              <div>• Engine: RawNet3 + LFCC-GMM Acoustic Model</div>
              <div>• STFT Window: 1024-point FFT with Hanning Window</div>
              <div>• Sample Rate: 44.1 kHz / 16-bit Mono</div>
              <div>• Latency: ~95ms for 30-second audio track</div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="text-center p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-2xl font-bold text-white">Experience DeepVerify in Action</h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Test our forensic engine with sample deepfakes or upload your own files to see real-time XAI Grad-CAM visualizations.
        </p>
        <div className="pt-2">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
