import React from 'react';
import { ShieldCheck, HeartHandshake, Sparkles, Cpu, Eye, Scale, UserCheck, Lock } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-xs font-medium text-brand-300 mb-4 border border-brand-500/20">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>About The Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Pioneering Transparent, Human-Centered AI Recruitment
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            FUTUREVERSE is an enterprise talent operating platform uniting precision requirements engineering with explainable candidate evaluation.
          </p>
        </div>

        {/* Developer Attribution Card */}
        <div className="p-8 rounded-3xl glass-panel border border-brand-500/30 bg-gradient-to-r from-slate-900/90 via-future-surface to-slate-900/90 shadow-glow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-400 font-semibold">
                  DEVELOPER ATTRIBUTION
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Operational Platform
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Created & Developed by Sayan Rooj
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                FUTUREVERSE was designed, engineered, and deployed by Sayan Rooj to pioneer next-generation talent acquisition. Built from the ground up featuring multi-dimensional criteria modeling, adaptive proctored AI interview sessions, domain intelligence messaging, and auditable governance workflows.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://github.com/sayanrooj/FUTUREVERSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-500/20 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  View GitHub Repository
                </a>
                <a
                  href="https://github.com/sayanrooj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
                >
                  GitHub Profile (@sayanrooj)
                </a>
              </div>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-center shrink-0 space-y-1">
              <div className="text-xl font-bold text-brand-400">FUTUREVERSE</div>
              <div className="text-[11px] text-slate-400 font-mono">Production Edition</div>
              <div className="text-[10px] text-emerald-400 font-mono font-semibold">IST (UTC+05:30) Standard</div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="p-6 rounded-2xl glass-panel border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Why FUTUREVERSE Was Created</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Traditional recruitment suffers from two major flaws: black-box keyword filtering that discards capable candidates without reason, and subjective hiring cycles that lack consistency. FUTUREVERSE bridges this divide by enforcing transparent criteria weights defined explicitly by recruiters.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-future-indigo/10 flex items-center justify-center text-indigo-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">How AI Assists Recruitment</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI within FUTUREVERSE is an evaluator, never the sovereign judge. It parses CVs into structured credentials, compares experiences against role criteria, conducts interactive adaptive interviews, and generates grounded evidence citations for human review.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">How Recruiters Benefit</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Recruiters retain complete control over what attributes matter. Instead of sifting through hundreds of PDFs manually, recruiters review ranked candidate dossiers with transparent evidence badges (Met, Not Met, Partially Met, Unclear) and direct interview replay.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">How Candidates Benefit</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Candidates receive total transparency into their match score, concrete skill-gap breakdowns, and actionable learning recommendations. Even when not selected, candidates leave with tangible improvement areas rather than silent rejection.
            </p>
          </div>

        </div>

        {/* Responsible AI & Ethics Section */}
        <div className="p-8 rounded-2xl glass-panel border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-brand-400" />
            <h2 className="text-2xl font-bold text-white">Responsible AI & Transparency Charter</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm">Zero Protected Attribute Bias</h4>
              <p>
                FUTUREVERSE strictly prohibits algorithmic inference based on gender, race, age, facial appearance, background audio accent, or demographic tokens. Evaluation is anchored solely on verified competence.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm">Grounded Evidence Standard</h4>
              <p>
                Every match score is accompanied by natural language evidence citing candidate profile items or CV sections. Unclear requirements are flagged for human inspection rather than penalized.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200 text-sm">Human Recruiter Authority</h4>
              <p>
                Hiring invitations and final employment offers require human recruiter authorization. Recruiter overrides are tracked in immutable audit logs for corporate governance.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
