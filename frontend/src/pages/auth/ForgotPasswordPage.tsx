import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Mail, ArrowRight, AlertCircle, CheckCircle2,
  KeyRound, Lock, Eye, EyeOff, RefreshCw, ShieldCheck, ArrowLeft
} from 'lucide-react';
import { api } from '../../services/api';

type Step = 'email' | 'otp' | 'reset' | 'done';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(600);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (step !== 'otp') return;
    const interval = setInterval(() => {
      setOtpTimer(t => (t <= 1 ? 0 : t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => setResendCooldown(c => c - 1), 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const requestOtp = useCallback(async (emailAddr: string) => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await api.auth.requestOtp(emailAddr);
      setDemoOtp(res.demo_otp || null);
      setStep('otp');
      setOtpTimer(600);
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestOtp(email);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.auth.verifyOtp(email, otp);
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.auth.resetPasswordOtp(email, otp, newPassword);
      setStep('done');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps: Step[] = ['email', 'otp', 'reset', 'done'];
  const stepLabels: Record<Step, string> = { email: 'Enter Email', otp: 'Verify Code', reset: 'New Password', done: 'Done' };
  const currentIdx = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-future-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-future-indigo p-0.5 mx-auto">
            <div className="w-full h-full bg-future-bg rounded-[14px] flex items-center justify-center">
              {step === 'done' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <KeyRound className="w-6 h-6 text-brand-400" />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {step === 'done' ? 'Password Reset!' : 'Forgot Password'}
          </h1>
          <p className="text-xs text-slate-400">
            {step === 'email' && 'Enter your registered email to receive a verification code.'}
            {step === 'otp' && `Enter the 6-digit verification code for ${email}`}
            {step === 'reset' && 'Create a strong new password for your account.'}
            {step === 'done' && 'Your password has been reset successfully.'}
          </p>
        </div>

        {/* Progress Steps */}
        {step !== 'done' && (
          <div className="flex items-center gap-1">
            {steps.slice(0, 3).map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-all ${
                  i < currentIdx ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  i === currentIdx ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40' :
                  'bg-slate-800 text-slate-500 border border-slate-700'
                }`}>
                  {i < currentIdx ? <CheckCircle2 className="w-3 h-3" /> : <span>{i + 1}</span>}
                  <span>{stepLabels[s]}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-px ${i < currentIdx ? 'bg-emerald-500/40' : 'bg-slate-700'}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Email */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="fp-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <button
              id="fp-send-otp-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-future-indigo hover:from-brand-600 hover:to-future-indigo/90 shadow-glow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Sending Code\u2026' : 'Send Verification Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            {demoOtp && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Demo Mode \u2014 Your Verification Code
                </div>
                <p className="text-slate-300 text-[11px]">No email server in demo; code shown here instead:</p>
                <div className="text-3xl font-mono font-bold text-amber-400 tracking-widest text-center py-2">
                  {demoOtp}
                </div>
                <p className="text-slate-400 text-[11px]">In production this would be emailed to {email}.</p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Code expires in:</span>
              <span className={`font-mono font-bold ${otpTimer < 60 ? 'text-rose-400' : 'text-brand-400'}`}>
                {formatTime(otpTimer)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">6-Digit Verification Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="fp-otp-input"
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono tracking-widest text-center"
                />
              </div>
            </div>

            <button
              id="fp-verify-otp-btn"
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-future-indigo hover:from-brand-600 hover:to-future-indigo/90 shadow-glow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Verifying\u2026' : 'Verify Code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="fp-resend-btn"
              onClick={() => requestOtp(email)}
              disabled={resendCooldown > 0 || loading}
              className="w-full py-2 rounded-xl text-xs font-medium text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <RefreshCw className="w-3 h-3" />
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </form>
        )}

        {/* STEP 3: New Password */}
        {step === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="fp-new-password"
                  type={showNewPw ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[6, 8, 10, 12].map((threshold, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                      newPassword.length >= threshold
                        ? ['bg-rose-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500'][i]
                        : 'bg-slate-700'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="fp-confirm-password"
                  type={showConfirmPw ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-[11px] mt-1 ${newPassword === confirmPassword ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {newPassword === confirmPassword ? '\u2713 Passwords match' : '\u2717 Passwords do not match'}
                </p>
              )}
            </div>

            <button
              id="fp-reset-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-future-indigo hover:from-brand-600 hover:to-future-indigo/90 shadow-glow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Resetting\u2026' : 'Reset Password'}</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === 'done' && (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-emerald-300 font-semibold text-sm">Password reset successfully!</p>
              <p className="text-slate-400 text-xs mt-1">
                Sign in with your new password for{' '}
                <span className="text-white font-medium">{email}</span>
              </p>
            </div>
            <button
              id="fp-go-login-btn"
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-future-indigo hover:from-brand-600 hover:to-future-indigo/90 shadow-glow-sm transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Sign In</span>
            </button>
          </div>
        )}

        {/* Footer */}
        {step !== 'done' && (
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Remember your password?{' '}
            <Link to="/login" className="text-brand-400 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
