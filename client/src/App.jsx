import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PublicLandingPage from './pages/PublicLandingPage';
import Login from './pages/Login';
import About from './pages/About';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Lesson from './pages/Lesson';
import Settings from './pages/Settings';
import AITutor from './pages/AITutor';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* الواجهة العامة */}
        <Route path="/" element={<PublicLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />

        {/* مسار لوحة تحكم الأدمن (محمي حصرياً) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* المسارات المحمية الخاصة بالطلاب المسجلين */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
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

        {/* صفحة غير موجودة */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}