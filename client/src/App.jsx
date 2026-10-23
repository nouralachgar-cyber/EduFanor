import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLandingPage from './pages/PublicLandingPage';
import Login from './pages/Login';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Lesson from './pages/Lesson';
import Settings from './pages/Settings';
import Register from './pages/Register';
import AITutor from './pages/AITutor';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* الواجهة العامة */}
        <Route path="/" element={<PublicLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />

        {/* مسار لوحة تحكم الأدمن (محمي حصرياً لنورة noura@edufanor.com) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* المسارات المحمية الخاصة بالطلاب المسجلين فقط */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/courses" 
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lesson" 
          element={
            <ProtectedRoute>
              <Lesson />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/ai-tutor" 
          element={
            <ProtectedRoute>
              <AITutor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />

        {/* توجيه أي مسار آخر غير معروف إلى الصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}