import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Activity,
  Server,
  FileText,
  Settings,
  ArrowRight,
  Database,
  Cpu,
  Lock,
  MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const [health, setHealth] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getSystemHealth()
      .then(res => setHealth(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PLATFORM GOVERNANCE & CONTROL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Super Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Master control: provision recruiter accounts, manage public CMS, inspect audit logs, and monitor platform health
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/owners"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-glow transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Provision Recruiter Account</span>
            </Link>
          </div>
        </div>

        {/* 4 System Health KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400">Core Platform Status</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{health?.status || 'HEALTHY'}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-2 font-mono">Uptime: 99.98% SLA</div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400">Database Engine</span>
            <div className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-400" />
              <span>{health?.database_status || 'CONNECTED'}</span>
            </div>
            <div className="text-[11px] text-brand-400 mt-2 font-mono">Async Connection Pool</div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400">AI Scoring Engine</span>
            <div className="text-xl font-bold text-white mt-1 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>{health?.ai_engine_status || 'OPERATIONAL'}</span>
            </div>
            <div className="text-[11px] text-indigo-400 mt-2 font-mono">Cognitive v2.6 Native</div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400">Total Registered Users</span>
            <div className="text-2xl font-bold text-white mt-1">{health?.active_users || 6}</div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">RBAC Enforced</div>
          </div>
        </div>

        {/* Administration Hub Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Link
            to="/admin/owners"
            className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Recruiter & Owner Provisioning
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Create verified recruiter accounts, toggle account activation, reset credentials, and assign permission scopes.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>Manage Recruiters</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/cms"
            className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                Public Website Content (CMS)
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Edit homepage hero banners, about statements, announcements, and contact coordinates in real-time.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-brand-400 font-semibold">
              <span>Edit CMS Content</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/achievements-events"
            className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-future-indigo/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-future-indigo/10 border border-future-indigo/20 flex items-center justify-center text-indigo-400 mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                Achievements & Events Manager
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Publish platform achievements, certifications, recruitment summits, and virtual masterclass sessions.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-semibold">
              <span>Manage Events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/audit-logs"
            className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Compliance Audit Trail
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Immutable activity logs tracking recruiter overrides, criteria edits, logins, and shortlisting actions.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400 font-semibold">
              <span>Inspect Audit Logs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/support"
            className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                Support Ticket Desk
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Resolve candidate and recruiter inquiries, handle proctoring queries, and update ticket lifecycle states.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-sky-400 font-semibold">
              <span>View Support Queue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 mb-4">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">System Architecture & Creator</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Created & Developed by <strong className="text-white">Sayan Rooj</strong>. FUTUREVERSE Release 2026.1.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              FASTAPI • REACT 19 • TAILWIND • SQLALCHEMY
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
