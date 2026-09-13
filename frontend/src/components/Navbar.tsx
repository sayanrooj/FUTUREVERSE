import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  LifeBuoy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-future-indigo p-0.5 shadow-glow-sm group-hover:shadow-glow transition-all">
              <div className="w-full h-full bg-future-bg rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-wider font-sans text-white flex items-center gap-1.5">
                <span>FUTURE</span>
                <span className="text-brand-400">VERSE</span>
              </div>
              <p className="text-[10px] text-future-textMuted tracking-widest font-mono uppercase">
                AI Talent Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-brand-400 bg-future-surface/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-brand-400 bg-future-surface/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              About
            </Link>
            <Link
              to="/what-we-do"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/what-we-do') ? 'text-brand-400 bg-future-surface/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              What We Do
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/how-it-works') ? 'text-brand-400 bg-future-surface/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/achievements"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/achievements') ? 'text-brand-400 bg-future-surface/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Achievements
            </Link>
            <Link
              to="/events"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/events') ? 'text-brand-400 bg-future-surface/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Events
            </Link>
            <Link
              to="/careers"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/careers') ? 'text-brand-400 bg-future-surface/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Careers
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/contact') ? 'text-brand-400 bg-future-surface/80' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Action / Profile Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            {!user ? (
              <>
                <Link
                  to="/candidate-login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  Candidate Login
                </Link>
                <Link
                  to="/owner-login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors border border-slate-700/60"
                >
                  For Recruiters
                </Link>
                <Link
                  to="/admin-login"
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 hover:border-emerald-500/50 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                  title="Super Admin Platform Governance"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin</span>
                </Link>
                <Link
                  to="/careers"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-500 to-future-indigo hover:from-brand-600 hover:to-future-indigo/90 text-white shadow-glow-sm transition-all transform hover:-translate-y-0.5"
                >
                  Explore Jobs
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Role Specific Dashboard Link */}
                {role === 'CANDIDATE' && (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/candidate/dashboard"
                      className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition-all flex items-center gap-1.5"
                    >
                      <User className="w-4 h-4" />
                      <span>Candidate Portal</span>
                    </Link>
                    <Link
                      to="/candidate/support"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-all flex items-center gap-1.5"
                      title="Direct Support & Ticket Helpdesk"
                    >
                      <LifeBuoy className="w-3.5 h-3.5 text-brand-400" />
                      <span>Support</span>
                    </Link>
                  </div>
                )}

                {role === 'OWNER' && (
                  <Link
                    to="/owner/dashboard"
                    className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-future-indigo/10 text-indigo-300 border border-future-indigo/20 hover:bg-future-indigo/20 transition-all flex items-center gap-1.5"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Recruiter Hub</span>
                  </Link>
                )}

                {role === 'SUPER_ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Platform Admin</span>
                  </Link>
                )}

                <div className="h-6 w-px bg-slate-800" />

                {/* User details & logout */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white leading-tight">{user.full_name}</p>
                    <span className="text-[10px] text-brand-400 font-mono">{user.role}</span>
                  </div>
                  <button
                    onClick={logout}
                    title="Log Out"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            About
          </Link>
          <Link
            to="/what-we-do"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            What We Do
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            How It Works
          </Link>
          <Link
            to="/achievements"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            Achievements
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            Events
          </Link>
          <Link
            to="/careers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            Careers
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
          >
            Contact
          </Link>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {!user ? (
              <>
                <Link
                  to="/candidate-login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg"
                >
                  Candidate Login
                </Link>
                <Link
                  to="/owner-login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-slate-300 border border-slate-700 rounded-lg"
                >
                  For Recruiters
                </Link>
                <Link
                  to="/admin-login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-xs font-semibold text-emerald-400 border border-emerald-500/40 bg-emerald-950/30 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Super Admin Platform Governance</span>
                </Link>
              </>
            ) : (
              <>
                {role === 'CANDIDATE' && (
                  <>
                    <Link
                      to="/candidate/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center px-4 py-2 text-sm font-medium text-brand-300 bg-brand-500/10 rounded-lg"
                    >
                      Candidate Dashboard
                    </Link>
                    <Link
                      to="/candidate/support"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg flex items-center justify-center gap-2"
                    >
                      <LifeBuoy className="w-4 h-4 text-brand-400" />
                      <span>Support & Helpdesk</span>
                    </Link>
                  </>
                )}
                {role === 'OWNER' && (
                  <Link
                    to="/owner/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-sm font-medium text-indigo-300 bg-future-indigo/10 rounded-lg"
                  >
                    Recruiter Dashboard
                  </Link>
                )}
                {role === 'SUPER_ADMIN' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-sm font-medium text-emerald-300 bg-emerald-500/10 rounded-lg"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-rose-400 bg-rose-500/10 rounded-lg"
                >
                  Log Out ({user.full_name})
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
