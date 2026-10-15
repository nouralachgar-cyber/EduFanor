import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/courses');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-cream-darkCard p-8 rounded-3xl border border-cream dark:border-gray-800 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-burgundy flex items-center justify-center text-white shadow-md">
            <ShieldAlert className="w-6 h-6 text-medicalRed" />
          </div>
          <h2 className="text-3xl font-extrabold text-burgundy dark:text-cream">
            تسجيل الدخول إلى EduFanor
          </h2>
          <p className="text-sm text-gray-500">
            أدخل بيانات حسابك لمتابعة مسارك التعليمي
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-medicalRed/30 text-medicalRed text-sm flex items-center gap-2 font-medium">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 rtl:right-3 rtl:left-auto" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 rtl:right-3 rtl:left-auto" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-burgundy hover:bg-burgundy-hover text-white font-bold shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-burgundy dark:text-medicalRed font-bold hover:underline">
              سجل الآن
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}