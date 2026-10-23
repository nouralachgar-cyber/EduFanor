import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <ShieldAlert className="h-5 w-5 text-teal" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-ink">{t('nav.brand')}</h3>
              <p className="mt-0.5 text-xs text-ink-muted">{t('footer.desc')}</p>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-xs font-bold text-ink-muted">
            <Link to="/courses" className="transition-colors hover:text-brand-ink">
              {t('footer.courses')}
            </Link>
            <Link to="/ai-tutor" className="transition-colors hover:text-brand-ink">
              {t('footer.aiTutor')}
            </Link>
            <Link to="/settings" className="transition-colors hover:text-brand-ink">
              {t('nav.settings')}
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-center text-xs text-ink-muted">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
