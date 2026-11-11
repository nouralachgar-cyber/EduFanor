import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin }) {
  const { user, loading } = useContext(AuthContext);

  // قائمة الإيميلات المعتمدة كـ Admin
  const ADMIN_EMAILS = ['noura@edufanor.com', 'nlachgar12@gmail.com'];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#CBAEB1] border-t-[#642D3D]" />
      </div>
    );
  }

  // إذا لم يكن مسجلاً للدخول إطلاقاً
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // تحقق حماية الأدمن
  if (requireAdmin) {
    const isAdmin = user.role === 'admin' || ADMIN_EMAILS.includes(user?.email?.toLowerCase());

    if (isAdmin) {
      return children;
    }

    // إذا لم يكن أدمن، يتم توجيهه لداشبورد الطلبة
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}