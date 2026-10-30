import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-primary"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  // إذا ما كانش مسجل الدخول، توجيه لصفحة تسجيل الدخول
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin pages also require a server-issued session. The backend re-checks every admin API call.
  if (requireAdmin && (user.role !== 'admin' || user.legacy || !localStorage.getItem('edu_token'))) {
    return <Navigate to={user.role === 'admin' ? '/login' : '/dashboard'} replace />;
  }

  return children;
}