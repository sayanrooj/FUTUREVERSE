import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Brain,
  Sliders,
  CheckCircle2,
  FileCheck,
  Video,
  BarChart3,
  Users,
  Target,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import { getLiveISTTime } from '../../utils/time';

export const HomePage: React.FC = () => {
  const [jobsCount, setJobsCount] = useState<number>(5);
  const [liveClock, setLiveClock] = useState(getLiveISTTime());

  useEffect(() => {
    api.jobs.list().then(jobs => {
      if (jobs && jobs.length) setJobsCount(jobs.length);
    }).catch(() => {});

    const timer = setInterval(() => {
      setLiveClock(getLiveISTTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 overflow-hidden">
      
      {/* Glow Orbs Background */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-80 right-10 w-[500px] h-[350px] bg-future-indigo/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-20 lg:pb-32 text-center">
        
        {/* Release / Developer Badge & Live Clock */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-medium text-brand-300 border border-brand-500/30">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>FUTUREVERSE 2026 • AI-Powered Recruitment</span>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-slate-750/90 text-xs font-mono text-slate-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-bold text-white tracking-wider">{liveClock.time}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">{liveClock.date}</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">{liveClock.tz}</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
          <span className="block text-white">FUTUREVERSE</span>
          <span className="block text-2xl sm:text-4xl lg:text-5xl font-bold gradient-brand-text mt-3">
            Intelligent Recruitment. Better Talent. Future Ready.
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-slate-400 font-normal leading-relaxed mb-10">
          An AI-powered recruitment platform that helps organizations discover, evaluate, and connect with the right talent through intelligent screening, adaptive interviews, and human-centered decision making.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            to="/careers"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-500 to-future-indigo hover:from-brand-600 hover:to-future-indigo/90 shadow-glow transition-all flex items-center justify-center gap-2 group"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/owner-login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white glass-panel hover:bg-slate-800/60 border border-slate-700/60 transition-all"
          >
            Recruiter Login
          </Link>
        </div>

        {/* Key Metrics / Highlights Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl glass-panel border border-slate-800">
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-slate-400 mt-1">Weighted Criteria Engine</div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-slate-800">
            <div className="text-2xl font-bold text-brand-400">0.8s</div>
            <div className="text-xs text-slate-400 mt-1">Explainable CV Parsing</div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-slate-800">
            <div className="text-2xl font-bold text-indigo-400">Adaptive</div>
            <div className="text-xs text-slate-400 mt-1">AI Proctored Interviews</div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-slate-800">
            <div className="text-2xl font-bold text-emerald-400">Human-In-Loop</div>
            <div className="text-xs text-slate-400 mt-1">Zero Blind Auto-Rejection</div>
          </div>
        </div>

      </section>

      {/* Core Principle Workflow Diagram */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            The FUTUREVERSE Central Principle
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Admin/Recruiter defines WHAT matters. AI evaluates HOW WELL the candidate matches. Human recruiter makes the final important decision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-brand-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-5">
              <Sliders className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-brand-400 uppercase tracking-wider mb-1">Pillar 1</div>
            <h3 className="text-lg font-bold text-white mb-2">Recruiter Defines WHAT Matters</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Design multi-step job requirements: technical & soft skills, education, experience thresholds, project relevance, and strict 100% criteria weights with knockout conditions.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-future-indigo/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-future-indigo/10 border border-future-indigo/20 flex items-center justify-center text-indigo-400 mb-5">
              <Brain className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1">Pillar 2</div>
            <h3 className="text-lg font-bold text-white mb-2">AI Evaluates HOW WELL They Match</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Transparent CV extraction, contextual candidate scoring, and adaptive proctored AI interviews produce objective evidence badges (Met, Not Met, Partially Met, Unclear).
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">Pillar 3</div>
            <h3 className="text-lg font-bold text-white mb-2">Human Makes the FINAL Decision</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Recruiters inspect audit logs, compare candidates side-by-side, schedule face-to-face discussions, and apply human discretion overrides with logged rationale.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Built for Real-World Recruitment Teams
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            A comprehensive talent operating system powering end-to-end recruitment with zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl glass-panel border border-slate-800/80">
            <FileCheck className="w-6 h-6 text-brand-400 mb-4" />
            <h3 className="font-semibold text-white mb-2">Explainable AI Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No black-box scores. Every requirement features clear evidence citations and status indicators for total auditability.
            </p>
          </div>

          <div className="p-6 rounded-xl glass-panel border border-slate-800/80">
            <Video className="w-6 h-6 text-indigo-400 mb-4" />
            <h3 className="font-semibold text-white mb-2">Adaptive AI Interviews</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interviews tailored dynamically to candidate CVs and projects with camera preview, voice response, and intelligent follow-ups.
            </p>
          </div>

          <div className="p-6 rounded-xl glass-panel border border-slate-800/80">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-4" />
            <h3 className="font-semibold text-white mb-2">Ethical Integrity Monitoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gentle warning triggers, window blur tracking, and clear separation between technical disconnects and review flags.
            </p>
          </div>

          <div className="p-6 rounded-xl glass-panel border border-slate-800/80">
            <Users className="w-6 h-6 text-amber-400 mb-4" />
            <h3 className="font-semibold text-white mb-2">Candidate Comparison</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare 2 to 4 candidates side-by-side across overall scores, tech stacks, experience, and interview performance.
            </p>
          </div>

          <div className="p-6 rounded-xl glass-panel border border-slate-800/80">
            <Target className="w-6 h-6 text-rose-400 mb-4" />
            <h3 className="font-semibold text-white mb-2">Skill-Gap Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Classifies skills into Strong, Developing, and Missing with tailored learning tracks for constructive candidate development.
            </p>
          </div>

          <div className="p-6 rounded-xl glass-panel border border-slate-800/80">
            <BarChart3 className="w-6 h-6 text-sky-400 mb-4" />
            <h3 className="font-semibold text-white mb-2">Enterprise Funnel Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time pipeline monitoring, interview pass rates, application conversion velocity, and complete audit logging.
            </p>
          </div>
        </div>
      </section>

      {/* Developer Credit Banner */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="p-6 rounded-2xl glass-panel border border-brand-500/20 bg-gradient-to-b from-slate-900/60 to-future-surface/80">
          <p className="text-xs font-mono text-brand-400 uppercase tracking-widest mb-1">
            CREATOR & ARCHITECT
          </p>
          <h3 className="text-xl font-bold text-white mb-2">
            FUTUREVERSE — Created & Developed by Sayan Rooj
          </h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Engineered with modern full-stack technologies to deliver ethical, explainable, and production-grade recruitment software.
          </p>
        </div>
      </section>

    </div>
  );
};
