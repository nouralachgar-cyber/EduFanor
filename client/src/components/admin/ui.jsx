import React, { useEffect } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Inbox, Loader2, X } from 'lucide-react';
import { formatNumber } from '../../lib/admin';

const tones = {
  sage: 'bg-brand-soft text-success-ink',
  amber: 'bg-amber-soft/45 text-amber',
  clay: 'bg-danger-soft text-danger',
  surface: 'bg-surface-muted text-ink',
};

export function PageHeader({ eyebrow, title, subtitle, actions, children }) {
  return (
    <div className="admin-rise flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink-muted">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[1.75rem]">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-muted">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, subtitle, actions, children, className = '', bodyClassName = '', noPadding = false }) {
  return (
    <section className={`admin-card ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col gap-3 border-b border-line px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-extrabold text-ink">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={`${noPadding ? '' : 'p-4 sm:p-5'} ${bodyClassName}`}>{children}</div>
    </section>
  );
}

export function StatCard({ icon: Icon, label, value, hint, tone = 'sage', trend }) {
  return (
    <div className="admin-card admin-fade flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <span className={`icon-box h-9 w-9 ${tones[tone] || tones.sage}`}>
          {Icon && <Icon className="h-4 w-4" />}
        </span>
        {trend !== undefined && trend !== null && (
          <span
            className={`chip ${Number(trend) >= 0 ? 'bg-success-soft text-success-ink' : 'bg-danger-soft text-danger'}`}
          >
            {Number(trend) >= 0 ? '+' : ''}
            {trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink-muted">{label}</p>
        <p className="mt-1 font-display text-2xl font-bold leading-none text-ink">{value}</p>
        {hint && <p className="mt-1.5 text-[11px] font-semibold text-ink-muted">{hint}</p>}
      </div>
    </div>
  );
}

export function Badge({ children, tone = 'neutral' }) {
  const map = {
    neutral: 'bg-surface-muted text-ink-muted',
    green: 'bg-success-soft text-success-ink',
    amber: 'bg-amber-soft/50 text-amber',
    red: 'bg-danger-soft text-danger',
    sage: 'bg-brand-soft text-success-ink',
    outline: 'border border-line bg-transparent text-ink-muted',
  };
  return <span className={`chip ${map[tone] || map.neutral}`}>{children}</span>;
}

export function LoadingState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary dark:text-brand-ink" />
      <p className="text-xs font-bold text-ink-muted">{label}</p>
    </div>
  );
}

export function ErrorState({ title, message, onRetry, retryLabel }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <span className="icon-box h-12 w-12 bg-danger-soft text-danger">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <div>
        <p className="text-sm font-extrabold text-ink">{title}</p>
        {message && <p className="mt-1 max-w-md text-xs leading-relaxed text-ink-muted">{message}</p>}
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary h-9 px-4 text-xs">
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message, action, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
      <span className="icon-box h-12 w-12 bg-surface-muted text-ink-muted">
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-sm font-extrabold text-ink">{title}</p>
        {message && <p className="mt-1 max-w-sm text-xs leading-relaxed text-ink-muted">{message}</p>}
      </div>
      {action}
    </div>
  );
}

export function Pagination({ page = 1, pages = 1, total, onPage, language = 'en', labels = {} }) {
  if (pages <= 1) return null;
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3 sm:flex-row sm:px-5">
      <p className="text-[11px] font-semibold text-ink-muted">
        {labels.total || 'Total'}: {formatNumber(total, language)}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card text-ink transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={labels.previous || 'Previous'}
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>
        <span className="px-2 text-[11px] font-extrabold text-ink">
          {labels.page || 'Page'} {formatNumber(page, language)} / {formatNumber(pages, language)}
        </span>
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card text-ink transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={labels.next || 'Next'}
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const handler = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handler);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' };

  return (
    <div className="admin-modal-backdrop admin-fade" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <div className={`admin-rise w-full ${widths[size] || widths.md} rounded-2xl border border-line bg-card shadow-lift`}>
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-extrabold text-ink">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="admin-scroll max-h-[calc(100vh-14rem)] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-3.5">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel, cancelLabel, busy }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn-secondary h-9 px-4 text-xs">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-danger px-4 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-ink-muted">{message}</p>
    </Modal>
  );
}

export function Field({ label, hint, required, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="label mb-1.5">
        {label}
        {required && <span className="text-danger">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[10px] font-semibold text-ink-muted">{hint}</span>}
    </label>
  );
}

export function SectionLabel({ children }) {
  return (
    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-muted">{children}</p>
  );
}
