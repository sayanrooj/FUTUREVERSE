const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? '/api'
    : 'https://futureverse-api.loca.lt/api');

export function getAuthToken(): string | null {
  return localStorage.getItem('futureverse_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('futureverse_token', token);
}

export function clearAuthToken() {
  localStorage.removeItem('futureverse_token');
  localStorage.removeItem('futureverse_user');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'Network request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  return response.json();
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
      const formData = new FormData();
      formData.append('file', file);
      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/candidate/resume/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Upload failed');
      }
      return res.json();
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
