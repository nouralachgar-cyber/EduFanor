import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from '../icons';

export default function AiModal({ open, onClose, title, subtitle, icon, badge, children, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const handler = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-[#3E588F]/55 backdrop-blur-sm dark:bg-[#203562]/70"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : 'AI panel'}
            className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-card shadow-pop sm:rounded-3xl ${
              wide ? 'sm:max-w-3xl' : 'sm:max-w-xl'
            }`}
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 22, scale: 0.985 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1"
              style={{
                background: 'linear-gradient(90deg, #C0C5CD, #E3E8F8, #E9EFE8)',
              }}
              aria-hidden="true"
            />
            <header className="flex items-start justify-between gap-3 border-b border-line px-5 pb-3.5 pt-4 sm:px-6">
              <div className="flex min-w-0 items-start gap-3">
                {icon && (
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3E588F,#203562)] text-white shadow-[0_10px_24px_-10px_rgba(100,45,61,0.6)] dark:bg-[linear-gradient(135deg,#C0C5CD,#E3E8F8)] dark:text-[#203562]">
                    {icon}
                  </span>
                )}
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-extrabold text-ink sm:text-base">{title}</h2>
                  {subtitle && (
                    <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">{subtitle}</p>
                  )}
                </div>
                {badge}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
