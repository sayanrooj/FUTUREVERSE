import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { api } from '../../services/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.public.submitContact({ name, email, phone, message });
      setSubmitted(true);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
            CONNECT WITH US
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2 mb-4">
            Get In Touch
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Have questions about enterprise deployment, platform customization, or interview integration? Reach our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Office Headquarters</h3>
              
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <MapPin className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white">FUTUREVERSE AI Labs</p>
                  <p className="text-slate-400">Bangalore Innovation Hub, Outer Ring Road</p>
                  <p className="text-slate-400">Karnataka, India — 560103</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>contact@futureverse.ai</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+91 (080) 4120-9900</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                <MessageSquare className="w-4 h-4 text-brand-400" />
                <span>Need Technical Support?</span>
              </div>
              <p>
                Candidates and Recruiters with active accounts can submit proctored session support tickets directly inside their dashboards.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-2xl glass-panel border border-slate-800">
              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Transmitted!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Thank you for reaching out to FUTUREVERSE. Our recruitment advisory team will review your note and respond shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setMessage(''); }}
                    className="mt-4 px-4 py-2 text-xs text-brand-400 font-medium hover:underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-white mb-2">Send an Advisory Note</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number (Optional)</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Inquiry / Requirements</label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your organization's recruitment workflow, platform inquiry, or partnership questions..."
                      className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-future-indigo hover:from-brand-600 hover:to-future-indigo/90 shadow-glow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Submitting...' : 'Dispatch Message'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
