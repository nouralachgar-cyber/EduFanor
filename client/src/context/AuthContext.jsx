import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // تحميل بيانات المستخدم من localStorage عند فتح التطبيق
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('edu_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error parsing stored user data:', e);
      localStorage.removeItem('edu_user');
    } finally {
      setLoading(false);
    }
  }, []);

  // دالة تسجيل الدخول المحسنة مع حماية تامة للـ email
  const login = async (email, password) => {
    try {
      // التأكد أن الإيميل عبارة عن نص عاد نقدر نطبقو ليه trim
      const emailStr = typeof email === 'string' ? email : String(email || '');
      const cleanEmail = emailStr.trim().toLowerCase();
      
      const isAdmin = cleanEmail === 'noura@edufanor.com' || cleanEmail.includes('admin');

      const currentUser = {
        name: isAdmin ? 'Noura (Admin)' : (cleanEmail ? cleanEmail.split('@')[0] : 'المستخدم'),
        email: cleanEmail || 'student@edufanor.com',
        role: isAdmin ? 'admin' : 'user',
      };

      setUser(currentUser);
      localStorage.setItem('edu_user', JSON.stringify(currentUser));
      
      return { success: true, user: currentUser };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'حدث خطأ أثناء تسجيل الدخول',
      };
    }
  };

  // دالة إنشاء حساب جديد مع حماية تامة للـ email
  const register = async (name, email, password) => {
    try {
      const emailStr = typeof email === 'string' ? email : String(email || '');
      const cleanEmail = emailStr.trim().toLowerCase();
      
      const isAdmin = cleanEmail === 'noura@edufanor.com' || cleanEmail.includes('admin');

      const newUser = {
        name: name || (isAdmin ? 'Noura (Admin)' : 'مستخدم جديد'),
        email: cleanEmail || 'student@edufanor.com',
        role: isAdmin ? 'admin' : 'user',
      };

      setUser(newUser);
      localStorage.setItem('edu_user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: 'حدث خطأ أثناء إنشاء الحساب',
      };
    }
  };

  // دالة تسجيل الخروج
  const logout = () => {
    setUser(null);
    localStorage.removeItem('edu_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};