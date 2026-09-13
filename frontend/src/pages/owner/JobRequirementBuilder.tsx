import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Briefcase,
  Layers,
  Save,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { api } from '../../services/api';

export const JobRequirementBuilder: React.FC = () => {
  const navigate = useNavigate();

  // Basic Information
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Artificial Intelligence & Data Science');
  const [category, setCategory] = useState('Machine Learning');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [employmentType, setEmploymentType] = useState('Full Time');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [location, setLocation] = useState('Bangalore, India');
  const [salaryRange, setSalaryRange] = useState('₹20,00,000 - ₹35,00,000 PA');
  const [openings, setOpenings] = useState(2);
  const [deadline, setDeadline] = useState('2026-12-31');

  // Education Requirements
  const [eduDegree, setEduDegree] = useState("Bachelor's Degree in Computer Science or related field");
  const [eduRequired, setEduRequired] = useState(true);
  const [eduWeight, setEduWeight] = useState(10.0);

  // Experience Requirements
  const [expYears, setExpYears] = useState(2.0);
  const [expRequired, setExpRequired] = useState(true);
  const [expWeight, setExpWeight] = useState(15.0);

  // Dynamic Technical Skills List
  const [techSkills, setTechSkills] = useState<any[]>([
    { name: 'Python', level: 'Advanced', is_required: true, weight: 20.0, is_knockout: true },
    { name: 'Machine Learning', level: 'Intermediate', is_required: true, weight: 15.0, is_knockout: false },
    { name: 'SQL', level: 'Intermediate', is_required: true, weight: 10.0, is_knockout: false }
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [newSkillRequired, setNewSkillRequired] = useState(true);
  const [newSkillWeight, setNewSkillWeight] = useState(10.0);
  const [newSkillKnockout, setNewSkillKnockout] = useState(false);

  // Soft Skills
  const [softSkills, setSoftSkills] = useState<any[]>([
    { name: 'Problem Solving', is_required: true, weight: 10.0 },
    { name: 'Communication', is_required: false, weight: 5.0 }
  ]);

  // Projects & Knowledge
  const [projectReq, setProjectReq] = useState('Practical Machine Learning / NLP Capstone Implementation');
  const [projectWeight, setProjectWeight] = useState(15.0);

  // Criteria Weight Manager (MUST EQUAL EXACTLY 100%)
  const [criteria, setCriteria] = useState<any[]>([
    { category_name: 'Technical Skills', weight_percentage: 30.0 },
    { category_name: 'Relevant Experience', weight_percentage: 15.0 },
    { category_name: 'Education', weight_percentage: 10.0 },
    { category_name: 'Projects', weight_percentage: 15.0 },
    { category_name: 'AI/ML Knowledge', weight_percentage: 10.0 },
    { category_name: 'Problem Solving', weight_percentage: 10.0 },
    { category_name: 'Communication', weight_percentage: 5.0 },
    { category_name: 'Role Relevance', weight_percentage: 5.0 }
  ]);

  // Scoring Thresholds
  const [minScoreThreshold, setMinScoreThreshold] = useState(70.0);
  const [techThreshold, setTechThreshold] = useState(60.0);
  const [problemThreshold, setProblemThreshold] = useState(60.0);

  // Recruiter Configurable AI Interview Round Questions
  const [aiQuestions, setAiQuestions] = useState<any[]>([
    {
      id: 1,
      question_text: 'Welcome to the AI interview round. Please introduce yourself and summarize your core technical experience that directly qualifies you for this position.',
      question_type: 'ROLE_SPECIFIC',
      target_skill: 'Technical Background',
      context_hint: 'Focus on proven experience, core technical stack, and passion for engineering excellence.'
    },
    {
      id: 2,
      question_text: 'Walk us through a critical production architecture you designed. What trade-offs did you make between performance, latency, and maintainability?',
      question_type: 'PROJECT_BASED',
      target_skill: 'System Architecture',
      context_hint: 'Highlight specific design decisions, technologies utilized, and measurable outcomes.'
    },
    {
      id: 3,
      question_text: 'Suppose an API or microservice begins experiencing intermittent 504 gateway timeouts and thread exhaustion under peak traffic. How would you systematically diagnose and resolve this?',
      question_type: 'PROBLEM_SOLVING',
      target_skill: 'Diagnostic Methodology',
      context_hint: 'Structure your systematic investigation from metrics and tracing to root cause mitigation.'
    },
    {
      id: 4,
      question_text: 'How do you establish rigorous test coverage, clean code standards, and automated CI/CD safeguards in a high-velocity engineering team?',
      question_type: 'TECHNICAL',
      target_skill: 'Software Quality & CI/CD',
      context_hint: 'Mention automated unit/integration testing, peer reviews, and deployment safeguards.'
    },
    {
      id: 5,
      question_text: 'Describe a challenging situation where a product requirement shifted right before a release deadline. How did you negotiate scope, align with stakeholders, and deliver value?',
      question_type: 'SCENARIO_BASED',
      target_skill: 'Communication & Adaptability',
      context_hint: 'Use the STAR method (Situation, Task, Action, Result).'
    }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('TECHNICAL');
  const [newQuestionTargetSkill, setNewQuestionTargetSkill] = useState('');
  const [newQuestionHint, setNewQuestionHint] = useState('');

  const addAiQuestion = () => {
    if (!newQuestionText.trim()) return;
    setAiQuestions([
      ...aiQuestions,
      {
        id: Date.now(),
        question_text: newQuestionText.trim(),
        question_type: newQuestionType,
        target_skill: newQuestionTargetSkill.trim() || 'Core Competency',
        context_hint: newQuestionHint.trim() || ''
      }
    ]);
    setNewQuestionText('');
    setNewQuestionTargetSkill('');
    setNewQuestionHint('');
  };

  const removeAiQuestion = (idx: number) => {
    setAiQuestions(aiQuestions.filter((_, i) => i !== idx));
  };

  // Templates
  const [templates, setTemplates] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    api.jobs.getTemplates()
      .then(res => setTemplates(res || []))
      .catch(() => {});
  }, []);

  // Compute Criteria Total
  const criteriaTotal = criteria.reduce((sum, c) => sum + (parseFloat(c.weight_percentage) || 0), 0);
  const isCriteriaValid = Math.abs(criteriaTotal - 100.0) < 0.1;

  const updateCriteriaWeight = (index: number, newWeight: number) => {
    const updated = [...criteria];
    updated[index].weight_percentage = newWeight;
    setCriteria(updated);
  };

  const addTechSkill = () => {
    if (!newSkillName.trim()) return;
    setTechSkills([
      ...techSkills,
      {
        name: newSkillName.trim(),
        level: newSkillLevel,
        is_required: newSkillRequired,
        weight: newSkillWeight,
        is_knockout: newSkillKnockout
      }
    ]);
    setNewSkillName('');
  };

  const removeTechSkill = (idx: number) => {
    setTechSkills(techSkills.filter((_, i) => i !== idx));
  };

  const applyTemplate = (template: any) => {
    if (template.criteria_json) {
      setCriteria(template.criteria_json);
    }
  };

  const handlePublishJob = async () => {
    if (!isCriteriaValid) {
      setValidationError(`Criteria Total must equal exactly 100%. Current total: ${criteriaTotal.toFixed(1)}%`);
      return;
    }
    if (!title.trim() || !description.trim()) {
      setValidationError('Job title and description are required.');
      return;
    }

    setSubmitting(true);
    setValidationError(null);

    // Build requirements payload
    const reqsPayload = [
      {
        type: 'EDUCATION',
        name: eduDegree,
        level: 'Degree',
        is_required: eduRequired,
        weight: eduWeight,
        is_knockout: eduRequired
      },
      {
        type: 'EXPERIENCE',
        name: `${expYears} years relevant experience`,
        level: `${expYears}+ yrs`,
        is_required: expRequired,
        weight: expWeight,
        is_knockout: expRequired
      },
      ...techSkills.map(s => ({
        type: 'TECH_SKILL',
        name: s.name,
        level: s.level,
        is_required: s.is_required,
        weight: s.weight,
        is_knockout: s.is_knockout
      })),
      ...softSkills.map(s => ({
        type: 'SOFT_SKILL',
        name: s.name,
        level: 'Professional',
        is_required: s.is_required,
        weight: s.weight,
        is_knockout: false
      })),
      {
        type: 'PROJECT',
        name: projectReq,
        level: 'Production Ready',
        is_required: true,
        weight: projectWeight,
        is_knockout: false
      }
    ];

    try {
      const created = await api.jobs.create({
        title,
        department,
        category,
        description,
        responsibilities,
        employment_type: employmentType,
        work_mode: workMode,
        location,
        salary_range: salaryRange,
        openings: parseInt(openings as any) || 1,
        deadline,
        status: 'ACTIVE',
        min_score_threshold: minScoreThreshold,
        category_thresholds: {
          'Technical Skills': techThreshold,
          'Problem Solving': problemThreshold,
          interview_questions: aiQuestions
        },
        requirements: reqsPayload,
        criteria
      });

      if (created?.id) {
        try {
          await api.owner.setJobInterviewQuestions(created.id, aiQuestions);
        } catch {}
      }

      navigate('/owner/dashboard');
    } catch (err: any) {
      setValidationError(err.message || 'Failed to publish job.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-future-bg text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-future-indigo">
              ADVANCED SPECIFICATION BUILDER
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Job Requirement & Criteria Builder
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Define what matters: configure skills, knockout requirements, and strict 100% criteria weights
            </p>
          </div>

          {/* Criteria Total Indicator Banner */}
          <div className="px-4 py-2 rounded-2xl glass-panel border flex items-center gap-3">
            <span className="text-xs text-slate-400">Criteria Total:</span>
            {isCriteriaValid ? (
              <span className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% ✓</span>
              </span>
            ) : (
              <span className="text-sm font-mono font-bold text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{criteriaTotal.toFixed(1)}% — {criteriaTotal < 100 ? `Add ${(100 - criteriaTotal).toFixed(1)}%` : `Reduce ${(criteriaTotal - 100).toFixed(1)}%`}</span>
              </span>
            )}
          </div>
        </div>

        {validationError && (
          <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Template Quick Selection */}
        {templates.length > 0 && (
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Pre-load Criteria Template:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700 hover:border-brand-500 text-slate-300 hover:text-white transition-colors"
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 1: BASIC DETAILS */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Briefcase className="w-4 h-4 text-brand-400" />
            <span>1. Basic Job Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Machine Learning Engineer"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Artificial Intelligence & Data Science"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Office Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bangalore, India"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Salary Range</label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="₹24,00,000 - ₹38,00,000 PA"
                className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Job Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the position, mission, and team culture..."
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Key Responsibilities</label>
            <textarea
              rows={3}
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="Core day-to-day deliverables and expectations..."
              className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* SECTION 2: EDUCATION & EXPERIENCE */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>2. Education & Experience Thresholds</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Education */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-white">Education Requirement</h3>
              <input
                type="text"
                value={eduDegree}
                onChange={(e) => setEduDegree(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={eduRequired}
                    onChange={(e) => setEduRequired(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-brand-500"
                  />
                  <span>Required (Knockout)</span>
                </label>
                <span>Weight: {eduWeight}%</span>
              </div>
            </div>

            {/* Experience */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-white">Experience Requirement</h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.5"
                  value={expYears}
                  onChange={(e) => setExpYears(parseFloat(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
                <span className="text-xs text-slate-300">Minimum Years of Experience</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={expRequired}
                    onChange={(e) => setExpRequired(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-brand-500"
                  />
                  <span>Required</span>
                </label>
                <span>Weight: {expWeight}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: TECHNICAL SKILLS BUILDER */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>3. Dynamic Technical Skills Builder</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {techSkills.length} configured
            </span>
          </div>

          {/* Add Skill Form */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Skill name (e.g. PyTorch)"
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <label className="flex items-center gap-1.5 text-slate-300">
                <input
                  type="checkbox"
                  checked={newSkillRequired}
                  onChange={(e) => setNewSkillRequired(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-brand-500"
                />
                <span>Required</span>
              </label>
              <label className="flex items-center gap-1.5 text-rose-400">
                <input
                  type="checkbox"
                  checked={newSkillKnockout}
                  onChange={(e) => setNewSkillKnockout(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-rose-500"
                />
                <span>Knockout</span>
              </label>
            </div>
            <button
              type="button"
              onClick={addTechSkill}
              className="w-full py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Configured Skills List */}
          <div className="space-y-2">
            {techSkills.map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white">{s.name}</span>
                  <span className="text-[11px] font-mono text-slate-400">({s.level})</span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      s.is_required
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                    }`}
                  >
                    {s.is_required ? 'Required' : 'Preferred'}
                  </span>
                  {s.is_knockout && (
                    <span className="text-[10px] font-mono text-rose-400 font-bold">
                      [Knockout Mandatory]
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-mono">Weight: {s.weight}%</span>
                  <button
                    type="button"
                    onClick={() => removeTechSkill(idx)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: CRITERIA WEIGHT MANAGER (MUST EQUAL 100%) */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-brand-500/40 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-400" />
                <span>4. Criteria Weight Manager</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The system strictly validates that the sum of criteria weights equals exactly 100%
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Total Criteria:</span>
              <div className={`text-lg font-mono font-bold ${isCriteriaValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                {criteriaTotal.toFixed(1)}% {isCriteriaValid ? '✓' : '⚠️'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {criteria.map((c, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{c.category_name}</span>
                  <span className="font-mono text-brand-400 font-bold">{c.weight_percentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={c.weight_percentage}
                  onChange={(e) => updateCriteriaWeight(idx, parseFloat(e.target.value) || 0)}
                  className="w-full accent-brand-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4.5: AI INTERVIEW ROUND QUESTION STUDIO */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-future-indigo/40 space-y-6 bg-gradient-to-b from-slate-900/40 to-future-surface/40">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <h2 className="text-base font-bold text-white">
                  5. AI Interview Round Questions (Custom Domain Round)
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Define the specific questions candidates will face in the AI proctored interview. Configure types, target competencies, and hints.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/30">
              {aiQuestions.length} Questions Configured
            </span>
          </div>

          {/* Existing Questions List */}
          <div className="space-y-3">
            {aiQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {q.question_type}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Skill: {q.target_skill}
                    </span>
                  </div>
                  <p className="text-xs text-white leading-relaxed font-medium">
                    {q.question_text}
                  </p>
                  {q.context_hint && (
                    <p className="text-[11px] text-slate-400 italic">
                      💡 Hint: {q.context_hint}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeAiQuestion(idx)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-all shrink-0"
                  title="Remove Question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Question Sub-form */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-brand-400" />
              <span>Add Custom AI Interview Question</span>
            </span>

            <textarea
              rows={2}
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g. Describe your methodology for orchestrating low-latency vector embeddings in production..."
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Question Category</label>
                <select
                  value={newQuestionType}
                  onChange={(e) => setNewQuestionType(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="TECHNICAL">Technical Deep Dive</option>
                  <option value="PROBLEM_SOLVING">Problem Solving & Debugging</option>
                  <option value="PROJECT_BASED">Architecture & Projects</option>
                  <option value="SCENARIO_BASED">Scenario & STAR Behavioral</option>
                  <option value="ROLE_SPECIFIC">Role Introduction & Culture</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Target Skill or Competency</label>
                <input
                  type="text"
                  value={newQuestionTargetSkill}
                  onChange={(e) => setNewQuestionTargetSkill(e.target.value)}
                  placeholder="e.g. System Design, PyTorch"
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Evaluation Hint for Candidate</label>
                <input
                  type="text"
                  value={newQuestionHint}
                  onChange={(e) => setNewQuestionHint(e.target.value)}
                  placeholder="e.g. Focus on scalability trade-offs"
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={addAiQuestion}
                disabled={!newQuestionText.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-all flex items-center gap-1.5 disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question to AI Round</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 5: THRESHOLDS & PUBLISH */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>5. Scoring Thresholds & Final Review</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="block text-slate-400 mb-1">Minimum Overall Screening Score</label>
              <input
                type="number"
                value={minScoreThreshold}
                onChange={(e) => setMinScoreThreshold(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Candidates below this are flagged</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="block text-slate-400 mb-1">Technical Skills Threshold (%)</label>
              <input
                type="number"
                value={techThreshold}
                onChange={(e) => setTechThreshold(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Minimum category requirement</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="block text-slate-400 mb-1">Problem Solving Threshold (%)</label>
              <input
                type="number"
                value={problemThreshold}
                onChange={(e) => setProblemThreshold(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Prevents weak critical category</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Total Requirements: <strong className="text-white">{techSkills.length + 3}</strong> • Criteria: <strong className="text-white">{isCriteriaValid ? '100% Valid ✓' : 'Invalid'}</strong>
            </div>

            <button
              onClick={handlePublishJob}
              disabled={submitting || !isCriteriaValid}
              className="px-8 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-future-indigo to-brand-600 hover:from-future-indigo/90 hover:to-brand-700 shadow-glow-indigo transition-all flex items-center gap-2 disabled:opacity-40"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Publishing Position...' : 'Publish Job Requirement'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
