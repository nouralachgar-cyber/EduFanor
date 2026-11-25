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
} from '../../components/icons';
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
    <div className="space-y-6 bg-canvas min-h-screen p-4 text-ink sm:p-6">
      <PageHeader
        eyebrow={t('admin.shell.workspace')}
        title={t('admin.students.title')}
        subtitle={t('admin.students.subtitle')}
        actions={
          <button
            type="button"
            onClick={load}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-2 text-ink transition-colors hover:bg-highlight shadow-sm xl:h-10 xl:w-10"
            aria-label={t('admin.common.refresh')}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="green" className="bg-surface-2 text-ink border border-line">
          <Users className="h-3.5 w-3.5 text-lavender" /> {formatNumber(pagination.total, i18n.language)} {t('admin.common.students')}
        </Badge>
        <Badge tone="sage" className="bg-positive-soft text-positive-ink border border-line">{t('admin.common.active')}: {formatNumber(summary.active, i18n.language)}</Badge>
        <Badge tone="red" className="bg-negative-soft text-negative-ink border border-line">{t('admin.common.suspended')}: {formatNumber(summary.suspended, i18n.language)}</Badge>
      </div>

      <Panel noPadding className="bg-surface border border-line rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 bg-surface-2 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.students.searchPlaceholder')}
              className="min-h-11 w-full rounded-xl border border-line bg-surface py-2.5 ps-10 pe-4 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              aria-label={t('admin.common.search')}
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" aria-label={t('admin.common.status')}>
              <option value="">{t('admin.students.allStatuses')}</option>
              <option value="active">{t('admin.common.active')}</option>
              <option value="suspended">{t('admin.common.suspended')}</option>
            </select>
            <select value={activity} onChange={(event) => setActivity(event.target.value)} className="min-h-11 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" aria-label={t('admin.common.filter')}>
              <option value="">{t('admin.students.allActivity')}</option>
              <option value="active">{t('admin.students.onlyActive')}</option>
              <option value="inactive">{t('admin.students.onlyInactive')}</option>
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-11 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary col-span-2 sm:col-span-1 shadow-sm" aria-label={t('admin.common.filter')}>
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
              <table className="admin-table w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line bg-surface-2 text-xs text-ink">
                    <th className="p-3.5">{t('admin.students.name')}</th>
                    <th className="p-3.5">{t('admin.common.status')}</th>
                    <th className="p-3.5">{t('admin.students.joined')}</th>
                    <th className="p-3.5">{t('admin.students.lastActive')}</th>
                    <th className="p-3.5">{t('admin.students.lessonsDone')}</th>
                    <th className="p-3.5">{t('admin.students.quizzesTaken')}</th>
                    <th className="p-3.5">{t('admin.students.bestScore')}</th>
                    <th className="p-3.5">{t('admin.common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-xs">
                  {rows.map((student) => (
                    <tr key={student._id} className="hover:bg-surface-2 transition-colors">
                      <td className="p-3.5">
                        <Link to={`/admin/students/${student._id}`} className="group flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-extrabold text-ink border border-line">
                            {initials(student.name)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-extrabold text-ink group-hover:text-lavender">{student.name}</span>
                            <span className="block truncate text-[10px] text-ink-soft" dir="ltr">{student.email}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-col items-start gap-1">
                          <Badge tone={student.status === 'suspended' ? 'red' : 'green'} className={student.status === 'suspended' ? 'bg-negative-soft text-negative-ink border border-line' : 'bg-positive-soft text-positive-ink border border-line'}>
                            {student.status === 'suspended' ? t('admin.common.suspended') : t('admin.common.active')}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-3.5 text-xs text-ink-soft">{formatDate(student.createdAt, i18n.language)}</td>
                      <td className="p-3.5 text-xs text-ink-soft">{student.lastActive ? relativeTime(student.lastActive, i18n.language) : t('admin.students.neverActive')}</td>
                      <td className="p-3.5 font-bold text-ink">{formatNumber(student.completedLessonCount || 0, i18n.language)}</td>
                      <td className="p-3.5 font-bold text-ink">{formatNumber(student.quizAttemptCount || 0, i18n.language)}</td>
                      <td className="p-3.5 font-bold text-ink">{formatPercent(student.bestQuiz, i18n.language)}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/students/${student._id}`}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-2 text-ink transition-colors hover:bg-highlight shadow-sm xl:h-8 xl:w-8"
                            aria-label={t('admin.common.view')}
                            title={t('admin.common.view')}
                          >
                            <ArrowUpRight className="h-4 w-4 text-lavender" />
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setPending({
                                student,
                                status: student.status === 'suspended' ? 'active' : 'suspended',
                              })
                            }
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors shadow-sm xl:h-8 xl:w-8 ${
                              student.status === 'suspended'
                                ? 'border-line bg-positive-soft text-positive-ink hover:bg-highlight'
                                : 'border-line bg-negative-soft text-negative-ink hover:bg-highlight'
                            }`}
                            aria-label={student.status === 'suspended' ? t('admin.students.activate') : t('admin.students.suspend')}
                            title={student.status === 'suspended' ? t('admin.students.activate') : t('admin.students.suspend')}
                          >
                            {student.status === 'suspended' ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
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
                <div key={student._id} className="p-4 hover:bg-surface-2 transition-colors">
                  <div className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-extrabold text-ink border border-line">
                      {initials(student.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link to={`/admin/students/${student._id}`} className="block truncate text-xs font-extrabold text-ink">
                        {student.name}
                      </Link>
                      <p className="flex items-center gap-1.5 truncate text-[10px] text-ink-soft" dir="ltr">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-lavender" /> {student.email}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <Badge tone={student.status === 'suspended' ? 'red' : 'green'} className={student.status === 'suspended' ? 'bg-negative-soft text-negative-ink border border-line' : 'bg-positive-soft text-positive-ink border border-line'}>
                          {student.status === 'suspended' ? t('admin.common.suspended') : t('admin.common.active')}
                        </Badge>
                        <Badge tone="outline" className="bg-surface-2 text-ink border border-line">{student.lastActive ? relativeTime(student.lastActive, i18n.language) : t('admin.students.neverActive')}</Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-xl border border-line bg-surface-2 p-2">
                          <p className="text-[9px] font-bold text-muted">{t('admin.students.lessonsDone')}</p>
                          <p className="text-xs font-extrabold text-ink">{formatNumber(student.completedLessonCount || 0, i18n.language)}</p>
                        </div>
                        <div className="rounded-xl border border-line bg-surface-2 p-2">
                          <p className="text-[9px] font-bold text-muted">{t('admin.students.quizzesTaken')}</p>
                          <p className="text-xs font-extrabold text-ink">{formatNumber(student.quizAttemptCount || 0, i18n.language)}</p>
                        </div>
                        <div className="rounded-xl border border-line bg-surface-2 p-2">
                          <p className="text-[9px] font-bold text-muted">{t('admin.students.bestScore')}</p>
                          <p className="text-xs font-extrabold text-ink">{formatPercent(student.bestQuiz, i18n.language)}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link to={`/admin/students/${student._id}`} className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-surface-2 py-2 text-center text-xs font-bold text-ink shadow-sm transition-colors hover:bg-highlight">
                          <UserRound className="h-3.5 w-3.5 text-lavender" /> {t('admin.common.view')}
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setPending({
                              student,
                              status: student.status === 'suspended' ? 'active' : 'suspended',
                            })
                          }
                          className={`flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-sm ${
                            student.status === 'suspended'
                              ? 'bg-positive-soft text-positive-ink border border-line'
                              : 'bg-negative-soft text-negative-ink border border-line'
                          }`}
                        >
                          {student.status === 'suspended' ? <ShieldCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
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