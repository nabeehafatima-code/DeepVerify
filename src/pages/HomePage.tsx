import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Eye, 
  Cpu, 
  FileText, 
  Layers, 
  Video, 
  Music, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Activity, 
  Globe, 
  Scale, 
  Newspaper, 
  Building2, 
  GraduationCap, 
  Users, 
  Zap, 
  Search,
  Flame,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { ConfidenceRing } from '../components/ConfidenceRing';
import { PredictionBadge, RiskBadge } from '../components/RiskBadge';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* =========================================================================
          HERO SECTION
      ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Trust Badge */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono font-semibold text-cyan-300 shadow-lg shadow-cyan-950/40"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>AI-POWERED MEDIA VERIFICATION SYSTEM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </motion.div>
          </div>

          {/* Headline & Subtitle */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]"
            >
              Detect. Verify.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                Trust.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
            >
              Next-generation AI forensics to expose deepfakes, synthetic voice clones, and manipulated visual media before disinformation spreads.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/analyze"
                id="hero-primary-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Analyze Media Now</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>

              <Link
                to="/how-it-works"
                id="hero-secondary-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-semibold text-sm sm:text-base transition-all"
              >
                <span>How DeepVerify Works</span>
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual: Realistic AI Media-Analysis Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-14 max-w-5xl mx-auto relative rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 sm:p-6 shadow-2xl backdrop-blur-xl cyber-grid"
          >
            {/* Window Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">
                  deepverify_neural_forensics://preview_session
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                  LIVE INFERENCE
                </span>
              </div>
            </div>

            {/* Dashboard Inner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              
              {/* Media Preview & Heatmap Box */}
              <div className="md:col-span-5 relative aspect-square rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Scanned AI portrait"
                  className="w-full h-full object-cover"
                />
                {/* Heatmap Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-50"
                  style={{
                    mixBlendMode: 'color-dodge',
                    background: 'radial-gradient(ellipse at 50% 35%, rgba(244, 63, 94, 0.9) 0%, rgba(245, 158, 11, 0.7) 35%, transparent 70%)'
                  }}
                />
                {/* Suspicious box hotspot */}
                <div className="absolute top-[28%] left-[30%] w-[40%] h-[20%] border-2 border-rose-500 bg-rose-500/20 rounded-lg animate-pulse">
                  <span className="absolute -top-5 left-0 bg-slate-950 text-[10px] font-mono font-bold text-rose-400 px-1.5 py-0.5 rounded border border-rose-800">
                    Ocular Asymmetry 97%
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 flex justify-between">
                  <span>File: sample_face_swap.jpg</span>
                  <span className="text-cyan-400">Grad-CAM Active</span>
                </div>
              </div>

              {/* Central Confidence & Metrics */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <PredictionBadge prediction="deepfake" size="md" />
                
                <div className="my-3 scale-90">
                  <ConfidenceRing
                    confidence={97.4}
                    prediction="deepfake"
                    size={160}
                    strokeWidth={12}
                    label="Model Confidence"
                  />
                </div>

                <div className="w-full space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Deepfake Probability:</span>
                    <span className="text-rose-400 font-bold">97.4%</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Risk Level:</span>
                    <span className="text-rose-400 font-bold">HIGH RISK</span>
                  </div>
                </div>
              </div>

              {/* Key Findings List */}
              <div className="md:col-span-3 space-y-2.5 text-xs">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Top Neural Flags
                </span>

                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <div className="font-bold mb-0.5">Asymmetric Corneal Reflection</div>
                  <p className="text-[11px] text-slate-300">Light vectors diverge across left and right pupils.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <div className="font-bold mb-0.5">Boundary Blending Seam</div>
                  <p className="text-[11px] text-slate-300">Unnatural gradient smoothing at jawline.</p>
                </div>

                <Link
                  to="/analyze"
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Test with your own media</span>
                </Link>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          SECTION: SUPPORTED MEDIA (3 Cards)
      ========================================================================= */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Multi-Modal Detection Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Supported Media Formats
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Comprehensive deepfake detection tailored to distinct spatial, temporal, and acoustic signatures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. Image Detection */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 hover:border-cyan-500/40 transition-all group flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Image Detection</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Identifies GAN and Diffusion synthetic generation, facial warping, cornea reflections, and localized blending seams.
                </p>

                <ul className="space-y-2.5 pt-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Face manipulation & identity swaps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Synthetic image detection (Midjourney, DALL-E)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Suspicious-region Grad-CAM visualization</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/analyze?type=image"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300"
              >
                <span>Analyze Images</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* 2. Video Detection */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 hover:border-purple-500/40 transition-all group flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Video className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Video Detection</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Deep temporal Bi-LSTM and TimeSformer networks examine inter-frame consistency, blink dynamics, and lip-sync kinetics.
                </p>

                <ul className="space-y-2.5 pt-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Frame-level temporal consistency analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Phoneme-viseme desynchronization tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Suspicious frame marker identification</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/analyze?type=video"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300"
              >
                <span>Analyze Videos</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* 3. Audio Detection */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 hover:border-amber-500/40 transition-all group flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Music className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white">Audio Detection</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  RawNet3 and LFCC-GMM algorithms uncover voice clones, synthetic vocoder artifacts, and artificial frequency cutoffs.
                </p>

                <ul className="space-y-2.5 pt-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Synthetic voice clone & TTS detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>2D STFT spectral power density analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Acoustic authenticity assessment</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/analyze?type=audio"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300"
              >
                <span>Analyze Audio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: HOW DEEPVERIFY WORKS (4 Steps)
      ========================================================================= */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              End-to-End Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How DeepVerify Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              A 4-stage transparent verification pipeline designed for high accuracy and explainable results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'Upload Media',
                desc: 'Drag & drop image, video, or audio payloads. Cryptographic SHA-256 hashes are computed upon ingestion.',
                icon: Layers
              },
              {
                num: '02',
                title: 'Deep AI Analysis',
                desc: 'Ensemble spatial and temporal neural models scan pixel structures, landmarks, and frequency spectra.',
                icon: Cpu
              },
              {
                num: '03',
                title: 'Explain Findings',
                desc: 'Grad-CAM heatmaps and anomaly breakdowns highlight exactly why regions or frames were flagged.',
                icon: Eye
              },
              {
                num: '04',
                title: 'Verify & Export',
                desc: 'Receive calibrated confidence metrics, risk tiers, and downloadable official verification certificates.',
                icon: ShieldCheck
              }
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-base">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono font-black text-2xl text-slate-700">{step.num}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: WHY DEEPVERIFY (6 Cards)
      ========================================================================= */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Core Technical Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why DeepVerify?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Moving beyond black-box AI to deliver verifiable, explainable, and accountable media forensics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Explainable AI (XAI)',
                desc: 'Visual attribution mapping and clear reasons showing precisely why content was flagged.',
                icon: Eye
              },
              {
                title: 'Confidence Scoring',
                desc: 'Unbiased probabilistic confidence bounds calibrated across multiple model ensembles.',
                icon: Activity
              },
              {
                title: 'Suspicious Region Detection',
                desc: 'Localized bounding boxes highlighting blended seams, iris specular anomalies, and texture morphing.',
                icon: Flame
              },
              {
                title: 'Verification Reports',
                desc: 'Downloadable PDF certificates and structured JSON exports for legal and audit dossiers.',
                icon: FileText
              },
              {
                title: 'Multi-Media Support',
                desc: 'Single unified interface covering image, video, and audio deepfake detection pipelines.',
                icon: Layers
              },
              {
                title: 'High-Throughput Speed',
                desc: 'Optimized inference pipelines providing rapid verification with sub-second image latencies.',
                icon: Zap
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 hover:border-cyan-500/30 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: USE CASES (6 Sectors)
      ========================================================================= */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Broad Societal Application
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Who Relies on DeepVerify?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Engineered for mission-critical media verification across civic and industrial sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Journalism & Fact-Checkers',
                desc: 'Verify wire agency photos and breaking video footage before publication to preserve institutional credibility.',
                icon: Newspaper
              },
              {
                title: 'Government & Public Safety',
                desc: 'Protect democratic elections, counter viral disinformation campaigns, and secure public communication channels.',
                icon: Building2
              },
              {
                title: 'Education & Researchers',
                desc: 'Equip media literacy programs and forensics laboratories with rigorous forensic analytical tools.',
                icon: GraduationCap
              },
              {
                title: 'Enterprise & Finance',
                desc: 'Safeguard executive communications against CEO voice fraud and biometric identity impersonation.',
                icon: Lock
              },
              {
                title: 'Content Moderation',
                desc: 'Automate high-volume triage of synthetic media violations across digital community platforms.',
                icon: ShieldAlert
              },
              {
                title: 'Everyday Users',
                desc: 'Provide citizens with accessible tools to independently evaluate suspicious viral media clips.',
                icon: Users
              }
            ].map((useCase, idx) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">{useCase.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{useCase.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: STATS / TRUST INDICATORS
      ========================================================================= */}
      <section className="py-16 border-t border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono block mb-1">
                3
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 block">
                Media Types Supported
              </span>
              <span className="text-[11px] text-slate-400">Images, Videos, and Audio</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono block mb-1">
                99.2%
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 block">
                Benchmark Accuracy
              </span>
              <span className="text-[11px] text-slate-400">FaceForensics++ & DFDC</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono block mb-1">
                100%
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 block">
                Explainable Results
              </span>
              <span className="text-[11px] text-slate-400">Grad-CAM & Frequency Maps</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-mono block mb-1">
                FastAPI
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 block">
                Production-Ready
              </span>
              <span className="text-[11px] text-slate-400">REST API Integration Ready</span>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: CALL TO ACTION
      ========================================================================= */}
      <section className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-cyan-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Ready to verify your media?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Upload an image, video, or audio file now and receive comprehensive forensic analysis with explainable evidence in seconds.
          </p>

          <div className="pt-2">
            <Link
              to="/analyze"
              id="cta-bottom-button"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Free Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
