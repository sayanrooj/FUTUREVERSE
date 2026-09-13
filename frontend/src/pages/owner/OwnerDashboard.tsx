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
  Layers
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

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
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
    </div>
  );
};

export default OwnerDashboard;
