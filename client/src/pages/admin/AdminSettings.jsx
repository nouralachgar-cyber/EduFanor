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
  Sparkles,
  Sun,
  UserRound,
  Wifi,
} from '../../components/icons';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { adminApi, formatDate, formatDateTime, formatNumber, initials, relativeTime } from '../../lib/admin';
import { aiApi, localizeAiError } from '../../lib/ai';
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
  const [aiStatus, setAiStatus] = useState({ busy: false, checked: false, ok: false, model: null, message: '' });
  const isAr = i18n.language === 'ar';

  const checkAi = async () => {
    setAiStatus((previous) => ({ ...previous, busy: true }));
    try {
      const result = await aiApi.health();
      setAiStatus({ busy: false, checked: true, ok: Boolean(result?.ok), model: result?.model || null, message: '' });
    } catch (err) {
      setAiStatus((previous) => ({
        ...previous,
        busy: false,
        checked: true,
        ok: false,
        model: null,
        message: localizeAiError(err, isAr),
      }));
    }
  };

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

  if (loading && !data) {
    return (
      <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C]">
        <LoadingState label={t('admin.common.loading')} />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C]">
        <ErrorState title={t('admin.errors.loadProfile')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />
      </div>
    );
  }

  const account = data.user;
  const recentActions = data.recentActions || [];

  return (
    <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C]">
      <PageHeader
        eyebrow={t('admin.shell.system')}
        title={t('admin.settings.title')}
        subtitle={t('admin.settings.subtitle')}
        actions={
          <button
            type="button"
            onClick={load}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DD88CF] bg-[#F8E7F6] text-[#4B164C] transition-colors hover:bg-[#DD88CF]/30 shadow-sm"
            aria-label={t('admin.common.refresh')}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel title={t('admin.settings.profile')} subtitle={t('admin.settings.profileDesc')} className="bg-white border border-[#DD88CF]/40 rounded-2xl p-6 shadow-sm">
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="mb-4 flex items-center gap-3.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4B164C] text-sm font-extrabold text-[#F8E7F6] shadow-sm">
                {initials(profile.name)}
              </span>
              <div>
                <p className="text-sm font-extrabold text-[#4B164C]">{profile.name || t('admin.shell.adminAccount')}</p>
                <Badge tone="green" className="bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]"><ShieldCheck className="h-3.5 w-3.5 text-[#DD88CF]" /> {t('admin.settings.adminRole')}</Badge>
              </div>
            </div>
            <Field label={t('admin.settings.name')} required>
              <input 
                value={profile.name} 
                onChange={(event) => setProfile((previous) => ({ ...previous, name: event.target.value }))} 
                className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm" 
              />
            </Field>
            <Field label={t('admin.settings.email')} required>
              <input 
                type="email" 
                value={profile.email} 
                onChange={(event) => setProfile((previous) => ({ ...previous, email: event.target.value }))} 
                className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm" 
                dir="ltr" 
              />
            </Field>
            <button 
              type="submit" 
              disabled={savingProfile} 
              className="rounded-xl bg-[#4B164C] px-5 py-2.5 text-xs font-extrabold text-[#F8E7F6] shadow-sm hover:bg-[#4B164C]/90 disabled:opacity-50"
            >
              {savingProfile ? t('admin.common.saving') : t('admin.common.save')}
            </button>
          </form>
        </Panel>

        <Panel title={t('admin.settings.password')} subtitle={t('admin.settings.passwordDesc')} className="bg-white border border-[#DD88CF]/40 rounded-2xl p-6 shadow-sm">
          <form onSubmit={savePassword} className="space-y-4">
            <Field label={t('admin.settings.currentPassword')} required>
              <input 
                type="password" 
                value={password.currentPassword} 
                onChange={(event) => setPassword((previous) => ({ ...previous, currentPassword: event.target.value }))} 
                className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm" 
                autoComplete="current-password" 
              />
            </Field>
            <Field label={t('admin.settings.newPassword')} required>
              <input 
                type="password" 
                value={password.newPassword} 
                onChange={(event) => setPassword((previous) => ({ ...previous, newPassword: event.target.value }))} 
                className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm" 
                autoComplete="new-password" 
                minLength={8} 
              />
            </Field>
            <Field label={t('admin.settings.confirmPassword')} required>
              <input 
                type="password" 
                value={password.confirmPassword} 
                onChange={(event) => setPassword((previous) => ({ ...previous, confirmPassword: event.target.value }))} 
                className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm" 
                autoComplete="new-password" 
                minLength={8} 
              />
            </Field>
            <button 
              type="submit" 
              disabled={savingPassword} 
              className="flex items-center gap-1.5 rounded-xl bg-[#4B164C] px-5 py-2.5 text-xs font-extrabold text-[#F8E7F6] shadow-sm hover:bg-[#4B164C]/90 disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4 text-[#DD88CF]" /> {savingPassword ? t('admin.common.saving') : t('admin.common.save')}
            </button>
          </form>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel title={t('admin.settings.account')} className="bg-white border border-[#DD88CF]/40 rounded-2xl p-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] px-4 py-3">
              <span className="text-xs font-semibold text-[#4B164C]/70">{t('admin.settings.role')}</span>
              <span className="text-xs font-extrabold text-[#4B164C]">{t('admin.settings.adminRole')}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] px-4 py-3">
              <span className="text-xs font-semibold text-[#4B164C]/70">{t('admin.settings.createdAt')}</span>
              <span className="text-xs font-bold text-[#4B164C]">{formatDate(account.createdAt, i18n.language)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] px-4 py-3">
              <span className="text-xs font-semibold text-[#4B164C]/70">{t('admin.settings.lastLogin')}</span>
              <span className="text-xs font-bold text-[#4B164C]">{account.lastLoginAt ? formatDateTime(account.lastLoginAt, i18n.language) : t('admin.common.notAvailable')}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] px-4 py-3">
              <span className="text-xs font-semibold text-[#4B164C]/70">{t('admin.settings.actionsCount')}</span>
              <span className="text-xs font-extrabold text-[#4B164C]">{formatNumber(data.actionCount, i18n.language)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] px-4 py-3">
              <span className="text-xs font-semibold text-[#4B164C]/70">{t('admin.settings.serverStatus')}</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <Wifi className="h-4 w-4" /> {t('admin.settings.connected')}
              </span>
            </div>
          </div>
        </Panel>

        <Panel title={t('admin.settings.preferences')} subtitle={t('admin.settings.preferencesDesc')} className="bg-white border border-[#DD88CF]/40 rounded-2xl p-6 shadow-sm">
          <div className="space-y-3">
            <button 
              type="button" 
              onClick={toggleTheme} 
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] p-3 text-start transition-colors hover:bg-[#F8E7F6]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]">
                  {isDark ? <Moon className="h-4 w-4 text-[#DD88CF]" /> : <Sun className="h-4 w-4 text-[#DD88CF]" />}
                </span>
                <span>
                  <span className="block text-xs font-extrabold text-[#4B164C]">{t('admin.settings.appearance')}</span>
                  <span className="block text-[10px] text-[#4B164C]/70">{isDark ? t('admin.common.no') : t('admin.common.yes')} / {isDark ? 'Dark' : 'Light'}</span>
                </span>
              </span>
              <span className={`relative h-6 w-10 rounded-full transition-colors ${isDark ? 'bg-[#4B164C]' : 'bg-[#DD88CF]'}`}>
                <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${isDark ? 'start-5' : 'start-1'}`} />
              </span>
            </button>

            <button 
              type="button" 
              onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')} 
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] p-3 text-start transition-colors hover:bg-[#F8E7F6]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]">
                  <Globe className="h-4 w-4 text-[#DD88CF]" />
                </span>
                <span>
                  <span className="block text-xs font-extrabold text-[#4B164C]">{t('admin.settings.language')}</span>
                  <span className="block text-[10px] text-[#4B164C]/70">{isAr ? t('admin.common.ar') : t('admin.common.en')}</span>
                </span>
              </span>
              <Badge tone="outline" className="bg-white text-[#4B164C] border border-[#DD88CF]">{isAr ? 'العربية' : 'English'}</Badge>
            </button>
          </div>
        </Panel>
      </div>

      <Panel title={t('admin.settings.aiTitle')} subtitle={t('admin.settings.aiDesc')} className="bg-white border border-[#DD88CF]/40 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${aiStatus.checked && aiStatus.ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-[#F8E7F6] text-[#4B164C] border-[#DD88CF]'}`}>
              <Sparkles className="h-5 w-5 text-[#DD88CF]" />
            </span>
            <div>
              <p className="text-xs font-extrabold text-[#4B164C]">
                {aiStatus.checked
                  ? aiStatus.ok
                    ? t('admin.settings.aiReady')
                    : t('admin.settings.aiOff')
                  : t('admin.settings.aiUnknown')}
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-[#4B164C]/70">
                {aiStatus.checked
                  ? aiStatus.ok
                    ? `${t('admin.settings.aiModel')}: Grok · ${aiStatus.model}`
                    : aiStatus.message || t('admin.settings.aiOffHint')
                  : t('admin.settings.aiCheckHint')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={checkAi}
            disabled={aiStatus.busy}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#DD88CF] bg-[#F8E7F6] px-4 text-xs font-bold text-[#4B164C] transition-colors hover:bg-[#DD88CF]/30 disabled:opacity-60 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-[#DD88CF] ${aiStatus.busy ? 'animate-spin' : ''}`} />
            {aiStatus.busy ? t('admin.settings.aiChecking') : t('admin.settings.aiCheck')}
          </button>
        </div>
      </Panel>

      <Panel title={t('admin.settings.recentActions')} noPadding className="bg-white border border-[#DD88CF]/40 rounded-2xl shadow-sm overflow-hidden">
        {recentActions.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs font-semibold text-[#4B164C]/70">{t('admin.audit.noLogs')}</div>
        ) : (
          <div className="divide-y divide-[#DD88CF]/20">
            {recentActions.map((log) => (
              <div key={log._id} className="flex items-start justify-between gap-3 px-4 py-3.5 hover:bg-[#F5F5F5]/60 transition-colors">
                <div className="flex min-w-0 items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#DD88CF]" />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#4B164C]">{t(`admin.audit.actions.${log.action}`, { defaultValue: log.action })}</p>
                    <p className="truncate text-[10px] text-[#4B164C]/70">{log.details || log.targetLabel}</p>
                  </div>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-[#4B164C]/60">{relativeTime(log.createdAt, i18n.language)}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shadow-sm">
        <div className="flex items-start gap-3">
          <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="text-xs font-extrabold text-red-900">{t('admin.settings.dangerZone')}</p>
            <p className="text-[10px] text-red-700">{t('admin.settings.dangerDesc')}</p>
          </div>
        </div>
        <button 
          type="button" 
          onClick={signOut} 
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-xs font-bold text-white transition-opacity hover:bg-red-700 shadow-sm"
        >
          <LogOut className="h-4 w-4" /> {t('admin.settings.signOut')}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}