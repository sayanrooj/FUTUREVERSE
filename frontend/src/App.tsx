import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth, type UserRole } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { WhatWeDoPage } from './pages/public/WhatWeDoPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AchievementsPage } from './pages/public/AchievementsPage';
import { EventsPage } from './pages/public/EventsPage';
import { CareersPage } from './pages/public/CareersPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { CandidateLoginPage } from './pages/auth/CandidateLoginPage';
import { CandidateRegisterPage } from './pages/auth/CandidateRegisterPage';
import { OwnerLoginPage } from './pages/auth/OwnerLoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

// Candidate Portal
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { CandidateProfilePage } from './pages/candidate/CandidateProfilePage';
import { CandidateApplicationsPage } from './pages/candidate/CandidateApplicationsPage';
import { CandidateSupportPage } from './pages/candidate/CandidateSupportPage';
import { SkillGapPage } from './pages/candidate/SkillGapPage';

// Owner / Recruiter Portal
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { JobRequirementBuilder } from './pages/owner/JobRequirementBuilder';
import { CandidateRankingPage } from './pages/owner/CandidateRankingPage';
import { CandidateInsightPage } from './pages/owner/CandidateInsightPage';

// Proctored Interview Session
import { AIInterviewRoom } from './pages/interview/AIInterviewRoom';

// Super Admin
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { OwnerManagementPage } from './pages/admin/OwnerManagementPage';
import { CMSManagerPage } from './pages/admin/CMSManagerPage';
import { AchievementsEventsManagerPage } from './pages/admin/AchievementsEventsManagerPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { AdminSupportPage } from './pages/admin/AdminSupportPage';

// Errors
import { NotFoundPage, ForbiddenPage } from './pages/errors/NotFoundPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({
  children,
  allowedRoles
}) => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-future-bg flex items-center justify-center text-slate-400">Verifying session...</div>;
  }

  if (!user) {
    return <Navigate to="/candidate-login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

// Main Layout Controller
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isInterviewRoom = location.pathname.startsWith('/interview/');

  return (
    <div className="flex flex-col min-h-screen bg-future-bg text-slate-100">
      {!isInterviewRoom && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isInterviewRoom && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Layout>
          <Routes>
            {/* Public Showcase Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/what-we-do" element={<WhatWeDoPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Authentication Routes */}
            <Route path="/candidate-login" element={<CandidateLoginPage />} />
            <Route path="/login" element={<Navigate to="/candidate-login" replace />} />
            <Route path="/register" element={<CandidateRegisterPage />} />
            <Route path="/owner-login" element={<OwnerLoginPage />} />
            <Route path="/recruiter-login" element={<Navigate to="/owner-login" replace />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
            <Route path="/admin/login" element={<Navigate to="/admin-login" replace />} />
            <Route path="/super-admin" element={<Navigate to="/admin-login" replace />} />

            {/* Candidate Protected Portal */}
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute allowedRoles={['CANDIDATE']}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/profile"
              element={
                <ProtectedRoute allowedRoles={['CANDIDATE']}>
                  <CandidateProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/applications"
              element={
                <ProtectedRoute allowedRoles={['CANDIDATE']}>
                  <CandidateApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/skill-gap/:jobId"
              element={
                <ProtectedRoute allowedRoles={['CANDIDATE']}>
                  <SkillGapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/support"
              element={
                <ProtectedRoute allowedRoles={['CANDIDATE']}>
                  <CandidateSupportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/support/:ticketId"
              element={
                <ProtectedRoute allowedRoles={['CANDIDATE']}>
                  <CandidateSupportPage />
                </ProtectedRoute>
              }
            />

            {/* Owner / Recruiter Protected Portal */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['OWNER', 'SUPER_ADMIN']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/jobs/create"
              element={
                <ProtectedRoute allowedRoles={['OWNER', 'SUPER_ADMIN']}>
                  <JobRequirementBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/candidates/:jobId"
              element={
                <ProtectedRoute allowedRoles={['OWNER', 'SUPER_ADMIN']}>
                  <CandidateRankingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/candidate-insight/:appId"
              element={
                <ProtectedRoute allowedRoles={['OWNER', 'SUPER_ADMIN']}>
                  <CandidateInsightPage />
                </ProtectedRoute>
              }
            />

            {/* Proctored Live Interview (Access guarded by unique token) */}
            <Route path="/interview/:token" element={<AIInterviewRoom />} />

            {/* Super Admin Protected Portal */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/owners"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <OwnerManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cms"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <CMSManagerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/achievements-events"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AchievementsEventsManagerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AuditLogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/support"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AdminSupportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/support/:ticketId"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AdminSupportPage />
                </ProtectedRoute>
              }
            />

            {/* Errors */}
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
