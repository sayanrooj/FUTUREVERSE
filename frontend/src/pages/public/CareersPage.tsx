import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal,
  X,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, RequirementBadge } from '../../components/Badge';

export const CareersPage: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [department, setDepartment] = useState('');

  // Application state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState<any | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  const fetchJobs = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (workMode) params.work_mode = workMode;
    if (department) params.department = department;

    api.jobs.list(params)
      .then(res => setJobs(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, [workMode, department]);

  const openJobDetails = async (jobId: number) => {
    setDetailsLoading(true);
    setApplySuccess(null);
    setApplyError(null);
    try {
      const fullJob = await api.jobs.get(jobId);
      setSelectedJob(fullJob);
    } catch {
      // Fallback
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      // Not logged in prompt
      setApplyModalOpen(true);
      return;
    }
    if (role !== 'CANDIDATE') {
      setApplyError('Applications are reserved for Candidate accounts.');
      return;
    }

    setApplyLoading(true);
    setApplyError(null);
    try {
      const res = await api.candidate.apply(selectedJob.id);
      setApplySuccess(res);
    } catch (err: any) {
      setApplyError(err.message || 'Failed to submit application.');
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
            OPEN POSITIONS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2 mb-4">
            Explore Opportunities
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Discover roles with transparent criteria weights, merit-based AI evaluation, and human recruiter review.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title, skill or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Work Modes</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
            </select>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Departments</option>
              <option value="Artificial Intelligence">AI & Data Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product & Design</option>
              <option value="Analytics">Analytics</option>
              <option value="University">Internships</option>
            </select>

            <button
              onClick={fetchJobs}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-colors"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Job Cards Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading open positions...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No positions match your search criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-brand-400 px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">
                      {job.department}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      {job.openings} {job.openings === 1 ? 'Opening' : 'Openings'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                    {job.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location} ({job.work_mode})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.employment_type} • {job.salary_range}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Min Score Threshold: {job.min_score_threshold}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Criteria v{job.current_criteria_version}
                  </span>
                  <button
                    onClick={() => openJobDetails(job.id)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-500/15 text-brand-400 border border-brand-500/30 hover:bg-brand-500/25 transition-all flex items-center gap-1.5"
                  >
                    <span>View Role</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Detailed Job Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="bg-future-surface border border-slate-700/80 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title & Metas */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-brand-400 px-2.5 py-0.5 rounded bg-brand-500/10 border border-brand-500/20">
                  {selectedJob.department}
                </span>
                <span className="text-xs text-slate-400">
                  {selectedJob.work_mode} • {selectedJob.employment_type}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">{selectedJob.title}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Location: {selectedJob.location} | Compensation: {selectedJob.salary_range} | Openings: {selectedJob.openings}
              </p>
            </div>

            {/* Description & Responsibilities */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <h3 className="font-semibold text-white">About the Position</h3>
              <p>{selectedJob.description}</p>
              {selectedJob.responsibilities && (
                <>
                  <h3 className="font-semibold text-white pt-2">Key Responsibilities</h3>
                  <p className="whitespace-pre-line">{selectedJob.responsibilities}</p>
                </>
              )}
            </div>

            {/* Criteria & Weights Breakdown */}
            {selectedJob.criteria && selectedJob.criteria.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-brand-400" />
                    <span>Configured Evaluation Criteria & Weights</span>
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    Total: 100% ✓
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedJob.criteria.map((c: any) => (
                    <div key={c.id} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                      <div className="text-slate-400 text-[11px] truncate">{c.category_name}</div>
                      <div className="text-sm font-bold text-brand-400">{c.weight_percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Requirements with Knockout & Required/Preferred */}
            {selectedJob.requirements && selectedJob.requirements.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-semibold text-white">Specific Requirements ({selectedJob.requirements.length})</h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedJob.requirements.map((r: any) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <RequirementBadge isRequired={r.is_required} />
                        <div>
                          <span className="font-semibold text-white">{r.name}</span>
                          {r.level && <span className="text-[11px] text-slate-400 ml-2">({r.level})</span>}
                          {r.is_knockout && (
                            <span className="ml-2 text-[10px] text-rose-400 font-mono font-bold">
                              [Knockout Mandatory]
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-slate-400 text-[11px]">Weight: {r.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Alerts */}
            {applySuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Application Successfully Submitted!</span>
                </div>
                <p>AI initial match score: <strong>{applySuccess.match_score}%</strong>. Your profile has entered recruiter ranking.</p>
                <Link to="/candidate/applications" className="underline font-semibold text-emerald-200">
                  Track in Candidate Dashboard →
                </Link>
              </div>
            )}

            {applyError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{applyError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Screening Threshold: <strong className="text-white">{selectedJob.min_score_threshold}%</strong>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={handleApply}
                  disabled={applyLoading || applySuccess !== null}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-500 to-future-indigo hover:from-brand-600 hover:to-future-indigo/90 transition-all shadow-glow-sm disabled:opacity-50"
                >
                  {applyLoading ? 'Evaluating Match...' : applySuccess ? 'Applied ✓' : 'Apply For Position'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Logged-Out Prompt Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-future-surface border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Candidate Account Required</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Please log in or create a candidate account to apply. Your account enables automatic AI resume parsing, match scoring, and proctored interview attendance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/candidate-login"
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors"
              >
                Candidate Login
              </Link>
              <Link
                to="/register"
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Create Account
              </Link>
            </div>
            <button
              onClick={() => setApplyModalOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-300 mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
