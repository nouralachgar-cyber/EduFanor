import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Mail } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <ShieldCheck className="h-5 w-5 text-amber-soft" />
              </span>
              <span className="font-display text-lg font-semibold text-ink">{t('nav.brand')}</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">{t('footer.desc')}</p>
            <p className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-ink-muted">
              <Mail className="h-3.5 w-3.5 text-teal-deep" />
              <a href="mailto:support@edufanor.com" className="hover:text-ink" dir="ltr">
                support@edufanor.com
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                {t('footer.learn', 'Learn')}
              </p>
              <nav className="mt-3 flex flex-col gap-2 font-semibold text-ink">
                <Link to="/courses" className="transition-colors hover:text-brand-ink">
                  {t('footer.courses')}
                </Link>
                <Link to="/progress" className="transition-colors hover:text-brand-ink">
                  {t('nav.progress', 'Progress')}
                </Link>
                <Link to="/quizzes" className="transition-colors hover:text-brand-ink">
                  {t('nav.quizzes', 'Quizzes')}
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                {t('footer.platform', 'Platform')}
              </p>
              <nav className="mt-3 flex flex-col gap-2 font-semibold text-ink">
                <Link to="/ai-tutor" className="transition-colors hover:text-brand-ink">
                  {t('footer.aiTutor')}
                </Link>
                <Link to="/about" className="transition-colors hover:text-brand-ink">
                  {t('footer.about', 'About')}
                </Link>
                <Link to="/settings" className="transition-colors hover:text-brand-ink">
                  {t('nav.settings')}
                </Link>
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                {t('footer.notes', 'Notes')}
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
                {t('footer.disclaimer', 'Educational content only. In an emergency, contact local emergency services first.')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-[11px] text-ink-muted">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
