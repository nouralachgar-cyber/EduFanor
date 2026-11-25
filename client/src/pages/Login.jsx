/* From Uiverse.io by Yaya12085 - https://uiverse.io/Yaya12085/short-turtle-53 */
/* MIT License, Copyright (c) Yaya12085 (Yaya Mohamed) */

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from '../components/icons';
import { AuthContext } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import styles from './Login.module.css';

export default function Login() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      <div className="w-full flex justify-center">
        <form className={styles['edufanor-auth-form']} onSubmit={handleLogin}>
          <p className={styles['edufanor-auth-title']}>{isAr ? 'مرحباً بعودتك' : 'Welcome back'}</p>
          <p className={styles['edufanor-auth-message']}>
            {isAr
              ? 'سجّل الدخول إلى حسابك في EduFanor لمتابعة تعلّمك.'
              : 'Sign in to your EduFanor account to continue learning.'}
          </p>

          {errorMsg && (
            <div role="alert" className={styles['edufanor-auth-error']}>
              {errorMsg}
            </div>
          )}

          <label>
            <input
              className={styles['edufanor-auth-input']}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder=" "
              dir="ltr"
            />
            <span className={styles['edufanor-auth-span']}>{t('auth.email')}</span>
          </label>

          <label>
            <input
              className={`${styles['edufanor-auth-input']} ${styles['edufanor-auth-input-password']}`}
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder=" "
            />
            <span className={styles['edufanor-auth-span']}>{t('auth.password')}</span>
            <button
              type="button"
              className={styles['edufanor-auth-eye']}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </label>

          <div className={styles['edufanor-auth-row']}>
            <label className={styles['edufanor-auth-remember']}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>{isAr ? 'تذكرني' : 'Remember me'}</span>
            </label>
            <Link to="/forgot-password" className={styles['edufanor-auth-forgot']}>
              {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className={styles['edufanor-auth-submit']}
          >
            {loading ? t('auth.loggingIn') : t('auth.loginBtn')}
          </button>

          <p className={styles['edufanor-auth-signin']}>
            {t('auth.noAccount')}{' '}
            <Link to="/register">{t('auth.signUp')}</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
