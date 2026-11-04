import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from '../../components/icons';
import { adminApi, formatNumber, localize } from '../../lib/admin';
import {
  Badge,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
} from '../../components/admin/ui';
import Toast from '../../components/Toast';

export default function AdminCourses() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .courses({ search, status })
      .then((data) => setCourses(data.courses || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = window.setTimeout(load, 280);
    return () => window.clearTimeout(timer);
  }, [search, status]);

  // توجيه مباشر إلى الاستوديو الجديد عوض الـ Modal القديمة
  const openCreate = () => {
    navigate('/admin/lessons/new');
  };

  const openEdit = (course) => {
    navigate(`/admin/courses/${course._id}/lessons/new`);
  };

  const removeCourse = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await adminApi.deleteCourse(deleting._id);
      setToast({ type: 'success', message: t('admin.courses.courseDeleted') });
      setDeleting(null);
      load();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setDeleteBusy(false);
    }
  };

  const publishedCount = courses.filter((course) => course.published).length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={t('admin.shell.workspace')}
        title={t('admin.courses.title')}
        subtitle={t('admin.courses.subtitle')}
        actions={
          <>
            <button
              type="button"
              onClick={load}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-card text-ink transition-colors hover:bg-surface-muted"
              aria-label={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button type="button" onClick={openCreate} className="btn-primary h-9 px-3.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> {t('admin.courses.newCourse')}
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="sage"><BookOpen className="h-3 w-3" /> {formatNumber(courses.length, i18n.language)} {t('admin.common.courses')}</Badge>
        <Badge tone="green">{t('admin.common.published')}: {formatNumber(publishedCount, i18n.language)}</Badge>
        <Badge tone="amber">{t('admin.common.draft')}: {formatNumber(courses.length - publishedCount, i18n.language)}</Badge>
      </div>

      <Panel noPadding>
        <div className="flex flex-col gap-2.5 border-b border-line p-3.5 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.courses.searchPlaceholder')}
              className="input h-9 ps-9 text-xs"
              aria-label={t('admin.common.search')}
            />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="input h-9 text-xs sm:w-40" aria-label={t('admin.common.status')}>
            <option value="">{t('admin.courses.allStatuses')}</option>
            <option value="published">{t('admin.courses.onlyPublished')}</option>
            <option value="draft">{t('admin.courses.onlyDraft')}</option>
          </select>
        </div>

        {loading && courses.length === 0 ? (
          <LoadingState label={t('admin.common.loading')} />
        ) : error ? (
          <ErrorState title={t('admin.errors.loadCourses')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />
        ) : courses.length === 0 ? (
          <EmptyState
            title={t('admin.courses.noCourses')}
            icon={BookOpen}
            action={<button type="button" onClick={openCreate} className="btn-primary h-9 px-4 text-xs"><Plus className="h-3.5 w-3.5" />{t('admin.courses.newCourse')}</button>}
          />
        ) : (
          <div className="grid gap-3 p-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <article key={course._id} className="admin-card group overflow-hidden">
                <div className="relative h-36 overflow-hidden bg-surface-muted">
                  {course.image ? (
                    <img src={course.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-muted"><ImageIcon className="h-8 w-8" /></div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#4682A9]/70 to-transparent" />
                  <div className="absolute start-2.5 top-2.5 flex gap-1.5">
                    <Badge tone={course.published ? 'green' : 'amber'}>
                      {course.published ? t('admin.common.published') : t('admin.common.draft')}
                    </Badge>
                  </div>
                  <div className="absolute end-2.5 top-2.5 flex gap-1">
                    <button type="button" onClick={() => openEdit(course)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-primary shadow-sm backdrop-blur transition-colors hover:bg-white" aria-label={t('admin.common.edit')} title={t('admin.common.edit')}>
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setDeleting(course)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-danger shadow-sm backdrop-blur transition-colors hover:bg-white" aria-label={t('admin.common.delete')} title={t('admin.common.delete')}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="absolute inset-x-3 bottom-2.5">
                    <p className="truncate text-[10px] font-extrabold uppercase tracking-wider text-white/70">
                      {t(`admin.courses.categories.${course.category}`, { defaultValue: course.category })}
                    </p>
                    <h3 className="truncate font-display text-base font-bold text-white">{localize(course.title, i18n.language)}</h3>
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="line-clamp-2 min-h-[2.4rem] text-[11px] leading-relaxed text-ink-muted">
                    {localize(course.description, i18n.language)}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    <div className="rounded-lg bg-surface-muted px-1.5 py-1.5 text-center">
                      <p className="text-[9px] font-bold text-ink-muted">{t('admin.common.lessons')}</p>
                      <p className="text-xs font-extrabold text-ink">{formatNumber(course.lessonCount || 0, i18n.language)}</p>
                    </div>
                    <div className="rounded-lg bg-surface-muted px-1.5 py-1.5 text-center">
                      <p className="text-[9px] font-bold text-ink-muted">{t('admin.common.quizzes')}</p>
                      <p className="text-xs font-extrabold text-ink">{formatNumber(course.quizCount || 0, i18n.language)}</p>
                    </div>
                    <div className="rounded-lg bg-surface-muted px-1.5 py-1.5 text-center">
                      <p className="text-[9px] font-bold text-ink-muted">{t('admin.courses.estimatedMinutes')}</p>
                      <p className="text-xs font-extrabold text-ink">{formatNumber(course.estimatedMinutes, i18n.language)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-ink-muted">
                      {t(`admin.courses.difficulties.${course.difficulty}`, { defaultValue: course.difficulty })}
                    </span>
                    <Link to={`/admin/courses/${course._id}`} className="inline-flex items-center gap-1 text-[10px] font-extrabold text-primary hover:underline dark:text-brand-ink">
                      {t('admin.courses.openCourse')} <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={removeCourse}
        title={t('admin.common.delete')}
        message={t('admin.courses.deleteConfirm')}
        confirmLabel={t('admin.common.delete')}
        cancelLabel={t('admin.common.cancel')}
        busy={deleteBusy}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}