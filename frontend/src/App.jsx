import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import './App.css';

// Lazy-loaded route components for fast initial load & dynamic code-splitting
const Landing = lazy(() => import('./components/landing/Landing'));
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/Signup'));
const OAuthCallback = lazy(() => import('./components/auth/OAuthCallback'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Assessment = lazy(() => import('./components/assessment/Assessment'));
const SkillGraph = lazy(() => import('./components/skillgraph/SkillGraph'));
const Profile = lazy(() => import('./components/profile/profile'));
const Roadmap = lazy(() => import('./components/roadmap/roadmap'));
const MilestoneAssessment = lazy(() => import('./components/assessment/MilestoneAssessment'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-3 border-violet-600 border-t-transparent" />
        <span className="text-sm font-medium text-slate-500">Loading page...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public standalone pages (landing & auth) */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />

          {/* Application pages sharing the persistent Navbar via AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/skills" element={<SkillGraph />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/MilestoneAssessment" element={<MilestoneAssessment />} />
            <Route path="/milestone-assessment/:skillId" element={<MilestoneAssessment />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
