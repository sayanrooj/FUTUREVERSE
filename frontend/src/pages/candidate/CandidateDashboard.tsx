import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Briefcase,
  Video,
  Award,
  ArrowRight,
  Sparkles,
  Bell,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.candidate.getProfile().catch(() => null),
      api.candidate.getApplications().catch(() => []),
      api.candidate.getNotifications().catch(() => [])
    ]).then(([prof, apps, notifs]) => {
      setProfile(prof);
      setApplications(apps || []);
      setNotifications(notifs || []);
    }).finally(() => setLoading(false));
  }, []);

  const pendingInterview = applications.find(a => a.interview && a.interview.status !== 'Completed');

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-brand-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CANDIDATE INTELLIGENCE HUB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back, {user?.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {profile?.headline || 'Complete your CV profile to maximize algorithmic role matching'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/candidate/profile"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 glass-panel hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              Manage CV & Profile
            </Link>
            <Link
              to="/careers"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-sm transition-all"
            >
              Browse Open Roles
            </Link>
          </div>
        </div>

        {/* Priority AI Interview Banner if Invited */}
        {pendingInterview && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-future-indigo/20 via-brand-500/15 to-future-surface border border-brand-500/40 shadow-glow-indigo flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-300 font-bold px-2 py-0.5 rounded bg-brand-500/20">
                Action Required • AI Interview Ready
              </span>
              <h3 className="text-lg font-bold text-white">
                Proctored AI Interview for {pendingInterview.job_title}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Your credentials satisfied the initial screening threshold. Please enter the private interview environment to complete your adaptive assessment.
              </p>
            </div>
            <Link
              to={`/interview/${pendingInterview.interview.token}`}
              className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-brand-500 hover:bg-brand-400 shadow-glow flex items-center gap-2 shrink-0 transition-transform hover:-translate-y-0.5"
            >
              <Video className="w-4 h-4" />
              <span>Launch Interview Room</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* 4 Pipeline Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <div className="text-xs text-slate-400">Applications Submitted</div>
            <div className="text-2xl font-bold text-white mt-1">{applications.length}</div>
            <div className="text-[11px] text-brand-400 mt-2 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Active Roles</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <div className="text-xs text-slate-400">CV Parsing Status</div>
            <div className="text-2xl font-bold text-white mt-1">
              {profile?.has_resume ? 'Verified ✓' : 'Pending'}
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>{profile?.skills?.length || 0} Skills Extracted</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <div className="text-xs text-slate-400">AI Interviews Active</div>
            <div className="text-2xl font-bold text-white mt-1">
              {applications.filter(a => a.interview).length}
            </div>
            <div className="text-[11px] text-indigo-400 mt-2 flex items-center gap-1">
              <Video className="w-3.5 h-3.5" />
              <span>Proctored Sessions</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-slate-800">
            <div className="text-xs text-slate-400">F2F Discussions</div>
            <div className="text-2xl font-bold text-white mt-1">
              {applications.filter(a => a.f2f_schedule).length}
            </div>
            <div className="text-[11px] text-amber-400 mt-2 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Final Evaluation</span>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Active Applications & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Applications (2 cols) */}
          <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-400" />
                <span>My Applications</span>
              </h2>
              <Link to="/candidate/applications" className="text-xs text-brand-400 hover:underline">
                View All Applications →
              </Link>
            </div>

            {loading ? (
              <div className="text-xs text-slate-400 py-8 text-center">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-xs text-slate-400">You have not applied to any positions yet.</p>
                <Link
                  to="/careers"
                  className="inline-block px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500"
                >
                  Explore Available Positions
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{app.job_title}</h4>
                        <span className="text-[11px] font-mono text-brand-400 px-2 py-0.5 rounded bg-brand-500/10">
                          {app.job_department}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <span>Status: <strong className="text-slate-200">{app.status}</strong></span>
                        {app.scores && (
                          <span>Match Score: <strong className="text-brand-400">{app.scores.overall_score}%</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {app.interview && (
                        <Link
                          to={`/interview/${app.interview.token}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-future-indigo/20 text-indigo-300 border border-future-indigo/40 hover:bg-future-indigo/30 transition-colors"
                        >
                          {app.interview.status === 'Completed' ? 'View Result' : 'Interview →'}
                        </Link>
                      )}
                      <Link
                        to="/candidate/applications"
                        className="px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notification Feed (1 col) */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-400" />
                <span>Notifications</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">
                {notifications.length} recent
              </span>
            </div>

            {notifications.length === 0 ? (
              <div className="text-xs text-slate-500 py-8 text-center">No new notifications.</div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-1">
                    <div className="font-semibold text-slate-200">{n.title}</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{n.message}</p>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
