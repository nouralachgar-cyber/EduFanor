import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, AlertCircle, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, Info } from '../components/icons';
import { AuthContext } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

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

  // قائمة الإيميلات المعتمدة للأدمن (الرسمي + الاحتياطي)
  const ADMIN_EMAILS = ['noura@edufanor.com', 'nlachgar12@gmail.com'];

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. محاولة تسجيل الدخول عبر الـ Backend العادي
      const result = await login(email, password);
      setLoading(false);

      if (result && result.success) {
        const userObj = result.user || {};
        const isAdmin = userObj.role === 'admin' || ADMIN_EMAILS.includes(cleanEmail);

        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
        return;
      }
    } catch (err) {
      console.warn("Backend login failed, using presentation fallback...", err);
    }

    setLoading(false);

    // 2. خطة الأمان للبريزونطاسيو (إذا كان السيرفر متوقف):
    if (ADMIN_EMAILS.includes(cleanEmail)) {
      localStorage.setItem('user', JSON.stringify({ 
        name: 'Noura Lachgar', 
        email: cleanEmail, 
        role: 'admin' 
      }));
      navigate('/admin', { replace: true });
      return;
    }

    setErrorMsg(t('auth.invalidCredentials', 'Invalid email or password. Please try again.'));
  };

  return (
    <AuthLayout>
      <div className="card p-6 shadow-pop sm:p-8">
        <div className="mb-6">
          <span className="chip bg-brand-soft text-brand-ink">
            <ShieldCheck className="h-3.5 w-3.5" />
            {isAr ? 'مرحباً بعودتك' : 'Welcome back'}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
            {t('auth.loginTitle')}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t('auth.loginSubtitle')}</p>
        </div>

        {errorMsg && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-danger/25 bg-danger-soft p-3.5 text-xs font-bold text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="label">
              <Mail className="h-3.5 w-3.5 text-brand-ink" />
              <span>{t('auth.email')}</span>
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="noura@edufanor.com"
              className="input"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="label">
              <Lock className="h-3.5 w-3.5 text-brand-ink" />
              <span>{t('auth.password')}</span>
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                className={`input ${isAr ? 'pe-11' : 'ps-11'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className={`absolute top-1/2 -translate-y-1/2 p-1.5 text-ink-muted transition-colors hover:text-ink ${
                  isAr ? 'left-2.5' : 'right-2.5'
                }`}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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

        <div className="mt-6 border-t border-line pt-4 text-center text-xs text-ink-muted">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-extrabold text-brand-ink hover:text-accent">
            {t('auth.signUp')}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}