import React, { useEffect, useState } from 'react';
import { Award, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.public.getAchievements()
      .then(res => setAchievements(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
            PLATFORM MILESTONES & HONORS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2 mb-4">
            Platform Achievements
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Recognized milestones in ethical AI talent engineering, evaluation scale, and algorithmic transparency.
          </p>
        </div>

        {/* Loading / Content */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading achievements...</div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No achievements published yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl glass-panel border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                      <Award className="w-5 h-5" />
                    </div>
                    {item.metric && (
                      <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        {item.metric}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono uppercase text-brand-400 tracking-wider">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                  Recorded on: {item.date_str}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
