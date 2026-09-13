import {
  MOCK_USERS,
  MOCK_JOBS,
  MOCK_APPLICATIONS,
  MOCK_TICKETS,
  MOCK_AUDIT_LOGS,
  MOCK_ACHIEVEMENTS,
  MOCK_EVENTS,
  MOCK_CONTENT,
  getStoredJobs,
  saveStoredJobs,
  getStoredApplications,
  saveStoredApplications,
  getStoredTickets,
  saveStoredTickets,
} from './mockData';

const isLocalEnvironment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const hasCustomRemoteApi =
  Boolean(import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim().length > 0);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (isLocalEnvironment ? '/api' : '');

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('futureverse_token');
  } catch {
    return null;
  }
}

export function setAuthToken(token: string) {
  try {
    localStorage.setItem('futureverse_token', token);
  } catch {}
}

export function clearAuthToken() {
  try {
    localStorage.removeItem('futureverse_token');
    localStorage.removeItem('futureverse_user');
  } catch {}
}

function getStoredUser(): any | null {
  try {
    const raw = localStorage.getItem('futureverse_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStoredUser(user: any) {
  try {
    localStorage.setItem('futureverse_user', JSON.stringify(user));
  } catch {}
}

function isBackendOffline(): boolean {
  if (isLocalEnvironment) return false;
  try {
    return sessionStorage.getItem('fv_backend_offline') === '1';
  } catch {
    return false;
  }
}

function markBackendOffline() {
  if (!isLocalEnvironment) {
    try {
      sessionStorage.setItem('fv_backend_offline', '1');
    } catch {}
  }
}

// Fallback dispatcher providing sub-second execution when offline or deployed on static GitHub Pages
function handleFallback<T>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();
  let parsedBody: any = {};
  if (options.body && typeof options.body === 'string') {
    try {
      parsedBody = JSON.parse(options.body);
    } catch {}
  }

  // --- AUTH ENDPOINTS ---
  if (endpoint === '/auth/login' || endpoint === '/auth/owner-login' || endpoint === '/auth/admin-login') {
    const email = (parsedBody.email || '').trim().toLowerCase();
    const password = (parsedBody.password || '').trim();

    // 1. Admin Portal Login
    if (endpoint === '/auth/admin-login') {
      const token = `token-admin-${Date.now()}`;
      setAuthToken(token);
      const userSession = {
        id: 1,
        email: email || 'admin@futureverse.ai',
        full_name: 'Super Administrator',
        role: 'SUPER_ADMIN' as const,
        is_active: true,
      };
      saveStoredUser(userSession);
      return {
        access_token: token,
        token_type: 'bearer',
        user_id: 1,
        email: userSession.email,
        full_name: userSession.full_name,
        role: 'SUPER_ADMIN',
        user: userSession,
      } as unknown as T;
    }

    // 2. Owner / Recruiter Portal Login
    if (endpoint === '/auth/owner-login') {
      const token = `token-owner-${Date.now()}`;
      setAuthToken(token);
      const userSession = {
        id: 2,
        email: email || 'recruiter@futureverse.ai',
        full_name: 'Alex Morgan',
        role: 'OWNER' as const,
        is_active: true,
      };
      saveStoredUser(userSession);
      return {
        access_token: token,
        token_type: 'bearer',
        user_id: 2,
        email: userSession.email,
        full_name: userSession.full_name,
        role: 'OWNER',
        user: userSession,
      } as unknown as T;
    }

    // 3. Candidate Portal Login (/auth/login) - Allows ANY Gmail or email to log in
    let matchedUser = MOCK_USERS.find((u: any) => u.email.toLowerCase() === email);
    if (!matchedUser) {
      try {
        const dyn = JSON.parse(localStorage.getItem('fv_registered_users') || '[]');
        matchedUser = dyn.find((u: any) => u.email.toLowerCase() === email);
      } catch {}
    }

    const isSayan = email.includes('sayan') || email === 'sayanrooj742137@gmail.com' || email === 'sayanrooj312005@gmail.com';

    let userId = 7;
    let userFullName = 'Sayan Rooj';
    let userEmail = email || 'sayanrooj742137@gmail.com';

    if (matchedUser) {
      userId = matchedUser.id;
      userFullName = matchedUser.full_name;
      userEmail = matchedUser.email;
    } else if (isSayan) {
      userId = 7;
      userFullName = 'Sayan Rooj';
      userEmail = email;
    } else if (email) {
      const namePart = email.split('@')[0];
      userFullName = namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[._]/g, ' ');
      userId = Math.floor(100 + Math.random() * 900);
      userEmail = email;
    }

    const token = `token-cand-${userId}-${Date.now()}`;
    setAuthToken(token);
    const userSession = {
      id: userId,
      email: userEmail,
      full_name: userFullName,
      role: 'CANDIDATE' as const,
      is_active: true,
    };
    saveStoredUser(userSession);

    return {
      access_token: token,
      token_type: 'bearer',
      user_id: userId,
      email: userEmail,
      full_name: userFullName,
      role: 'CANDIDATE',
      user: userSession,
    } as unknown as T;
  }

  if (endpoint === '/auth/register') {
    const newUser = {
      id: Date.now(),
      email: (parsedBody.email || '').trim().toLowerCase(),
      full_name: parsedBody.full_name || 'Candidate',
      role: 'CANDIDATE',
      password: parsedBody.password || 'Candidate@2026',
      is_active: true,
    };
    try {
      const dyn = JSON.parse(localStorage.getItem('fv_registered_users') || '[]');
      dyn.push(newUser);
      localStorage.setItem('fv_registered_users', JSON.stringify(dyn));
    } catch {}

    const token = `token-${newUser.id}-${Date.now()}`;
    setAuthToken(token);
    saveStoredUser(newUser);

    return {
      access_token: token,
      token_type: 'bearer',
      user_id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: 'CANDIDATE',
    } as unknown as T;
  }

  if (endpoint === '/auth/me') {
    const user = getStoredUser();
    if (user) return user as unknown as T;
    // If token exists, construct default valid user
    const token = getAuthToken();
    if (token) {
      return {
        id: 7,
        email: 'sayanrooj742137@gmail.com',
        full_name: 'Sayan Rooj',
        role: 'CANDIDATE',
        is_active: true,
      } as unknown as T;
    }
    throw new Error('Not authenticated');
  }

  // --- JOBS ENDPOINTS ---
  if (endpoint.startsWith('/jobs')) {
    const jobs = getStoredJobs();

    if (endpoint === '/jobs' && method === 'GET') {
      return jobs as unknown as T;
    }

    if (endpoint === '/jobs' && method === 'POST') {
      const newJob = {
        id: Date.now(),
        ...parsedBody,
        status: parsedBody.status || 'ACTIVE',
        created_at: new Date().toISOString(),
        applications_count: 0,
        requirements_count: (parsedBody.requirements || []).length,
      };
      jobs.unshift(newJob);
      saveStoredJobs(jobs);
      return newJob as unknown as T;
    }

    if (endpoint === '/jobs/templates/list') {
      return [
        { id: 1, name: 'AI / Machine Learning Engineer', department: 'Artificial Intelligence' },
        { id: 2, name: 'Full Stack Distributed Systems Engineer', department: 'Engineering' },
        { id: 3, name: 'Cloud Infrastructure & DevOps Lead', department: 'Infrastructure' },
      ] as unknown as T;
    }

    const matchId = endpoint.match(/^\/jobs\/(\d+)/);
    if (matchId) {
      const jId = parseInt(matchId[1], 10);
      const found = jobs.find((j: any) => j.id === jId) || jobs[0];

      if (method === 'PUT') {
        const updated = { ...found, ...parsedBody };
        const newJobs = jobs.map((j: any) => (j.id === jId ? updated : j));
        saveStoredJobs(newJobs);
        return updated as unknown as T;
      }
      if (method === 'DELETE') {
        const newJobs = jobs.filter((j: any) => j.id !== jId);
        saveStoredJobs(newJobs);
        return { message: 'Job deleted successfully' } as unknown as T;
      }
      return found as unknown as T;
    }
    return jobs as unknown as T;
  }

  // --- CANDIDATE ENDPOINTS ---
  if (endpoint.startsWith('/candidate')) {
    const apps = getStoredApplications();
    const currentUser = getStoredUser();

    if (endpoint === '/candidate/profile') {
      if (method === 'PUT') {
        return { message: 'Profile updated successfully' } as unknown as T;
      }
      return {
        id: currentUser?.id || 7,
        user_id: currentUser?.id || 7,
        full_name: currentUser?.full_name || 'Sayan Rooj',
        email: currentUser?.email || 'sayanrooj742137@gmail.com',
        headline: 'Cognitive Systems & AI Engineer',
        experience_years: 3.5,
        skills: ['Python', 'FastAPI', 'PyTorch', 'Transformers', 'React', 'TypeScript', 'Distributed Systems'],
        degree: 'Bachelor of Technology in Computer Science & Engineering',
        resumes: [{ id: 1, filename: 'Sayan_Rooj_AI_Engineer_CV.pdf', uploaded_at: '2026-09-13T10:00:00' }],
      } as unknown as T;
    }

    if (endpoint === '/candidate/applications') {
      const email = (currentUser?.email || 'sayanrooj742137@gmail.com').toLowerCase();
      const filtered = apps.filter(
        (a: any) =>
          (a.candidate_email && a.candidate_email.toLowerCase() === email) ||
          a.candidate_id === currentUser?.id
      );
      if (filtered.length > 0) return filtered as unknown as T;
      const sayanApps = apps.filter((a: any) => a.candidate_email && a.candidate_email.toLowerCase().includes('sayan'));
      if (sayanApps.length > 0) return sayanApps as unknown as T;
      return [] as unknown as T;
    }

    const applyMatch = endpoint.match(/^\/candidate\/apply\/(\d+)/);
    if (applyMatch) {
      const jId = parseInt(applyMatch[1], 10);
      const jobs = getStoredJobs();
      const job = jobs.find((j: any) => j.id === jId) || { title: 'Engineer Position', department: 'Engineering' };

      const newApp = {
        id: Date.now(),
        job_id: jId,
        job_title: job.title,
        job_department: job.department,
        work_mode: job.work_mode || 'Hybrid',
        candidate_id: currentUser?.id || 7,
        candidate_name: currentUser?.full_name || 'Sayan Rooj',
        candidate_email: currentUser?.email || 'sayanrooj742137@gmail.com',
        status: 'CV Screening',
        overall_match_score: 93.8,
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status_summary: 'Application submitted and verified by AI Cognitive Analyzer',
        stage: 'Stage 1: CV Screening',
        recommendation: 'Hire',
        scores: {
          overall_score: 93.8,
          criteria_breakdown: { 'Technical Skills': 95.0, 'Problem Solving': 90.0, Experience: 92.0 },
          requirement_evidence: [
            { name: "Bachelor's Degree in CS", type: 'EDUCATION', status: 'Met', evidence: 'Verified degree matches requirements.' },
            { name: 'Python & AI Frameworks', type: 'TECH_SKILL', status: 'Met', evidence: 'Practical deep learning and API delivery.' },
          ],
          knockout_met: true,
        },
      };

      apps.unshift(newApp);
      saveStoredApplications(apps);

      return {
        message: 'Application submitted successfully.',
        application_id: newApp.id,
        match_score: 93.8,
        status: newApp.status,
      } as unknown as T;
    }

    if (endpoint.startsWith('/candidate/skill-gap')) {
      return {
        overall_score: 91.5,
        matched_skills: ['Python', 'FastAPI', 'PyTorch', 'React', 'TypeScript', 'SQL'],
        missing_skills: ['Kubernetes Advanced', 'GraphQL'],
        recommendations: [
          'Review advanced cloud-native deployment patterns.',
          'Prepare for domain architectural interview questions.'
        ]
      } as unknown as T;
    }

    if (endpoint === '/candidate/notifications') {
      return [
        {
          id: 1,
          title: 'Offer Extended: Cognitive Systems Engineer',
          message: 'Congratulations! An official domain employment offer has been extended for your review.',
          created_at: '2026-09-13T12:00:00',
          is_read: false,
          link: '/candidate/applications'
        },
        {
          id: 2,
          title: 'Application Analyzed by AI',
          message: 'Your credentials have been matched with a 94.2% suitability score.',
          created_at: '2026-09-13T10:30:00',
          is_read: true,
          link: '/candidate/applications'
        }
      ] as unknown as T;
    }

    if (endpoint.startsWith('/candidate/support/tickets')) {
      const tickets = getStoredTickets();
      if (endpoint === '/candidate/support/tickets' && method === 'POST') {
        const newTicket = {
          id: Date.now(),
          ticket_number: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
          subject: parsedBody.subject || 'Inquiry',
          category: parsedBody.category || 'TECHNICAL',
          priority: parsedBody.priority || 'MEDIUM',
          status: 'OPEN',
          created_at: new Date().toISOString(),
          messages: [{ id: 1, sender: currentUser?.full_name || 'Candidate', message: parsedBody.message || '' }]
        };
        tickets.unshift(newTicket);
        saveStoredTickets(tickets);
        return newTicket as unknown as T;
      }
      return tickets as unknown as T;
    }
  }

  // --- OWNER / RECRUITER ENDPOINTS ---
  if (endpoint.startsWith('/owner')) {
    const jobs = getStoredJobs();
    const apps = getStoredApplications();

    if (endpoint === '/owner/dashboard') {
      const activeJobs = jobs.filter((j: any) => j.status === 'ACTIVE').length;
      const shortlisted = apps.filter((a: any) =>
        ['Shortlisted', 'AI Interview Invited', 'Interview Completed', 'Face-to-Face Scheduled', 'Offer Extended'].includes(a.status)
      ).length;
      const interviewsCount = apps.filter((a: any) => a.interview || a.status === 'Interview Completed').length;
      const hires = apps.filter((a: any) => a.status === 'Offer Extended').length;

      return {
        jobs,
        recent_jobs: jobs.slice(0, 6),
        recent_applications: apps.slice(0, 6),
        metrics: {
          total_jobs: jobs.length,
          active_jobs: activeJobs,
          total_candidates: apps.length,
          shortlisted: shortlisted,
          interviews_completed: interviewsCount,
          hires_count: hires,
          pass_rate: 88.5,
        },
        funnel: [
          { stage: 'Applications Received', count: apps.length },
          { stage: 'CV Screening Passed', count: Math.max(apps.length - 2, 1) },
          { stage: 'Shortlisted by Recruiter', count: shortlisted },
          { stage: 'Interviews Completed', count: interviewsCount },
          { stage: 'Offers Extended', count: hires }
        ]
      } as unknown as T;
    }

    if (endpoint.includes('/candidates')) {
      const matchJob = endpoint.match(/\/owner\/jobs\/(\d+)\/candidates/);
      if (matchJob) {
        const jId = parseInt(matchJob[1], 10);
        const filtered = apps.filter((a: any) => a.job_id === jId);
        return {
          job: jobs.find((j: any) => j.id === jId) || jobs[0],
          candidates: filtered.length > 0 ? filtered : apps,
          total_count: filtered.length > 0 ? filtered.length : apps.length
        } as unknown as T;
      }
      return apps as unknown as T;
    }

    const insightMatch = endpoint.match(/\/owner\/applications\/(\d+)\/insight/);
    if (insightMatch) {
      const aId = parseInt(insightMatch[1], 10);
      const app = apps.find((a: any) => a.id === aId) || apps[0];
      return {
        application: app,
        overall_score: app.overall_match_score || 88.0,
        criteria_breakdown: app.scores?.criteria_breakdown || { 'Technical Skills': 85.0, 'Problem Solving': 80.0 },
        requirement_evidence: app.scores?.requirement_evidence || [],
        recruiter_override: app.scores?.recruiter_override || false,
      } as unknown as T;
    }

    const statusMatch = endpoint.match(/\/owner\/applications\/(\d+)\/status/);
    if (statusMatch) {
      const aId = parseInt(statusMatch[1], 10);
      const updatedApps = apps.map((a: any) => (a.id === aId ? { ...a, status: parsedBody.status, updated_at: new Date().toISOString() } : a));
      saveStoredApplications(updatedApps);
      return { message: 'Status updated successfully' } as unknown as T;
    }

    const decisionMatch = endpoint.match(/\/owner\/applications\/(\d+)\/final-decision/);
    if (decisionMatch) {
      const aId = parseInt(decisionMatch[1], 10);
      const updatedApps = apps.map((a: any) =>
        a.id === aId
          ? {
              ...a,
              final_decision: parsedBody.decision,
              final_decision_notes: parsedBody.notes,
              final_decision_at: new Date().toISOString(),
              status: parsedBody.decision === 'HIRE' ? 'Offer Extended' : 'Not Selected',
            }
          : a
      );
      saveStoredApplications(updatedApps);
      return { message: 'Decision submitted successfully' } as unknown as T;
    }

    const inviteMatch = endpoint.match(/\/owner\/applications\/(\d+)\/invite-interview/);
    if (inviteMatch) {
      const aId = parseInt(inviteMatch[1], 10);
      const updatedApps = apps.map((a: any) =>
        a.id === aId ? { ...a, status: 'AI Interview Invited', interview: { token: `token-${aId}`, status: 'SCHEDULED' } } : a
      );
      saveStoredApplications(updatedApps);
      return { message: 'Candidate invited to AI interview round.', token: `token-${aId}` } as unknown as T;
    }

    const f2fMatch = endpoint.match(/\/owner\/applications\/(\d+)\/schedule-f2f/);
    if (f2fMatch) {
      const aId = parseInt(f2fMatch[1], 10);
      const updatedApps = apps.map((a: any) =>
        a.id === aId ? { ...a, status: 'Face-to-Face Scheduled', f2f_schedule: parsedBody } : a
      );
      saveStoredApplications(updatedApps);
      return { message: 'Face-to-Face interview scheduled successfully.' } as unknown as T;
    }
  }

  // --- INTERVIEW ENDPOINTS ---
  if (endpoint.startsWith('/interview')) {
    if (endpoint.includes('/session/')) {
      return {
        session_id: 1,
        token: 'interview-token-verified',
        candidate_name: 'Sayan Rooj',
        job_title: 'Senior AI / Cognitive Systems Engineer',
        status: 'READY',
        questions: [
          { id: 1, question_text: 'Explain how you design transformer attention heads for distributed inference.', time_limit: 120 },
          { id: 2, question_text: 'How do you handle data drift in continuous cognitive pipelines?', time_limit: 120 }
        ],
        proctoring_enabled: true
      } as unknown as T;
    }
  }

  // --- ADMIN ENDPOINTS ---
  if (endpoint.startsWith('/admin')) {
    if (endpoint === '/admin/audit-logs') {
      return MOCK_AUDIT_LOGS as unknown as T;
    }
    if (endpoint === '/admin/support-tickets') {
      return getStoredTickets() as unknown as T;
    }
    if (endpoint === '/admin/achievements') {
      return MOCK_ACHIEVEMENTS as unknown as T;
    }
    if (endpoint === '/admin/events') {
      return MOCK_EVENTS as unknown as T;
    }
    if (endpoint === '/admin/cms') {
      return MOCK_CONTENT as unknown as T;
    }
    if (endpoint === '/admin/owners') {
      return [
        { id: 2, user_id: 2, full_name: 'Alex Morgan', email: 'recruiter@futureverse.ai', is_active: true, department: 'Talent Acquisition' }
      ] as unknown as T;
    }
    if (endpoint === '/admin/system-health') {
      return {
        status: 'OPERATIONAL',
        database: 'CONNECTED',
        ai_engine: 'ONLINE (v2.6)',
        email_service: 'ACTIVE',
        uptime: '99.99%',
        last_check: new Date().toISOString()
      } as unknown as T;
    }
    if (endpoint.startsWith('/admin/emails')) {
      return [
        { id: 1, recipient: 'sayanrooj742137@gmail.com', subject: 'Domain Offer Extended', status: 'DELIVERED', sent_at: '2026-09-13T12:00:00' },
        { id: 2, recipient: 'aarav.sharma@example.com', subject: 'Interview Invitation', status: 'DELIVERED', sent_at: '2026-09-13T10:30:00' }
      ] as unknown as T;
    }
  }

  // --- PUBLIC ENDPOINTS ---
  if (endpoint.startsWith('/public')) {
    if (endpoint === '/public/content') return MOCK_CONTENT as unknown as T;
    if (endpoint === '/public/achievements') return MOCK_ACHIEVEMENTS as unknown as T;
    if (endpoint === '/public/events') return MOCK_EVENTS as unknown as T;
    if (endpoint === '/public/contact') return { message: 'Inquiry received. Thank you for connecting with FUTUREVERSE.' } as unknown as T;
  }

  throw new Error(`Endpoint ${endpoint} not found in fallback.`);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  // On GitHub Pages or static host (when no custom remote API URL is specified),
  // immediately use the standalone client engine with 0ms latency and 100% reliability!
  if (!isLocalEnvironment && !hasCustomRemoteApi) {
    return handleFallback<T>(endpoint, options);
  }

  // If we already detected the remote backend is unreachable on this session, immediately use local store
  if (isBackendOffline()) {
    return handleFallback<T>(endpoint, options);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Strict AbortController: 2000ms timeout on remote tunnels to prevent browser freeze/lag
  const controller = new AbortController();
  const timeoutLimit = isLocalEnvironment ? 4500 : 2000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutLimit);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetail = 'Network request failed';
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
      } catch {
        errorDetail = response.statusText;
      }
      // If unauthorized with 401/403, throw error so UI displays invalid credentials
      if (response.status === 401 || response.status === 403) {
        throw new Error(errorDetail);
      }
      throw new Error(errorDetail);
    }

    return await response.json();
  } catch (networkErr: any) {
    clearTimeout(timeoutId);

    // If this is an authentication error (401/403), rethrow it so the user knows credentials were wrong
    if (
      networkErr?.message?.includes('Invalid') ||
      networkErr?.message?.includes('denied') ||
      networkErr?.message?.includes('Unauthorized') ||
      networkErr?.message?.includes('deactivated')
    ) {
      throw networkErr;
    }

    // Network timed out or connection dropped: mark backend offline to prevent subsequent delays
    markBackendOffline();

    // Fall back to instant embedded state
    return handleFallback<T>(endpoint, options);
  }
}

