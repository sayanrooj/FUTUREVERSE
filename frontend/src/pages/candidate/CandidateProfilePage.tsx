import React, { useEffect, useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  Save,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { api } from '../../services/api';

export const CandidateProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [projects, setProjects] = useState<string[]>([]);
  const [newProject, setNewProject] = useState('');

  // CV Parsed Data Review state
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [parsedReviewOpen, setParsedReviewOpen] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await api.candidate.getProfile();
      setProfile(data);
      setHeadline(data.headline || '');
      setBio(data.bio || '');
      setLocation(data.location || '');
      setEducationLevel(data.education_level || '');
      setExperienceYears(data.experience_years || 0);
      setSkills(data.skills || []);
      setProjects(data.projects || []);
      if (data.parsed_data) {
        setParsedData(data.parsed_data);
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage(null);
    try {
      const res = await api.candidate.uploadResume(file);
      setParsedData(res.parsed_data);
      setParsedReviewOpen(true);
      // Sync form fields with AI parsed data
      if (res.parsed_data.degree) setEducationLevel(res.parsed_data.degree);
      if (res.parsed_data.experience_years) setExperienceYears(res.parsed_data.experience_years);
      if (res.parsed_data.technical_skills) {
        const merged = Array.from(new Set([...skills, ...res.parsed_data.technical_skills]));
        setSkills(merged);
      }
      if (res.parsed_data.projects) {
        const mergedProjects = Array.from(new Set([...projects, ...res.parsed_data.projects]));
        setProjects(mergedProjects);
      }
      await fetchProfile();
    } catch (err: any) {
      setErrorMessage(err.message || 'CV upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);
    try {
      await api.candidate.updateProfile({
        headline,
        bio,
        location,
        education_level: educationLevel,
        experience_years: experienceYears,
        skills,
        projects
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const addProject = () => {
    if (newProject.trim() && !projects.includes(newProject.trim())) {
      setProjects([...projects, newProject.trim()]);
      setNewProject('');
    }
  };

  const removeProject = (projToRemove: string) => {
    setProjects(projects.filter(p => p !== projToRemove));
  };

  if (loading) {
    return <div className="min-h-screen bg-future-bg flex items-center justify-center text-slate-400">Loading profile data...</div>;
  }

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand-400">
              CANDIDATE DOSSIER
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Profile & CV Parsing Intelligence
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and confirm your AI-extracted credentials for precision matching
            </p>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-sm transition-all flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile and parsed credentials updated successfully!</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* CV Upload Box */}
        <div className="p-8 rounded-3xl glass-panel border border-brand-500/30 bg-gradient-to-b from-slate-900/60 to-future-surface">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>RESUME PARSER SERVICE</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Upload Candidate CV (PDF, DOCX, TXT)
              </h3>
              <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                Our parsing service automatically identifies degrees, verified skills, experience timelines, and projects. You will review and confirm all extracted information.
              </p>
              {profile?.has_resume && (
                <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-mono pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Current CV: {profile.resume_filename}</span>
                </div>
              )}
            </div>

            <div className="shrink-0">
              <label className="cursor-pointer px-6 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-brand-500 to-future-indigo hover:from-brand-600 hover:to-future-indigo/90 shadow-glow-sm transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Parsing with AI...' : 'Upload & Parse CV'}</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* AI Parsed Review Banner (if recently parsed) */}
        {parsedData && (
          <div className="p-6 rounded-2xl glass-panel border border-emerald-500/40 bg-emerald-500/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">AI-Extracted Credential Summary</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Verified by ResumeParserService</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Degree / Specialization</span>
                <p className="font-semibold text-white mt-0.5">{parsedData.degree || 'Bachelor of Technology'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Experience Extracted</span>
                <p className="font-semibold text-white mt-0.5">{parsedData.experience_years} Years</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Technical Skills Found</span>
                <p className="font-semibold text-emerald-400 mt-0.5">{parsedData.technical_skills?.length || 0} Skills</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Edit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1: Basic Information */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-400" />
              <span>Career Positioning</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. AI/ML Engineer | Python & Distributed Systems"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Professional Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your technical background..."
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Current Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Bangalore, India"
                  className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  step="0.5"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Formal Education Level</label>
              <input
                type="text"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                placeholder="e.g. Master of Technology (M.Tech) in AI"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Column 2: Skills & Projects */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-6">
            
            {/* Technical Skills */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>Technical Skills ({skills.length})</span>
                <span className="text-[11px] text-slate-500 font-mono">Synced with AI Matching</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add skill (e.g. PyTorch)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                {skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-200"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(s)}
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Practical Projects */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-future-indigo" />
                  <span>Projects & Deliverables</span>
                </span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProject())}
                  placeholder="Add project title or link..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={addProject}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-future-indigo hover:bg-indigo-500 text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-xs">
                {projects.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                  >
                    <span className="text-slate-300 truncate pr-2">{p}</span>
                    <button
                      type="button"
                      onClick={() => removeProject(p)}
                      className="text-slate-400 hover:text-rose-400 shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
