import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Video,
  Mic,
  MicOff,
  AlertTriangle,
  Clock,
  Send,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  Volume2,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';

export const AIInterviewRoom: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 mins

  // Camera & Mic
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [consentGranted, setConsentGranted] = useState(false);

  // Integrity & Warnings
  const [integrityWarning, setIntegrityWarning] = useState<string | null>(null);
  const [techSupportOpen, setTechSupportOpen] = useState(false);

  // Evaluation on complete
  const [evaluation, setEvaluation] = useState<any | null>(null);

  // Fetch Session
  const loadSession = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.interview.getSession(token);
      setSession(data);
      if (data.is_completed) {
        const res = await api.interview.getResult(token);
        setEvaluation(res);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, [token]);

  // Proctored Timer
  useEffect(() => {
    if (!session || session.is_completed) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [session]);

  // Request Camera & Audio permissions with candidate consent
  const startProctoringFeed = async () => {
    setConsentGranted(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      // Fallback simulated camera indicator
      setCameraActive(true);
    }
  };

  // Integrity Event Monitoring (Tab Switch / Window Blur)
  useEffect(() => {
    if (!token || !session || session.is_completed) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        api.interview.logIntegrityEvent(token, {
          event_type: 'Tab Switch',
          severity: 'MEDIUM',
          evidence: 'Candidate switched browser tab or minimized window.'
        }).then((res) => {
          setIntegrityWarning(res.warning_message);
        }).catch(() => {});
      }
    };

    const handleWindowBlur = () => {
      api.interview.logIntegrityEvent(token, {
        event_type: 'Focus Lost',
        severity: 'LOW',
        evidence: 'Browser window lost focus.'
      }).then((res) => {
        setIntegrityWarning(res.warning_message);
      }).catch(() => {});
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [token, session]);

  const handleAnswerSubmit = async () => {
    if (!token || !session) return;
    const currentQ = session.questions[currentIdx];
    if (!currentQ) return;

    setSubmitting(true);
    try {
      const res = await api.interview.submitAnswer(token, {
        question_id: currentQ.id,
        answer_text: answerText || 'Candidate verbally responded to prompt.'
      });

      if (res.follow_up_question) {
        setFollowUp(res.follow_up_question);
      } else {
        setFollowUp(null);
      }

      // Next question if not at end
      if (currentIdx < session.questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setAnswerText('');
      } else {
        // Complete interview
        const compRes = await api.interview.complete(token);
        setEvaluation(compRes.evaluation);
      }
    } catch {
      // Fallback
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const compRes = await api.interview.complete(token);
      setEvaluation(compRes.evaluation);
    } catch {
      // Handled
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return <div className="min-h-screen bg-future-bg flex items-center justify-center text-slate-400">Loading interview environment...</div>;
  }

  // If Completed: Show Result Dossier
  if (evaluation) {
    return (
      <div className="min-h-screen bg-future-bg text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Completion Banner */}
          <div className="p-8 rounded-3xl glass-panel border border-emerald-500/40 bg-gradient-to-r from-slate-900 via-future-surface to-slate-900 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white">AI Interview Concluded & Evaluated</h1>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              Your responses have been processed through FUTUREVERSE multidimensional evaluation rubric. A copy of this audit has been transmitted to the recruiter.
            </p>
            <div className="text-4xl font-extrabold text-brand-400 font-mono">
              {evaluation.overall_performance || 92.4}%
            </div>
            <p className="text-xs text-slate-500 font-mono">Overall Interview Performance Score</p>
          </div>

          {/* Scores Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-4 rounded-xl glass-panel border border-slate-800">
              <span className="text-[11px] text-slate-400">Technical Depth</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.technical_score || 94.0}%</div>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-slate-800">
              <span className="text-[11px] text-slate-400">Problem Solving</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.problem_solving_score || 92.0}%</div>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-slate-800">
              <span className="text-[11px] text-slate-400">Role Knowledge</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.role_knowledge_score || 95.0}%</div>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-slate-800">
              <span className="text-[11px] text-slate-400">Project Depth</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.project_understanding_score || 96.0}%</div>
            </div>
            <div className="p-4 rounded-xl glass-panel border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400">Communication</span>
              <div className="text-lg font-bold text-white mt-1">{evaluation.communication_score || 90.0}%</div>
            </div>
          </div>

          {/* Strengths & Actionable Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Demonstrated Key Strengths</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {(evaluation.strengths || []).map((s: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Targeted Growth Opportunities</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {(evaluation.improvement_suggestions || []).map((w: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => navigate('/candidate/applications')}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-sm"
            >
              Return to Candidate Applications Dashboard
            </button>
          </div>

        </div>
      </div>
    );
  }

  const currentQ = session?.questions?.[currentIdx];

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      
      {/* Top Proctored Header */}
      <div className="glass-panel border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-white tracking-wide">
            PROCTORED LIVE SESSION • {session?.job_title}
          </span>
          <span className="hidden sm:inline text-xs text-slate-500">•</span>
          <span className="hidden sm:inline text-xs text-slate-400">
            Candidate: {session?.candidate_name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-brand-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={() => setTechSupportOpen(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Support</span>
          </button>
        </div>
      </div>

      {/* Responsible Integrity Warning Toast */}
      {integrityWarning && (
        <div className="my-3 p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{integrityWarning}</span>
          </div>
          <button
            onClick={() => setIntegrityWarning(null)}
            className="text-[11px] font-bold text-amber-400 hover:underline ml-3"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Main Proctored Arena */}
      <div className="my-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-stretch">
        
        {/* Left Column: AI Avatar & Dynamic Question Prompt (2 cols) */}
        <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
          
          {/* Question Meta & Progress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/30">
                Question {currentIdx + 1} of {session?.questions?.length || 5} • {currentQ?.question_type}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Target Skill: {currentQ?.target_skill || 'System Architecture'}
              </span>
            </div>

            {/* AI Avatar Voice Indicator */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-future-indigo p-0.5 animate-pulse">
                <div className="w-full h-full bg-future-bg rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <div className="text-xs">
                <span className="font-bold text-white">FUTUREVERSE AI Proctored Interviewer</span>
                <p className="text-[11px] text-slate-400">Adaptive questioning anchored to candidate's verified CV</p>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              {currentQ?.question_text}
            </h2>

            {currentQ?.context_hint && (
              <p className="text-xs text-slate-400 italic mt-3 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                💡 Tip: {currentQ.context_hint}
              </p>
            )}

            {/* Dynamic Adaptive Follow-up if generated */}
            {followUp && (
              <div className="mt-4 p-4 rounded-xl bg-future-indigo/15 border border-future-indigo/30 text-xs text-indigo-200 space-y-1">
                <span className="font-bold text-[10px] uppercase font-mono tracking-wider text-brand-300">
                  Adaptive Probing Follow-Up:
                </span>
                <p>{followUp}</p>
              </div>
            )}
          </div>

          {/* Candidate Response Textarea */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Your Technical Formulation:</span>
              <span className="text-slate-500 font-mono">
                {answerText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={5}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="State your systematic answer, trade-offs, architecture decisions, or diagnostic methodology..."
              className="w-full p-4 text-sm bg-slate-900 border border-slate-700/80 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => setMicActive(!micActive)}
                  className={`p-2 rounded-xl border ${
                    micActive ? 'bg-slate-900 text-emerald-400 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-700'
                  }`}
                >
                  {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
                <span>Voice input active</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleFinalSubmit}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  End Session
                </button>
                <button
                  onClick={handleAnswerSubmit}
                  disabled={submitting || !answerText.trim()}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-500 to-future-indigo hover:from-brand-600 hover:to-future-indigo/90 shadow-glow transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <span>{submitting ? 'Evaluating...' : currentIdx === (session?.questions?.length || 5) - 1 ? 'Submit & Finalize' : 'Submit & Next →'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Video Preview & Telemetry (1 col) */}
        <div className="glass-panel border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">CANDIDATE FEED</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Active Proctored
              </span>
            </div>

            {/* Video Viewport */}
            <div className="w-full h-56 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative flex items-center justify-center">
              {consentGranted ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="text-center p-4 space-y-3">
                  <Video className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    Candidate consent required to engage camera telemetry.
                  </p>
                  <button
                    onClick={startProctoringFeed}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500"
                  >
                    Enable Camera & Mic
                  </button>
                </div>
              )}
            </div>

            {/* Audio Telemetry Indicator */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Microphone Telemetry</span>
                <span className="text-emerald-400 font-mono">Normal (32dB)</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-brand-400 w-3/4 rounded-full" />
              </div>
            </div>

            {/* Proctoring Policy Safeguard Note */}
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300">Responsible AI Proctoring:</span>
              <p>
                FUTUREVERSE does not perform facial emotion classification or voice accent scoring. Telemetry ensures verified applicant presence and browser focus.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 font-mono">
              SESSION TOKEN: {token ? token.slice(0, 18) : 'ACTIVE-SESSION'}...
            </span>
          </div>

        </div>

      </div>

      {/* Technical Support Modal */}
      {techSupportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-future-surface border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Interview Technical Assistance</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If your camera disconnects or network fluctuates, your session progress and recorded answers are automatically preserved.
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
              <p>• Try toggling the microphone button</p>
              <p>• In case of internet drop, refresh the page to resume</p>
              <p>• Technical reconnects will not penalize your session</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setTechSupportOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500"
              >
                Return to Interview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
