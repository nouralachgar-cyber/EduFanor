import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Lock, Mail, AlertCircle, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const highlights = [
    t('auth.point1'),
    t('auth.point2'),
    t('auth.point3'),
  ];

  return (
    <div className="min-h-screen bg-[#FCFAFF] dark:bg-[#17121D] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-16 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Card Container */}
        <div className="rounded-3xl bg-white dark:bg-[#21192B] border border-[#EDE6F5] dark:border-[#3B2B4C] p-6 sm:p-8 space-y-6 shadow-sm">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#49305D] text-white shadow-md">
              <ShieldAlert className="h-7 w-7 text-[#8A6BBE]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#49305D] dark:text-white">
                {t('auth.loginTitle')}
              </h2>
              <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5]">
                {t('auth.loginSubtitle')}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 font-bold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-bold text-[#49305D] dark:text-[#F8F4FC]">
                <Mail className="h-3.5 w-3.5 text-[#8A6BBE]" />
                <span>{t('auth.email')}</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className="w-full rounded-2xl border border-[#EDE6F5] dark:border-[#3B2B4C] bg-[#FCFAFF] dark:bg-[#17121D] px-4 py-3 text-xs font-semibold text-[#1F142E] dark:text-[#F8F4FC] outline-none focus:border-[#8A6BBE] transition-colors"
                dir="ltr"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-bold text-[#49305D] dark:text-[#F8F4FC]">
                <Lock className="h-3.5 w-3.5 text-[#8A6BBE]" />
                <span>{t('auth.password')}</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className={`w-full rounded-2xl border border-[#EDE6F5] dark:border-[#3B2B4C] bg-[#FCFAFF] dark:bg-[#17121D] px-4 py-3 text-xs font-semibold text-[#1F142E] dark:text-[#F8F4FC] outline-none focus:border-[#8A6BBE] transition-colors ${isAr ? 'pl-11' : 'pr-11'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 p-1 text-[#6B5E7C] dark:text-[#C9BED5] hover:text-[#49305D] dark:hover:text-white transition-colors cursor-pointer ${isAr ? 'left-3' : 'right-3'}`}
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-[#49305D] hover:bg-[#39244A] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('auth.loggingIn')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t('auth.loginBtn')}
                  {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </span>
              )}
            </button>
          </form>

          {/* Footer Link to Register */}
          <div className="text-center text-xs text-[#6B5E7C] dark:text-[#C9BED5]">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-[#8A6BBE] font-black hover:underline">
              {t('auth.signUp')}
            </Link>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-6 space-y-2 px-2">
          {highlights.map((point, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-[#6B5E7C] dark:text-[#C9BED5] font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#8A6BBE] shrink-0" />
              <span>{point}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}