import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, CheckCircle2, Globe } from './icons';
import { useTheme } from '../context/ThemeContext';
import EduFanorWordmark from './EduFanorWordmark';
import ThemeToggle from './ui/ThemeToggle';

export default function AuthLayout({ children }) {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const isAr = i18n.language === 'ar';

  const points = [t('auth.point1'), t('auth.point2'), t('auth.point3')];

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside
          className="relative hidden overflow-hidden bg-cover bg-[center_35%] opacity-100 lg:flex lg:flex-col lg:justify-between h-full px-10 pt-6 pb-8 lg:px-14"
          style={{ backgroundImage: "url('/heroa.jpg')" }}
        >
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center">
              <EduFanorWordmark className="w-44 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] sm:w-48" />
            </Link>
          </div>

          <div className="relative z-10 my-auto max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
            <p className="text-sm font-bold uppercase tracking-widest text-[#F0D9FF]">
              {isAr ? 'تعلّم بوضوح وثقة' : 'LEARN WITH CLARITY AND CONFIDENCE'}
            </p>
            <h2 className={`mt-3 ${isAr ? 'font-arabic' : "font-['Viga']"} text-5xl leading-[1.1] xl:text-[3.5rem]`}>
              {isAr ? (
                <>
                  <span className="block text-white">معرفة صغيرة.</span>
                  <span className="block text-[#F0D9FF]">استجابة أهدأ.</span>
                </>
              ) : (
                <>
                  <span className="block text-white">A little knowledge.</span>
                  <span className="block text-[#F0D9FF]">A calmer response.</span>
                </>
              )}
            </h2>
            <p className="mt-5 max-w-lg text-lg font-normal leading-relaxed text-white/95 sm:text-xl">
              {isAr
                ? 'دروس منظمة، اختبارات قصيرة، وتقدّم محفوظ — مساحة تعلّم هادئة للإسعافات الأولية.'
                : 'Structured lessons, short quizzes, and saved progress — a calm first-aid learning space.'}
            </p>

            <ul className="mt-7 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-base font-medium text-white sm:text-lg">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F0D9FF]" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 max-w-md pb-0 text-xs leading-relaxed text-white/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
            {isAr
              ? 'المحتوى تعليمي فقط. في الطوارئ، اتصل بخدمات الإسعاف المحلية أولاً.'
              : 'Educational content only. In an emergency, contact local emergency services first.'}
          </p>
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
              <ThemeToggle
                checked={isDark}
                onChange={toggleTheme}
                className="scale-[0.68] origin-center"
                ariaLabel="Toggle dark mode"
              />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
            <div className="w-full max-w-[460px]">
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
