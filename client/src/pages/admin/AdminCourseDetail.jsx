import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  BookOpen,
  ClipboardCheck,
  Edit3,
  Eye,
  FileQuestion,
  Layers,
  Plus,
  RefreshCw,
  Trash2,
} from '../../components/icons';
import { adminApi, formatNumber, localize } from '../../lib/admin';
import {
  Badge,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  Panel,
  StatCard,
} from '../../components/admin/ui';
import QuizEditorModal from '../../components/admin/QuizEditorModal';
import CourseFormModal from '../../components/admin/CourseFormModal';
import Toast from '../../components/Toast';

export default function AdminCourseDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('lessons');
  const [quizEditorOpen, setQuizEditorOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [courseFormOpen, setCourseFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .course(id)
      .then(setData)
      .catch((err) => setError(err.status === 404 ? t('admin.errors.loadCourse') : err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const lessons = data?.lessons || [];
  const quizzes = data?.quizzes || [];
  const course = data?.course;

  const questionCount = useMemo(
    () => quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0),
    [quizzes]
  );

  const openCreateLesson = () => navigate(`/admin/courses/${id}/lessons/new`);
  const openEditLesson = (lesson) => navigate(`/admin/courses/${id}/lessons/${lesson._id}`);

  const openCreateQuiz = () => {
    setEditingQuiz(null);
    setQuizEditorOpen(true);
  };

  const openEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setQuizEditorOpen(true);
  };

  const removeItem = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      if (deleting.type === 'lesson') {
        await adminApi.deleteLesson(deleting.item._id);
        setToast({ type: 'success', message: t('admin.courses.lessonDeleted') });
      } else {
        await adminApi.deleteQuiz(deleting.item._id);
        setToast({ type: 'success', message: t('admin.courses.quizDeleted') });
      }
      setDeleting(null);
      load();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setDeleteBusy(false);
    }
  };

  if (loading && !data) return <LoadingState label={t('admin.common.loading')} />;
  if (error && !data) {
    return <ErrorState title={t('admin.errors.loadCourse')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />;
  }

  return (
    <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C]">
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/courses')}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#4B164C]/70 transition-colors hover:text-[#4B164C]"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180 text-[#DD88CF]" /> {t('admin.courses.title')}
        </button>

        <div className="rounded-3xl border border-[#DD88CF]/40 bg-white p-5 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            {course?.image ? (
              <img src={course.image} alt="" className="h-20 w-28 shrink-0 rounded-2xl object-cover border border-[#DD88CF]/50" />
            ) : (
              <span className="flex h-20 w-28 shrink-0 items-center justify-center rounded-2xl bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]/50"><BookOpen className="h-6 w-6 text-[#DD88CF]" /></span>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight text-[#4B164C] sm:text-2xl">{localize(course?.title, i18n.language)}</h1>
                <Badge tone={course?.published ? 'green' : 'amber'} className="bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]">{course?.published ? t('admin.common.published') : t('admin.common.draft')}</Badge>
              </div>
              <p className="mt-0.5 text-xs font-bold text-[#4B164C]/60" dir="ltr">{course?.slug}</p>
              <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-relaxed text-[#4B164C]/80">{localize(course?.description, i18n.language)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge tone="outline" className="bg-[#F5F5F5] text-[#4B164C] border-[#DD88CF]">{t(`admin.courses.categories.${course?.category}`, { defaultValue: course?.category })}</Badge>
                <Badge tone="outline" className="bg-[#F5F5F5] text-[#4B164C] border-[#DD88CF]">{t(`admin.courses.difficulties.${course?.difficulty}`, { defaultValue: course?.difficulty })}</Badge>
                <Badge tone="outline" className="bg-[#F5F5F5] text-[#4B164C] border-[#DD88CF]">{formatNumber(course?.estimatedMinutes, i18n.language)} {t('admin.common.minutes')}</Badge>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start">
            <button
              type="button"
              onClick={() => setCourseFormOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#F8E7F6] px-4 py-2 text-xs font-extrabold text-[#4B164C] border border-[#DD88CF] hover:bg-[#DD88CF]/30 transition-colors shadow-sm"
            >
              <Edit3 className="h-3.5 w-3.5 text-[#DD88CF]" /> {t('admin.common.edit')}
            </button>
            <button
              type="button"
              onClick={load}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DD88CF] bg-[#F8E7F6] text-[#4B164C] transition-colors hover:bg-[#DD88CF]/30 shadow-sm"
              aria-label={t('admin.common.refresh')}
              title={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Layers} label={t('admin.common.lessons')} value={formatNumber(lessons.length, i18n.language)} tone="sage" />
        <StatCard icon={Eye} label={t('admin.common.published')} value={formatNumber(lessons.filter((lesson) => lesson.published).length, i18n.language)} tone="green" />
        <StatCard icon={ClipboardCheck} label={t('admin.common.quizzes')} value={formatNumber(quizzes.length, i18n.language)} tone="surface" />
        <StatCard icon={FileQuestion} label={t('admin.courses.questions')} value={formatNumber(questionCount, i18n.language)} tone="amber" />
      </div>

      <Panel noPadding className="bg-white border border-[#DD88CF]/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-[#DD88CF]/30 px-4 py-3 bg-[#F8E7F6]/50">
          <div className="flex items-center gap-1.5 rounded-xl bg-[#F5F5F5] p-1 border border-[#DD88CF]/30">
            <button
              type="button"
              onClick={() => setTab('lessons')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition-colors ${tab === 'lessons' ? 'bg-[#4B164C] text-[#F8E7F6] shadow-sm' : 'text-[#4B164C]/70 hover:text-[#4B164C]'}`}
            >
              {t('admin.common.lessons')} ({formatNumber(lessons.length, i18n.language)})
            </button>
            <button
              type="button"
              onClick={() => setTab('quizzes')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition-colors ${tab === 'quizzes' ? 'bg-[#4B164C] text-[#F8E7F6] shadow-sm' : 'text-[#4B164C]/70 hover:text-[#4B164C]'}`}
            >
              {t('admin.common.quizzes')} ({formatNumber(quizzes.length, i18n.language)})
            </button>
          </div>
          {tab === 'lessons' ? (
            <button type="button" onClick={openCreateLesson} className="flex items-center gap-1.5 rounded-xl bg-[#4B164C] px-3.5 py-2 text-xs font-extrabold text-[#F8E7F6] hover:bg-[#4B164C]/90 shadow-sm"><Plus className="h-3.5 w-3.5 text-[#DD88CF]" />{t('admin.courses.addLesson')}</button>
          ) : (
            <button type="button" onClick={openCreateQuiz} disabled={lessons.length === 0} className="flex items-center gap-1.5 rounded-xl bg-[#4B164C] px-3.5 py-2 text-xs font-extrabold text-[#F8E7F6] hover:bg-[#4B164C]/90 shadow-sm disabled:opacity-50"><Plus className="h-3.5 w-3.5 text-[#DD88CF]" />{t('admin.courses.addQuiz')}</button>
          )}
        </div>

        {tab === 'lessons' ? (
          lessons.length === 0 ? (
            <EmptyState
              title={t('admin.courses.noLessons')}
              icon={Layers}
              action={<button type="button" onClick={openCreateLesson} className="flex items-center gap-1.5 rounded-xl bg-[#4B164C] px-4 py-2 text-xs font-extrabold text-[#F8E7F6] shadow-sm"><Plus className="h-4 w-4 text-[#DD88CF]" />{t('admin.courses.addLesson')}</button>}
            />
          ) : (
            <div className="divide-y divide-[#DD88CF]/20">
              {lessons.map((lesson, index) => {
                const blockCount = (lesson.blocks?.ar || lesson.blocks?.en || lesson.blocks || []).length;
                return (
                <div key={lesson._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between hover:bg-[#F5F5F5]/60 transition-colors">
                  <div className="flex min-w-0 items-start gap-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F8E7F6] text-xs font-extrabold text-[#4B164C] border border-[#DD88CF]/50">
                      {formatNumber(lesson.order || index + 1, i18n.language)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-extrabold text-[#4B164C]">{localize(lesson.title, i18n.language)}</p>
                        <Badge tone={lesson.published ? 'green' : 'amber'} className="bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]">{lesson.published ? t('admin.courses.publishedLesson') : t('admin.courses.draftLesson')}</Badge>
                        <Badge tone={lesson.reviewStatus === 'reviewed' ? 'green' : lesson.reviewStatus === 'in_review' ? 'amber' : 'outline'} className="bg-[#F5F5F5] text-[#4B164C] border border-[#DD88CF]">
                          {t(`admin.courses.${lesson.reviewStatus || 'unreviewed'}`)}
                        </Badge>
                        <Badge tone="outline" className="bg-[#F5F5F5] text-[#4B164C] border border-[#DD88CF]">
                          {formatNumber(blockCount, i18n.language)} {t('admin.courses.blocksCount')}
                        </Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-relaxed text-[#4B164C]/70">
                        {localize(lesson.content, i18n.language) || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-start">
                    <button type="button" onClick={() => openEditLesson(lesson)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DD88CF] bg-[#F8E7F6] text-[#4B164C] transition-colors hover:bg-[#DD88CF]/30" aria-label={t('admin.courses.editLesson')} title={t('admin.courses.editLesson')}>
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => setDeleting({ type: 'lesson', item: lesson })} className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100" aria-label={t('admin.common.delete')} title={t('admin.common.delete')}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          )
        ) : quizzes.length === 0 ? (
          <EmptyState
            title={t('admin.courses.noQuizzes')}
            icon={ClipboardCheck}
            action={
              <button type="button" onClick={openCreateQuiz} disabled={lessons.length === 0} className="flex items-center gap-1.5 rounded-xl bg-[#4B164C] px-4 py-2 text-xs font-extrabold text-[#F8E7F6] shadow-sm disabled:opacity-50">
                <Plus className="h-4 w-4 text-[#DD88CF]" />{t('admin.courses.addQuiz')}
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-[#DD88CF]/20">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-[#F5F5F5]/60 transition-colors">
                <div className="flex min-w-0 items-start gap-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]/50"><ClipboardCheck className="h-4 w-4 text-[#DD88CF]" /></span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-extrabold text-[#4B164C]">{localize(quiz.title, i18n.language)}</p>
                      <Badge tone={quiz.published ? 'green' : 'amber'} className="bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]">{quiz.published ? t('admin.common.published') : t('admin.common.draft')}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-[#4B164C]/70">
                      {t('admin.courses.lesson')}: {localize(quiz.lesson?.title, i18n.language) || t('admin.common.notAvailable')} · {t('admin.courses.questionsCount')}: {formatNumber(quiz.questions?.length || 0, i18n.language)} · {t('admin.courses.passingScore')}: {formatNumber(quiz.passingScore, i18n.language)}%
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                  <button type="button" onClick={() => openEditQuiz(quiz)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DD88CF] bg-[#F8E7F6] text-[#4B164C] transition-colors hover:bg-[#DD88CF]/30" aria-label={t('admin.courses.editQuiz')} title={t('admin.courses.editQuiz')}>
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setDeleting({ type: 'quiz', item: quiz })} className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100" aria-label={t('admin.common.delete')} title={t('admin.common.delete')}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <QuizEditorModal
        open={quizEditorOpen}
        quiz={editingQuiz}
        lessons={lessons}
        onClose={() => {
          setQuizEditorOpen(false);
          setEditingQuiz(null);
        }}
        onSaved={() => {
          setQuizEditorOpen(false);
          setEditingQuiz(null);
          setToast({ type: 'success', message: t('admin.courses.quizSaved') });
          load();
        }}
      />

      <CourseFormModal
        open={courseFormOpen}
        course={{ id }}
        onClose={() => setCourseFormOpen(false)}
        onSaved={() => {
          setCourseFormOpen(false);
          setToast({ type: 'success', message: t('admin.courseEditor.savedToast') });
          load();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={removeItem}
        title={t('admin.common.delete')}
        message={deleting?.type === 'lesson' ? t('admin.courses.deleteLessonConfirm') : t('admin.courses.deleteQuizConfirm')}
        confirmLabel={t('admin.common.delete')}
        cancelLabel={t('admin.common.cancel')}
        busy={deleteBusy}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}