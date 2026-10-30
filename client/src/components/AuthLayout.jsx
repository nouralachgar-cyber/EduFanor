import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ArrowLeft, ArrowRight, Sun, Moon, CheckCircle2, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AuthLayout({ children }) {
  const { t, i18n } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const isAr = i18n.language === 'ar';

  const points = [t('auth.point1'), t('auth.point2'), t('auth.point3')];

  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside
          className="relative hidden overflow-hidden bg-[#0A1712] bg-cover bg-center px-10 py-10 text-[#FCFAF6] lg:flex lg:flex-col lg:justify-between"
          style={{ backgroundImage: "url('/heroback.jpg')" }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,14,11,0.78),rgba(7,18,14,0.9))]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_25%,rgba(245,158,66,0.18),transparent_55%)]" aria-hidden="true" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F59E42] text-[#0A1712]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">EduFanor</span>
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#FFD09A]">
              {isAr ? 'تعلّم بثقة ووضوح' : 'Learn with clarity and confidence'}
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight">
              {isAr ? (
                <>
                  معرفة صغيرة.
                  <br />
                  <span className="italic text-[#F59E42]">استعداد أكبر.</span>
                </>
              ) : (
                <>
                  A little knowledge.
                  <br />
                  <span className="italic text-[#F59E42]">A calmer response.</span>
                </>
              )}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#FCFAF6]/65">
              {isAr
                ? 'دروس منظمة، اختبارات قصيرة، وتقدّم محفوظ — مساحة تعلّم هادئة للإسعافات الأولية.'
                : 'Structured lessons, short quizzes, and saved progress — a calm first-aid learning space.'}
            </p>

            <ul className="mt-8 space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-xs font-semibold text-[#FCFAF6]/80">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E42]" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 max-w-sm text-[10px] leading-relaxed text-[#FCFAF6]/45">
            {isAr
              ? 'المحتوى تعليمي فقط. في الطوارئ، اتصل بخدمات الإسعاف المحلية أولاً.'
              : 'Educational content only. In an emergency, contact local emergency services first.'}
          </p>
        </aside>

        <main className="flex min-h-screen flex-col">
          <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-extrabold text-ink-muted transition-colors hover:text-ink">
              {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              <span>{isAr ? 'العودة للرئيسية' : 'Back to home'}</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-[10px] font-extrabold text-ink transition-colors hover:bg-surface-muted"
                aria-label={t('nav.toggleLanguage')}
              >
                <Globe className="h-3.5 w-3.5 text-brand-ink" />
                {isAr ? 'EN' : 'ع'}
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink transition-colors hover:bg-surface-muted"
                aria-label={t('nav.toggleTheme')}
              >
                {isDark ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-brand-ink" />}
              </button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
            <div className="w-full max-w-md">
              <div className="mb-6 flex items-center gap-3 lg:hidden">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                  <ShieldCheck className="h-5 w-5 text-amber-soft" />
                </span>
                <span className="font-display text-lg font-semibold tracking-tight text-ink">EduFanor</span>
              </div>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
