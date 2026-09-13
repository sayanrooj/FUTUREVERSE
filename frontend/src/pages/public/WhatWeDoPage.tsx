import React from 'react';
import {
  FileText,
  GitCompare,
  ListOrdered,
  Sliders,
  Video,
  Award,
  Target,
  BarChart3,
  Mail,
  Workflow
} from 'lucide-react';

export const WhatWeDoPage: React.FC = () => {
  const pillars = [
    {
      icon: FileText,
      title: 'AI CV Screening',
      desc: 'Rapidly parses candidate resumes (PDF, DOCX) into structured data schemas, extracting technical skills, soft skills, educational credentials, and verified capstone projects.',
      tag: 'Ground Truth Extraction'
    },
    {
      icon: GitCompare,
      title: 'Candidate Matching',
      desc: 'Performs multi-dimensional semantic comparison between candidate credentials and job criteria, generating natural language evidence citations and transparent status badges.',
      tag: 'Explainable AI'
    },
    {
      icon: ListOrdered,
      title: 'Candidate Ranking',
      desc: 'Ranks applicants based on exact Admin-configured category weights (technical, experience, education, projects). Automatically flags borderline applications for human review.',
      tag: 'Dynamic Prioritization'
    },
    {
      icon: Sliders,
      title: 'Job Requirement Management',
      desc: 'Multi-step requirement builder allowing recruiters to define 12 requirement types, required vs preferred attributes, category thresholds, and strict 100% criteria weight sum validation.',
      tag: 'Total Control'
    },
    {
      icon: Video,
      title: 'AI Interviews',
      desc: 'Proctored live interview session with candidate camera preview, microphone check, AI interviewer avatar, and dynamically generated questions anchored to the candidate\'s real CV.',
      tag: 'Adaptive Sessions'
    },
    {
      icon: Award,
      title: 'Interview Evaluation',
      desc: 'Multidimensional assessment scoring Technical Knowledge, Problem Solving, Role Knowledge, Project Depth, and Communication with concrete strengths and improvement roadmaps.',
      tag: 'Holistic Rubric'
    },
    {
      icon: Target,
      title: 'Skill Gap Analysis',
      desc: 'Compares job requisites against candidate capabilities, classifying competencies into Strong, Developing, and Missing with tailored learning recommendations.',
      tag: 'Candidate Growth'
    },
    {
      icon: BarChart3,
      title: 'Recruitment Analytics',
      desc: 'Executive pipeline telemetry covering application velocity, stage conversion funnels, interview pass ratios, and department hiring distributions.',
      tag: 'Pipeline Telemetry'
    },
    {
      icon: Mail,
      title: 'Candidate Communication',
      desc: 'Automated transactional email notifications and real-time in-app alerts covering application status updates, interview invitations, and scheduling confirmations.',
      tag: 'Engagement Engine'
    },
    {
      icon: Workflow,
      title: 'Recruitment Workflow Management',
      desc: 'Structured 12-stage candidate progression pipeline with side-by-side comparison, private recruiter notes, human override toggles, and Face-to-Face scheduling.',
      tag: 'End-to-End Orchestration'
    }
  ];

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
            PLATFORM CAPABILITIES
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2 mb-4">
            What FUTUREVERSE Delivers
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Ten integrated pillars powering modern, ethical, and high-velocity recruitment operations.
          </p>
        </div>

        {/* 10 Pillar Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel border border-slate-800/90 hover:border-brand-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50">
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Pillar {idx + 1} of 10</span>
                  <span className="text-brand-400 group-hover:translate-x-1 transition-transform">Active Module →</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