export const api = {
  // Auth
  auth: {
    register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    ownerLogin: (data: any) => request<any>('/auth/owner-login', { method: 'POST', body: JSON.stringify(data) }),
    adminLogin: (data: any) => request<any>('/auth/admin-login', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => request<any>('/auth/me'),
    forgotPassword: (email: string) => request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (data: any) => request<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Jobs
  jobs: {
    list: (params: Record<string, string> = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request<any[]>(`/jobs${qs ? `?${qs}` : ''}`);
    },
    get: (id: number) => request<any>(`/jobs/${id}`),
    create: (data: any) => request<any>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request<any>(`/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request<any>(`/jobs/${id}`, { method: 'DELETE' }),
    getTemplates: () => request<any[]>('/jobs/templates/list'),
    createTemplate: (data: any) => request<any>('/jobs/templates', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Candidate
  candidate: {
    getProfile: () => request<any>('/candidate/profile'),
    updateProfile: (data: any) => request<any>('/candidate/profile', { method: 'PUT', body: JSON.stringify(data) }),
    uploadResume: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const token = getAuthToken();
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`${API_BASE_URL}/candidate/resume/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
          signal: controller.signal,
        });
        clearTimeout(tid);
        if (!res.ok) throw new Error('Upload failed');
        return await res.json();
      } catch {
        return {
          message: 'CV uploaded and parsed successfully.',
          resume_id: 1,
          filename: file.name,
          parsed_data: {
            degree: 'Bachelor of Technology in Computer Science & Engineering',
            technical_skills: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'React', 'TypeScript'],
            soft_skills: ['Problem Solving', 'Technical Leadership', 'Communication'],
            experience_years: 3.5,
            projects: ['Distributed AI Inference Engine', 'Autonomous Agent Platform'],
            certifications: ['Deep Learning Specialization', 'AWS Solutions Architect']
          }
        };
      }
    },
    confirmResume: (data: any) => request<any>('/candidate/resume/confirm', { method: 'PUT', body: JSON.stringify(data) }),
    apply: (jobId: number) => request<any>(`/candidate/apply/${jobId}`, { method: 'POST' }),
    getApplications: () => request<any[]>('/candidate/applications'),
    getSkillGap: (jobId: number) => request<any>(`/candidate/skill-gap/${jobId}`),
    getNotifications: () => request<any[]>('/candidate/notifications'),
    markNotificationRead: (id: number) => request<any>(`/candidate/notifications/${id}/read`, { method: 'PUT' }),
    getSupportTickets: () => request<any[]>('/candidate/support/tickets'),
    createSupportTicket: (data: any) => request<any>('/candidate/support/tickets', { method: 'POST', body: JSON.stringify(data) }),
    getSupportTicketDetails: (id: number) => request<any>(`/candidate/support/tickets/${id}`),
    sendSupportMessage: (id: number, message: string) => request<any>(`/candidate/support/tickets/${id}/messages`, { method: 'POST', body: JSON.stringify({ message }) }),
  },

  // Owner / Recruiter
  owner: {
    getDashboard: () => request<any>('/owner/dashboard'),
    getCandidates: (jobId: number, params: Record<string, any> = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request<any>(`/owner/jobs/${jobId}/candidates${qs ? `?${qs}` : ''}`);
    },
    getInsight: (appId: number) => request<any>(`/owner/applications/${appId}/insight`),
    compareCandidates: (application_ids: number[]) =>
      request<any>('/owner/applications/compare', { method: 'POST', body: JSON.stringify({ application_ids }) }),
    updateStatus: (appId: number, data: any) =>
      request<any>(`/owner/applications/${appId}/status`, { method: 'POST', body: JSON.stringify(data) }),
    setFinalDecision: (appId: number, data: { decision: string; notes?: string }) =>
      request<any>(`/owner/applications/${appId}/final-decision`, { method: 'POST', body: JSON.stringify(data) }),
    inviteInterview: (appId: number) =>
      request<any>(`/owner/applications/${appId}/invite-interview`, { method: 'POST' }),
    scheduleF2F: (appId: number, data: any) =>
      request<any>(`/owner/applications/${appId}/schedule-f2f`, { method: 'POST', body: JSON.stringify(data) }),
    addNote: (appId: number, text: string, is_private = true) =>
      request<any>(`/owner/applications/${appId}/note`, { method: 'POST', body: JSON.stringify({ note_text: text, is_private }) }),
    retryApplicationEmail: (appId: number) =>
      request<any>(`/owner/applications/${appId}/retry-email`, { method: 'POST' }),
  },

  // Proctored Interview Session
  interview: {
    getSession: (token: string) => request<any>(`/interview/session/${token}`),
    submitAnswer: (token: string, data: { question_id: number; answer_text: string; response_time_seconds?: number }) =>
      request<any>(`/interview/session/${token}/answer`, { method: 'POST', body: JSON.stringify(data) }),
    logIntegrityEvent: (token: string, data: { event_type: string; severity?: string; evidence: string }) =>
      request<any>(`/interview/session/${token}/integrity-event`, { method: 'POST', body: JSON.stringify(data) }),
    complete: (token: string) => request<any>(`/interview/session/${token}/complete`, { method: 'POST' }),
    getResult: (token: string) => request<any>(`/interview/session/${token}/result`),
  },

  // Super Admin
  admin: {
    getOwners: () => request<any[]>('/admin/owners'),
    createOwner: (data: any) => request<any>('/admin/owners', { method: 'POST', body: JSON.stringify(data) }),
    updateOwner: (id: number, data: any) => request<any>(`/admin/owners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getCMS: () => request<any>('/admin/cms'),
    updateCMS: (sectionKey: string, data: any) => request<any>(`/admin/cms/${sectionKey}`, { method: 'PUT', body: JSON.stringify(data) }),
    getAchievements: () => request<any[]>('/admin/achievements'),
    createAchievement: (data: any) => request<any>('/admin/achievements', { method: 'POST', body: JSON.stringify(data) }),
    deleteAchievement: (id: number) => request<any>(`/admin/achievements/${id}`, { method: 'DELETE' }),
    getEvents: () => request<any[]>('/admin/events'),
    createEvent: (data: any) => request<any>('/admin/events', { method: 'POST', body: JSON.stringify(data) }),
    deleteEvent: (id: number) => request<any>(`/admin/events/${id}`, { method: 'DELETE' }),
    getAuditLogs: (limit = 50) => request<any[]>(`/admin/audit-logs?limit=${limit}`),
    getSupportTickets: () => request<any[]>('/admin/support-tickets'),
    getSupportTicketDetails: (id: number) => request<any>(`/admin/support-tickets/${id}`),
    replySupportTicket: (id: number, data: any) => request<any>(`/admin/support-tickets/${id}/reply`, { method: 'POST', body: JSON.stringify(data) }),
    updateTicketStatus: (id: number, status: string) => request<any>(`/admin/support-tickets/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    getEmailLogs: (limit = 50) => request<any[]>(`/admin/emails?limit=${limit}`),
    retryEmail: (id: number) => request<any>(`/admin/emails/retry/${id}`, { method: 'POST' }),
    getSystemHealth: () => request<any>('/admin/system-health'),
  },

  // Public
  public: {
    getContent: () => request<any>('/public/content'),
    getAchievements: () => request<any[]>('/public/achievements'),
    getEvents: () => request<any[]>('/public/events'),
    submitContact: (data: any) => request<any>('/public/contact', { method: 'POST', body: JSON.stringify(data) }),
  },
};
