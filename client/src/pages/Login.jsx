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
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="card p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lift">
              <ShieldAlert className="h-7 w-7 text-teal" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-ink">
                {t('auth.loginTitle')}
              </h2>
              <p className="text-xs text-ink-muted">
                {t('auth.loginSubtitle')}
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 font-bold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="label">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>{t('auth.email')}</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                className="input"
                dir="ltr"
              />
            </div>

            <div className="space-y-1.5">
              <label className="label">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>{t('auth.password')}</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className={`input ${isAr ? 'pe-11' : 'ps-11'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink transition-colors ${isAr ? 'left-3' : 'right-3'}`}
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm"
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

          <div className="text-center text-xs text-ink-muted">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              {t('auth.signUp')}
            </Link>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-6 space-y-2">
          {highlights.map((point, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-ink-muted">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-deep shrink-0" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
