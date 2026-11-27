
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import Landing from './components/landing/Landing'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Dashboard from './components/dashboard/Dashboard'
import Assessment from './components/assessment/Assessment'
import SkillGraph from './components/skillgraph/SkillGraph'
import Profile from './components/profile/profile'
import Roadmap from './components/roadmap/roadmap'
import OAuthCallback from './components/auth/OAuthCallback'


import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* GitHub OAuth callback */}
        <Route
          path="/oauth2/callback"
          element={<OAuthCallback />}
        />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/assessment" element={<Assessment />} />

        <Route path="/skills" element={<SkillGraph />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/roadmap" element={<Roadmap />} />
       

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
