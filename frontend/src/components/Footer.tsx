import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Lock, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-future-bg border-t border-slate-800/80 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-future-indigo p-0.5">
                <div className="w-full h-full bg-future-bg rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-wider text-white">
                FUTURE<span className="text-brand-400">VERSE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent recruitment platform empowering merit-based talent matching through explainable AI screening, adaptive interviews, and human-centered decision making.
            </p>
            <div className="flex items-center space-x-3 text-xs text-brand-400 font-mono">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Responsible AI
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> ISO 27001 Ready
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/what-we-do" className="hover:text-brand-400 transition-colors">
                  AI CV Screening
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-brand-400 transition-colors">
                  12-Step Recruitment Flow
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-brand-400 transition-colors">
                  Explore Open Jobs
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="hover:text-brand-400 transition-colors">
                  Platform Achievements
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-brand-400 transition-colors">
                  Summits & Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Roles & Access */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Portals
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/candidate-login" className="hover:text-brand-400 transition-colors">
                  Candidate Portal
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-400 transition-colors">
                  Register as Candidate
                </Link>
              </li>
              <li>
                <Link to="/owner-login" className="hover:text-brand-400 transition-colors">
                  Recruiter & Owner Login
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="hover:text-brand-400 transition-colors">
                  Super Admin Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Ethics, Compliance & Creator */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Trust & Governance
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">
                  AI Transparency Charter
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">
                  Integrity Monitoring Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-400 transition-colors">
                  Support & Help Center
                </Link>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-[11px] text-slate-400">
                Created & Developed by <strong className="text-slate-200 font-semibold">Sayan Rooj</strong>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Developer Credit */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-brand-400" />
            <span>FUTUREVERSE © 2026</span>
            <span>•</span>
            <span className="text-slate-300 font-medium">Designed & Developed by Sayan Rooj</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-300">Terms of Service</Link>
            <Link to="/about" className="hover:text-slate-300">Candidate Consent</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
