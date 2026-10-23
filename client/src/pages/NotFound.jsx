import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-soft">
          <Search className="h-10 w-10 text-brand-ink" />
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-ink">404</h1>
          <p className="text-lg font-bold text-ink">
            {t('notFound.title', 'Page not found')}
          </p>
          <p className="text-sm text-ink-muted">
            {t('notFound.desc', 'The page you are looking for does not exist or has been moved.')}
          </p>
        </div>
        <Link to="/dashboard" className="btn-primary px-6 py-3">
          <Home className="h-4 w-4" />
          <span>{t('notFound.backHome', 'Back to Dashboard')}</span>
        </Link>
      </div>
    </div>
  );
}
