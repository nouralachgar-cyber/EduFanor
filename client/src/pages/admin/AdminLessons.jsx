import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from '../../components/icons';
import { adminApi, formatDateTime, formatNumber, localize } from '../../lib/admin';
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

export default function AdminLessons() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const loadLessons = () => {
    setLoading(true);
    setError('');
    adminApi
      .lessons({ search, course: courseFilter, status: statusFilter })
      .then((data) => setLessons(data.lessons || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = window.setTimeout(loadLessons, 280);
    return () => window.clearTimeout(timer);
  }, [search, courseFilter, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    adminApi
      .courses()
      .then((data) => setCourses(data.courses || []))
      .catch(() => setCourses([]));
  }, []);

  const togglePublish = async (lesson) => {
    setTogglingId(lesson._id);
    try {
      await adminApi.updateLesson(lesson._id, {
        course: lesson.course?._id || lesson.course,
        title: lesson.title,
        content: lesson.content || { ar: '', en: '' },
        blocks: lesson.blocks || { ar: [], en: [] },
        objectives: lesson.objectives || { ar: [], en: [] },
        safetyNotes: lesson.safetyNotes || { ar: '', en: '' },
        images: lesson.images || [],
        videoUrl: lesson.videoUrl || '',
        coverImage: lesson.coverImage || '',
        estimatedMinutes: lesson.estimatedMinutes,
        difficulty: lesson.difficulty,
        sourceRefs: lesson.sourceRefs || [],
        reviewStatus: lesson.reviewStatus || 'unreviewed',
        order: lesson.order || 0,
        published: !lesson.published,
      });
      setToast({
        type: 'success',
        message: t(lesson.published ? 'admin.lessonsPage.unpublishedToast' : 'admin.lessonsPage.publishedToast'),
      });
      loadLessons();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setTogglingId(null);
    }
  };

  const removeLesson = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await adminApi.deleteLesson(deleting._id);
      setToast({ type: 'success', message: t('admin.lessonsPage.deletedToast') });
      setDeleting(null);
      loadLessons();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setDeleteBusy(false);
    }
  };

  const publishedCount = lessons.filter((lesson) => lesson.published).length;
  const blockCount = (lesson) => {
    const ar = Array.isArray(lesson.blocks?.ar) ? lesson.blocks.ar.length : 0;
    const en = Array.isArray(lesson.blocks?.en) ? lesson.blocks.en.length : 0;
    return Math.max(ar, en);
  };

  return (
    <div className="space-y-6 bg-[#F6F5F2] min-h-screen p-4 sm:p-6 text-[#415E72]">
      <PageHeader
        eyebrow={t('admin.shell.workspace')}
        title={t('admin.lessonsPage.title')}
        subtitle={t('admin.lessonsPage.subtitle')}
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadLessons}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5B0CD] bg-[#F6F5F2] text-[#415E72] transition-colors hover:bg-[#C5B0CD]/30 shadow-sm xl:h-10 xl:w-10"
              aria-label={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin/lessons/new')} 
              className="flex min-h-11 items-center gap-1.5 rounded-xl bg-[#415E72] px-4 py-2.5 text-xs font-extrabold text-[#F6F5F2] shadow-sm hover:bg-[#415E72]/90"
            >
              <Plus className="h-4 w-4 text-[#C5B0CD]" /> {t('admin.lessonsPage.newLesson')}
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="sage" className="bg-[#F6F5F2] text-[#415E72] border border-[#C5B0CD]"><Layers className="h-3 w-3 text-[#C5B0CD]" /> {t('admin.common.lessons')}: {formatNumber(lessons.length, i18n.language)}</Badge>
        <Badge tone="green" className="bg-emerald-50 text-emerald-800 border border-emerald-200"><Eye className="h-3 w-3" /> {t('admin.common.published')}: {formatNumber(publishedCount, i18n.language)}</Badge>
        <Badge tone="amber" className="bg-amber-50 text-amber-800 border border-amber-200"><EyeOff className="h-3 w-3" /> {t('admin.common.draft')}: {formatNumber(lessons.length - publishedCount, i18n.language)}</Badge>
      </div>

      <Panel noPadding className="bg-white border border-[#C5B0CD]/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#C5B0CD]/30 p-4 bg-[#F6F5F2]/50 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#415E72]/60" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.lessonsPage.searchPlaceholder')}
              className="min-h-11 w-full rounded-xl border border-[#C5B0CD] bg-white py-3 ps-10 pe-4 text-base text-[#415E72] focus:outline-none focus:ring-2 focus:ring-[#415E72] shadow-sm"
              aria-label={t('admin.common.search')}
            />
          </div>
          <select 
            value={courseFilter} 
            onChange={(event) => setCourseFilter(event.target.value)} 
            className="min-h-11 rounded-xl border border-[#C5B0CD] bg-white px-4 py-2.5 text-xs text-[#415E72] focus:outline-none focus:ring-2 focus:ring-[#415E72] sm:w-52 shadow-sm"
            aria-label={t('admin.lessonsPage.filterCourse')}
          >
            <option value="">{t('admin.lessonsPage.allCourses')}</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {localize(course.title, i18n.language)}
              </option>
            ))}
          </select>
          <select 
            value={statusFilter} 
            onChange={(event) => setStatusFilter(event.target.value)} 
            className="min-h-11 rounded-xl border border-[#C5B0CD] bg-white px-4 py-2.5 text-xs text-[#415E72] focus:outline-none focus:ring-2 focus:ring-[#415E72] sm:w-40 shadow-sm"
            aria-label={t('admin.common.status')}
          >
            <option value="">{t('admin.courses.allStatuses')}</option>
            <option value="published">{t('admin.courses.onlyPublished')}</option>
            <option value="draft">{t('admin.courses.onlyDraft')}</option>
          </select>
        </div>

        {loading && lessons.length === 0 ? (
          <LoadingState label={t('admin.common.loading')} />
        ) : error ? (
          <ErrorState title={t('admin.errors.loadLessons')} message={error} onRetry={loadLessons} retryLabel={t('admin.common.retry')} />
        ) : lessons.length === 0 ? (
          <EmptyState
            title={t('admin.lessonsPage.noLessons')}
            icon={FileText}
            action={
              <button type="button" onClick={() => navigate('/admin/lessons/new')} className="flex min-h-11 items-center gap-1.5 rounded-xl bg-[#415E72] px-4 py-2.5 text-xs font-extrabold text-[#F6F5F2] shadow-sm hover:bg-[#415E72]/90">
                <Plus className="h-4 w-4 text-[#C5B0CD]" /> {t('admin.lessonsPage.newLesson')}
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-[#C5B0CD]/20">
            {lessons.map((lesson) => {
              const courseTitle = localize(lesson.course?.title, i18n.language) || '—';
              const blocks = blockCount(lesson);
              return (
                <div key={lesson._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-[#F6F5F2]/60 transition-colors">
                  <div className="flex min-w-0 items-start gap-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F6F5F2] text-xs font-extrabold text-[#415E72] border border-[#C5B0CD]/50">
                      {formatNumber(lesson.order || 0, i18n.language)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-extrabold text-[#415E72]">{localize(lesson.title, i18n.language)}</p>
                        <Badge tone={lesson.published ? 'green' : 'amber'} className="bg-[#F6F5F2] text-[#415E72] border border-[#C5B0CD]">
                          {lesson.published ? t('admin.common.published') : t('admin.common.draft')}
                        </Badge>
                        <Badge tone={lesson.reviewStatus === 'reviewed' ? 'green' : lesson.reviewStatus === 'in_review' ? 'amber' : 'outline'} className="bg-[#F6F5F2] text-[#415E72] border border-[#C5B0CD]">
                          {t(`admin.courses.${lesson.reviewStatus || 'unreviewed'}`)}
                        </Badge>
                        <Badge tone="outline" className="bg-[#F6F5F2] text-[#415E72] border border-[#C5B0CD]"><Layers className="h-3 w-3 text-[#C5B0CD]" /> {formatNumber(blocks, i18n.language)} {t('admin.courses.blocksCount')}</Badge>
                      </div>
                      <p className="mt-1 text-[10px] font-bold text-[#415E72]/70">
                        {t('admin.lessonsPage.courseCol')}: {courseTitle} · {formatDateTime(lesson.updatedAt, i18n.language)}
                      </p>
                      <p className="mt-0.5 line-clamp-1 max-w-2xl text-xs text-[#415E72]/80">
                        {localize(lesson.content, i18n.language) || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => togglePublish(lesson)}
                      disabled={togglingId === lesson._id}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5B0CD] bg-[#F6F5F2] text-[#415E72] transition-colors hover:bg-[#C5B0CD]/30 shadow-sm disabled:opacity-40 xl:h-8 xl:w-8"
                      aria-label={lesson.published ? t('admin.lessonsPage.unpublish') : t('admin.lessonsPage.publishNow')}
                      title={lesson.published ? t('admin.lessonsPage.unpublish') : t('admin.lessonsPage.publishNow')}
                    >
                      {togglingId === lesson._id ? (
                        <RefreshCw className="h-4 w-4 animate-spin text-[#C5B0CD]" />
                      ) : lesson.published ? (
                        <EyeOff className="h-4 w-4 text-[#C5B0CD]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#C5B0CD]" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/lessons/${lesson._id}`)}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5B0CD] bg-[#F6F5F2] text-[#415E72] transition-colors hover:bg-[#C5B0CD]/30 shadow-sm xl:h-8 xl:w-8"
                      aria-label={t('admin.common.edit')}
                      title={t('admin.common.edit')}
                    >
                      <Edit3 className="h-4 w-4 text-[#C5B0CD]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(lesson)}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 shadow-sm xl:h-8 xl:w-8"
                      aria-label={t('admin.common.delete')}
                      title={t('admin.common.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={removeLesson}
        title={t('admin.editor.deleteLessonTitle')}
        message={t('admin.editor.deleteLessonConfirm')}
        confirmLabel={t('admin.common.delete')}
        cancelLabel={t('admin.common.cancel')}
        busy={deleteBusy}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
