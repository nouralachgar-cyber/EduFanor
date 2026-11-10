import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import CourseFormModal from '../../components/admin/CourseFormModal';
import Toast from '../../components/Toast';

export default function AdminCourses() {
  const { t, i18n } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
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

  const openCreate = () => {
    setEditingCourse(null);
    setFormOpen(true);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setFormOpen(true);
  };

  const onCourseSaved = () => {
    setFormOpen(false);
    setEditingCourse(null);
    setToast({ type: 'success', message: t('admin.courseEditor.savedToast') });
    load();
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
    <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C]">
      <PageHeader
        eyebrow={t('admin.shell.workspace')}
        title={t('admin.courses.title')}
        subtitle={t('admin.courses.subtitle')}
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={load}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DD88CF] bg-[#F8E7F6] text-[#4B164C] transition-colors hover:bg-[#DD88CF]/30 shadow-sm"
              aria-label={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              type="button" 
              onClick={openCreate} 
              className="flex items-center gap-1.5 rounded-xl bg-[#4B164C] px-4 py-2.5 text-xs font-extrabold text-[#F8E7F6] shadow-sm hover:bg-[#4B164C]/90"
            >
              <Plus className="h-4 w-4 text-[#DD88CF]" /> {t('admin.courses.newCourse')}
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="sage" className="bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]"><BookOpen className="h-3 w-3 text-[#DD88CF]" /> {formatNumber(courses.length, i18n.language)} {t('admin.common.courses')}</Badge>
        <Badge tone="green" className="bg-emerald-50 text-emerald-800 border border-emerald-200">{t('admin.common.published')}: {formatNumber(publishedCount, i18n.language)}</Badge>
        <Badge tone="amber" className="bg-amber-50 text-amber-800 border border-amber-200">{t('admin.common.draft')}: {formatNumber(courses.length - publishedCount, i18n.language)}</Badge>
      </div>

      <Panel noPadding className="bg-white border border-[#DD88CF]/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#DD88CF]/30 p-4 bg-[#F8E7F6]/50 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B164C]/60" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.courses.searchPlaceholder')}
              className="w-full rounded-xl border border-[#DD88CF] bg-white py-2.5 ps-10 pe-4 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm"
              aria-label={t('admin.common.search')}
            />
          </div>
          <select 
            value={status} 
            onChange={(event) => setStatus(event.target.value)} 
            className="rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] sm:w-44 shadow-sm" 
            aria-label={t('admin.common.status')}
          >
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
            action={<button type="button" onClick={openCreate} className="flex items-center gap-1.5 rounded-xl bg-[#4B164C] px-4 py-2.5 text-xs font-extrabold text-[#F8E7F6] shadow-sm"><Plus className="h-4 w-4 text-[#DD88CF]" />{t('admin.courses.newCourse')}</button>}
          />
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <article key={course._id} className="rounded-2xl border border-[#DD88CF]/40 bg-[#F5F5F5] overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                <div>
                  <div className="relative h-40 overflow-hidden bg-white border-b border-[#DD88CF]/30">
                    {course.image ? (
                      <img src={course.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#4B164C]/50"><ImageIcon className="h-8 w-8 text-[#DD88CF]" /></div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#4B164C]/80 to-transparent" />
                    <div className="absolute start-3 top-3 flex gap-1.5">
                      <Badge tone={course.published ? 'green' : 'amber'} className="bg-white/90 text-[#4B164C] border border-[#DD88CF]">
                        {course.published ? t('admin.common.published') : t('admin.common.draft')}
                      </Badge>
                    </div>
                    <div className="absolute end-3 top-3 flex gap-1.5">
                      <button type="button" onClick={() => openEdit(course)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#4B164C] shadow-sm transition-colors hover:bg-[#F8E7F6] border border-[#DD88CF]" aria-label={t('admin.common.edit')} title={t('admin.common.edit')}>
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => setDeleting(course)} className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm transition-colors hover:bg-red-50 border border-red-200" aria-label={t('admin.common.delete')} title={t('admin.common.delete')}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="absolute inset-x-3 bottom-2.5">
                      <p className="truncate text-[10px] font-extrabold uppercase tracking-wider text-[#F8E7F6]">
                        {t(`admin.courses.categories.${course.category}`, { defaultValue: course.category })}
                      </p>
                      <h3 className="truncate font-display text-base font-bold text-white">{localize(course.title, i18n.language)}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 min-h-[2.4rem] text-xs leading-relaxed text-[#4B164C]/80">
                      {localize(course.description, i18n.language)}
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-white p-2 text-center border border-[#DD88CF]/40">
                        <p className="text-[9px] font-bold text-[#4B164C]/60">{t('admin.common.lessons')}</p>
                        <p className="text-xs font-extrabold text-[#4B164C]">{formatNumber(course.lessonCount || 0, i18n.language)}</p>
                      </div>
                      <div className="rounded-xl bg-white p-2 text-center border border-[#DD88CF]/40">
                        <p className="text-[9px] font-bold text-[#4B164C]/60">{t('admin.common.quizzes')}</p>
                        <p className="text-xs font-extrabold text-[#4B164C]">{formatNumber(course.quizCount || 0, i18n.language)}</p>
                      </div>
                      <div className="rounded-xl bg-white p-2 text-center border border-[#DD88CF]/40">
                        <p className="text-[9px] font-bold text-[#4B164C]/60">{t('admin.courses.estimatedMinutes')}</p>
                        <p className="text-xs font-extrabold text-[#4B164C]">{formatNumber(course.estimatedMinutes, i18n.language)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-2 flex items-center justify-between gap-2 border-t border-[#DD88CF]/20">
                  <span className="text-[10px] font-bold text-[#4B164C]/70">
                    {t(`admin.courses.difficulties.${course.difficulty}`, { defaultValue: course.difficulty })}
                  </span>
                  <Link to={`/admin/courses/${course._id}`} className="inline-flex items-center gap-1 text-xs font-extrabold text-[#4B164C] hover:text-[#DD88CF] transition-colors">
                    {t('admin.courses.openCourse')} <ArrowUpRight className="h-3.5 w-3.5 text-[#DD88CF]" />
                  </Link>
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

      <CourseFormModal
        open={formOpen}
        course={editingCourse}
        onClose={() => {
          setFormOpen(false);
          setEditingCourse(null);
        }}
        onSaved={onCourseSaved}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}