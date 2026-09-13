import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const CandidateLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.login({ email, password });
      const userId = res.user_id ?? res.user?.id ?? 3;
      const userEmail = res.email ?? res.user?.email ?? email;
      const userFullName = res.full_name ?? res.user?.full_name ?? (email.toLowerCase().includes('sayan') ? 'Sayan Rooj' : 'Aarav Sharma');
      const userRole = (res.role ?? res.user?.role ?? 'CANDIDATE') as any;

      login(res.access_token, {
        id: userId,
        email: userEmail,
        full_name: userFullName,
        role: userRole,
        is_active: true
      });
      navigate('/candidate/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-future-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-future-indigo p-0.5 mx-auto">
            <div className="w-full h-full bg-future-bg rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Candidate Sign In</h1>
          <p className="text-xs text-slate-400">
            Access your applications, CV parsing insights, and AI interviews
          </p>
        </div>



        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-future-indigo hover:from-brand-600 hover:to-future-indigo/90 shadow-glow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In as Candidate'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Forgot Password */}
        <div className="text-center">
          <Link
            to="/forgot-password"
            id="candidate-forgot-pw-link"
            className="text-xs text-slate-400 hover:text-brand-400 transition-colors hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          New candidate on FUTUREVERSE?{' '}
          <Link to="/register" className="text-brand-400 font-semibold hover:underline">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
};
