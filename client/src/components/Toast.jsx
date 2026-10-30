import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      role="status"
      className="animate-toast-in fixed bottom-6 start-6 z-[60] flex max-w-sm items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 shadow-pop"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isSuccess ? 'bg-success-soft text-success-ink' : 'bg-danger-soft text-danger'
        }`}
      >
        {isSuccess ? <CheckCircle2 className="h-4.5 w-4.5" /> : <AlertCircle className="h-4.5 w-4.5" />}
      </span>

      <span className="text-xs font-extrabold leading-relaxed text-ink">{message}</span>

      <button
        onClick={onClose}
        aria-label="Close"
        className="ms-1 rounded-lg p-1 text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
