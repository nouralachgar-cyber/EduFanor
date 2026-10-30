import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  RefreshCw,
  UserRound,
} from 'lucide-react';
import { adminApi, formatDate, formatNumber, formatPercent, localize, relativeTime } from '../../lib/admin';
import { Badge, EmptyState, ErrorState, LoadingState, PageHeader, Pagination, Panel } from '../../components/admin/ui';

const types = ['course_start', 'course_complete', 'lesson_complete', 'quiz_attempt'];

const icons = {
  course_start: BookOpen,
  course_complete: GraduationCap,
  lesson_complete: CheckCircle2,
  quiz_attempt: ClipboardCheck,
};

const labels = {
  course_start: 'admin.activity.courseStart',
  course_complete: 'admin.activity.courseComplete',
  lesson_complete: 'admin.activity.lessonComplete',
  quiz_attempt: 'admin.activity.quizAttempt',
};

const tones = {
  course_start: 'sage',
  course_complete: 'green',
  lesson_complete: 'amber',
  quiz_attempt: 'neutral',
};

export default function AdminActivity() {
  const { t, i18n } = useTranslation();
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .activity({ type, page, limit: 20 })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [type, page]);

  useEffect(() => {
    setPage(1);
  }, [type]);

  if (loading && !data) return <LoadingState label={t('admin.common.loading')} />;
  if (error && !data) {
    return <ErrorState title={t('admin.errors.loadActivity')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />;
  }

  const events = data.events || [];
  const pagination = data.pagination || { page: 1, pages: 1, total: 0 };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={t('admin.shell.operations')}
        title={t('admin.activity.title')}
        subtitle={t('admin.activity.subtitle')}
        actions={
          <button
            type="button"
            onClick={load}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-card text-ink transition-colors hover:bg-surface-muted"
            aria-label={t('admin.common.refresh')}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setType('')}
          className={`chip border ${type === '' ? 'border-primary bg-primary text-white' : 'border-line bg-card text-ink-muted hover:bg-surface-muted'}`}
        >
          {t('admin.activity.allTypes')}
        </button>
        {types.map((item) => {
          const Icon = icons[item];
          return (
            <button
              key={item}
              type="button"
              onClick={() => setType(item)}
              className={`chip border ${type === item ? 'border-primary bg-primary text-white' : 'border-line bg-card text-ink-muted hover:bg-surface-muted'}`}
            >
              <Icon className="h-3 w-3" /> {t(labels[item])}
            </button>
          );
        })}
      </div>

      <Panel noPadding>
        <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
          <h2 className="text-sm font-extrabold text-ink">{t('admin.activity.title')}</h2>
          <Badge tone="outline">{formatNumber(pagination.total, i18n.language)}</Badge>
        </div>

        {events.length === 0 ? (
          <EmptyState title={t('admin.activity.noActivity')} icon={Activity} />
        ) : (
          <>
            <div className="admin-scroll hidden overflow-x-auto md:block">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.activity.event')}</th>
                    <th>{t('admin.activity.student')}</th>
                    <th>{t('admin.activity.course')}</th>
                    <th>{t('admin.activity.lesson')}</th>
                    <th>{t('admin.activity.score')}</th>
                    <th>{t('admin.activity.time')}</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => {
                    const Icon = icons[event.type] || Activity;
                    return (
                      <tr key={event._id}>
                        <td>
                          <span className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-muted text-primary dark:text-brand-ink">
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <Badge tone={tones[event.type]}>{t(labels[event.type] || 'admin.activity.event')}</Badge>
                          </span>
                        </td>
                        <td>
                          <p className="text-xs font-bold text-ink">{event.user?.name || t('admin.activity.unknownStudent')}</p>
                          <p className="text-[10px] text-ink-muted" dir="ltr">{event.user?.email || ''}</p>
                        </td>
                        <td className="text-[11px] text-ink-muted">{localize(event.lesson?.course?.title, i18n.language) || event.courseKey || '—'}</td>
                        <td className="text-[11px] text-ink-muted">{localize(event.lesson?.title, i18n.language) || '—'}</td>
                        <td className="font-bold">{event.percent !== undefined && event.percent !== null ? formatPercent(event.percent, i18n.language) : '—'}</td>
                        <td>
                          <p className="text-[10px] font-semibold text-ink-muted">{relativeTime(event.occurredAt, i18n.language)}</p>
                          <p className="text-[9px] text-ink-muted">{formatDate(event.occurredAt, i18n.language, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-line md:hidden">
              {events.map((event) => {
                const Icon = icons[event.type] || Activity;
                return (
                  <div key={event._id} className="flex items-start gap-3 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary dark:text-brand-ink">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-[11px] font-extrabold text-ink">{t(labels[event.type] || 'admin.activity.event')}</p>
                        {event.percent !== undefined && event.percent !== null && (
                          <Badge tone="amber">{formatPercent(event.percent, i18n.language)}</Badge>
                        )}
                      </div>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] font-semibold text-ink-muted">
                        <UserRound className="h-3 w-3 shrink-0" /> {event.user?.name || t('admin.activity.unknownStudent')}
                      </p>
                      <p className="truncate text-[10px] text-ink-muted">
                        {localize(event.lesson?.course?.title, i18n.language) || event.courseKey || ''}
                      </p>
                      <p className="mt-1 text-[9px] font-semibold text-ink-muted">{relativeTime(event.occurredAt, i18n.language)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          onPage={setPage}
          language={i18n.language}
          labels={{
            total: t('admin.common.total'),
            page: t('admin.common.page'),
            previous: t('admin.common.previous'),
            next: t('admin.common.next'),
          }}
        />
      </Panel>
    </div>
  );
}
