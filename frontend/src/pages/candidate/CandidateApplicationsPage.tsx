import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Video,
  Calendar,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Sliders
} from 'lucide-react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/Badge';
import { formatISTDate } from '../../utils/time';

export const CandidateApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await api.candidate.getApplications();
      setApplications(data || []);
      if (data && data.length > 0) {
        setSelectedApp(data[0]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const pipelineStages = [
    'Applied',
    'CV Screening',
    'Recruiter Review',
    'Shortlisted',
    'AI Interview Invited',
    'Interview Completed',
    'Face-to-Face Scheduled',
    'Final Decision'
  ];

  const getStageIndex = (status: string) => {
    if (status === 'Offer Extended' || status === 'Not Selected') return 7;
    const idx = pipelineStages.indexOf(status);
    return idx !== -1 ? idx : 1;
  };

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
            APPLICATION LIFECYCLE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            My Position Applications ({applications.length})
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status tracking from CV screening to proctored AI interview and face-to-face scheduling
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading your applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 space-y-4">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Submitted Applications</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Explore our current job openings and submit your verified CV profile for instant AI match evaluation.
            </p>
            <Link
              to="/careers"
              className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-glow-sm"
            >
              Browse Open Positions
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Applications List */}
            <div className="lg:col-span-1 space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-2xl glass-panel border transition-all cursor-pointer ${
                    selectedApp?.id === app.id
                      ? 'border-brand-500/60 bg-slate-900/90 shadow-glow-sm'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-brand-400 px-2 py-0.5 rounded bg-brand-500/10">
                      {app.job_department}
                    </span>
                    {app.scores && (
                      <span className="text-xs font-bold text-emerald-400">
                        {app.scores.overall_score}% Match
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm">{app.job_title}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <span>Status:</span>
                      {app.final_decision === 'SELECTED' || app.status === 'Offer Extended' ? (
                        <span className="font-bold text-emerald-400">SELECTED</span>
                      ) : app.final_decision === 'NOT_SELECTED' || app.status === 'Not Selected' ? (
                        <span className="font-bold text-rose-400">NOT SELECTED</span>
                      ) : app.final_decision === 'ON_HOLD' ? (
                        <span className="font-bold text-amber-400">ON HOLD</span>
                      ) : (
                        <strong className="text-slate-200">{app.status_summary?.candidate_facing_status || app.status}</strong>
                      )}
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Selected Application Detail & Progress Tracker */}
            {selectedApp && (
              <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-brand-400">{selectedApp.job_department}</span>
                    <h2 className="text-2xl font-bold text-white mt-0.5">{selectedApp.job_title}</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Applied on: {formatISTDate(selectedApp.applied_at)} • {selectedApp.work_mode}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/candidate/skill-gap/${selectedApp.job_id}`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors"
                    >
                      Skill-Gap Analysis
                    </Link>
                  </div>
                </div>

                {/* Authoritative Final Recruitment Decision Banner */}
                {selectedApp.final_decision === 'SELECTED' || selectedApp.status === 'Offer Extended' ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-emerald-600/15 to-slate-900 border border-emerald-500/40 space-y-3 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm sm:text-base">
                        <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
                        <span>FINAL RECRUITMENT DECISION: SELECTED</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
                        OFFER EXTENDED
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Congratulations! After evaluating all technical screening stages, AI interviews, and committee evaluations, you have been selected for this position.
                    </p>
                    {selectedApp.final_decision_notes && (
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                        <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider block mb-1">Hiring Committee Message:</span>
                        <p className="font-sans italic text-slate-200">"{selectedApp.final_decision_notes}"</p>
                      </div>
                    )}
                  </div>
                ) : selectedApp.final_decision === 'NOT_SELECTED' || selectedApp.status === 'Not Selected' ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-500/20 via-rose-600/10 to-slate-900 border border-rose-500/40 space-y-3 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm sm:text-base">
                        <AlertCircle className="w-6 h-6 shrink-0 text-rose-400" />
                        <span>FINAL RECRUITMENT DECISION: NOT SELECTED</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 self-start sm:self-auto">
                        APPLICATION NOT PROCEEDING
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Thank you for the dedication and technical competence you demonstrated throughout our evaluation process. While your completed interview submissions, evaluations, and scores remain verified and securely preserved in your permanent profile record, the hiring committee has moved forward with other applicants for this position.
                    </p>
                    {selectedApp.final_decision_notes && (
                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                        <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider block mb-1">Hiring Committee Feedback:</span>
                        <p className="font-sans italic text-slate-200">"{selectedApp.final_decision_notes}"</p>
                      </div>
                    )}
                  </div>
                ) : selectedApp.final_decision === 'ON_HOLD' ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-slate-900 border border-amber-500/40 space-y-2 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
                        <Clock className="w-5 h-5 shrink-0 text-amber-400" />
                        <span>FINAL RECRUITMENT DECISION: ON HOLD</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 self-start sm:self-auto">
                        UNDER REVIEW
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Your application has been placed on hold pending review with subsequent candidate cohorts.
                    </p>
                    {selectedApp.final_decision_notes && (
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                        <p className="italic">"{selectedApp.final_decision_notes}"</p>
                      </div>
                    )}
                  </div>
                ) : null}

                {/* Visual Pipeline Progress Stepper */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Application Progression Timeline
                  </h3>
                  <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    {pipelineStages.slice(0, 7).map((stage, idx) => {
                      const currentIdx = getStageIndex(selectedApp.status);
                      const isComplete = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={idx} className="flex md:flex-col items-center gap-2 md:text-center text-left">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCurrent
                                ? 'bg-brand-500 text-white shadow-glow'
                                : isComplete
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isComplete ? '✓' : idx + 1}
                          </div>
                          <span
                            className={`text-[11px] font-medium leading-tight ${
                              isCurrent ? 'text-brand-300 font-bold' : isComplete ? 'text-slate-300' : 'text-slate-600'
                            }`}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Face-to-Face Scheduled Banner if present */}
                {selectedApp.f2f_schedule && (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <Calendar className="w-5 h-5" />
                      <span>Face-to-Face Interview Confirmed</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-500">Date & Time:</span>
                        <p className="font-semibold text-white mt-0.5">
                          {selectedApp.f2f_schedule.date_str} at {selectedApp.f2f_schedule.time_str}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Interviewer:</span>
                        <p className="font-semibold text-white mt-0.5">{selectedApp.f2f_schedule.interviewer_name}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-500">Meeting Link / Location:</span>
                        <p className="font-mono text-brand-400 break-all mt-0.5">
                          {selectedApp.f2f_schedule.location_or_link}
                        </p>
                      </div>
                    </div>
                    {selectedApp.f2f_schedule.instructions && (
                      <p className="text-xs text-slate-400 italic pt-1">
                        Instructions: "{selectedApp.f2f_schedule.instructions}"
                      </p>
                    )}
                  </div>
                )}

                {/* AI Interview Performance & Record Preservation Card */}
                {selectedApp.interview && (
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-future-indigo/15 to-brand-500/15 border border-future-indigo/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider">
                          AI Interview Performance
                        </div>
                        {selectedApp.interview.status === 'Completed' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Completed • Verified Record Preserved
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white mt-0.5">
                        Session Status: {selectedApp.interview.status}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        {selectedApp.interview.status === 'Completed'
                          ? 'Your proctored interview answers, evaluations, and overall performance metrics remain 100% intact and verified in your talent dossier.'
                          : 'Proctored session ready. Ensure camera and microphone access are granted.'}
                      </p>
                    </div>

                    <Link
                      to={`/interview/${selectedApp.interview.token}`}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-400 shadow-glow flex items-center gap-1.5 shrink-0 transition-transform hover:-translate-y-0.5"
                    >
                      <Video className="w-4 h-4" />
                      <span>{selectedApp.interview.status === 'Completed' ? 'Review Evaluation & Scores' : 'Enter Interview'}</span>
                    </Link>
                  </div>
                )}

                {/* Score Breakdown & Requirement Evidence Badges */}
                {selectedApp.scores && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-brand-400" />
                        <span>AI Match Evidence & Criteria Breakdown</span>
                      </h3>
                      <span className="text-xs font-mono font-bold text-brand-400">
                        Overall: {selectedApp.scores.overall_score}%
                      </span>
                    </div>

                    {/* Category Breakdown Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {Object.entries(selectedApp.scores.criteria_breakdown || {}).map(([cat, val]: any) => (
                        <div key={cat} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                          <span className="text-[11px] text-slate-400 truncate block">{cat}</span>
                          <span className="text-sm font-bold text-white">{val}%</span>
                        </div>
                      ))}
                    </div>

                    {/* Specific Requirement Evidence */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-medium text-slate-400">Grounded Requirement Evidence:</h4>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {(selectedApp.scores.requirement_evidence || []).map((ev: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{ev.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">({ev.type})</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">{ev.evidence}</p>
                            </div>
                            <StatusBadge status={ev.status} size="sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
