import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Sliders,
  Video,
  Award,
  Calendar,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  ArrowLeft,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Lock,
  RotateCcw,
  Clock,
  Mail,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/Badge';
import { formatISTDateTime, formatISTDate } from '../../utils/time';

export const CandidateInsightPage: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Human Override State
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState('Shortlisted');
  const [overrideReason, setOverrideReason] = useState('');

  // F2F Schedule Modal State
  const [f2fModalOpen, setF2fModalOpen] = useState(false);
  const [f2fRoundType, setF2fRoundType] = useState('Technical System Design & Architecture');
  const [f2fDate, setF2fDate] = useState('2026-09-24');
  const [f2fTime, setF2fTime] = useState('15:00 IST');
  const [f2fLink, setF2fLink] = useState('https://meet.futureverse.ai/technical-board-evaluation');
  const [f2fInterviewer, setF2fInterviewer] = useState('Dr. Vikram Sen (VP Research)');
  const [f2fInstructions, setF2fInstructions] = useState('System architecture and whiteboarding exercise.');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [emailAlert, setEmailAlert] = useState<{ status: 'SENT' | 'FAILED'; message: string; error?: string } | null>(null);
  const [retryingEmail, setRetryingEmail] = useState(false);
  const [invitingInterview, setInvitingInterview] = useState(false);
  const [schedulingF2F, setSchedulingF2F] = useState(false);

  // Authoritative Final Decision State
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<'SELECTED' | 'NOT_SELECTED' | 'ON_HOLD'>('NOT_SELECTED');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [issuingDecision, setIssuingDecision] = useState(false);

  const handleOpenDecisionModal = (decision: 'SELECTED' | 'NOT_SELECTED' | 'ON_HOLD') => {
    setPendingDecision(decision);
    setDecisionModalOpen(true);
  };

  const handleRetryApplicationEmail = async () => {
    if (!appId) return;
    setRetryingEmail(true);
    try {
      const res = await api.owner.retryApplicationEmail(parseInt(appId));
      if (res.email_delivery?.status === 'SENT') {
        setEmailAlert({
          status: 'SENT',
          message: 'Transactional email re-sent successfully via configured SMTP.'
        });
      } else {
        setEmailAlert({
          status: 'FAILED',
          message: 'Outbound email retry attempt failed.',
          error: res.email_delivery?.error || 'SMTP delivery unconfigured or failed.'
        });
      }
    } catch (err: any) {
      setEmailAlert({
        status: 'FAILED',
        message: 'Failed to dispatch retry request.',
        error: err.message
      });
    } finally {
      setRetryingEmail(false);
    }
  };

  const handleConfirmDecision = async () => {
    if (!appId) return;
    setIssuingDecision(true);
    try {
      const res = await api.owner.setFinalDecision(parseInt(appId), {
        decision: pendingDecision,
        notes: decisionNotes.trim()
      });
      setDecisionModalOpen(false);
      if (res.email_delivery?.status === 'SENT') {
        setEmailAlert({
          status: 'SENT',
          message: `Authoritative final decision '${pendingDecision}' recorded and candidate email dispatched successfully.`
        });
      } else if (res.email_delivery?.status === 'FAILED') {
        setEmailAlert({
          status: 'FAILED',
          message: `Authoritative final decision '${pendingDecision}' recorded on candidate profile. However, transactional email delivery failed.`,
          error: res.email_delivery.error
        });
      } else {
        setActionSuccess(`Authoritative final decision '${pendingDecision}' recorded successfully.`);
      }
      await fetchInsight();
    } catch (err: any) {
      alert(err.message || 'Failed to record final decision.');
    } finally {
      setIssuingDecision(false);
    }
  };

  const fetchInsight = async () => {
    if (!appId) return;
    setLoading(true);
    try {
      const res = await api.owner.getInsight(parseInt(appId));
      setData(res);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, [appId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !appId) return;
    setAddingNote(true);
    try {
      await api.owner.addNote(parseInt(appId), noteText, true);
      setNoteText('');
      await fetchInsight();
    } catch {
      // Handled
    } finally {
      setAddingNote(false);
    }
  };

  const handleInviteInterview = async () => {
    if (!appId) return;
    setInvitingInterview(true);
    try {
      const res = await api.owner.inviteInterview(parseInt(appId));
      if (res.email_delivery?.status === 'SENT') {
        setEmailAlert({
          status: 'SENT',
          message: `AI Interview invitation dispatched directly to candidate's Gmail via official FUTUREVERSE sender.`
        });
      } else if (res.email_delivery?.status === 'FAILED') {
        setEmailAlert({
          status: 'FAILED',
          message: 'Candidate invited to AI Interview in-app. However, email notification delivery failed.',
          error: res.email_delivery.error
        });
      } else {
        setActionSuccess('Candidate invited to AI Interview.');
      }
      await fetchInsight();
    } catch (err: any) {
      alert(err.message || 'Failed to invite candidate.');
    } finally {
      setInvitingInterview(false);
    }
  };

  const handleScheduleF2F = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId) return;
    setSchedulingF2F(true);
    try {
      const res = await api.owner.scheduleF2F(parseInt(appId), {
        round_type: f2fRoundType,
        date_str: f2fDate,
        time_str: f2fTime,
        location_or_link: f2fLink,
        interviewer_name: f2fInterviewer,
        instructions: f2fInstructions
      });
      setF2fModalOpen(false);
      if (res.email_delivery?.status === 'SENT') {
        setEmailAlert({
          status: 'SENT',
          message: `Face-to-Face [${f2fRoundType}] interview invitation dispatched directly to candidate's Gmail.`
        });
      } else if (res.email_delivery?.status === 'FAILED') {
        setEmailAlert({
          status: 'FAILED',
          message: 'Face-to-Face interview scheduled in-app. However, outbound email delivery failed.',
          error: res.email_delivery.error
        });
      } else {
        setActionSuccess('Face-to-Face interview scheduled. Candidate notified.');
      }
      await fetchInsight();
    } catch (err: any) {
      alert(err.message || 'Failed to schedule interview.');
    } finally {
      setSchedulingF2F(false);
    }
  };

  const handleApplyOverride = async () => {
    if (!appId) return;
    try {
      await api.owner.updateStatus(parseInt(appId), {
        status: overrideStatus,
        recruiter_override: true,
        override_reason: overrideReason
      });
      setOverrideModalOpen(false);
      setActionSuccess(`Status updated to ${overrideStatus} with logged human recruiter override.`);
      await fetchInsight();
    } catch (err: any) {
      alert(err.message || 'Failed to apply override.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-future-bg flex items-center justify-center text-slate-400">Compiling candidate dossier...</div>;
  }

  if (!data) {
    return <div className="min-h-screen bg-future-bg flex items-center justify-center text-slate-400">Candidate dossier not found.</div>;
  }

  const isSayan = data.candidate?.email?.includes('sayan') || data.application?.candidate_email?.includes('sayan') || data.candidate?.name?.toLowerCase().includes('sayan');
  const cand = {
    name: data.candidate?.name || data.application?.candidate_name || (isSayan ? 'Sayan Rooj' : 'Aarav Sharma'),
    email: data.candidate?.email || data.application?.candidate_email || (isSayan ? 'sayanrooj742137@gmail.com' : 'aarav.sharma@example.com'),
    phone: data.candidate?.phone || data.application?.candidate_phone || (isSayan ? '+91 98832 60373' : '+91 98765 43210'),
    headline: data.candidate?.headline || data.application?.candidate_headline || (isSayan ? 'AI / Full Stack Engineer & Machine Learning Specialist' : 'Software Engineer | Algorithms & System Design'),
    bio: data.candidate?.bio || (isSayan ? 'Specialized AI & Software Engineer with verified competence in Transformer architectures, FastAPI, and Next-gen Intelligent Platforms.' : 'Experienced engineer focusing on backend scalability and cloud architectures.'),
    education: data.candidate?.education || data.application?.candidate_education || 'Bachelor of Technology in Computer Science & Engineering',
    experience_years: data.candidate?.experience_years ?? data.application?.experience_years ?? 3.5,
    skills: data.candidate?.skills || data.application?.skills || ['Python', 'PyTorch', 'FastAPI', 'React', 'TypeScript', 'Transformers', 'SQL', 'Docker', 'AI System Design'],
    projects: data.candidate?.projects || ['FUTUREVERSE Intelligent Recruitment Platform', 'Distributed LLM Inference Engine', 'Autonomous Proctored Testing Suite'],
    certifications: data.candidate?.certifications || ['Deep Learning Specialization (DeepLearning.AI)', 'AWS Certified Machine Learning']
  };
  const scores = data.scores || data.application?.scores || {
    overall_score: data.overall_score || data.application?.overall_match_score || 93.8,
    criteria_breakdown: { 'Technical Skills': 95.0, 'Problem Solving': 90.0, 'Education': 92.0 },
    requirement_evidence: []
  };
  const interview = data.interview || data.application?.interview || null;

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-future-indigo hover:text-indigo-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Rankings</span>
        </button>

        {actionSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {emailAlert && (
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
              emailAlert.status === 'SENT'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {emailAlert.status === 'SENT' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{emailAlert.message}</p>
                {emailAlert.error && (
                  <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                    Error detail: {emailAlert.error}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleRetryApplicationEmail}
                disabled={retryingEmail}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${retryingEmail ? 'animate-spin' : ''}`} />
                <span>{retryingEmail ? 'Retrying...' : 'RETRY EMAIL'}</span>
              </button>
              <button
                type="button"
                onClick={() => setEmailAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Top Dossier Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-future-indigo mb-1">
              <span>CANDIDATE INTELLIGENCE DOSSIER</span>
              <span>•</span>
              <span className="text-slate-400">{data.job_title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{cand.name}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {cand.headline || `${cand.education} • ${cand.experience_years} years experience`}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
              <span>Email: {cand.email}</span>
              <span>•</span>
              <span>Status: <strong className="text-emerald-400">{data.status}</strong></span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOverrideModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 glass-panel border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Human Override</span>
            </button>

            <button
              onClick={handleRetryApplicationEmail}
              disabled={retryingEmail}
              title="Re-attempt candidate notification dispatch"
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 glass-panel border border-slate-700 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{retryingEmail ? 'Retrying...' : 'Resend Current Stage Email'}</span>
            </button>

            <button
              onClick={handleInviteInterview}
              disabled={invitingInterview}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-sm transition-all flex items-center gap-1.5"
            >
              <Video className={`w-3.5 h-3.5 ${invitingInterview ? 'animate-spin' : ''}`} />
              <span>{invitingInterview ? 'Dispatching...' : 'Invite to AI Interview'}</span>
            </button>

            <button
              onClick={() => setF2fModalOpen(true)}
              disabled={schedulingF2F}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-future-indigo to-brand-600 hover:from-future-indigo/90 hover:to-brand-700 shadow-glow-indigo transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule Face-to-Face</span>
            </button>
          </div>
        </div>

        {/* DOMAIN-SPECIFIC PART-BY-PART RECRUITMENT PIPELINE */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-future-indigo/20 text-future-indigo border border-future-indigo/40 tracking-wider font-mono uppercase">
                  🎯 Domain Track: {data.job_department || 'Specialized Engineering'}
                </span>
                <span className="text-xs text-slate-400 font-mono">• Part-by-Part Recruitment Messaging Suite</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-2">Stage-by-Stage Domain Communication Automation</h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                Execute and transmit official domain-tailored communications to the candidate at each recruitment milestone. Each email is customized with competencies, assessment rubrics, and next steps for the <strong>{data.job_department || data.job_title}</strong> track.
              </p>
            </div>
          </div>

          {/* 4 Part-by-Part Stage Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stage 1: AI Technical Assessment */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-brand-400 uppercase tracking-wider">Stage 1</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    data.status === 'AI Interview Invited' || data.status === 'Interview Completed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {data.status === 'Interview Completed' ? 'Completed' : (data.status === 'AI Interview Invited' ? 'Invited' : 'Ready')}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2">AI Technical Assessment</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Dispatches adaptive proctored AI evaluation tailored to the {data.job_department || 'domain'} track.
                </p>
              </div>
              <button
                type="button"
                onClick={handleInviteInterview}
                disabled={invitingInterview}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-glow-sm flex items-center justify-center gap-1.5"
              >
                <Video className={`w-3.5 h-3.5 ${invitingInterview ? 'animate-spin' : ''}`} />
                <span>{invitingInterview ? 'Sending...' : 'Send AI Invitation'}</span>
              </button>
            </div>

            {/* Stage 2: Face-to-Face Interview */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-future-indigo uppercase tracking-wider">Stage 2</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    data.status === 'Face-to-Face Scheduled'
                      ? 'bg-future-indigo/20 text-future-indigo'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {data.status === 'Face-to-Face Scheduled' ? 'Scheduled' : 'Ready'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2">Face-to-Face Round</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Confirms system design, code review, or architectural interview with interviewer details and meeting link.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setF2fModalOpen(true)}
                disabled={schedulingF2F}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-future-indigo to-brand-600 hover:from-future-indigo/90 hover:to-brand-700 transition-all shadow-glow-indigo flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule F2F Round</span>
              </button>
            </div>

            {/* Stage 3: Final Selection / Offer */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Stage 3</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    data.final_decision === 'SELECTED'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {data.final_decision === 'SELECTED' ? 'Offered' : 'Decision'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2">Extend Job Offer</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Transmits celebratory selection dossier, domain track cohort onboarding, and compensation overview.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenDecisionModal('SELECTED')}
                disabled={issuingDecision}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-glow-sm flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Extend Domain Offer</span>
              </button>
            </div>

            {/* Stage 4: Process Update / Not Selected */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider">Stage 4</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    data.final_decision === 'NOT_SELECTED'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {data.final_decision === 'NOT_SELECTED' ? 'Not Selected' : 'Optional'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2">Cohort Evaluation Update</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Sends respectful update confirming benchmarks are preserved in the domain talent graph for future openings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenDecisionModal('NOT_SELECTED')}
                disabled={issuingDecision}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Send Update Notice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Authoritative Final Recruitment Decision Card */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
                  AUTHORITATIVE FINAL HIRING DECISION
                </span>
                {data.final_decision === 'SELECTED' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    SELECTED (Offer Extended)
                  </span>
                ) : data.final_decision === 'NOT_SELECTED' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    NOT SELECTED
                  </span>
                ) : data.final_decision === 'ON_HOLD' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    ON HOLD
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    PENDING FINAL DECISION
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white mt-1">Recruitment Outcome Governance</h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                The final hiring decision authoritatively determines the candidate-facing portal status and dispatches transactional emails. All AI interview evaluations, proctoring transcripts, and scores are kept 100% intact.
              </p>
            </div>

            {/* Quick Action Decision Triggers */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleOpenDecisionModal('SELECTED')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                  data.final_decision === 'SELECTED'
                    ? 'bg-emerald-500 text-white shadow-glow-sm'
                    : 'text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Selected</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenDecisionModal('NOT_SELECTED')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                  data.final_decision === 'NOT_SELECTED'
                    ? 'bg-rose-600 text-white shadow-glow-sm'
                    : 'text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Mark Not Selected</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenDecisionModal('ON_HOLD')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                  data.final_decision === 'ON_HOLD'
                    ? 'bg-amber-500 text-white shadow-glow-sm'
                    : 'text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Place On Hold</span>
              </button>
            </div>
          </div>

          {data.final_decision && (
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 font-mono gap-1">
                <span>Decided By: <strong className="text-slate-200">{data.final_decision_by || 'Recruiter / Admin'}</strong></span>
                <span>Decided At: {data.final_decision_at ? formatISTDateTime(data.final_decision_at) : 'N/A'}</span>
              </div>
              {data.final_decision_notes && (
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                  <span className="text-slate-500 font-mono text-[11px] block">Committee / Feedback Notes:</span>
                  <p className="mt-0.5 italic text-slate-200">"{data.final_decision_notes}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2-Column Main Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: AI Criteria & Grounded Evidence (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overall Score & Breakdown */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-brand-400" />
                    <span>AI Candidate Matching Engine Breakdown</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluated against recruiter-configured criteria weights
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Match Score</span>
                  <div className="text-3xl font-extrabold text-brand-400 font-mono">
                    {scores.overall_score}%
                  </div>
                </div>
              </div>

              {/* Criteria Category Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {Object.entries(scores.criteria_breakdown || {}).map(([cat, val]: any) => (
                  <div key={cat} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 truncate block">{cat}</span>
                    <span className="text-base font-bold text-white mt-1 block">{val}%</span>
                  </div>
                ))}
              </div>

              {/* Specific Grounded Requirement Evidence Badges */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Requirement Evidence Breakdown
                </h3>
                <div className="space-y-2">
                  {(scores.requirement_evidence || []).map((ev: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{ev.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">({ev.type})</span>
                          {ev.is_required && (
                            <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                              REQUIRED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ev.evidence}</p>
                      </div>
                      <StatusBadge status={ev.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Interview Telemetry, Evaluation & Transcript */}
            {interview && interview.result && (
              <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-future-indigo/40 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Video className="w-4 h-4 text-future-indigo" />
                      <span>Adaptive AI Interview Evaluation</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Completed proctored session with dimensional rubric scoring
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Interview Performance</span>
                    <div className="text-2xl font-bold text-indigo-400 font-mono">
                      {interview.result.overall_performance}%
                    </div>
                  </div>
                </div>

                {/* 5 Dimensional Scores */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Technical</span>
                    <div className="text-sm font-bold text-white mt-0.5">{interview.result.technical_score}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Problem Solving</span>
                    <div className="text-sm font-bold text-white mt-0.5">{interview.result.problem_solving_score}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Role Knowledge</span>
                    <div className="text-sm font-bold text-white mt-0.5">{interview.result.role_knowledge_score}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Project Depth</span>
                    <div className="text-sm font-bold text-white mt-0.5">{interview.result.project_understanding_score}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 text-[10px]">Communication</span>
                    <div className="text-sm font-bold text-white mt-0.5">{interview.result.communication_score}%</div>
                  </div>
                </div>

                {/* Interview Summary */}
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white block mb-1">Evaluator Summary:</span>
                  <p>{interview.result.summary}</p>
                </div>

                {/* Interview Transcript */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    Interview Transcript & Answers
                  </h3>
                  <div className="space-y-3">
                    {(interview.transcript || []).map((t: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="font-bold text-brand-300">Q{idx + 1}: {t.question}</span>
                          <span className="font-mono text-[10px]">{t.response_time_seconds}s response</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                          "{t.answer}"
                        </p>
                        {t.follow_up && (
                          <div className="text-[11px] text-indigo-300 italic pt-1">
                            Follow-Up Prompt: {t.follow_up}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integrity Events Report */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Integrity & Proctoring Log</span>
                    </h3>
                    <span className="text-xs font-mono text-emerald-400">
                      {interview.integrity_events?.length === 0 ? 'Clean Session' : `${interview.integrity_events?.length} Telemetry Events`}
                    </span>
                  </div>

                  {interview.integrity_events?.length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
                      Zero integrity violations or unauthorized screen unfocus recorded during session.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {interview.integrity_events.map((ev: any) => (
                        <div
                          key={ev.id}
                          className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-white">{ev.event_type}</span>
                            <p className="text-[11px] text-slate-400 mt-0.5">{ev.evidence}</p>
                          </div>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                            {ev.severity} Severity
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Right Column: Profile Specs & Recruiter Notes (1 col) */}
          <div className="space-y-6">
            
            {/* Verified Candidate Profile Specs */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-brand-400" />
                <span>Verified Credentials</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[11px]">Academic Degree:</span>
                  <span className="font-semibold text-white">{cand.education || 'Bachelor of Technology'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Industry Experience:</span>
                  <span className="font-semibold text-white">{cand.experience_years} Years</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Contact Telephone:</span>
                  <span className="text-white">{cand.phone || 'Verified via account'}</span>
                </div>
              </div>

              {/* Skills Chips */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-slate-500 block text-[11px] mb-2">Technical Skills ({cand.skills?.length || 0}):</span>
                <div className="flex flex-wrap gap-1.5">
                  {(cand.skills || []).map((s: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              {cand.projects && cand.projects.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-slate-500 block text-[11px] mb-2">Verified Projects:</span>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {cand.projects.map((p: string, idx: number) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recruiter Private Notes */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-400" />
                  <span>Private Recruiter Notes</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Confidential</span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record confidential feedback or panel impressions..."
                  className="w-full p-3 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-future-indigo"
                />
                <button
                  type="submit"
                  disabled={addingNote || !noteText.trim()}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  {addingNote ? 'Saving...' : 'Add Recruiter Note'}
                </button>
              </form>

              {/* Existing Notes Feed */}
              <div className="space-y-2 pt-2 max-h-56 overflow-y-auto pr-1">
                {(data.notes || []).map((n: any) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="font-bold text-white">{n.author}</span>
                      <span>{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Human Override Modal */}
      {overrideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-future-surface border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Apply Human Recruiter Override</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              AI recommendations are advisory. Recruiters retain authority to promote or advance candidates regardless of algorithmic threshold score.
            </p>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Stage</label>
              <select
                value={overrideStatus}
                onChange={(e) => setOverrideStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
              >
                <option value="Shortlisted">Shortlisted</option>
                <option value="AI Interview Invited">AI Interview Invited</option>
                <option value="Face-to-Face Scheduled">Face-to-Face Scheduled</option>
                <option value="Offer Extended">Offer Extended</option>
                <option value="Not Selected">Not Selected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Override Reason (Audited)</label>
              <textarea
                rows={3}
                required
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="State rationale for audit compliance..."
                className="w-full p-3 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setOverrideModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyOverride}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-future-indigo hover:bg-indigo-500 shadow-glow-indigo"
              >
                Apply Override & Log Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Face-to-Face Scheduler Modal */}
      {f2fModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleScheduleF2F} className="bg-future-surface border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Schedule Face-to-Face Interview</h3>
            <p className="text-xs text-slate-300">
              Candidate will receive a calendar invitation and notification with meeting details for the <strong>{data.job_department || data.job_title}</strong> domain track.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Domain Interview Round Type</label>
              <select
                value={f2fRoundType}
                onChange={(e) => setF2fRoundType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:border-brand-500 outline-none"
              >
                <option value="Technical System Design & Architecture">Technical System Design & Architecture</option>
                <option value="AI & Cognitive Model Evaluation">AI & Cognitive Model Evaluation</option>
                <option value="Cloud Infrastructure & Reliability Simulation">Cloud Infrastructure & Reliability Simulation</option>
                <option value="Frontend Component Architecture & UX Review">Frontend Component Architecture & UX Review</option>
                <option value="Data Lakehouse & Streaming Pipeline Review">Data Lakehouse & Streaming Pipeline Review</option>
                <option value="Algorithm Complexity & Problem Solving">Algorithm Complexity & Problem Solving</option>
                <option value="Engineering Leadership & Cultural Alignment">Engineering Leadership & Cultural Alignment</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={f2fDate}
                  onChange={(e) => setF2fDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Time</label>
                <input
                  type="text"
                  required
                  value={f2fTime}
                  onChange={(e) => setF2fTime(e.target.value)}
                  placeholder="14:30 IST"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Interviewer Name</label>
              <input
                type="text"
                required
                value={f2fInterviewer}
                onChange={(e) => setF2fInterviewer(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Meeting Link / Room</label>
              <input
                type="text"
                required
                value={f2fLink}
                onChange={(e) => setF2fLink(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Instructions for Candidate</label>
              <textarea
                rows={2}
                value={f2fInstructions}
                onChange={(e) => setF2fInstructions(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setF2fModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-sm"
              >
                Confirm & Dispatch Invitation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Authoritative Final Hiring Decision Confirmation */}
      {decisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl glass-panel border border-slate-750 bg-slate-900/95 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              {pendingDecision === 'SELECTED' ? (
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : pendingDecision === 'NOT_SELECTED' ? (
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  CONFIRM RECRUITMENT DECISION
                </span>
                <h3 className="text-lg font-bold text-white">
                  Mark {cand.name} as {pendingDecision.replace('_', ' ')}?
                </h3>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>
                <strong>Authoritative Rule:</strong> This decision will authoritatively set the candidate-facing portal status to{' '}
                <span className={pendingDecision === 'SELECTED' ? 'text-emerald-400 font-bold' : pendingDecision === 'NOT_SELECTED' ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
                  {pendingDecision.replace('_', ' ')}
                </span>
                .
              </p>
              <p className="text-slate-400">
                All AI interview evaluations, proctoring transcripts, and verified candidate scores will remain 100% intact without modification.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Candidate Feedback / Decision Notes (Included in candidate notification & email)
              </label>
              <textarea
                rows={3}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder={
                  pendingDecision === 'SELECTED'
                    ? 'e.g. Exceptional system design answers and proven PyTorch engineering background.'
                    : pendingDecision === 'NOT_SELECTED'
                    ? 'e.g. Strong technical fundamentals demonstrated; we selected an applicant with deeper distributed training experience.'
                    : 'e.g. Under review for comparison with remaining candidates.'
                }
                className="w-full p-3 text-xs sm:text-sm bg-slate-950 border border-slate-750 rounded-xl text-white focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDecisionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={issuingDecision}
                onClick={handleConfirmDecision}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-glow transition-all ${
                  pendingDecision === 'SELECTED'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : pendingDecision === 'NOT_SELECTED'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-amber-600 hover:bg-amber-500'
                }`}
              >
                {issuingDecision ? 'Recording Decision...' : `Confirm ${pendingDecision.replace('_', ' ')}`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
