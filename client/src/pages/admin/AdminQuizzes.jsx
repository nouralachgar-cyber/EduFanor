import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ClipboardCheck,
  Edit3,
  Eye,
  EyeOff,
  FileQuestion,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from '../../components/icons';
import { adminApi, formatNumber, formatPercent, localize } from '../../lib/admin';
import { Badge, ConfirmDialog, EmptyState, ErrorState, LoadingState, PageHeader, Panel } from '../../components/admin/ui';
import QuizEditorModal from '../../components/admin/QuizEditorModal';
import Toast from '../../components/Toast';

export default function AdminQuizzes() {
  const { t, i18n } = useTranslation();
  const [quizzes, setQuizzes] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [lessonFilter, setLessonFilter] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const loadQuizzes = () => {
    setLoading(true);
    setError('');
    adminApi
      .quizzes({ search, lesson: lessonFilter })
      .then((data) => setQuizzes(data.quizzes || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = window.setTimeout(loadQuizzes, 280);
    return () => window.clearTimeout(timer);
  }, [search, lessonFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    adminApi
      .lessons()
      .then((data) => setLessons(data.lessons || []))
      .catch(() => setLessons([]));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (quiz) => {
    setEditing(quiz);
    setEditorOpen(true);
  };

  const togglePublish = async (quiz) => {
    setTogglingId(quiz._id);
    try {
      await adminApi.updateQuiz(quiz._id, {
        title: quiz.title,
        lesson: quiz.lesson?._id || quiz.lesson,
        passingScore: quiz.passingScore,
        published: !quiz.published,
        questions: quiz.questions || [],
      });
      setToast({
        type: 'success',
        message: t(quiz.published ? 'admin.quizzesPage.unpublishedToast' : 'admin.quizzesPage.publishedToast'),
      });
      loadQuizzes();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setTogglingId(null);
    }
  };

  const removeQuiz = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await adminApi.deleteQuiz(deleting._id);
      setToast({ type: 'success', message: t('admin.quizzesPage.deletedToast') });
      setDeleting(null);
      loadQuizzes();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setDeleteBusy(false);
    }
  };

  const totals = useMemo(
    () => ({
      questions: quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0),
      published: quizzes.filter((quiz) => quiz.published).length,
    }),
    [quizzes]
  );

  return (
    <div className="space-y-6 bg-canvas min-h-screen p-4 text-ink sm:p-6">
      <PageHeader
        eyebrow={t('admin.shell.workspace')}
        title={t('admin.quizzesPage.title')}
        subtitle={t('admin.quizzesPage.subtitle')}
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadQuizzes}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-2 text-ink transition-colors hover:bg-highlight shadow-sm xl:h-10 xl:w-10"
              aria-label={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              type="button" 
              onClick={openCreate} 
              disabled={lessons.length === 0} 
              className="flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-on-primary shadow-sm hover:bg-primary-hover disabled:opacity-50"
            >
              <Plus className="h-4 w-4 text-lavender" /> {t('admin.quizzesPage.newQuiz')}
            </button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="surface" className="bg-surface-2 text-ink border border-line"><ClipboardCheck className="h-3.5 w-3.5 text-lavender" /> {t('admin.common.quizzes')}: {formatNumber(quizzes.length, i18n.language)}</Badge>
        <Badge tone="green" className="bg-positive-soft text-positive-ink border border-line">{t('admin.common.published')}: {formatNumber(totals.published, i18n.language)}</Badge>
        <Badge tone="amber" className="bg-caution-soft text-caution-ink border border-line">{t('admin.common.draft')}: {formatNumber(quizzes.length - totals.published, i18n.language)}</Badge>
        <Badge tone="outline" className="bg-surface-2 text-ink border border-line"><FileQuestion className="h-3.5 w-3.5 text-lavender" /> {t('admin.courses.questionsCount')}: {formatNumber(totals.questions, i18n.language)}</Badge>
      </div>

      <Panel noPadding className="bg-surface border border-line rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 bg-surface-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.quizzesPage.searchPlaceholder')}
              className="min-h-11 w-full rounded-xl border border-line bg-surface py-2.5 ps-10 pe-4 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              aria-label={t('admin.common.search')}
            />
          </div>
          <select 
            value={lessonFilter} 
            onChange={(event) => setLessonFilter(event.target.value)} 
            className="min-h-11 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary sm:w-60 shadow-sm"
            aria-label={t('admin.quizzesPage.filterLesson')}
          >
            <option value="">{t('admin.quizzesPage.allLessons')}</option>
            {lessons.map((lesson) => (
              <option key={lesson._id} value={lesson._id}>
                {localize(lesson.title, i18n.language)}
              </option>
            ))}
          </select>
        </div>

        {loading && quizzes.length === 0 ? (
          <LoadingState label={t('admin.common.loading')} />
        ) : error ? (
          <ErrorState title={t('admin.errors.loadQuizzes')} message={error} onRetry={loadQuizzes} retryLabel={t('admin.common.retry')} />
        ) : quizzes.length === 0 ? (
          <EmptyState
            title={t('admin.quizzesPage.noQuizzes')}
            icon={ClipboardCheck}
            action={
              <button type="button" onClick={openCreate} disabled={lessons.length === 0} className="flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-on-primary shadow-sm hover:bg-primary-hover disabled:opacity-50">
                <Plus className="h-4 w-4 text-lavender" /> {t('admin.quizzesPage.newQuiz')}
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-line">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between hover:bg-surface-2 transition-colors">
                <div className="flex min-w-0 items-start gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink border border-line">
                    <ClipboardCheck className="h-4 w-4 text-lavender" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-extrabold text-ink">{localize(quiz.title, i18n.language)}</p>
                      <Badge tone={quiz.published ? 'green' : 'amber'} className="bg-surface-2 text-ink border border-line">
                        {quiz.published ? t('admin.common.published') : t('admin.common.draft')}
                      </Badge>
                    </div>
                    <p className="mt-1 text-[10px] font-bold text-ink-soft">
                      {t('admin.quizzesPage.lessonCol')}: {localize(quiz.lesson?.title, i18n.language) || t('admin.common.notAvailable')}
                      {quiz.lesson?.course?.title ? ` · ${t('admin.lessonsPage.courseCol')}: ${localize(quiz.lesson.course.title, i18n.language)}` : ''}
                      {' · '}{t('admin.courses.questionsCount')}: {formatNumber(quiz.questions?.length || 0, i18n.language)}
                      {' · '}{t('admin.courses.passingScore')}: {formatNumber(quiz.passingScore, i18n.language)}%
                      {' · '}{t('admin.quizzesPage.attemptsCol')}: {formatNumber(quiz.attemptCount, i18n.language)}
                      {quiz.averageScore !== null && quiz.averageScore !== undefined
                        ? ` · ${t('admin.quizzesPage.avgCol')}: ${formatPercent(quiz.averageScore, i18n.language)}`
                        : ''}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => togglePublish(quiz)}
                    disabled={togglingId === quiz._id}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-2 text-ink transition-colors hover:bg-highlight shadow-sm disabled:opacity-40 xl:h-8 xl:w-8"
                    aria-label={quiz.published ? t('admin.quizzesPage.unpublish') : t('admin.quizzesPage.publishNow')}
                    title={quiz.published ? t('admin.quizzesPage.unpublish') : t('admin.quizzesPage.publishNow')}
                  >
                    {togglingId === quiz._id ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-lavender" />
                    ) : quiz.published ? (
                      <EyeOff className="h-4 w-4 text-lavender" />
                    ) : (
                      <Eye className="h-4 w-4 text-lavender" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(quiz)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-2 text-ink transition-colors hover:bg-highlight shadow-sm xl:h-8 xl:w-8"
                    aria-label={t('admin.common.edit')}
                    title={t('admin.common.edit')}
                  >
                    <Edit3 className="h-4 w-4 text-lavender" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(quiz)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-negative-soft text-negative-ink transition-colors hover:bg-highlight shadow-sm xl:h-8 xl:w-8"
                    aria-label={t('admin.common.delete')}
                    title={t('admin.common.delete')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <QuizEditorModal
        open={editorOpen}
        quiz={editing}
        lessons={lessons}
        onClose={() => {
          setEditorOpen(false);
          setEditing(null);
        }}
        onSaved={() => {
          setEditorOpen(false);
          setEditing(null);
          setToast({ type: 'success', message: t('admin.courses.quizSaved') });
          loadQuizzes();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={removeQuiz}
        title={t('admin.common.delete')}
        message={t('admin.courses.deleteQuizConfirm')}
        confirmLabel={t('admin.common.delete')}
        cancelLabel={t('admin.common.cancel')}
        busy={deleteBusy}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
