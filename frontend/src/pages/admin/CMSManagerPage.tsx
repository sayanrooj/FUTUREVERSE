import React, { useEffect, useState } from 'react';
import { FileText, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const CMSManagerPage: React.FC = () => {
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutBody, setAboutBody] = useState('');

  useEffect(() => {
    api.admin.getCMS()
      .then(res => {
        setContent(res || {});
        if (res?.hero) {
          setHeroTitle(res.hero.title || '');
          setHeroSubtitle(res.hero.subtitle || '');
        }
        if (res?.about) {
          setAboutTitle(res.about.title || '');
          setAboutBody(res.about.body || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveSection = async (sectionKey: string, payload: any) => {
    setSavingSection(sectionKey);
    try {
      await api.admin.updateCMS(sectionKey, payload);
      setSuccessMsg(`Section '${sectionKey}' updated successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      alert('Failed to save CMS section.');
    } finally {
      setSavingSection(null);
    }
  };

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
            CONTENT MANAGEMENT SYSTEM
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Public Website Content Editor
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify public-facing platform copy, hero statements, and mission descriptions in real time
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Hero Section Form */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">Homepage Hero Section</h2>
            <button
              onClick={() => saveSection('hero', { title: heroTitle, subtitle: heroSubtitle, metadata_json: { creator: 'Sayan Rooj' } })}
              disabled={savingSection === 'hero'}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSection === 'hero' ? 'Saving...' : 'Save Hero'}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Hero Main Heading</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Hero Subheading & Description</label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white"
            />
          </div>
        </div>

        {/* About Section Form */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">About Page Mission & Narrative</h2>
            <button
              onClick={() => saveSection('about', { title: aboutTitle, body: aboutBody, metadata_json: { creator: 'Sayan Rooj' } })}
              disabled={savingSection === 'about'}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingSection === 'about' ? 'Saving...' : 'Save About'}</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">About Section Title</label>
            <input
              type="text"
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Mission Narrative Body</label>
            <textarea
              rows={5}
              value={aboutBody}
              onChange={(e) => setAboutBody(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
