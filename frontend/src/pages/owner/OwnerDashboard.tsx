import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Video,
  Award,
  Plus,
  ArrowRight,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  FileSpreadsheet,
  Search,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  Trash2,
  X,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatISTDate } from '../../utils/time';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DRAFT' | 'CLOSED'>('ALL');

  // AI Interview Question Studio Modal State
  const [selectedJobForQuestions, setSelectedJobForQuestions] = useState<any | null>(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [jobQuestions, setJobQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [savingQuestions, setSavingQuestions] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [newQText, setNewQText] = useState('');
  const [newQType, setNewQType] = useState('TECHNICAL');
  const [newQSkill, setNewQSkill] = useState('');
  const [newQHint, setNewQHint] = useState('');

  const openQuestionStudio = async (job: any) => {
    setSelectedJobForQuestions(job);
    setQuestionModalOpen(true);
    setLoadingQuestions(true);
    setSaveSuccessMsg(null);
    try {
      const res = await api.owner.getJobInterviewQuestions(job.id);
      setJobQuestions(res.questions || []);
    } catch {
      setJobQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSaveQuestions = async () => {
    if (!selectedJobForQuestions) return;
    setSavingQuestions(true);
    try {
      await api.owner.setJobInterviewQuestions(selectedJobForQuestions.id, jobQuestions);
      setSaveSuccessMsg(`Custom AI interview questions successfully saved and deployed for ${selectedJobForQuestions.title}!`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch {
      // Handled
    } finally {
      setSavingQuestions(false);
    }
  };

  const addQuestion = () => {
    if (!newQText.trim()) return;
    setJobQuestions([
      ...jobQuestions,
      {
        id: Date.now(),
        question_text: newQText.trim(),
        question_type: newQType,
        target_skill: newQSkill.trim() || 'Core Competency',
        context_hint: newQHint.trim() || ''
      }
    ]);
    setNewQText('');
    setNewQSkill('');
    setNewQHint('');
  };

  const removeQuestion = (idx: number) => {
    setJobQuestions(jobQuestions.filter((_, i) => i !== idx));
  };

  const fetchDashboard = () => {
    setLoading(true);
    api.owner.getDashboard()
      .then(res => setData(res))
      .catch((err) => console.error('Failed to load owner dashboard', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const m = data?.metrics || {};
  const funnel = data?.funnel || [];
  const rawJobs: any[] = data?.jobs || data?.recent_jobs || [];

  const filteredJobs = rawJobs.filter((j: any) => {
    const matchesSearch = !searchTerm ||
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Recruiter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800">
          <div>
            <div className="text-xs font-mono text-future-indigo uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>RECRUITMENT OPERATING SYSTEM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Recruiter Hub • {user?.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure job criteria weights, inspect explainable candidate rankings, and conduct interview reviews
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/owner/jobs/create"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-future-indigo to-brand-600 hover:from-future-indigo/90 hover:to-brand-700 shadow-glow-indigo transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Job Requirement</span>
            </Link>
          </div>
        </div>

        {/* 4 Core Pipeline KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400">Total Positions</span>
            <div className="text-2xl font-bold text-white mt-1">{m.total_jobs || rawJobs.length}</div>
            <div className="text-[11px] text-brand-400 mt-2 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{m.active_jobs || rawJobs.filter(j => j.status === 'ACTIVE').length} Currently Active</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400">Candidates Evaluated</span>
            <div className="text-2xl font-bold text-white mt-1">{m.total_applications ?? 0}</div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{m.shortlisted_candidates ?? 0} Shortlisted</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400">AI Interviews Evaluated</span>
            <div className="text-2xl font-bold text-white mt-1">{m.ai_interviews_completed ?? 0}</div>
            <div className="text-[11px] text-indigo-400 mt-2 flex items-center gap-1">
              <Video className="w-3.5 h-3.5" />
              <span>Pass Rate: {m.interview_pass_rate || '100%'}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400">Face-to-Face Scheduled</span>
            <div className="text-2xl font-bold text-white mt-1">{m.face_to_face_interviews ?? 0}</div>
            <div className="text-[11px] text-amber-400 mt-2 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>{m.final_hires ?? 0} Offers Extended</span>
            </div>
          </div>
        </div>

        {/* Recruitment Funnel Visualizer */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-400" />
                <span>Recruitment Pipeline Funnel</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Conversion velocity from application receipt to final human hiring decision
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Live Telemetry
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {funnel.map((step: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Stage {idx + 1}</span>
                <div className="text-xl font-bold text-white">{step.count}</div>
                <p className="text-[11px] text-slate-400 leading-tight">{step.stage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Jobs with Direct Ranking Links & Search/Filter */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-400" />
                <span>Job Requirements & Candidate Rankings</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage positions, inspect AI match explainability, and conduct candidate evaluations
              </p>
            </div>
            <Link
              to="/owner/jobs/create"
              className="text-xs text-brand-400 font-semibold hover:underline self-start sm:self-auto"
            >
              + Post New Requirement
            </Link>
          </div>

          {/* Search Bar & Status Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search job title, department..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
              {(['ALL', 'ACTIVE', 'DRAFT', 'CLOSED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    statusFilter === st
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-xs text-slate-400">Loading job positions...</div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                No job positions match the current filter.
              </div>
            ) : (
              filteredJobs.map((job: any) => (
                <div
                  key={job.id}
                  className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-sm sm:text-base">{job.title}</h3>
                      <span className="text-[10px] font-mono text-brand-400 px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">
                        {job.department}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {job.openings} {job.openings === 1 ? 'Opening' : 'Openings'}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          job.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5 flex-wrap">
                      <span>Position #{job.id}</span>
                      {job.created_at && (
                        <span>• Posted on {formatISTDate(job.created_at)}</span>
                      )}
                      <span>• Criteria Weights Active</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => openQuestionStudio(job)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-300 bg-brand-500/15 border border-brand-500/30 hover:bg-brand-500/25 transition-all flex items-center gap-1.5 shadow-sm"
                      title="Set / Configure questions for AI interview round"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                      <span>AI Questions</span>
                    </button>
                    <Link
                      to={`/owner/candidates/${job.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-future-indigo hover:bg-indigo-500 shadow-glow-indigo transition-all flex items-center gap-1.5"
                    >
                      <span>View Ranked Candidates</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Creator Attribution */}
        <div className="text-center text-[11px] text-slate-500 font-mono">
          FUTUREVERSE Recruiter Hub • Designed & Developed by Sayan Rooj
        </div>

      </div>

      {/* --- AI INTERVIEW QUESTION STUDIO MODAL --- */}
      {questionModalOpen && selectedJobForQuestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-future-surface border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] flex flex-col justify-between overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/40 text-brand-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-white">AI Interview Question Studio</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Target Position: <strong className="text-white">{selectedJobForQuestions.title}</strong> • {selectedJobForQuestions.department}
                </p>
              </div>

              <button
                onClick={() => setQuestionModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Feedback Alert */}
            {saveSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto space-y-5 pr-1 flex-1">
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
                Candidates attending the AI Interview round for this position will be systematically evaluated on these questions. You can add new questions, specify question types, target skills, and guidance hints.
              </div>

              {loadingQuestions ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Loading configured questions...
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>CONFIGURED ROUND QUESTIONS ({jobQuestions.length})</span>
                    <span className="text-[11px] text-brand-400">All questions active in proctored session</span>
                  </div>

                  {jobQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4 hover:border-slate-700 transition-all"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-mono font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {q.question_type}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            Skill: {q.target_skill || 'Core Competency'}
                          </span>
                        </div>
                        <p className="text-xs text-white leading-relaxed font-medium">
                          {q.question_text}
                        </p>
                        {q.context_hint && (
                          <p className="text-[11px] text-slate-400 italic">
                            💡 Hint: {q.context_hint}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeQuestion(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all shrink-0"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Question Section */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-brand-400" />
                  <span>Add New Question to AI Interview Round</span>
                </span>

                <textarea
                  rows={2}
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="e.g. Explain how you design fault-tolerant asynchronous microservices with graceful backoff..."
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Question Type</label>
                    <select
                      value={newQType}
                      onChange={(e) => setNewQType(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="TECHNICAL">Technical Deep Dive</option>
                      <option value="PROBLEM_SOLVING">Problem Solving</option>
                      <option value="SYSTEM_DESIGN">System Design & Architecture</option>
                      <option value="SCENARIO_BASED">Scenario / STAR</option>
                      <option value="ROLE_SPECIFIC">Role Competency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Target Skill</label>
                    <input
                      type="text"
                      value={newQSkill}
                      onChange={(e) => setNewQSkill(e.target.value)}
                      placeholder="e.g. FastAPI, Transformers"
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Context Hint for Candidate</label>
                    <input
                      type="text"
                      value={newQHint}
                      onChange={(e) => setNewQHint(e.target.value)}
                      placeholder="e.g. Focus on scalability trade-offs"
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={addQuestion}
                    disabled={!newQText.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Question List</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 shrink-0">
              <span className="text-xs text-slate-400 font-mono">
                Total Questions: <strong className="text-white">{jobQuestions.length}</strong>
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveQuestions}
                  disabled={savingQuestions || jobQuestions.length === 0}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-future-indigo hover:from-brand-500 hover:to-future-indigo/90 shadow-glow transition-all flex items-center gap-1.5 disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{savingQuestions ? 'Saving Questions...' : 'Save & Deploy to AI Round'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default OwnerDashboard;
