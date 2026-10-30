import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  Eye,
  EyeOff,
  FileQuestion,
  Layers,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { adminApi, formatNumber, localize } from '../../lib/admin';
import {
  Badge,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  Modal,
  Panel,
  SectionLabel,
  StatCard,
} from '../../components/admin/ui';
import Toast from '../../components/Toast';

const newQuestion = () => ({
  question: { ar: '', en: '' },
  options: { ar: ['', ''], en: ['', ''] },
  correctAnswer: 0,
  explanation: { ar: '', en: '' },
});

const emptyLesson = (courseId, order) => ({
  course: courseId,
  title: { ar: '', en: '' },
  content: { ar: '', en: '' },
  objectives: { ar: [], en: [] },
  safetyNotes: { ar: '', en: '' },
  images: [],
  videoUrl: '',
  sourceRefs: [],
  reviewStatus: 'unreviewed',
  published: true,
  order,
});

const emptyQuiz = (lessonId) => ({
  title: { ar: '', en: '' },
  lesson: lessonId || '',
  passingScore: 70,
  published: true,
  questions: [newQuestion()],
});

export default function AdminCourseDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('lessons');
  const [lessonModal, setLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState(emptyLesson(id, 1));
  const [quizModal, setQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState(emptyQuiz());
  const [saving, setSaving] = useState(false);
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

  const openCreateLesson = () => {
    setEditingLesson(null);
    setLessonForm(emptyLesson(id, lessons.length + 1));
    setLessonModal(true);
  };

  const openEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      course: lesson.course?._id || lesson.course || id,
      title: { ar: lesson.title?.ar || '', en: lesson.title?.en || '' },
      content: { ar: lesson.content?.ar || '', en: lesson.content?.en || '' },
      objectives: { ar: lesson.objectives?.ar || [], en: lesson.objectives?.en || [] },
      safetyNotes: { ar: lesson.safetyNotes?.ar || '', en: lesson.safetyNotes?.en || '' },
      images: lesson.images || [],
      videoUrl: lesson.videoUrl || '',
      sourceRefs: lesson.sourceRefs || [],
      reviewStatus: lesson.reviewStatus || 'unreviewed',
      published: Boolean(lesson.published),
      order: lesson.order || 1,
    });
    setLessonModal(true);
  };

  const openCreateQuiz = () => {
    setEditingQuiz(null);
    setQuizForm(emptyQuiz(lessons[0]?._id));
    setQuizModal(true);
  };

  const openEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setQuizForm({
      title: { ar: quiz.title?.ar || '', en: quiz.title?.en || '' },
      lesson: quiz.lesson?._id || quiz.lesson || lessons[0]?._id || '',
      passingScore: quiz.passingScore ?? 70,
      published: Boolean(quiz.published),
      questions: (quiz.questions || []).map((question) => ({
        question: { ar: question.question?.ar || '', en: question.question?.en || '' },
        options: {
          ar: question.options?.ar?.length ? [...question.options.ar] : ['', ''],
          en: question.options?.en?.length ? [...question.options.en] : ['', ''],
        },
        correctAnswer: question.correctAnswer || 0,
        explanation: { ar: question.explanation?.ar || '', en: question.explanation?.en || '' },
      })),
    });
    setQuizModal(true);
  };

  const updateLessonField = (field, value) => setLessonForm((previous) => ({ ...previous, [field]: value }));
  const updateLessonBilingual = (field, lang, value) =>
    setLessonForm((previous) => ({ ...previous, [field]: { ...previous[field], [lang]: value } }));

  const saveLesson = async (event) => {
    event.preventDefault();
    if (!lessonForm.title.ar.trim() || !lessonForm.title.en.trim() || !lessonForm.content.ar.trim() || !lessonForm.content.en.trim()) {
      setToast({ type: 'error', message: t('admin.courses.fieldsRequired') });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...lessonForm,
        course: id,
        order: Number(lessonForm.order) || 1,
      };
      if (editingLesson) {
        await adminApi.updateLesson(editingLesson._id, payload);
      } else {
        await adminApi.createLesson(payload);
      }
      setToast({ type: 'success', message: t('admin.courses.lessonSaved') });
      setLessonModal(false);
      load();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const updateQuestion = (index, updater) =>
    setQuizForm((previous) => ({
      ...previous,
      questions: previous.questions.map((question, questionIndex) =>
        questionIndex === index ? updater(question) : question
      ),
    }));

  const updateQuestionText = (index, field, lang, value) =>
    updateQuestion(index, (question) => ({
      ...question,
      [field]: { ...question[field], [lang]: value },
    }));

  const updateOption = (questionIndex, lang, optionIndex, value) =>
    updateQuestion(questionIndex, (question) => ({
      ...question,
      options: {
        ...question.options,
        [lang]: question.options[lang].map((option, index) => (index === optionIndex ? value : option)),
      },
    }));

  const addOption = (questionIndex) =>
    updateQuestion(questionIndex, (question) => ({
      ...question,
      options: {
        ar: [...question.options.ar, ''],
        en: [...question.options.en, ''],
      },
    }));

  const removeOption = (questionIndex, optionIndex) =>
    updateQuestion(questionIndex, (question) => ({
      ...question,
      options: {
        ar: question.options.ar.filter((_, index) => index !== optionIndex),
        en: question.options.en.filter((_, index) => index !== optionIndex),
      },
      correctAnswer:
        question.correctAnswer >= optionIndex && question.correctAnswer > 0
          ? question.correctAnswer - 1
          : question.correctAnswer,
    }));

  const saveQuiz = async (event) => {
    event.preventDefault();
    if (!quizForm.title.ar.trim() || !quizForm.title.en.trim() || !quizForm.lesson) {
      setToast({ type: 'error', message: t('admin.courses.fieldsRequired') });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...quizForm,
        passingScore: Number(quizForm.passingScore) || 70,
        questions: quizForm.questions.map((question) => ({
          ...question,
          correctAnswer: Number(question.correctAnswer) || 0,
        })),
      };
      if (editingQuiz) {
        await adminApi.updateQuiz(editingQuiz._id, payload);
      } else {
        await adminApi.createQuiz(payload);
      }
      setToast({ type: 'success', message: t('admin.courses.quizSaved') });
      setQuizModal(false);
      load();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
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
    <div className="space-y-5">
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/courses')}
          className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> {t('admin.courses.title')}
        </button>

        <div className="admin-card admin-rise flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-start gap-3.5">
            {course.image ? (
              <img src={course.image} alt="" className="h-16 w-24 shrink-0 rounded-xl object-cover" />
            ) : (
              <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-ink-muted"><BookOpen className="h-6 w-6" /></span>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">{localize(course.title, i18n.language)}</h1>
                <Badge tone={course.published ? 'green' : 'amber'}>{course.published ? t('admin.common.published') : t('admin.common.draft')}</Badge>
              </div>
              <p className="mt-0.5 text-[11px] font-bold text-ink-muted" dir="ltr">{course.slug}</p>
              <p className="mt-1 line-clamp-2 max-w-2xl text-[11px] leading-relaxed text-ink-muted">{localize(course.description, i18n.language)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge tone="outline">{t(`admin.courses.categories.${course.category}`, { defaultValue: course.category })}</Badge>
                <Badge tone="outline">{t(`admin.courses.difficulties.${course.difficulty}`, { defaultValue: course.difficulty })}</Badge>
                <Badge tone="outline">{formatNumber(course.estimatedMinutes, i18n.language)} {t('admin.common.minutes')}</Badge>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={load}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-card text-ink transition-colors hover:bg-surface-muted self-start"
            aria-label={t('admin.common.refresh')}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Layers} label={t('admin.common.lessons')} value={formatNumber(lessons.length, i18n.language)} tone="sage" />
        <StatCard icon={Eye} label={t('admin.common.published')} value={formatNumber(lessons.filter((lesson) => lesson.published).length, i18n.language)} tone="green" />
        <StatCard icon={ClipboardCheck} label={t('admin.common.quizzes')} value={formatNumber(quizzes.length, i18n.language)} tone="surface" />
        <StatCard icon={FileQuestion} label={t('admin.courses.questions')} value={formatNumber(questionCount, i18n.language)} tone="amber" />
      </div>

      <Panel noPadding>
        <div className="flex items-center justify-between gap-2 border-b border-line px-3.5 py-3">
          <div className="flex items-center gap-1 rounded-xl bg-surface-muted p-1">
            <button
              type="button"
              onClick={() => setTab('lessons')}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-extrabold transition-colors ${tab === 'lessons' ? 'bg-card text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}
            >
              {t('admin.common.lessons')} ({formatNumber(lessons.length, i18n.language)})
            </button>
            <button
              type="button"
              onClick={() => setTab('quizzes')}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-extrabold transition-colors ${tab === 'quizzes' ? 'bg-card text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}
            >
              {t('admin.common.quizzes')} ({formatNumber(quizzes.length, i18n.language)})
            </button>
          </div>
          {tab === 'lessons' ? (
            <button type="button" onClick={openCreateLesson} className="btn-primary h-8 px-3 text-[10px]"><Plus className="h-3 w-3" />{t('admin.courses.addLesson')}</button>
          ) : (
            <button type="button" onClick={openCreateQuiz} disabled={lessons.length === 0} className="btn-primary h-8 px-3 text-[10px]"><Plus className="h-3 w-3" />{t('admin.courses.addQuiz')}</button>
          )}
        </div>

        {tab === 'lessons' ? (
          lessons.length === 0 ? (
            <EmptyState
              title={t('admin.courses.noLessons')}
              icon={Layers}
              action={<button type="button" onClick={openCreateLesson} className="btn-primary h-9 px-4 text-xs"><Plus className="h-3.5 w-3.5" />{t('admin.courses.addLesson')}</button>}
            />
          ) : (
            <div className="divide-y divide-line">
              {lessons.map((lesson, index) => (
                <div key={lesson._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-[11px] font-extrabold text-ink-muted">
                      {formatNumber(lesson.order || index + 1, i18n.language)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-xs font-extrabold text-ink">{localize(lesson.title, i18n.language)}</p>
                        <Badge tone={lesson.published ? 'green' : 'amber'}>{lesson.published ? t('admin.courses.publishedLesson') : t('admin.courses.draftLesson')}</Badge>
                        <Badge tone={lesson.reviewStatus === 'reviewed' ? 'green' : lesson.reviewStatus === 'in_review' ? 'amber' : 'outline'}>
                          {t(`admin.courses.${lesson.reviewStatus || 'unreviewed'}`)}
                        </Badge>
                      </div>
                      <p className="mt-1 line-clamp-2 max-w-2xl text-[11px] leading-relaxed text-ink-muted">{localize(lesson.content, i18n.language)}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 self-end sm:self-start">
                    <button type="button" onClick={() => openEditLesson(lesson)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink" aria-label={t('admin.courses.editLesson')} title={t('admin.courses.editLesson')}>
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => setDeleting({ type: 'lesson', item: lesson })} className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-danger-soft hover:text-danger" aria-label={t('admin.common.delete')} title={t('admin.common.delete')}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : quizzes.length === 0 ? (
          <EmptyState
            title={t('admin.courses.noQuizzes')}
            icon={ClipboardCheck}
            action={
              <button type="button" onClick={openCreateQuiz} disabled={lessons.length === 0} className="btn-primary h-9 px-4 text-xs">
                <Plus className="h-3.5 w-3.5" />{t('admin.courses.addQuiz')}
              </button>
            }
          />
        ) : (
          <div className="divide-y divide-line">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-soft/40 text-amber"><ClipboardCheck className="h-4 w-4" /></span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-xs font-extrabold text-ink">{localize(quiz.title, i18n.language)}</p>
                      <Badge tone={quiz.published ? 'green' : 'amber'}>{quiz.published ? t('admin.common.published') : t('admin.common.draft')}</Badge>
                    </div>
                    <p className="mt-0.5 text-[10px] text-ink-muted">
                      {t('admin.courses.lesson')}: {localize(quiz.lesson?.title, i18n.language) || t('admin.common.notAvailable')} · {t('admin.courses.questionsCount')}: {formatNumber(quiz.questions?.length || 0, i18n.language)} · {t('admin.courses.passingScore')}: {formatNumber(quiz.passingScore, i18n.language)}%
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                  <button type="button" onClick={() => openEditQuiz(quiz)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink" aria-label={t('admin.courses.editQuiz')} title={t('admin.courses.editQuiz')}>
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => setDeleting({ type: 'quiz', item: quiz })} className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-danger-soft hover:text-danger" aria-label={t('admin.common.delete')} title={t('admin.common.delete')}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Modal
        open={lessonModal}
        onClose={() => setLessonModal(false)}
        title={editingLesson ? t('admin.courses.editLesson') : t('admin.courses.createLesson')}
        subtitle={t('admin.courses.bilingualHint')}
        size="lg"
        footer={
          <>
            <button type="button" onClick={() => setLessonModal(false)} className="btn-secondary h-9 px-4 text-xs">{t('admin.common.cancel')}</button>
            <button type="submit" form="lesson-form" disabled={saving} className="btn-primary h-9 px-4 text-xs">{saving ? t('admin.common.saving') : t('admin.common.save')}</button>
          </>
        }
      >
        <form id="lesson-form" onSubmit={saveLesson} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={`${t('admin.courses.lessonTitle')} (${t('admin.common.ar')})`} required>
              <input value={lessonForm.title.ar} onChange={(event) => updateLessonBilingual('title', 'ar', event.target.value)} className="input" dir="rtl" />
            </Field>
            <Field label={`${t('admin.courses.lessonTitle')} (${t('admin.common.en')})`} required>
              <input value={lessonForm.title.en} onChange={(event) => updateLessonBilingual('title', 'en', event.target.value)} className="input" dir="ltr" />
            </Field>
            <Field label={`${t('admin.courses.lessonContent')} (${t('admin.common.ar')})`} required>
              <textarea value={lessonForm.content.ar} onChange={(event) => updateLessonBilingual('content', 'ar', event.target.value)} className="input h-28 resize-y py-2" dir="rtl" />
            </Field>
            <Field label={`${t('admin.courses.lessonContent')} (${t('admin.common.en')})`} required>
              <textarea value={lessonForm.content.en} onChange={(event) => updateLessonBilingual('content', 'en', event.target.value)} className="input h-28 resize-y py-2" dir="ltr" />
            </Field>
            <Field label={`${t('admin.courses.objectives')} (${t('admin.common.ar')})`} hint="سطر لكل هدف">
              <textarea value={(lessonForm.objectives.ar || []).join('\n')} onChange={(event) => updateLessonBilingual('objectives', 'ar', event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))} className="input h-20 resize-y py-2" dir="rtl" />
            </Field>
            <Field label={`${t('admin.courses.objectives')} (${t('admin.common.en')})`} hint="One objective per line">
              <textarea value={(lessonForm.objectives.en || []).join('\n')} onChange={(event) => updateLessonBilingual('objectives', 'en', event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))} className="input h-20 resize-y py-2" dir="ltr" />
            </Field>
            <Field label={`${t('admin.courses.safetyNotes')} (${t('admin.common.ar')})`}>
              <textarea value={lessonForm.safetyNotes.ar} onChange={(event) => updateLessonBilingual('safetyNotes', 'ar', event.target.value)} className="input h-20 resize-y py-2" dir="rtl" />
            </Field>
            <Field label={`${t('admin.courses.safetyNotes')} (${t('admin.common.en')})`}>
              <textarea value={lessonForm.safetyNotes.en} onChange={(event) => updateLessonBilingual('safetyNotes', 'en', event.target.value)} className="input h-20 resize-y py-2" dir="ltr" />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label={t('admin.common.status')}>
              <select value={lessonForm.reviewStatus} onChange={(event) => updateLessonField('reviewStatus', event.target.value)} className="input">
                <option value="unreviewed">{t('admin.courses.unreviewed')}</option>
                <option value="in_review">{t('admin.courses.in_review')}</option>
                <option value="reviewed">{t('admin.courses.reviewed')}</option>
              </select>
            </Field>
            <Field label={t('admin.courses.order')}>
              <input type="number" min="1" value={lessonForm.order} onChange={(event) => updateLessonField('order', event.target.value)} className="input" />
            </Field>
            <Field label={t('admin.courses.videoUrl')} className="sm:col-span-2">
              <input value={lessonForm.videoUrl} onChange={(event) => updateLessonField('videoUrl', event.target.value)} className="input" dir="ltr" placeholder="https://..." />
            </Field>
          </div>

          <Field label={t('admin.courses.sourceRefs')} hint="One source per line">
            <textarea value={(lessonForm.sourceRefs || []).join('\n')} onChange={(event) => updateLessonField('sourceRefs', event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))} className="input h-16 resize-y py-2" dir="ltr" />
          </Field>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-muted px-3.5 py-3">
            <span className="flex items-center gap-2 text-xs font-extrabold text-ink">
              {lessonForm.published ? <Eye className="h-3.5 w-3.5 text-success-ink" /> : <EyeOff className="h-3.5 w-3.5 text-ink-muted" />}
              {lessonForm.published ? t('admin.common.published') : t('admin.common.draft')}
            </span>
            <button type="button" onClick={() => updateLessonField('published', !lessonForm.published)} className={`relative h-7 w-12 rounded-full transition-colors ${lessonForm.published ? 'bg-primary' : 'bg-line-strong'}`} role="switch" aria-checked={lessonForm.published}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${lessonForm.published ? 'start-6' : 'start-1'}`} />
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={quizModal}
        onClose={() => setQuizModal(false)}
        title={editingQuiz ? t('admin.courses.editQuiz') : t('admin.courses.createQuiz')}
        subtitle={t('admin.courses.bilingualHint')}
        size="lg"
        footer={
          <>
            <button type="button" onClick={() => setQuizModal(false)} className="btn-secondary h-9 px-4 text-xs">{t('admin.common.cancel')}</button>
            <button type="submit" form="quiz-form" disabled={saving} className="btn-primary h-9 px-4 text-xs">{saving ? t('admin.common.saving') : t('admin.common.save')}</button>
          </>
        }
      >
        <form id="quiz-form" onSubmit={saveQuiz} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={`${t('admin.courses.quizTitle')} (${t('admin.common.ar')})`} required>
              <input value={quizForm.title.ar} onChange={(event) => setQuizForm((previous) => ({ ...previous, title: { ...previous.title, ar: event.target.value } }))} className="input" dir="rtl" />
            </Field>
            <Field label={`${t('admin.courses.quizTitle')} (${t('admin.common.en')})`} required>
              <input value={quizForm.title.en} onChange={(event) => setQuizForm((previous) => ({ ...previous, title: { ...previous.title, en: event.target.value } }))} className="input" dir="ltr" />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label={t('admin.courses.lesson')} required>
              <select value={quizForm.lesson} onChange={(event) => setQuizForm((previous) => ({ ...previous, lesson: event.target.value }))} className="input">
                <option value="">{t('admin.courses.selectLesson')}</option>
                {lessons.map((lesson) => (
                  <option key={lesson._id} value={lesson._id}>{localize(lesson.title, i18n.language)}</option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.courses.passingScore')}>
              <input type="number" min="0" max="100" value={quizForm.passingScore} onChange={(event) => setQuizForm((previous) => ({ ...previous, passingScore: event.target.value }))} className="input" />
            </Field>
            <Field label={t('admin.common.status')}>
              <select value={quizForm.published ? 'published' : 'draft'} onChange={(event) => setQuizForm((previous) => ({ ...previous, published: event.target.value === 'published' }))} className="input">
                <option value="published">{t('admin.common.published')}</option>
                <option value="draft">{t('admin.common.draft')}</option>
              </select>
            </Field>
          </div>

          <SectionLabel>{t('admin.courses.questionsCount')} ({formatNumber(quizForm.questions.length, i18n.language)})</SectionLabel>

          <div className="space-y-4">
            {quizForm.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="rounded-xl border border-line bg-surface-muted/50 p-3.5">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
                    {t('admin.courses.question')} {formatNumber(questionIndex + 1, i18n.language)}
                  </p>
                  {quizForm.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setQuizForm((previous) => ({ ...previous, questions: previous.questions.filter((_, index) => index !== questionIndex) }))}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-danger hover:underline"
                    >
                      <Trash2 className="h-3 w-3" /> {t('admin.courses.removeQuestion')}
                    </button>
                  )}
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <input value={question.question.ar} onChange={(event) => updateQuestionText(questionIndex, 'question', 'ar', event.target.value)} className="input h-10 text-xs" placeholder={`${t('admin.courses.question')} (${t('admin.common.ar')})`} dir="rtl" />
                  <input value={question.question.en} onChange={(event) => updateQuestionText(questionIndex, 'question', 'en', event.target.value)} className="input h-10 text-xs" placeholder={`${t('admin.courses.question')} (${t('admin.common.en')})`} dir="ltr" />
                </div>

                <div className="mt-3 space-y-2">
                  <p className="text-[10px] font-extrabold text-ink-muted">{t('admin.courses.options')}</p>
                  {question.options.ar.map((option, optionIndex) => (
                    <div key={optionIndex} className="grid grid-cols-[auto_1fr] gap-2 rounded-lg border border-line bg-card p-2">
                      <button
                        type="button"
                        onClick={() => updateQuestion(questionIndex, (previous) => ({ ...previous, correctAnswer: optionIndex }))}
                        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${question.correctAnswer === optionIndex ? 'border-primary bg-primary text-white' : 'border-line-strong text-transparent hover:border-primary'}`}
                        aria-label={t('admin.courses.correctAnswer')}
                        title={t('admin.courses.correctAnswer')}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </button>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input value={option} onChange={(event) => updateOption(questionIndex, 'ar', optionIndex, event.target.value)} className="input h-8 text-[11px]" placeholder={`${t('admin.courses.option')} ${optionIndex + 1} (${t('admin.common.ar')})`} dir="rtl" />
                        <input value={question.options.en[optionIndex] || ''} onChange={(event) => updateOption(questionIndex, 'en', optionIndex, event.target.value)} className="input h-8 text-[11px]" placeholder={`${t('admin.courses.option')} ${optionIndex + 1} (${t('admin.common.en')})`} dir="ltr" />
                      </div>
                      <div className="col-span-2 flex items-center justify-between gap-2">
                        <span className="text-[9px] font-semibold text-ink-muted">
                          {question.correctAnswer === optionIndex ? t('admin.courses.correctAnswer') : ''}
                        </span>
                        {question.options.ar.length > 2 && (
                          <button type="button" onClick={() => removeOption(questionIndex, optionIndex)} className="text-[9px] font-bold text-danger hover:underline">
                            {t('admin.courses.removeOption')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(questionIndex)} className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline dark:text-brand-ink">
                    <Plus className="h-3 w-3" /> {t('admin.courses.addOption')}
                  </button>
                </div>

                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  <input value={question.explanation.ar} onChange={(event) => updateQuestionText(questionIndex, 'explanation', 'ar', event.target.value)} className="input h-9 text-[11px]" placeholder={`${t('admin.courses.explanation')} (${t('admin.common.ar')})`} dir="rtl" />
                  <input value={question.explanation.en} onChange={(event) => updateQuestionText(questionIndex, 'explanation', 'en', event.target.value)} className="input h-9 text-[11px]" placeholder={`${t('admin.courses.explanation')} (${t('admin.common.en')})`} dir="ltr" />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setQuizForm((previous) => ({ ...previous, questions: [...previous.questions, newQuestion()] }))}
            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-line-strong px-3.5 py-2 text-[11px] font-bold text-ink transition-colors hover:bg-surface-muted"
          >
            <Plus className="h-3.5 w-3.5" /> {t('admin.courses.addQuestion')}
          </button>
        </form>
      </Modal>

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
