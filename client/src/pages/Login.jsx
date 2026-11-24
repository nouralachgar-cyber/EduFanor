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

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result?.success) {
        if (result?.code === 'INVALID_CREDENTIALS' || result?.status === 401) {
          setErrorMsg(t('auth.invalidCredentials'));
        } else if (result?.code === 'ACCOUNT_SUSPENDED') {
          setErrorMsg(t('auth.accountSuspended'));
        } else if (result?.code === 'API_NOT_CONFIGURED') {
          setErrorMsg(t('auth.serviceUnavailable'));
        } else if (result?.code === 'NETWORK_ERROR') {
          setErrorMsg(t('auth.networkError'));
        } else if (result?.code === 'INVALID_AUTH_RESPONSE') {
          setErrorMsg(t('auth.loginFailed'));
        } else if (result?.code === 'MISSING_TOKEN') {
          setErrorMsg(t('auth.loginFailed'));
        } else if (result?.code === 'INVALID_ROLE') {
          setErrorMsg(t('auth.loginFailed'));
        } else if (result?.status >= 500) {
          setErrorMsg(t('auth.serverError'));
        } else {
          setErrorMsg(result?.message || t('auth.loginFailed'));
        }
        return;
      }

      navigate(result.user.role === 'admin' ? '/admin' : '/dashboard', {
        replace: true,
      });
    } catch {
      setErrorMsg(t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="px-6 sm:p-8 lg:p-8">
        <div className="mb-6">
          <span className="chip bg-softLavender text-plumdeep">
            <ShieldCheck className="h-3.5 w-3.5" />
            {isAr ? 'مرحباً بعودتك' : 'Welcome back'}
          </span>
          <h1 className="mt-3 font-display font-semibold tracking-tight text-plumdeep">
            {t('auth.loginTitle')}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-plumLightMuted">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-plumLight/30 bg-softLavender p-4 font-inter text-base font-bold text-plumdeep"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="label">
              <Mail className="h-3.5 w-3.5 text-lavender" />
              <span>{t('auth.email')}</span>
            </label>
            <div className="relative">
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="noura@edufanor.com"
                className={`input pl-12`}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className={`absolute top-1/2 -translate-y-1/2 left-3 p-1.5 text-plumLightMuted transition-colors hover:text-plumdeep`}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="label">
              <Lock className="h-3.5 w-3.5 text-lavender" />
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
                className={`input pl-12`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-plumLight/30 border-t-plumdeep" />
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

        <div className="mt-6 border-t border-plumLight/30 pt-4 text-center font-inter text-[13px] text-plumLightMuted">
          {t('auth.noAccount')} {' '}
          <Link to="/register" className="font-extrabold text-lavender hover:text-softLavender">
            {t('auth.signUp')}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}