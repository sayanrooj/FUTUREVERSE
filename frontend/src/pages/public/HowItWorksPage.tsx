import React from 'react';
import {
  UserPlus,
  Upload,
  Cpu,
  Send,
  Sliders,
  ListOrdered,
  CheckCircle,
  Video,
  FileSpreadsheet,
  Eye,
  Calendar,
  Award
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Candidate Creates Profile',
      actor: 'Candidate',
      desc: 'Candidate registers account and builds base profile with career headline, contact details, and location.',
      icon: UserPlus
    },
    {
      num: 2,
      title: 'Candidate Uploads CV',
      actor: 'Candidate',
      desc: 'Candidate uploads resume (PDF/DOCX/TXT) to a private, encrypted storage vault.',
      icon: Upload
    },
    {
      num: 3,
      title: 'AI Analyzes CV',
      actor: 'AI Engine',
      desc: 'ResumeParserService extracts degree, verified tech skills, soft skills, experience duration, and project titles.',
      icon: Cpu
    },
    {
      num: 4,
      title: 'Candidate Applies to Job',
      actor: 'Candidate',
      desc: 'Candidate explores published jobs and submits application. Built-in duplicate prevention safeguards data integrity.',
      icon: Send
    },
    {
      num: 5,
      title: 'AI Matches Candidate Against Job Criteria',
      actor: 'AI Engine',
      desc: 'CandidateMatchingService calculates overall match score, checks knockout requirements, and issues evidence badges (Met, Not Met, Partially Met, Unclear).',
      icon: Sliders
    },
    {
      num: 6,
      title: 'Recruiter Reviews Ranked Candidates',
      actor: 'Recruiter',
      desc: 'Recruiter browses ranked candidate list sorted by match score, searches by skills, and compares candidate dossiers side-by-side.',
      icon: ListOrdered
    },
    {
      num: 7,
      title: 'Recruiter Shortlists Candidate',
      actor: 'Recruiter',
      desc: 'Recruiter shortlists high-potential candidates and triggers personalized proctored AI interview invitations via email and notification.',
      icon: CheckCircle
    },
    {
      num: 8,
      title: 'Candidate Attends AI Interview',
      actor: 'Candidate',
      desc: 'Candidate accesses proctored interview room with live camera preview, mic checks, dynamic adaptive questions, and responsible integrity monitoring.',
      icon: Video
    },
    {
      num: 9,
      title: 'AI Generates Interview Evaluation',
      actor: 'AI Engine',
      desc: 'InterviewEvaluationService analyzes technical knowledge, problem solving, role depth, and communication with concrete strengths and gap analyses.',
      icon: FileSpreadsheet
    },
    {
      num: 10,
      title: 'Recruiter Reviews Result & Integrity',
      actor: 'Recruiter',
      desc: 'Recruiter inspects interview transcript, audio/video telemetry summary, and integrity logs before deciding advancement.',
      icon: Eye
    },
    {
      num: 11,
      title: 'Face-to-Face Interview Scheduled',
      actor: 'Recruiter',
      desc: 'Recruiter schedules final Face-to-Face or virtual whiteboard panel discussion with automated calendar dispatch.',
      icon: Calendar
    },
    {
      num: 12,
      title: 'Final Human Decision',
      actor: 'Recruiter / Hiring Team',
      desc: 'Hiring committee reviews holistic candidate dossier and extends formal offer. Human judgment remains the final authority.',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
            INTELLIGENT TALENT WORKFLOW
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2 mb-4">
            How FUTUREVERSE Works
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            A seamless, 12-step recruitment lifecycle bridging human recruiter criteria with objective AI evaluation.
          </p>
        </div>

        {/* 12-Step Visual Progression Timeline */}
        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const actorBadgeColor =
              step.actor === 'Candidate'
                ? 'bg-brand-500/10 text-brand-400 border-brand-500/30'
                : step.actor === 'Recruiter' || step.actor === 'Recruiter / Hiring Team'
                ? 'bg-future-indigo/10 text-indigo-300 border-future-indigo/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

            return (
              <div
                key={step.num}
                className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center font-mono font-bold text-white shrink-0">
                    {step.num}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-white">{step.title}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${actorBadgeColor}`}>
                        {step.actor}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{step.desc}</p>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-400 shrink-0 self-end md:self-center">
                  Stage {step.num}/12
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
