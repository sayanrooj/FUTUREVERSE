import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-future-bg flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full glass-panel border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <span className="text-4xl font-extrabold text-white font-mono">404</span>
          <h1 className="text-xl font-bold text-white mt-2">Resource Not Found</h1>
          <p className="text-xs text-slate-400 mt-1">
            The requested recruitment resource or position is either relocated or archived.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-future-bg flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full glass-panel border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <span className="text-4xl font-extrabold text-white font-mono">403</span>
          <h1 className="text-xl font-bold text-white mt-2">Access Restricted (RBAC)</h1>
          <p className="text-xs text-slate-400 mt-1">
            You do not possess the required security role to access this portal.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
