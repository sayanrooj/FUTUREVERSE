import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status.toLowerCase();

  const px = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (s.includes('met') && !s.includes('not') && !s.includes('partial')) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-medium badge-met ${px}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Met</span>
      </span>
    );
  }

  if (s.includes('not met')) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-medium badge-not-met ${px}`}>
        <XCircle className="w-3.5 h-3.5 text-rose-400" />
        <span>Not Met</span>
      </span>
    );
  }

  if (s.includes('partially') || s.includes('partial')) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full font-medium badge-partial ${px}`}>
        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
        <span>Partially Met</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium badge-unclear ${px}`}>
      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
      <span>Unclear</span>
    </span>
  );
};

export const RequirementBadge: React.FC<{ isRequired: boolean }> = ({ isRequired }) => {
  if (isRequired) {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-rose-500/15 text-rose-400 border border-rose-500/30">
        Required
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-brand-500/15 text-brand-300 border border-brand-500/30">
      Preferred
    </span>
  );
};
