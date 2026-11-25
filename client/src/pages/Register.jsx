import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Info,
  CheckCircle2,
  User,
} from '../components/icons';
import { AuthContext } from '../context/AuthContext';
import EduFanorWordmark from '../components/EduFanorWordmark';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <AuthLayout>
      <div className="flex min-h-screen flex-col items-start gap-6 px-4 sm:px-6 lg:px-8">
        {/* Left Hero Panel */}
        <div className="flex-1 flex items-center justify-center lg:order-1">
          <div className="relative w-full max-w-2xl">
            <div
              className="absolute inset-0 bg-gradient-to-b from-scrim/80 to-scrim/45 select-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_18%,var(--palette-highlight),transparent_52%),radial-gradient(ellipse_at_18%_85%,var(--palette-lavender),transparent_46%)] select-none"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 opacity-[0.16] select-none"
              style={{
                backgroundImage:
                  'radial-gradient(var(--palette-highlight) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
              aria-hidden="true"
            />
            <EduFanorWordmark
              className="absolute top-0 left-0 w-16 -translate-y-1/2 text-lavender"
            />
            <div className="relative z-10 text-center">
              <h1 className="mt-3 font-display font-semibold tracking-tight text-on-dark text-3xl sm:text-4xl">
                {t('auth.registerTitle')}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-on-dark/80 sm:text-base">
                {t('auth.registerSubtitle')}
              </p>
              <ul className="mt-6 space-y-3 max-w-sm mx-auto text-sm text-on-dark/85">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lavender" />
                  <span>Structured lessons</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lavender" />
                  <span>Short quizzes</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lavender" />
                  <span>Saved progress</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Auth Panel */}
        <div className="flex-1 w-full max-w-lg p-4 sm:p-6 lg:p-8 lg:order-2">
          <div className="rounded-xl border border-line bg-surface p-6">
            <span className="chip bg-highlight text-ink">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isAr ? 'ابدأ مسارك' : 'Start your path'}
            </span>
            <h1 className="mt-3 font-display font-semibold tracking-tight text-ink text-2xl sm:text-3xl">
              {t('auth.registerTitle')}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
              {t('auth.registerSubtitle')}
            </p>

            {errorMsg && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-line bg-negative-soft p-4 font-inter text-base font-bold text-negative-ink dark:border-line-strong dark:bg-negative-soft dark:text-negative-ink"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-negative dark:text-negative-ink" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="space-y-4 pt-6" onSubmit={handleRegister}>
              <div className="space-y-3">
                <label htmlFor="register-name" className="label">
                  <User className="h-3.5 w-3.5 text-ink-soft dark:text-lavender" />
                  <span>{t('auth.name')}</span>
                </label>
                <input
                  id="register-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t('auth.namePlaceholder')}
                  className="input pl-12"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="register-email" className="label">
                  <Mail className="h-3.5 w-3.5 text-ink-soft dark:text-lavender" />
                  <span>{t('auth.email')}</span>
                </label>
                <div className="relative">
                  <input
                    id="register-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    className="input pl-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-1/2 -translate-y-1/2 left-3 p-1.5 text-ink-soft transition-colors hover:text-ink"
                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="register-password" className="label">
                  <Lock className="h-3.5 w-3.5 text-ink-soft dark:text-lavender" />
                  <span>{t('auth.password')}</span>
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    className="input pl-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-1/2 -translate-y-1/2 left-3 p-1.5 text-ink-soft transition-colors hover:text-ink"
                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-line/30 border-t-primary" />
                    {t('auth.registering')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {t('auth.registerBtn')}
                    {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </span>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-soft">
              {t('auth.hasAccount')} {' '}
              <Link to="/login" className="font-extrabold text-ink-soft transition-colors hover:text-lavender dark:text-lavender dark:hover:text-on-dark">
                {t('auth.signIn')}
              </Link>
            </p>

            <p className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-surface-2 font-inter px-3.5 py-3 text-[13px] leading-relaxed text-ink-soft dark:border-line dark:bg-surface-2 dark:text-lavender">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-soft dark:text-lavender" />
              {isAr
                ? 'تم إنشاء الحساب وإرساله إلى الخادم.' 
                : 'Account created and sent to server.'}
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
