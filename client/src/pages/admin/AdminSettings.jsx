import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  Globe,
  KeyRound,
  LogOut,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sun,
  UserRound,
  Wifi,
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { adminApi, formatDate, formatDateTime, formatNumber, initials, relativeTime } from '../../lib/admin';
import { Badge, ErrorState, Field, LoadingState, PageHeader, Panel } from '../../components/admin/ui';
import Toast from '../../components/Toast';

export default function AdminSettings() {
  const { t, i18n } = useTranslation();
  const { user, updateUser, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const isAr = i18n.language === 'ar';

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .profile()
      .then((result) => {
        setData(result);
        setProfile({ name: result.user.name || '', email: result.user.email || '' });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    try {
      const result = await adminApi.updateProfile(profile);
      updateUser(result.user);
      setData((previous) => ({ ...previous, user: result.user }));
      setToast({ type: 'success', message: t('admin.settings.profileSaved') });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      setToast({ type: 'error', message: t('admin.settings.passwordMismatch') });
      return;
    }
    setSavingPassword(true);
    try {
      await adminApi.updatePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setToast({ type: 'success', message: t('admin.settings.passwordSaved') });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSavingPassword(false);
    }
  };

  const signOut = () => {
    logout();
    navigate('/login');
  };

  if (loading && !data) return <LoadingState label={t('admin.common.loading')} />;
  if (error && !data) {
    return <ErrorState title={t('admin.errors.loadProfile')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />;
  }

  const account = data.user;
  const recentActions = data.recentActions || [];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={t('admin.shell.system')}
        title={t('admin.settings.title')}
        subtitle={t('admin.settings.subtitle')}
        actions={
          <button
            type="button"
            onClick={load}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-card text-ink transition-colors hover:bg-surface-muted"
            aria-label={t('admin.common.refresh')}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      <div className="grid gap-3 xl:grid-cols-[1fr_1fr]">
        <Panel title={t('admin.settings.profile')} subtitle={t('admin.settings.profileDesc')}>
          <form onSubmit={saveProfile} className="space-y-3.5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-extrabold text-white">
                {initials(profile.name)}
              </span>
              <div>
                <p className="text-sm font-extrabold text-ink">{profile.name || t('admin.shell.adminAccount')}</p>
                <Badge tone="green"><ShieldCheck className="h-3 w-3" /> {t('admin.settings.adminRole')}</Badge>
              </div>
            </div>
            <Field label={t('admin.settings.name')} required>
              <input value={profile.name} onChange={(event) => setProfile((previous) => ({ ...previous, name: event.target.value }))} className="input" />
            </Field>
            <Field label={t('admin.settings.email')} required>
              <input type="email" value={profile.email} onChange={(event) => setProfile((previous) => ({ ...previous, email: event.target.value }))} className="input" dir="ltr" />
            </Field>
            <button type="submit" disabled={savingProfile} className="btn-primary h-9 px-4 text-xs">
              {savingProfile ? t('admin.common.saving') : t('admin.common.save')}
            </button>
          </form>
        </Panel>

        <Panel title={t('admin.settings.password')} subtitle={t('admin.settings.passwordDesc')}>
          <form onSubmit={savePassword} className="space-y-3.5">
            <Field label={t('admin.settings.currentPassword')} required>
              <input type="password" value={password.currentPassword} onChange={(event) => setPassword((previous) => ({ ...previous, currentPassword: event.target.value }))} className="input" autoComplete="current-password" />
            </Field>
            <Field label={t('admin.settings.newPassword')} required>
              <input type="password" value={password.newPassword} onChange={(event) => setPassword((previous) => ({ ...previous, newPassword: event.target.value }))} className="input" autoComplete="new-password" minLength={8} />
            </Field>
            <Field label={t('admin.settings.confirmPassword')} required>
              <input type="password" value={password.confirmPassword} onChange={(event) => setPassword((previous) => ({ ...previous, confirmPassword: event.target.value }))} className="input" autoComplete="new-password" minLength={8} />
            </Field>
            <button type="submit" disabled={savingPassword} className="btn-primary h-9 px-4 text-xs">
              <KeyRound className="h-3.5 w-3.5" /> {savingPassword ? t('admin.common.saving') : t('admin.common.save')}
            </button>
          </form>
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1fr_1fr]">
        <Panel title={t('admin.settings.account')}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <span className="text-[11px] font-semibold text-ink-muted">{t('admin.settings.role')}</span>
              <span className="text-[11px] font-extrabold text-ink">{t('admin.settings.adminRole')}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <span className="text-[11px] font-semibold text-ink-muted">{t('admin.settings.createdAt')}</span>
              <span className="text-[11px] font-bold text-ink">{formatDate(account.createdAt, i18n.language)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <span className="text-[11px] font-semibold text-ink-muted">{t('admin.settings.lastLogin')}</span>
              <span className="text-[11px] font-bold text-ink">{account.lastLoginAt ? formatDateTime(account.lastLoginAt, i18n.language) : t('admin.common.notAvailable')}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <span className="text-[11px] font-semibold text-ink-muted">{t('admin.settings.actionsCount')}</span>
              <span className="text-[11px] font-extrabold text-ink">{formatNumber(data.actionCount, i18n.language)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <span className="text-[11px] font-semibold text-ink-muted">{t('admin.settings.serverStatus')}</span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-success-ink">
                <Wifi className="h-3.5 w-3.5" /> {t('admin.settings.connected')}
              </span>
            </div>
          </div>
        </Panel>

        <Panel title={t('admin.settings.preferences')} subtitle={t('admin.settings.preferencesDesc')}>
          <div className="space-y-2.5">
            <button type="button" onClick={toggleTheme} className="flex w-full items-center justify-between gap-3 rounded-xl border border-line px-3 py-3 text-start transition-colors hover:bg-surface-muted">
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-primary dark:text-brand-ink">
                  {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </span>
                <span>
                  <span className="block text-[11px] font-extrabold text-ink">{t('admin.settings.appearance')}</span>
                  <span className="block text-[10px] text-ink-muted">{isDark ? t('admin.common.no') : t('admin.common.yes')} / {isDark ? 'Dark' : 'Light'}</span>
                </span>
              </span>
              <span className={`relative h-6 w-10 rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-line-strong'}`}>
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${isDark ? 'start-5' : 'start-1'}`} />
              </span>
            </button>

            <button type="button" onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')} className="flex w-full items-center justify-between gap-3 rounded-xl border border-line px-3 py-3 text-start transition-colors hover:bg-surface-muted">
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-primary dark:text-brand-ink">
                  <Globe className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[11px] font-extrabold text-ink">{t('admin.settings.language')}</span>
                  <span className="block text-[10px] text-ink-muted">{isAr ? t('admin.common.ar') : t('admin.common.en')}</span>
                </span>
              </span>
              <Badge tone="outline">{isAr ? 'العربية' : 'English'}</Badge>
            </button>

          </div>
        </Panel>
      </div>

      <Panel title={t('admin.settings.recentActions')} noPadding>
        {recentActions.length === 0 ? (
          <div className="px-4 py-8 text-center text-[11px] font-semibold text-ink-muted">{t('admin.audit.noLogs')}</div>
        ) : (
          <div className="divide-y divide-line">
            {recentActions.map((log) => (
              <div key={log._id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="flex min-w-0 items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-ink" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-ink">{t(`admin.audit.actions.${log.action}`, { defaultValue: log.action })}</p>
                    <p className="truncate text-[10px] text-ink-muted">{log.details || log.targetLabel}</p>
                  </div>
                </div>
                <span className="shrink-0 text-[9px] font-semibold text-ink-muted">{relativeTime(log.createdAt, i18n.language)}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <div className="admin-card flex flex-col gap-3 border-danger/20 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <div>
            <p className="text-xs font-extrabold text-ink">{t('admin.settings.dangerZone')}</p>
            <p className="text-[10px] text-ink-muted">{t('admin.settings.dangerDesc')}</p>
          </div>
        </div>
        <button type="button" onClick={signOut} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-danger px-4 text-[11px] font-bold text-white transition-opacity hover:opacity-90">
          <LogOut className="h-3.5 w-3.5" /> {t('admin.settings.signOut')}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
