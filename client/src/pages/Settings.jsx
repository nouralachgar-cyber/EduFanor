import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings as SettingsIcon,
  Globe,
  Moon,
  Sun,
  ShieldCheck,
  Info,
  Check,
  Sparkles,
  MonitorSmartphone,
  Languages,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const isAr = i18n.language === 'ar';

  return (
    <div className="page-container">
      <div className="page-content mx-auto max-w-3xl space-y-8">
        <header>
          <span className="chip bg-brand-soft text-brand-ink">
            <SettingsIcon className="h-3.5 w-3.5" />
            {t('nav.settings')}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {t('settingsPage.title')}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">{t('settingsPage.subtitle')}</p>
        </header>

        <section className="card divide-y divide-line overflow-hidden">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <span className="icon-box h-10 w-10 bg-brand-soft text-brand-ink">
                <Languages className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-ink">{t('settingsPage.languageTitle')}</h2>
                <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">
                  {t('settingsPage.languageDesc')}
                </p>
              </div>
            </div>

            <div
              className="flex shrink-0 items-center rounded-xl border border-line bg-surface-muted p-1"
              role="group"
              aria-label={t('settingsPage.languageTitle')}
            >
              <button
                type="button"
                onClick={() => i18n.changeLanguage('ar')}
                className={`rounded-lg px-4 py-1.5 text-xs font-extrabold transition-colors ${
                  isAr ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => i18n.changeLanguage('en')}
                className={`rounded-lg px-4 py-1.5 text-xs font-extrabold transition-colors ${
                  !isAr ? 'bg-primary text-white' : 'text-ink-muted hover:text-ink'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <span className="icon-box h-10 w-10 bg-brand-soft text-brand-ink">
                {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-ink">
                  {isAr ? 'المظهر' : 'Appearance'}
                </h2>
                <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">
                  {isAr
                    ? 'اختر بين الوضع الفاتح والداكن. يُحفظ اختيارك في هذا المتصفح.'
                    : 'Choose between light and dark appearance. Your choice is saved in this browser.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              role="switch"
              aria-checked={isDark}
              aria-label={isAr ? 'الوضع الداكن' : 'Dark mode'}
              className={`flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${
                isDark ? 'justify-end bg-primary' : 'justify-start bg-line-strong'
              }`}
            >
              <span className="h-6 w-6 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <span className="icon-box h-10 w-10 bg-success-soft text-success-ink">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-ink">{t('settingsPage.verifiedTitle')}</h2>
                <p className="mt-0.5 max-w-md text-[11px] leading-relaxed text-ink-muted">
                  {t('settingsPage.verifiedDesc')}
                </p>
              </div>
            </div>
            <span className="chip shrink-0 bg-success-soft text-success-ink">
              <Check className="h-3 w-3" />
              {t('settingsPage.active')}
            </span>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <span className="icon-box h-10 w-10 bg-brand-soft text-brand-ink">
                <MonitorSmartphone className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-ink">
                  {isAr ? 'الحركة والوصول' : 'Motion and accessibility'}
                </h2>
                <p className="mt-0.5 max-w-md text-[11px] leading-relaxed text-ink-muted">
                  {isAr
                    ? 'تحترم الواجهة إعداد تقليل الحركة في نظامك، وتدعم التنقل بلوحة المفاتيح.'
                    : 'The interface respects your system’s reduced-motion setting and supports keyboard navigation.'}
                </p>
              </div>
            </div>
            <Sparkles className="h-5 w-5 shrink-0 text-accent" />
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-start gap-3">
            <span className="icon-box h-10 w-10 bg-surface-muted text-ink-muted">
              <Info className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-ink">{t('settingsPage.aboutTitle')}</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">{t('settingsPage.aboutDesc')}</p>
              <p className="mt-2 font-mono text-[10px] text-ink-muted">{t('settingsPage.version')}</p>
            </div>
          </div>
        </section>

        <p className="flex items-start gap-2 rounded-2xl border border-line bg-surface-muted px-4 py-3 text-[11px] leading-relaxed text-ink-muted">
          <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          {t('footer.disclaimer')}
        </p>
      </div>
    </div>
  );
}
