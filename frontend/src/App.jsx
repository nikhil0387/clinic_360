import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './LandingPage'
import PatientDashboard from './PatientDashboard'
import DoctorProfile from './DoctorProfile'
import DoctorDashboard from './DoctorDashboard'
import AdminDashboard from './AdminDashboard'
import SpecialistRegistry from './SpecialistRegistry'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/specialists" element={<SpecialistRegistry />} />
          <Route path="/doctor" element={<DoctorProfile />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Catch-all 404 Page */}
          <Route path="*" element={
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
              <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
              <h1 className="text-3xl font-headline font-extrabold text-slate-800 tracking-tight">Page Not Found</h1>
              <p className="text-slate-600 text-sm mt-2 max-w-sm">The clinic page you are looking for does not exist or has been moved.</p>
              <a href="/" className="mt-6 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm hover:bg-opacity-95 transition-all">
                Return to Home
              </a>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
