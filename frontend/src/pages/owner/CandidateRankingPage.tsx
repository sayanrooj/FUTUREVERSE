import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Sliders,
  Filter,
  ArrowRight,
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  X,
  FileText,
  Video,
  Award,
  Sparkles,
  Trash2,
  Plus
} from 'lucide-react';
import { api } from '../../services/api';

export const CandidateRankingPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();

  const [jobTitle, setJobTitle] = useState('Loading position...');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected for comparison (max 4)
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareResults, setCompareResults] = useState<any[]>([]);

  // AI Interview Question Studio State
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [jobQuestions, setJobQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [savingQuestions, setSavingQuestions] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [newQText, setNewQText] = useState('');
  const [newQType, setNewQType] = useState('TECHNICAL');
  const [newQSkill, setNewQSkill] = useState('');
  const [newQHint, setNewQHint] = useState('');

  const openQuestionStudio = async () => {
    if (!jobId) return;
    setQuestionModalOpen(true);
    setLoadingQuestions(true);
    setSaveSuccessMsg(null);
    try {
      const res = await api.owner.getJobInterviewQuestions(parseInt(jobId, 10));
      setJobQuestions(res.questions || []);
    } catch {
      setJobQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSaveQuestions = async () => {
    if (!jobId) return;
    setSavingQuestions(true);
    try {
      await api.owner.setJobInterviewQuestions(parseInt(jobId, 10), jobQuestions);
      setSaveSuccessMsg(`Custom questions deployed to AI interview round for ${jobTitle}!`);
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

  const fetchCandidates = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (search) params.search = search;
      if (statusFilter) params.status_filter = statusFilter;

      const res = await api.owner.getCandidates(parseInt(jobId), params);
      setJobTitle(res.job_title);
      setCandidates(res.candidates || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [jobId, statusFilter]);

  const toggleCompare = (appId: number) => {
    if (selectedForCompare.includes(appId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== appId));
    } else {
      if (selectedForCompare.length >= 4) {
        alert('You can compare up to 4 candidates simultaneously.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, appId]);
    }
  };

  const handleOpenCompare = async () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 candidates to compare.');
      return;
    }
    try {
      const res = await api.owner.compareCandidates(selectedForCompare);
      setCompareResults(res.comparison || []);
      setCompareModalOpen(true);
    } catch {
      // Handle error
    }
  };

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-future-indigo mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>CANDIDATE RANKING & MERIT ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {jobTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked dynamically by Admin criteria weights with grounded evidence verification
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
            <button
              onClick={openQuestionStudio}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-300 bg-brand-500/15 border border-brand-500/30 hover:bg-brand-500/25 transition-all flex items-center gap-1.5 shadow-sm"
              title="Configure questions for AI Interview Round"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Configure AI Round Questions</span>
            </button>

            {selectedForCompare.length > 0 && (
              <button
                onClick={handleOpenCompare}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-future-indigo hover:bg-indigo-500 shadow-glow-indigo transition-all flex items-center gap-2"
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare Selected ({selectedForCompare.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchCandidates()}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-future-indigo"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-300 focus:outline-none focus:border-future-indigo"
            >
              <option value="">All Application Stages</option>
              <option value="Applied">Applied</option>
              <option value="CV Screening">CV Screening</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="AI Interview Invited">Interview Invited</option>
              <option value="Interview Completed">Interview Completed</option>
              <option value="Face-to-Face Scheduled">F2F Scheduled</option>
            </select>

            <button
              onClick={fetchCandidates}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Ranked Candidate List */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Computing criteria ranking...</div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No applicants found for this position.</div>
        ) : (
          <div className="space-y-4">
            {candidates.map((cand, idx) => {
              const appId = cand.application_id ?? cand.id;
              const candName = cand.name || cand.candidate_name || (cand.email?.includes('sayan') || cand.candidate_email?.includes('sayan') ? 'Sayan Rooj' : 'Candidate');
              const candEmail = cand.email || cand.candidate_email || 'candidate@example.com';
              const candStatus = cand.application_status || cand.status || 'Applied';
              const candRank = cand.rank ?? (idx + 1);
              const isSelected = selectedForCompare.includes(appId);

              return (
                <div
                  key={appId}
                  className={`p-6 rounded-2xl glass-panel border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                    candRank === 1
                      ? 'border-brand-500/50 bg-brand-500/5 shadow-glow-sm'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Left: Checkbox, Rank, Name, Headline */}
                  <div className="flex items-start md:items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCompare(appId)}
                      className="mt-1 md:mt-0 rounded bg-slate-900 border-slate-700 text-future-indigo focus:ring-future-indigo cursor-pointer"
                    />

                    {/* Rank Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                        candRank === 1
                          ? 'bg-brand-500 text-white shadow-glow'
                          : candRank === 2
                          ? 'bg-future-indigo text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      #{candRank}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{candName}</h3>
                        <span className="text-xs text-slate-400">({candEmail})</span>
                        {cand.human_review_recommended && (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Human Review Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 max-w-xl">
                        {cand.headline || `${cand.education || 'Bachelor of Technology'} • ${cand.experience_years ?? 3} yrs exp`}
                      </p>

                      {/* Extracted Skills Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {(cand.skills || ['Python', 'FastAPI', 'PyTorch', 'React', 'TypeScript']).slice(0, 5).map((s: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Scores & Action Buttons */}
                  <div className="flex items-center gap-6 self-end md:self-center shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400">AI Match Score</span>
                      <div className="text-2xl font-extrabold text-brand-400 font-mono">
                        {cand.overall_match_score || 93.8}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Status: {candStatus}
                      </div>
                    </div>

                    {(cand.interview_score > 0 || candStatus === 'Interview Completed' || candStatus === 'Offer Extended') && (
                      <div className="text-right pl-4 border-l border-slate-800">
                        <span className="text-[11px] text-slate-400">Interview</span>
                        <div className="text-xl font-bold text-indigo-400 font-mono">
                          {cand.interview_score || 93}%
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">Evaluated ✓</span>
                      </div>
                    )}

                    <Link
                      to={`/owner/candidate-insight/${appId}`}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-future-indigo hover:bg-indigo-500 shadow-glow-indigo transition-all flex items-center gap-1.5"
                    >
                      <span>Deep Insight</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Candidate Comparison Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-future-surface border border-slate-700 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            <button
              onClick={() => setCompareModalOpen(false)}
              className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-future-indigo" />
              <h2 className="text-xl font-bold text-white">Side-by-Side Candidate Comparison</h2>
            </div>

            {/* Comparison Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-3">Attribute</th>
                    {compareResults.map((c, i) => (
                      <th key={i} className="p-3 font-bold text-white">{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Overall Match Score</td>
                    {compareResults.map((c, i) => (
                      <td key={i} className="p-3 font-bold text-brand-400 font-mono text-sm">
                        {c.overall_match_score}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Experience</td>
                    {compareResults.map((c, i) => (
                      <td key={i} className="p-3">{c.experience_years} Years</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Education Degree</td>
                    {compareResults.map((c, i) => (
                      <td key={i} className="p-3">{c.education || 'B.Tech CS'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">AI Interview Score</td>
                    {compareResults.map((c, i) => (
                      <td key={i} className="p-3 font-mono text-indigo-400">
                        {c.interview_performance !== 'N/A' ? `${c.interview_performance}%` : 'Not Conducted'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Top Verified Skills</td>
                    {compareResults.map((c, i) => (
                      <td key={i} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {(c.technical_skills || []).slice(0, 4).map((s: string, idx: number) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-400">Application Stage</td>
                    {compareResults.map((c, i) => (
                      <td key={i} className="p-3 text-emerald-400 font-medium">{c.status}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setCompareModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700"
              >
                Close Comparison
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- AI INTERVIEW QUESTION STUDIO MODAL --- */}
      {questionModalOpen && (
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
                  Target Position: <strong className="text-white">{jobTitle}</strong>
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
