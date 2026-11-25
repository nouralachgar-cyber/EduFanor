import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Sun, Moon, CheckCircle2, Globe } from './icons';
import { useTheme } from '../context/ThemeContext';
import EduFanorWordmark from './EduFanorWordmark';

export default function AuthLayout({ children }) {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const isAr = i18n.language === 'ar';

  const points = [t('auth.point1'), t('auth.point2'), t('auth.point3')];

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside
          className="relative hidden overflow-hidden bg-scrim bg-cover bg-[center_35%] lg:flex lg:flex-col lg:justify-between px-10 py-10 lg:px-12 lg:py-20"
          style={{ backgroundImage: "url('/heroa.jpg')" }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-b from-scrim/80 to-scrim/50"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_18%,var(--palette-highlight),transparent_52%),radial-gradient(ellipse_at_18%_85%,var(--palette-lavender),transparent_46%)] opacity-20"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                'radial-gradient(var(--palette-highlight) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center">
              <EduFanorWordmark className="w-36 text-on-dark" />
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-on-dark">
              {isAr ? 'تعلم بثقة ووضوح' : 'Learn with clarity and confidence'}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight">
              {isAr ? (
                <>
                  معرفة صغيرة.
                  <br />
                  <span className="italic text-on-dark">استعداد أكبر.</span>
                </>
              ) : (
                <>
                  A little knowledge.
                  <br />
                  <span className="italic text-on-dark">A calmer response.</span>
                </>
              )}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-on-dark/75">
              {isAr
                ? 'دروس منظمة، اختبارات قصيرة، وتقدّم محفوظ — مساحة تعلّم هادئة للإسعافات الأولية.'
                : 'Structured lessons, short quizzes, and saved progress — a calm first-aid learning space.'}
            </p>

            <ul className="mt-8 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-xs font-semibold text-on-dark/85">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-on-dark" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            <p className="relative z-10 max-w-sm text-[10px] leading-relaxed text-on-dark/60">
              {isAr
                ? 'المحتوى تعليمي فقط. في الطوارئ، اتصل بخدمات الإسعاف المحلية أولاً.'
                : 'Educational content only. In an emergency, contact local emergency services first.'}
            </p>
          </div>
        </aside>

        <main className="flex min-h-screen flex-col">
          <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-extrabold text-ink-soft transition-colors hover:text-ink dark:text-lavender dark:hover:text-on-dark">
              {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              <span>{isAr ? 'العودة للرئيسية' : 'Back to home'}</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
                className="flex h-9 items-center gap-1.5 rounded-full border border-line bg-highlight px-2.5 text-[10px] font-extrabold text-ink transition-colors hover:bg-primary dark:border-line dark:bg-surface-2 dark:text-on-dark dark:hover:bg-primary"
                aria-label={t('nav.toggleLanguage')}
              >
                <Globe className="h-3.5 w-3.5 text-ink-soft dark:text-lavender" />
                {isAr ? 'EN' : 'ع'}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-highlight text-ink transition-colors hover:bg-primary dark:border-line dark:bg-surface-2 dark:text-on-dark dark:hover:bg-primary"
                aria-label={t('nav.toggleTheme')}
              >
                {isDark ? (
                  <Sun className="h-4 w-4 text-lavender" />
                ) : (
                  <Moon className="h-4 w-4 text-on-primary dark:text-on-dark" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
            <div className="w-full max-w-md">
              <div className="mb-6 lg:hidden">
                <EduFanorWordmark className="w-32 text-ink dark:text-on-dark" />
              </div>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
