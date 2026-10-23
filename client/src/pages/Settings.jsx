import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Globe, Moon, Sun, Bell, ShieldCheck, Info, Check } from 'lucide-react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => localStorage.getItem('notifications') !== 'off');

  const toggleLanguage = () => {
    i18n.changeLanguage(isAr ? 'en' : 'ar');
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem('notifications', newState ? 'on' : 'off');
  };

  const settingSections = [
    {
      title: t('settingsPage.languageTitle'),
      desc: t('settingsPage.languageDesc'),
      icon: Globe,
      color: 'bg-brand-soft text-brand-ink',
      action: (
        <button onClick={toggleLanguage} className="btn-primary px-4 py-2 text-xs">
          {isAr ? 'English' : 'العربية'}
        </button>
      ),
    },
    {
      title: t('settingsPage.verifiedTitle'),
      desc: t('settingsPage.verifiedDesc'),
      icon: ShieldCheck,
      color: 'bg-success-soft text-success-ink',
      action: (
        <span className="chip bg-success-soft text-success-ink">
          <Check className="h-3 w-3" />
          {t('settingsPage.active')}
        </span>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="chip bg-brand-soft text-brand-ink">
            <SettingsIcon className="h-3.5 w-3.5" />
            <span>{t('nav.settings')}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            {t('settingsPage.title')}
          </h1>
          <p className="text-xs text-ink-muted">
            {t('settingsPage.subtitle')}
          </p>
        </div>

        {/* Settings Card */}
        <div className="card p-6 sm:p-8 space-y-4">
          {settingSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-surface-muted border border-line">
                <div className="flex items-center gap-3">
                  <div className={`icon-box h-10 w-10 ${section.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-ink">{section.title}</h4>
                    <p className="text-[11px] text-ink-muted mt-0.5">{section.desc}</p>
                  </div>
                </div>
                {section.action}
              </div>
            );
          })}

          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-muted border border-line">
            <div className="flex items-center gap-3">
              <div className="icon-box h-10 w-10 bg-brand-soft text-brand-ink">
                {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-ink">
                  {isAr ? 'الوضع الليلي' : 'Dark Mode'}
                </h4>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  {isAr ? 'تفعيل المظهر الداكن للواجهة' : 'Enable dark appearance'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                isDarkMode ? 'bg-primary' : 'bg-line-strong'
              }`}
              role="switch"
              aria-checked={isDarkMode}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  isDarkMode ? (isAr ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-muted border border-line">
            <div className="flex items-center gap-3">
              <div className="icon-box h-10 w-10 bg-brand-soft text-brand-ink">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-ink">
                  {isAr ? 'الإشعارات' : 'Notifications'}
                </h4>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  {isAr ? 'تذكير يومي بالتعلم والتحديات' : 'Daily learning reminders and challenges'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleNotifications}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
                notificationsEnabled ? 'bg-primary' : 'bg-line-strong'
              }`}
              role="switch"
              aria-checked={notificationsEnabled}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  notificationsEnabled ? (isAr ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card p-6 space-y-3 text-center">
          <div className="mx-auto icon-box h-10 w-10 bg-brand-soft text-brand-ink">
            <Info className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-extrabold text-ink">{t('settingsPage.aboutTitle')}</h3>
          <p className="text-xs text-ink-muted">{t('settingsPage.aboutDesc')}</p>
          <p className="text-[10px] text-ink-muted font-mono">{t('settingsPage.version')}</p>
        </div>
      </div>
    </div>
  );
}
