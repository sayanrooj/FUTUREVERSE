import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Target, CheckCircle2, AlertCircle, HelpCircle, BookOpen, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

export const SkillGapPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      api.candidate.getSkillGap(parseInt(jobId))
        .then(res => setData(res))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [jobId]);

  if (loading) {
    return <div className="min-h-screen bg-future-bg flex items-center justify-center text-slate-400">Analyzing skill gaps...</div>;
  }

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Back link */}
        <Link
          to="/candidate/applications"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 hover:text-brand-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>

        {/* Header */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
            COMPETENCY BENCHMARK
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Skill-Gap Analysis & Growth Blueprint
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Objective classification of your technical capabilities against this role's exact criteria
          </p>
        </div>

        {/* 3 Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Strong Skills */}
          <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Strong Alignment</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                {data?.strong?.length || 0}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Direct evidence verified in your CV portfolio meeting or exceeding benchmark requirements.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {(data?.strong || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="font-semibold text-emerald-300">{item.skill}</div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Developing Skills */}
          <div className="p-6 rounded-2xl glass-panel border border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>Developing Exposure</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                {data?.developing?.length || 0}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Foundational familiarity identified. Deepening real-world project usage recommended.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {(data?.developing || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="font-semibold text-amber-300">{item.skill}</div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="p-6 rounded-2xl glass-panel border border-rose-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <HelpCircle className="w-5 h-5" />
                <span>Missing Credentials</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">
                {data?.missing?.length || 0}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              No evidence detected in parsed credentials. Targeted capstones recommended.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {(data?.missing || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="font-semibold text-rose-300">{item.skill}</div>
                  <p className="text-[11px] text-slate-400 mt-1">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Actionable Learning Recommendations */}
        {data?.recommendations && data.recommendations.length > 0 && (
          <div className="p-6 rounded-2xl glass-panel border border-brand-500/30 space-y-3">
            <div className="flex items-center gap-2 text-brand-400 font-bold text-sm">
              <BookOpen className="w-4 h-4" />
              <span>Tailored Learning Recommendations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {data.recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5 text-[10px]">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
