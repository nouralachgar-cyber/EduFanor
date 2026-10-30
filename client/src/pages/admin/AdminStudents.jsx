import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRight,
  Ban,
  CheckCircle2,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react';
import { adminApi, formatDate, formatNumber, formatPercent, initials, relativeTime } from '../../lib/admin';
import {
  Badge,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pagination,
  Panel,
} from '../../components/admin/ui';
import Toast from '../../components/Toast';

const sorts = ['newest', 'oldest', 'name', 'email', 'activity'];

export default function AdminStudents() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState('');
  const [activity, setActivity] = useState(searchParams.get('activity') || '');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 320);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, activity, sort]);

  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (status) params.status = status;
    if (activity) params.activity = activity;
    params.sort = sort;
    params.page = page;
    params.limit = 12;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, status, activity, sort, page, setSearchParams]);

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .students({
        search: debouncedSearch,
        status,
        activity,
        sort,
        page,
        limit: 12,
      })
      .then((data) => {
        setRows(data.students || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [debouncedSearch, status, activity, sort, page]);

  const confirmStatusChange = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      const nextStatus = pending.status;
      await adminApi.updateStudentStatus(pending.student._id, nextStatus);
      setRows((previous) =>
        previous.map((row) => (row._id === pending.student._id ? { ...row, status: nextStatus } : row))
      );
      setToast({ type: 'success', message: t('admin.students.statusUpdated') });
      setPending(null);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setBusy(false);
    }
  };

  const summary = useMemo(
    () => ({
      active: rows.filter((row) => row.status !== 'suspended').length,
      suspended: rows.filter((row) => row.status === 'suspended').length,
      engaged: rows.filter((row) => row.active).length,
    }),
    [rows]
  );

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={t('admin.shell.workspace')}
        title={t('admin.students.title')}
        subtitle={t('admin.students.subtitle')}
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
        <Badge tone="green">
          <Users className="h-3 w-3" /> {formatNumber(pagination.total, i18n.language)} {t('admin.common.students')}
        </Badge>
        <Badge tone="sage">{t('admin.common.active')}: {formatNumber(summary.active, i18n.language)}</Badge>
        <Badge tone="red">{t('admin.common.suspended')}: {formatNumber(summary.suspended, i18n.language)}</Badge>
      </div>

      <Panel noPadding>
        <div className="flex flex-col gap-2.5 border-b border-line p-3.5 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.students.searchPlaceholder')}
              className="input h-9 ps-9 text-xs"
              aria-label={t('admin.common.search')}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="input h-9 text-xs" aria-label={t('admin.common.status')}>
              <option value="">{t('admin.students.allStatuses')}</option>
              <option value="active">{t('admin.common.active')}</option>
              <option value="suspended">{t('admin.common.suspended')}</option>
            </select>
            <select value={activity} onChange={(event) => setActivity(event.target.value)} className="input h-9 text-xs" aria-label={t('admin.common.filter')}>
              <option value="">{t('admin.students.allActivity')}</option>
              <option value="active">{t('admin.students.onlyActive')}</option>
              <option value="inactive">{t('admin.students.onlyInactive')}</option>
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="input col-span-2 h-9 text-xs sm:col-span-1" aria-label={t('admin.common.filter')}>
              {sorts.map((option) => (
                <option key={option} value={option}>
                  {t(`admin.students.sort${option.charAt(0).toUpperCase()}${option.slice(1)}`, { defaultValue: option })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && rows.length === 0 ? (
          <LoadingState label={t('admin.common.loading')} />
        ) : error ? (
          <ErrorState title={t('admin.errors.loadStudents')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />
        ) : rows.length === 0 ? (
          <EmptyState title={t('admin.students.noStudents')} icon={Users} />
        ) : (
          <>
            <div className="admin-scroll hidden overflow-x-auto md:block">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.students.name')}</th>
                    <th>{t('admin.common.status')}</th>
                    <th>{t('admin.students.joined')}</th>
                    <th>{t('admin.students.lastActive')}</th>
                    <th>{t('admin.students.lessonsDone')}</th>
                    <th>{t('admin.students.quizzesTaken')}</th>
                    <th>{t('admin.students.bestScore')}</th>
                    <th>{t('admin.common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <Link to={`/admin/students/${student._id}`} className="group flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-[10px] font-extrabold text-success-ink">
                            {initials(student.name)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-extrabold text-ink group-hover:text-primary dark:group-hover:text-brand-ink">{student.name}</span>
                            <span className="block truncate text-[10px] text-ink-muted" dir="ltr">{student.email}</span>
                          </span>
                        </Link>
                      </td>
                      <td>
                        <div className="flex flex-col items-start gap-1">
                          <Badge tone={student.status === 'suspended' ? 'red' : 'green'}>
                            {student.status === 'suspended' ? t('admin.common.suspended') : t('admin.common.active')}
                          </Badge>
                          {student.active && <span className="text-[9px] font-bold text-success-ink">• {t('admin.common.active')}</span>}
                        </div>
                      </td>
                      <td className="text-[11px] text-ink-muted">{formatDate(student.createdAt, i18n.language)}</td>
                      <td className="text-[11px] text-ink-muted">{student.lastActive ? relativeTime(student.lastActive, i18n.language) : t('admin.students.neverActive')}</td>
                      <td className="font-bold">{formatNumber(student.completedLessonCount || 0, i18n.language)}</td>
                      <td className="font-bold">{formatNumber(student.quizAttemptCount || 0, i18n.language)}</td>
                      <td className="font-bold">{formatPercent(student.bestQuiz, i18n.language)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/admin/students/${student._id}`}
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                            aria-label={t('admin.common.view')}
                            title={t('admin.common.view')}
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setPending({
                                student,
                                status: student.status === 'suspended' ? 'active' : 'suspended',
                              })
                            }
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                              student.status === 'suspended'
                                ? 'border-success-soft text-success-ink hover:bg-success-soft'
                                : 'border-line text-ink-muted hover:bg-danger-soft hover:text-danger'
                            }`}
                            aria-label={student.status === 'suspended' ? t('admin.students.activate') : t('admin.students.suspend')}
                            title={student.status === 'suspended' ? t('admin.students.activate') : t('admin.students.suspend')}
                          >
                            {student.status === 'suspended' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-line md:hidden">
              {rows.map((student) => (
                <div key={student._id} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-xs font-extrabold text-success-ink">
                      {initials(student.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link to={`/admin/students/${student._id}`} className="block truncate text-sm font-extrabold text-ink">
                        {student.name}
                      </Link>
                      <p className="flex items-center gap-1 truncate text-[10px] text-ink-muted" dir="ltr">
                        <Mail className="h-3 w-3 shrink-0" /> {student.email}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge tone={student.status === 'suspended' ? 'red' : 'green'}>
                          {student.status === 'suspended' ? t('admin.common.suspended') : t('admin.common.active')}
                        </Badge>
                        <Badge tone="outline">{student.lastActive ? relativeTime(student.lastActive, i18n.language) : t('admin.students.neverActive')}</Badge>
                      </div>
                      <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
                        <div className="rounded-lg bg-surface-muted px-1 py-1.5">
                          <p className="text-[9px] font-bold text-ink-muted">{t('admin.students.lessonsDone')}</p>
                          <p className="text-xs font-extrabold text-ink">{formatNumber(student.completedLessonCount || 0, i18n.language)}</p>
                        </div>
                        <div className="rounded-lg bg-surface-muted px-1 py-1.5">
                          <p className="text-[9px] font-bold text-ink-muted">{t('admin.students.quizzesTaken')}</p>
                          <p className="text-xs font-extrabold text-ink">{formatNumber(student.quizAttemptCount || 0, i18n.language)}</p>
                        </div>
                        <div className="rounded-lg bg-surface-muted px-1 py-1.5">
                          <p className="text-[9px] font-bold text-ink-muted">{t('admin.students.bestScore')}</p>
                          <p className="text-xs font-extrabold text-ink">{formatPercent(student.bestQuiz, i18n.language)}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-1.5">
                        <Link to={`/admin/students/${student._id}`} className="btn-secondary h-8 flex-1 text-[10px]">
                          <UserRound className="h-3 w-3" /> {t('admin.common.view')}
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setPending({
                              student,
                              status: student.status === 'suspended' ? 'active' : 'suspended',
                            })
                          }
                          className="btn-secondary h-8 text-[10px]"
                        >
                          {student.status === 'suspended' ? <ShieldCheck className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                          {student.status === 'suspended' ? t('admin.students.activate') : t('admin.students.suspend')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

      <ConfirmDialog
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        onConfirm={confirmStatusChange}
        title={pending?.status === 'suspended' ? t('admin.students.suspend') : t('admin.students.activate')}
        message={pending?.status === 'suspended' ? t('admin.students.suspendConfirm') : t('admin.students.activateConfirm')}
        confirmLabel={pending?.status === 'suspended' ? t('admin.students.suspend') : t('admin.students.activate')}
        cancelLabel={t('admin.common.cancel')}
        busy={busy}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
