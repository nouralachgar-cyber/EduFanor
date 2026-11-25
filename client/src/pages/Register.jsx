/* From Uiverse.io by Yaya12085 - https://uiverse.io/Yaya12085/short-turtle-53 */
/* MIT License, Copyright (c) Yaya12085 (Yaya Mohamed) */

import React, { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from '../components/icons';
import { AuthContext } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import styles from './Register.module.css';

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

  const passwordStrength = useMemo(() => {
    const value = password || '';
    let score = 0;
    if (value.length >= 6) score += 1;
    if (value.length >= 10) score += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
    if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;
    if (!value) return { score: 0, label: isAr ? 'ضعيفة' : 'Weak', color: '#D97777', width: '0%' };
    if (score <= 1) return { score, label: isAr ? 'ضعيفة' : 'Weak', color: '#D97777', width: '33%' };
    if (score <= 3) return { score, label: isAr ? 'متوسطة' : 'Medium', color: '#C9A227', width: '66%' };
    return { score, label: isAr ? 'قوية' : 'Strong', color: '#5B9A7A', width: '100%' };
  }, [password, isAr]);

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
      <div className="w-full flex justify-center">
        <form className={styles['edufanor-signup-form']} onSubmit={handleRegister}>
          {/* From Uiverse.io by Yaya12085 - https://uiverse.io/Yaya12085/short-turtle-53 */}
          {/* MIT License, Copyright (c) Yaya12085 (Yaya Mohamed) */}
          <p className={styles['edufanor-signup-title']}>{isAr ? 'إنشاء حساب' : 'Register'}</p>
          <p className={styles['edufanor-signup-message']}>
            {isAr
              ? 'أنشئ حسابك في EduFanor وابدأ تعلّم مهارات تنقذ الحياة.'
              : 'Create your EduFanor account and start learning life-saving skills.'}
          </p>

          {errorMsg && (
            <div role="alert" className={styles['edufanor-signup-error']}>
              {errorMsg}
            </div>
          )}

          <label>
            <input
              className={styles['edufanor-signup-input']}
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder=" "
            />
            <span className={styles['edufanor-signup-span']}>{t('auth.name')}</span>
          </label>

          <label>
            <input
              className={styles['edufanor-signup-input']}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder=" "
              dir="ltr"
            />
            <span className={styles['edufanor-signup-span']}>{t('auth.email')}</span>
          </label>

          <label>
            <input
              className={`${styles['edufanor-signup-input']} ${styles['edufanor-signup-input-password']}`}
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder=" "
            />
            <span className={styles['edufanor-signup-span']}>{t('auth.password')}</span>
            <button
              type="button"
              className={styles['edufanor-signup-eye']}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </label>

          <div className={styles['edufanor-signup-strength']} aria-live="polite">
            <div className={styles['edufanor-signup-strength-track']}>
              <div
                className={styles['edufanor-signup-strength-bar']}
                style={{ width: password ? passwordStrength.width : '0%', backgroundColor: passwordStrength.color }}
              />
            </div>
            <p className={styles['edufanor-signup-strength-label']}>
              {(isAr ? 'قوة كلمة المرور: ' : 'Password strength: ') + (password ? passwordStrength.label : (isAr ? '—' : '—'))}
            </p>
          </div>

          <button type="submit" disabled={loading} className={styles['edufanor-signup-submit']}>
            {loading ? t('auth.registering') : t('auth.registerBtn')}
          </button>

          <p className={styles['edufanor-signup-signin']}>
            {t('auth.hasAccount')}{' '}
            <Link to="/login">{t('auth.signIn')}</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
