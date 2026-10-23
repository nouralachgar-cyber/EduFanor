import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAFF] dark:bg-[#17121D]">
        <div className="w-8 h-8 border-4 border-[#8A6BBE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // إذا ما كانش مسجل الدخول، توجيه لصفحة تسجيل الدخول
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // إذا كانت الصفحة كتحتاج أدمن والمستخدم ماشي أدمن، يديه لـ dashboard الطالب
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}