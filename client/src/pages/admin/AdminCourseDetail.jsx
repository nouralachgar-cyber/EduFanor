import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, BookOpen, Edit3, Plus, RefreshCw, Trash2 } from '../../components/icons';
import { adminApi, formatNumber, localize } from '../../lib/admin';
import { Badge, EmptyState, ErrorState, LoadingState, PageHeader, Panel } from '../../components/admin/ui';
import Toast from '../../components/Toast';

export default function AdminCourseDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [courseData, lessonData] = await Promise.all([
        adminApi.course(id),
        adminApi.lessons({ course: id }),
      ]);
      setCourse(courseData?.course || null);
      setLessons(lessonData?.lessons || []);
    } catch (err) {
      setError(err.message || t('admin.errors.loadCourse'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading && !course) return <LoadingState label={t('admin.common.loading')} />;
  if (error) return <ErrorState title={t('admin.errors.loadCourse')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />;
  if (!course) return <EmptyState title={t('admin.courses.noCourses')} icon={BookOpen} />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t('admin.shell.workspace')}
        title={localize(course.title, i18n.language)}
        subtitle={localize(course.description, i18n.language)}
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={load}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-ink transition-colors hover:bg-surface-muted"
              aria-label={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to={`/admin/courses/${id}/lessons/new`}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" /> {t('admin.lessonsPage.newLesson')}
            </Link>
          </div>
        }
      />

      <Panel className="space-y-3">
        {lessons.length === 0 ? (
          <EmptyState
            title={t('admin.lessonsPage.noLessons')}
            icon={BookOpen}
            action={
              <Link to={`/admin/courses/${id}/lessons/new`} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-white">
                <Plus className="h-4 w-4" /> {t('admin.lessonsPage.newLesson')}
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-line">
            {lessons.map((lesson) => (
              <div key={lesson._id} className="flex items-center justify-between gap-3 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-ink">{localize(lesson.title, i18n.language)}</p>
                  <p className="text-[11px] text-ink-muted">
                    {lesson.published ? t('admin.common.published') : t('admin.common.draft')}
                    {lesson.estimatedMinutes ? ` · ${formatNumber(lesson.estimatedMinutes, i18n.language)} ${t('admin.courses.estimatedMinutes')}` : ''}
                  </p>
                </div>
                <Link
                  to={`/admin/courses/${id}/lessons/${lesson._id}`}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-primary hover:text-primary-hover"
                >
                  {t('admin.common.edit')} <Edit3 className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
