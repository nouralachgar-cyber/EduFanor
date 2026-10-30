import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={() => this.setState({ hasError: false, error: null })} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error, onReset }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted p-4">
      <div className="card max-w-md w-full p-8 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-soft">
          <AlertTriangle className="h-8 w-8 text-danger" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-ink">
            {t('error.title', 'Something went wrong')}
          </h2>
          <p className="text-sm text-ink-muted">
            {t('error.desc', 'An unexpected error occurred. Please try again.')}
          </p>
        </div>
        {error && (
          <p className="break-all rounded-lg bg-danger-soft p-3 font-mono text-xs text-danger">
            {error.message || String(error)}
          </p>
        )}
        <button onClick={onReset} className="btn-primary px-6 py-3">
          <RefreshCw className="h-4 w-4" />
          <span>{t('error.retry', 'Try Again')}</span>
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
