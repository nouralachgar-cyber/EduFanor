import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F5F2]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#C5B0CD] border-t-[#415E72]" />
      </div>
    );
  }

  // إذا لم يكن مسجلاً للدخول إطلاقاً
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // تحقق حماية الأدمن
  if (requireAdmin) {
    if (user.role === 'admin') return children;

    // إذا لم يكن أدمن، يتم توجيهه لداشبورد الطلبة
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}