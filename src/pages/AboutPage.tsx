import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Eye, 
  Target, 
  Users, 
  Award, 
  Code, 
  Lock, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  HeartHandshake,
  BookOpen,
  Terminal,
  Cpu
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
          Mission & Vision
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About DeepVerify
        </h1>
        <p className="text-base text-slate-300 leading-relaxed font-normal">
          Building verifiable trust in the age of synthetic media through transparent, explainable, and multi-modal AI forensics.
        </p>
      </div>

      {/* Mission Statement Hero Box */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Target className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            “Helping people make better decisions in a world of synthetic media.”
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            DeepVerify was conceived to address one of the most pressing cybersecurity and civic challenges of the 21st century: the weaponization of synthetic media. As generative AI models make synthetic face swaps, audio cloning, and manipulated video virtually indistinguishable to the human eye, society requires impartial, scientifically sound verification tools.
          </p>
        </div>

        {/* Ambient background ornament */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* The Problem & The Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* The Problem */}
        <div className="p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">The Crisis of Synthetic Disinformation</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Hyper-realistic deepfakes are increasingly exploited for financial fraud, election manipulation, reputation destruction, and digital impersonation. Traditional media inspection techniques can no longer keep pace with modern diffusion and neural vocoder algorithms.
          </p>
          <ul className="space-y-2 text-xs text-rose-200">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Over 900% annual increase in synthetic identity fraud incidents</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Erosion of institutional and journalistic trust in digital evidence</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Lack of transparent, explainable forensic tools for everyday users</span>
            </li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="p-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">The DeepVerify Standard</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            DeepVerify provides an open, explainable, and multi-modal platform. Rather than issuing a opaque black-box "true or false" score, we illuminate the precise biological, spatial, and acoustic anomalies detected, empowering human decision-makers.
          </p>
          <ul className="space-y-2 text-xs text-cyan-200">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Grad-CAM visual heatmaps highlighting exact manipulation hotspots</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Temporal keyframe analysis tracking blink and lip-sync kinetics</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Cryptographically signed forensic verification certificates</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Core Principles */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Engineering Values
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Our Guiding Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Explainable AI First',
              desc: 'Never hide behind black boxes. Every classification must be supported by spatial or temporal evidence.',
              icon: Eye
            },
            {
              title: 'Privacy Preserving',
              desc: 'Payloads are processed with ephemeral in-memory inference without unauthorized permanent retention.',
              icon: Lock
            },
            {
              title: 'Calibrated Confidence',
              desc: 'Provide statistically honest confidence intervals and Bayesian uncertainties rather than false certainty.',
              icon: Award
            },
            {
              title: 'Open Architecture',
              desc: 'Built with modular REST APIs designed for effortless FastAPI, PyTorch, and on-premise container integrations.',
              icon: Code
            }
          ].map((principle, idx) => {
            const Icon = principle.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{principle.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{principle.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hackathon & Technical Roadmap */}
      <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/90 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Smart India Hackathon (SIH) Technical Roadmap</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold">RELEASE 2.4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="font-mono text-cyan-400 font-bold block text-[11px]">PHASE 1: CURRENT</span>
            <h4 className="font-bold text-white text-sm">Full Frontend & Mock API</h4>
            <p className="text-slate-400 leading-relaxed">
              Complete multi-modal UI, interactive Grad-CAM heatmap visualization, video keyframe scrubbers, and exportable certificates.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="font-mono text-purple-400 font-bold block text-[11px]">PHASE 2: BACKEND SYNC</span>
            <h4 className="font-bold text-white text-sm">FastAPI & PyTorch Integration</h4>
            <p className="text-slate-400 leading-relaxed">
              Plugging `mockApi.ts` endpoints into production FastAPI microservices hosting GPU-accelerated EfficientNet-B7 and TimeSformer weights.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="font-mono text-emerald-400 font-bold block text-[11px]">PHASE 3: ENTERPRISE</span>
            <h4 className="font-bold text-white text-sm">C2PA Provenance & On-Prem</h4>
            <p className="text-slate-400 leading-relaxed">
              Content Authenticity Initiative (C2PA) cryptographic manifest verification, high-throughput batch API endpoints, and air-gapped deployments.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center p-10 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <h3 className="text-2xl font-bold text-white">Join Us in Combating Synthetic Manipulation</h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Start verifying images, videos, and voice recordings today with DeepVerify.
        </p>
        <div className="pt-2">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try DeepVerify Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
