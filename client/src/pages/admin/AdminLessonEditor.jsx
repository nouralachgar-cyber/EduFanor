import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  Eye,
  FileText,
  Image as ImageIcon,
  Layers,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  XCircle,
} from '../../components/icons';
import LessonBlocksEditor, { blankBlock, hasBlockContent, normalizeBlocks, previewBlocks, serializeBlocks } from '../../components/admin/LessonBlocksEditor';
import LessonBlocks from '../../components/LessonBlocks';
import QuizEditorModal from '../../components/admin/QuizEditorModal';
import AiModal from '../../components/ai/AiModal';
import { aiApi, localizeAiError } from '../../lib/ai';
import { adminApi, formatNumber, localize } from '../../lib/admin';
import { Badge, ConfirmDialog, ErrorState, Field, LoadingState, Modal, Panel, SectionLabel } from '../../components/admin/ui';
import Toast from '../../components/Toast';

const MAX_FILE_BYTES = 7.5 * 1024 * 1024;
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const REVIEW_STATES = ['unreviewed', 'in_review', 'reviewed'];

const emptyForm = () => ({
  course: '',
  title: { ar: '', en: '' },
  content: { ar: '', en: '' },
  safetyNotes: { ar: '', en: '' },
  videoUrl: '',
  coverImage: '',
  estimatedMinutes: 15,
  difficulty: 'beginner',
  reviewStatus: 'unreviewed',
  order: 1,
});

const splitLines = (value) =>
  String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export default function AdminLessonEditor() {
  const { id: routeCourseId, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const fileRef = useRef(null);

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [initialError, setInitialError] = useState('');

  const [form, setForm] = useState(emptyForm());
  const [objectivesAr, setObjectivesAr] = useState('');
  const [objectivesEn, setObjectivesEn] = useState('');
  const [sourceRefsText, setSourceRefsText] = useState('');
  const [drafts, setDrafts] = useState(() => [blankBlock('paragraph')]);
  const [loadedLesson, setLoadedLesson] = useState(null);
  const [lessonBusy, setLessonBusy] = useState(Boolean(lessonId));

  const [savingMode, setSavingMode] = useState(null);
  const [coverBusy, setCoverBusy] = useState(false);
  const [banner, setBanner] = useState('');
  const [toast, setToast] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLang, setPreviewLang] = useState(isAr ? 'ar' : 'en');
  const [deleting, setDeleting] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizEditing, setQuizEditing] = useState(null);
  const [quizPrefill, setQuizPrefill] = useState(null);

  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiPreview, setAiPreview] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setCoursesLoading(true);
    adminApi
      .courses()
      .then((data) => {
        if (!cancelled) setCourses(data.courses || []);
      })
      .catch((err) => {
        if (!cancelled) setBanner(err.message || t('admin.errors.loadCourses'));
      })
      .finally(() => !cancelled && setCoursesLoading(false));
    return () => {
      cancelled = true;
    };
  }, [t]);

  const loadLesson = useCallback(() => {
    if (!lessonId) {
      setLessonBusy(false);
      return;
    }
    setLessonBusy(true);
    setInitialError('');
    adminApi
      .lesson(lessonId)
      .then((data) => {
        if (!data?.lesson) throw new Error(t('admin.editor.lessonMissing'));
        const lesson = data.lesson;
        setLoadedLesson(lesson);
        setForm({
          course: lesson.course?._id || lesson.course || '',
          title: { ar: lesson.title?.ar || '', en: lesson.title?.en || '' },
          content: { ar: lesson.content?.ar || '', en: lesson.content?.en || '' },
          safetyNotes: { ar: lesson.safetyNotes?.ar || '', en: lesson.safetyNotes?.en || '' },
          videoUrl: lesson.videoUrl || '',
          coverImage: lesson.coverImage || '',
          estimatedMinutes: lesson.estimatedMinutes ?? 15,
          difficulty: lesson.difficulty || 'beginner',
          reviewStatus: lesson.reviewStatus || 'unreviewed',
          order: lesson.order ?? 1,
        });
        setObjectivesAr((lesson.objectives?.ar || []).join('\n'));
        setObjectivesEn((lesson.objectives?.en || []).join('\n'));
        setSourceRefsText((lesson.sourceRefs || []).join('\n'));
        setDrafts(normalizeBlocks(lesson.blocks));
      })
      .catch((err) => setInitialError(err.status === 404 ? t('admin.editor.lessonMissing') : err.message || t('admin.errors.loadCourses')))
      .finally(() => setLessonBusy(false));
  }, [lessonId, t]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  const defaultCourse =
    form.course ||
    routeCourseId ||
    searchParams.get('course') ||
    '';

  useEffect(() => {
    if (!lessonId && defaultCourse && courses.length > 0 && !loadedLesson) {
      const exists = courses.some((course) => course._id === defaultCourse);
      if (exists && !form.course) {
        setForm((previous) => ({ ...previous, course: defaultCourse }));
      }
    }
  }, [lessonId, defaultCourse, courses, loadedLesson, form.course]);

  const [quizList, setQuizList] = useState([]);
  const [quizRefresh, refreshQuizzes] = useState(0);
  useEffect(() => {
    if (!lessonId || !loadedLesson) {
      setQuizList([]);
      return undefined;
    }
    let cancelled = false;
    adminApi
      .quizzes({ lesson: lessonId })
      .then((data) => !cancelled && setQuizList(data.quizzes || []))
      .catch(() => !cancelled && setQuizList([]));
    return () => {
      cancelled = true;
    };
  }, [lessonId, loadedLesson, quizRefresh]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course._id === (form.course || defaultCourse)) || null,
    [courses, form.course, defaultCourse]
  );

  const quizLessons = useMemo(
    () => (loadedLesson ? [loadedLesson] : []),
    [loadedLesson]
  );

  const buildMaterial = useCallback(() => {
    const parts = [
      localize(form.title, isAr ? 'ar' : 'en'),
      localize(form.content, isAr ? 'ar' : 'en'),
      ...drafts
        .map((draft) => localize(draft.content, isAr ? 'ar' : 'en'))
        .filter(Boolean),
    ];
    return parts.filter(Boolean).join('\n').trim();
  }, [drafts, form.content, form.title, isAr]);

  const runAdminTask = useCallback(
    async ({ task, sourceText }) => {
      setAiBusy(true);
      setAiError('');
      try {
        return await aiApi.adminGenerate({ task, language: isAr ? 'ar' : 'en', sourceText });
      } catch (error) {
        setAiError(localizeAiError(error, isAr));
        return null;
      } finally {
        setAiBusy(false);
      }
    },
    [isAr]
  );

  const suggestTitles = async () => {
    const material =
      localize(form.title, 'ar') ||
      localize(form.title, 'en') ||
      localize(form.content, isAr ? 'ar' : 'en');
    if (!material.trim()) {
      setAiError(t('admin.quizzesPage.aiNeedsContext'));
      return;
    }
    const data = await runAdminTask({ task: 'title_suggestion', sourceText: material });
    if (data?.result) {
      setAiPreview({
        kind: 'titles',
        ar: Array.isArray(data.result.ar) ? data.result.ar : [],
        en: Array.isArray(data.result.en) ? data.result.en : [],
        model: data.model,
      });
    }
  };

  const improveBlock = async (index) => {
    const block = drafts[index];
    if (!block) return;
    const source = localize(block.content, isAr ? 'ar' : 'en');
    if (!source.trim()) return;
    const data = await runAdminTask({ task: 'improve_text', sourceText: source });
    if (data?.result) {
      setAiPreview({
        kind: 'paragraph',
        blockId: block.id,
        ar: data.result.ar || '',
        en: data.result.en || '',
        model: data.model,
      });
    }
  };

  const draftQuestion = async () => {
    const material = buildMaterial();
    if (!material.trim()) {
      setAiError(t('admin.quizzesPage.aiNeedsContext'));
      return;
    }
    const data = await runAdminTask({ task: 'quiz_draft', sourceText: material });
    if (data?.result) {
      setQuizPrefill({
        question: data.result.question,
        options: data.result.options,
        correctAnswer: Number(data.result.suggestedCorrectIndex) || 0,
        explanation: data.result.explanation || { ar: '', en: '' },
      });
      setQuizEditing(null);
      setQuizModalOpen(true);
    }
  };

  const applyTitles = (ar, en) => {
    setForm((previous) => ({ ...previous, title: { ar, en } }));
    setAiPreview(null);
  };

  const update = (patch) =>
    setForm((previous) => ({ ...previous, ...(typeof patch === 'function' ? patch(previous) : patch) }));

  const buildPayload = (published) => ({
    course: form.course || defaultCourse,
    title: { ar: form.title.ar.trim(), en: form.title.en.trim() },
    content: { ar: form.content.ar.trim(), en: form.content.en.trim() },
    blocks: serializeBlocks(drafts),
    objectives: { ar: splitLines(objectivesAr), en: splitLines(objectivesEn) },
    safetyNotes: { ar: form.safetyNotes.ar.trim(), en: form.safetyNotes.en.trim() },
    images: (loadedLesson?.images || []).length ? loadedLesson.images : [],
    videoUrl: form.videoUrl.trim(),
    coverImage: form.coverImage.trim(),
    estimatedMinutes: Number(form.estimatedMinutes) || undefined,
    difficulty: form.difficulty,
    sourceRefs: splitLines(sourceRefsText),
    reviewStatus: form.reviewStatus,
    published: Boolean(published),
    order: Number(form.order) || 0,
  });

  const validate = () => {
    if (!(form.course || defaultCourse)) {
      setBanner(t('admin.editor.validationCourse'));
      return false;
    }
    if (!form.title.ar.trim() || !form.title.en.trim()) {
      setBanner(t('admin.editor.validationTitles'));
      return false;
    }
    const hasIntro = form.content.ar.trim() && form.content.en.trim();
    if (!hasIntro && !hasBlockContent(drafts)) {
      setBanner(t('admin.editor.validationContent'));
      return false;
    }
    return true;
  };

  const save = async (published) => {
    if (!validate()) return;
    setSavingMode(published ? 'publish' : 'draft');
    setBanner('');
    try {
      const payload = buildPayload(published);
      const result = lessonId
        ? await adminApi.updateLesson(lessonId, payload)
        : await adminApi.createLesson(payload);
      const saved = result?.lesson;
      setToast({ type: 'success', message: t(published ? 'admin.editor.publishedToast' : 'admin.editor.savedToast') });
      if (!lessonId && saved?._id) {
        navigate(`/admin/lessons/${saved._id}`, { replace: true });
      } else if (lessonId && saved) {
        setLoadedLesson(saved);
      }
      refreshQuizzes((value) => value + 1);
    } catch (err) {
      setBanner(err.message || t('admin.editor.saveFailed'));
    } finally {
      setSavingMode(null);
    }
  };

  const removeLesson = async () => {
    if (!lessonId) return;
    setDeleteBusy(true);
    try {
      await adminApi.deleteLesson(lessonId);
      setToast({ type: 'success', message: t('admin.editor.deletedToast') });
      navigate(routeCourseId ? `/admin/courses/${routeCourseId}` : '/admin/lessons', { replace: true });
    } catch (err) {
      setBanner(err.message || t('admin.editor.deleteFailed'));
      setDeleting(false);
    } finally {
      setDeleteBusy(false);
    }
  };

  const handleCoverFile = async (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setBanner(t('admin.courseEditor.fileTooLarge'));
      return;
    }
    setCoverBusy(true);
    setBanner('');
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error(t('admin.courseEditor.imageReadFailed')));
        reader.readAsDataURL(file);
      });
      const result = await adminApi.uploadAsset({ dataUrl, name: file.name });
      if (!result?.url) throw new Error(t('admin.courseEditor.imageUploadFailed'));
      update(() => ({ coverImage: result.url }));
    } catch (err) {
      setBanner(err.message || t('admin.courseEditor.imageUploadFailed'));
    } finally {
      setCoverBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const onQuizSaved = async () => {
    setQuizModalOpen(false);
    setQuizEditing(null);
    setQuizPrefill(null);
    refreshQuizzes((value) => value + 1);
    if (lessonId) {
      adminApi
        .lesson(lessonId)
        .then((data) => data?.lesson && setLoadedLesson(data.lesson))
        .catch(() => {});
    }
  };

  const removeQuiz = async () => {
    if (!deleting || deleting.kind !== 'quiz') return;
    setDeleteBusy(true);
    try {
      await adminApi.deleteQuiz(deleting.item._id);
      setToast({ type: 'success', message: t('admin.courses.quizDeleted') });
      setDeleting(null);
      refreshQuizzes((value) => value + 1);
    } catch (err) {
      setBanner(err.message || t('admin.editor.deleteFailed'));
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  const statusTone = loadedLesson?.published ? 'green' : 'amber';

  if (lessonBusy || coursesLoading) {
    return (
      <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C]">
        <LoadingState label={t('admin.common.loading')} />
      </div>
    );
  }

  if (initialError) {
    return (
      <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C]">
        <ErrorState
          title={t('admin.editor.loadFailedTitle')}
          message={initialError}
          onRetry={() => navigate(routeCourseId ? `/admin/courses/${routeCourseId}` : '/admin/lessons')}
          retryLabel={t('admin.common.back')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C] pb-16">
      <div>
        <button
          type="button"
          onClick={() => navigate(routeCourseId ? `/admin/courses/${routeCourseId}` : lessonId ? '/admin/lessons' : '/admin/courses')}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#4B164C]/70 transition-colors hover:text-[#4B164C]"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180 text-[#DD88CF]" />
          {t(routeCourseId ? 'admin.courses.title' : 'admin.lessonsPage.title')}
        </button>

        <div className="rounded-3xl border border-[#DD88CF]/40 bg-white p-5 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#4B164C] text-[#F8E7F6] border border-[#DD88CF]/50 shadow-sm">
              {lessonId ? <Layers className="h-6 w-6 text-[#DD88CF]" /> : <FileText className="h-6 w-6 text-[#DD88CF]" />}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight text-[#4B164C] sm:text-2xl">
                  {lessonId ? localize(loadedLesson?.title, i18n.language) || t('admin.editor.title') : t('admin.editor.newTitle')}
                </h1>
                {loadedLesson ? (
                  <Badge tone={statusTone} className="bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]">{loadedLesson.published ? t('admin.common.published') : t('admin.common.draft')}</Badge>
                ) : (
                  <Badge tone="amber" className="bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]">{t('admin.common.draft')}</Badge>
                )}
                {loadedLesson && (
                  <Badge tone={loadedLesson.reviewStatus === 'reviewed' ? 'green' : loadedLesson.reviewStatus === 'in_review' ? 'amber' : 'outline'} className="bg-[#F5F5F5] text-[#4B164C] border border-[#DD88CF]">
                    {t(`admin.courses.${loadedLesson.reviewStatus || 'unreviewed'}`)}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#4B164C]/70">{t('admin.editor.subtitle')}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start">
            <button
              type="button"
              onClick={() => {
                setPreviewLang(isAr ? 'ar' : 'en');
                setPreviewOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-[#F8E7F6] px-4 py-2 text-xs font-extrabold text-[#4B164C] border border-[#DD88CF] hover:bg-[#DD88CF]/30 transition-colors shadow-sm"
            >
              <Eye className="h-3.5 w-3.5 text-[#DD88CF]" /> {t('admin.editor.preview')}
            </button>
            {lessonId && (
              <button
                type="button"
                onClick={() => setDeleting({ kind: 'lesson' })}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 shadow-sm"
                aria-label={t('admin.common.delete')}
                title={t('admin.common.delete')}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {banner && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700 shadow-sm">
          <XCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{banner}</span>
          <button type="button" onClick={() => setBanner('')} className="text-xs font-extrabold hover:underline">
            {t('admin.common.close')}
          </button>
        </div>
      )}
      {aiError && !aiBusy && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700 shadow-sm">
          <XCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{aiError}</span>
          <button type="button" onClick={() => setAiError('')} className="text-xs font-extrabold hover:underline">
            {t('admin.common.close')}
          </button>
        </div>
      )}

      {courses.length === 0 && !lessonBusy ? (
        <Panel noPadding className="bg-white border border-[#DD88CF]/40 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <BookOpen className="h-8 w-8 text-[#DD88CF]" />
            <p className="text-sm font-extrabold text-[#4B164C]">{t('admin.editor.noCoursesTitle')}</p>
            <p className="max-w-md text-xs font-semibold text-[#4B164C]/70">{t('admin.editor.noCoursesHint')}</p>
            <Link to="/admin/courses" className="flex items-center gap-1.5 rounded-xl bg-[#4B164C] px-4 py-2.5 text-xs font-extrabold text-[#F8H7F6] text-[#F8E7F6] shadow-sm">
              {t('admin.courses.newCourse')}
            </Link>
          </div>
        </Panel>
      ) : (
        <>
          <Panel title={t('admin.editor.sectionMeta')} subtitle={t('admin.editor.sectionMetaHint')} className="bg-white border border-[#DD88CF]/40 rounded-2xl p-6 shadow-sm">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={`${t('admin.editor.titleAr')} (${t('admin.common.ar')})`} required>
                  <input
                    value={form.title.ar}
                    onChange={(event) => update((previous) => ({ title: { ...previous.title, ar: event.target.value } }))}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm"
                    dir="rtl"
                    placeholder={t('admin.courseEditor.titleArPlaceholder')}
                  />
                </Field>
                <Field label={`${t('admin.editor.titleEn')} (${t('admin.common.en')})`} required>
                  <input
                    value={form.title.en}
                    onChange={(event) => update((previous) => ({ title: { ...previous.title, en: event.target.value } }))}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm"
                    dir="ltr"
                    placeholder={t('admin.courseEditor.titleEnPlaceholder')}
                  />
                </Field>
              </div>

              <button
                type="button"
                onClick={suggestTitles}
                disabled={aiBusy}
                className="inline-flex items-center gap-2 rounded-xl border border-[#DD88CF] bg-[#F8E7F6] px-4 py-2.5 text-xs font-bold text-[#4B164C] transition-colors hover:bg-[#DD88CF]/30 disabled:opacity-50 shadow-sm"
              >
                {aiBusy ? <Loader2 className="h-4 w-4 animate-spin text-[#DD88CF]" /> : <Sparkles className="h-4 w-4 text-[#DD88CF]" />}
                {t('admin.editor.aiSuggestTitle')}
              </button>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label={t('admin.editor.courseLabel')} required hint={selectedCourse ? selectedCourse.slug : undefined}>
                  <select
                    value={form.course || defaultCourse}
                    onChange={(event) => update(() => ({ course: event.target.value }))}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm"
                    disabled={Boolean(lessonId)}
                  >
                    <option value="">{t('admin.editor.courseSelect')}</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {localize(course.title, i18n.language)}{course.published ? '' : ` — ${t('admin.common.draft')}`}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t('admin.editor.difficultyLabel')}>
                  <select value={form.difficulty} onChange={(event) => update(() => ({ difficulty: event.target.value }))} className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm">
                    {DIFFICULTIES.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {t(`admin.courses.difficulties.${difficulty}`)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t('admin.editor.reviewLabel')}>
                  <select value={form.reviewStatus} onChange={(event) => update(() => ({ reviewStatus: event.target.value }))} className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm">
                    {REVIEW_STATES.map((state) => (
                      <option key={state} value={state}>
                        {t(`admin.courses.${state}`)}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label={t('admin.editor.orderLabel')}>
                  <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(event) => update(() => ({ order: event.target.value }))}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm"
                  />
                </Field>
                <Field label={t('admin.editor.minutesLabel')}>
                  <input
                    type="number"
                    min="1"
                    value={form.estimatedMinutes}
                    onChange={(event) => update(() => ({ estimatedMinutes: event.target.value }))}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm"
                  />
                </Field>
                <Field label={t('admin.editor.videoLabel')} hint={t('admin.editor.videoHint')}>
                  <input
                    type="url"
                    value={form.videoUrl}
                    onChange={(event) => update(() => ({ videoUrl: event.target.value }))}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm"
                    dir="ltr"
                    placeholder="https://www.youtube.com/watch?v=…"
                  />
                </Field>
              </div>

              <SectionLabel>{t('admin.editor.sectionIntro')}</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={`${t('admin.editor.intro')} (${t('admin.common.ar')})`}>
                  <textarea
                    rows={3}
                    value={form.content.ar}
                    onChange={(event) => update((previous) => ({ content: { ...previous.content, ar: event.target.value } }))}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm resize-y"
                    dir="rtl"
                  />
                </Field>
                <Field label={`${t('admin.editor.intro')} (${t('admin.common.en')})`}>
                  <textarea
                    rows={3}
                    value={form.content.en}
                    onChange={(event) => update((previous) => ({ content: { ...previous.content, en: event.target.value } }))}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm resize-y"
                    dir="ltr"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={`${t('admin.editor.objectives')} (${t('admin.common.ar')})`} hint={t('admin.editor.objectivesHint')}>
                  <textarea
                    rows={4}
                    value={objectivesAr}
                    onChange={(event) => setObjectivesAr(event.target.value)}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm resize-y"
                    dir="rtl"
                  />
                </Field>
                <Field label={`${t('admin.editor.objectives')} (${t('admin.common.en')})`} hint={t('admin.editor.objectivesHint')}>
                  <textarea
                    rows={4}
                    value={objectivesEn}
                    onChange={(event) => setObjectivesEn(event.target.value)}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm resize-y"
                    dir="ltr"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={`${t('admin.editor.safety')} (${t('admin.common.ar')})`}>
                  <textarea
                    rows={2}
                    value={form.safetyNotes.ar}
                    onChange={(event) => update((previous) => ({ safetyNotes: { ...previous.safetyNotes, ar: event.target.value } }))}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm resize-y"
                    dir="rtl"
                  />
                </Field>
                <Field label={`${t('admin.editor.safety')} (${t('admin.common.en')})`}>
                  <textarea
                    rows={2}
                    value={form.safetyNotes.en}
                    onChange={(event) => update((previous) => ({ safetyNotes: { ...previous.safetyNotes, en: event.target.value } }))}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm resize-y"
                    dir="ltr"
                  />
                </Field>
              </div>

              <SectionLabel>{t('admin.editor.sectionMedia')}</SectionLabel>
              <div className="flex flex-col gap-3 rounded-2xl border border-[#DD88CF]/40 bg-[#F5F5F5] p-4 sm:flex-row sm:items-center">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-[#DD88CF] bg-white">
                  {form.coverImage ? (
                    <img src={form.coverImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[#4B164C]/50">
                      <ImageIcon className="h-6 w-6 text-[#DD88CF]" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1 space-y-2.5">
                  <input
                    value={form.coverImage}
                    onChange={(event) => update(() => ({ coverImage: event.target.value }))}
                    className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm"
                    dir="ltr"
                    placeholder={t('admin.editor.coverPlaceholder')}
                  />
                  <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl bg-[#F8E7F6] px-4 text-xs font-extrabold text-[#4B164C] border border-[#DD88CF] hover:bg-[#DD88CF]/30 transition-colors shadow-sm">
                    {coverBusy ? <Loader2 className="h-4 w-4 animate-spin text-[#DD88CF]" /> : <Upload className="h-4 w-4 text-[#DD88CF]" />}
                    {coverBusy ? t('admin.courseEditor.imageUploading') : t('admin.courseEditor.imageFromPc')}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(event) => handleCoverFile(event.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>

              <Field label={t('admin.editor.sourceRefs')}>
                <textarea
                  rows={2}
                  value={sourceRefsText}
                  onChange={(event) => setSourceRefsText(event.target.value)}
                  className="w-full rounded-xl border border-[#DD88CF] bg-white px-4 py-2.5 text-xs text-[#4B164C] focus:outline-none focus:ring-2 focus:ring-[#4B164C] shadow-sm resize-y"
                  dir="ltr"
                  placeholder="https://cpr.example/source-1"
                />
              </Field>
            </div>
          </Panel>

          <Panel className="bg-white border border-[#DD88CF]/40 rounded-2xl p-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-[#4B164C]">{t('admin.editor.sectionBlocks')}</p>
                  <p className="text-xs font-semibold text-[#4B164C]/70">{t('admin.editor.sectionBlocksHint')}</p>
                </div>
                <span className="rounded-full bg-[#F8E7F6] px-3 py-1 text-xs font-extrabold text-[#4B164C] border border-[#DD88CF]">
                  {formatNumber(drafts.length, i18n.language)} {t('admin.courses.blocksCount')}
                </span>
              </div>
              <LessonBlocksEditor blocks={drafts} onChange={setDrafts} onImprove={improveBlock} />
            </div>
          </Panel>

          <Panel
            title={t('admin.editor.sectionQuizzes')}
            subtitle={t('admin.editor.sectionQuizzesHint')}
            className="bg-white border border-[#DD88CF]/40 rounded-2xl p-6 shadow-sm"
            actions={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={draftQuestion}
                  disabled={aiBusy}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#DD88CF] bg-[#F8E7F6] px-3.5 py-2 text-xs font-bold text-[#4B164C] transition-colors hover:bg-[#DD88CF]/30 disabled:opacity-50 shadow-sm"
                >
                  {aiBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#DD88CF]" /> : <Sparkles className="h-3.5 w-3.5 text-[#DD88CF]" />}
                  {t('admin.quizzesPage.aiDraft')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuizEditing(null);
                    setQuizPrefill(null);
                    setQuizModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#4B164C] px-3.5 py-2 text-xs font-extrabold text-[#F8E7F6] hover:bg-[#4B164C]/90 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5 text-[#DD88CF]" /> {t('admin.quizzesPage.newQuiz')}
                </button>
              </div>
            }
          >
            {lessonId ? (
              quizList.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#DD88CF] px-4 py-6 text-center text-xs font-semibold text-[#4B164C]/70 bg-[#F5F5F5]">
                  {t('admin.quizzesPage.noQuizzes')}
                </p>
              ) : (
                <div className="divide-y divide-[#DD88CF]/20">
                  {quizList.map((quiz) => (
                    <div key={quiz._id} className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]">
                          <ClipboardCheck className="h-4 w-4 text-[#DD88CF]" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-extrabold text-[#4B164C]">{localize(quiz.title, i18n.language)}</p>
                          <p className="text-[10px] text-[#4B164C]/70">
                            {t('admin.courses.questionsCount')}: {formatNumber(quiz.questions?.length || 0, i18n.language)} · {t('admin.common.status')}: {quiz.published ? t('admin.common.published') : t('admin.common.draft')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setQuizEditing(quiz);
                            setQuizPrefill(null);
                            setQuizModalOpen(true);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#DD88CF] bg-[#F8E7F6] text-[#4B164C] transition-colors hover:bg-[#DD88CF]/30 shadow-sm"
                          aria-label={t('admin.common.edit')}
                          title={t('admin.common.edit')}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting({ kind: 'quiz', item: quiz })}
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 shadow-sm"
                          aria-label={t('admin.common.delete')}
                          title={t('admin.common.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <p className="rounded-xl border border-dashed border-[#DD88CF] px-4 py-6 text-center text-xs font-semibold text-[#4B164C]/70 bg-[#F5F5F5]">
                {t('admin.editor.quizzesAfterSave')}
              </p>
            )}
          </Panel>

          <div className="sticky bottom-6 z-20">
            <div className="rounded-2xl border border-[#DD88CF]/60 bg-white/95 p-4 shadow-xl backdrop-blur flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-[60%] text-xs font-bold text-[#4B164C]/70">{t('admin.editor.saveHint')}</p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => save(false)}
                  disabled={Boolean(savingMode)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#F8E7F6] px-4 py-2.5 text-xs font-bold text-[#4B164C] border border-[#DD88CF] hover:bg-[#DD88CF]/30 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Save className="h-4 w-4 text-[#DD88CF]" />
                  {savingMode === 'draft' ? t('admin.common.saving') : t('admin.editor.saveDraft')}
                </button>
                <button
                  type="button"
                  onClick={() => save(true)}
                  disabled={Boolean(savingMode)}
                  className="flex items-center gap-1.5 rounded-xl bg-[#4B164C] px-5 py-2.5 text-xs font-extrabold text-[#F8H7F6] text-[#F8E7F6] hover:bg-[#4B164C]/90 shadow-md disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4 text-[#DD88CF]" />
                  {savingMode === 'publish' ? t('admin.common.saving') : t('admin.editor.publish')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} size="lg" title={t('admin.editor.previewTitle')} subtitle={t('admin.editor.previewHint')}>
        {(() => {
          const lang = previewLang;
          const preview = previewBlocks(drafts, lang);
          const objectives = splitLines(lang === 'ar' ? objectivesAr : objectivesEn);
          return (
            <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="space-y-5 text-[#4B164C]">
              <div>
                <p className="font-display text-lg font-bold text-[#4B164C]">{form.title[lang] || localize(form.title, lang)}</p>
                {form.content[lang] && <p className="mt-2 text-xs leading-relaxed text-[#4B164C]/80">{form.content[lang]}</p>}
              </div>
              {objectives.length > 0 && (
                <div className="rounded-xl border border-[#DD88CF]/40 bg-[#F5F5F5] p-4">
                  <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#4B164C]/60">{t('admin.editor.objectives')}</p>
                  <ul className="space-y-1.5">
                    {objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs leading-relaxed text-[#4B164C]">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#DD88CF]" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <LessonBlocks blocks={preview} isAr={lang === 'ar'} />
              {form.safetyNotes[lang] && (
                <div className="flex items-start gap-2.5 rounded-xl border border-[#DD88CF]/40 bg-[#F8E7F6] p-3.5 text-xs font-bold text-[#4B164C]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#DD88CF]" />
                  {form.safetyNotes[lang]}
                </div>
              )}
            </div>
          );
        })()}
        <div className="mt-4 flex justify-center gap-1 rounded-xl bg-[#F5F5F5] p-1 border border-[#DD88CF]/30">
          {['ar', 'en'].map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setPreviewLang(lang)}
              className={`rounded-lg px-4 py-1.5 text-xs font-extrabold transition-colors ${previewLang === lang ? 'bg-[#4B164C] text-[#F8E7F6] shadow-sm' : 'text-[#4B164C]/70 hover:text-[#4B164C]'}`}
            >
              {t(lang === 'ar' ? 'admin.common.ar' : 'admin.common.en')}
            </button>
          ))}
        </div>
      </Modal>

      <QuizEditorModal
        open={quizModalOpen}
        quiz={quizEditing}
        lessons={quizLessons}
        defaultLessonId={lessonId || ''}
        prefillQuestion={quizPrefill}
        onClose={() => {
          setQuizModalOpen(false);
          setQuizEditing(null);
          setQuizPrefill(null);
        }}
        onSaved={onQuizSaved}
      />

      <AiModal
        open={Boolean(aiPreview)}
        onClose={() => setAiPreview(null)}
        wide
        title={aiPreview?.kind === 'titles' ? t('admin.editor.aiTitlesTitle') : t('admin.editor.aiParagraphTitle')}
        subtitle={aiPreview?.model ? `Grok · ${aiPreview.model}` : 'Grok'}
        icon={<Sparkles className="h-4 w-4 text-[#DD88CF]" />}
      >
        {aiPreview?.kind === 'titles' && (
          <div className="max-h-[60vh] space-y-2.5 overflow-y-auto" dir={isAr ? 'rtl' : 'ltr'}>
            {aiPreview.ar.map((titleAr, index) => {
              const titleEn = aiPreview.en[index] || titleAr;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => applyTitles(titleAr, titleEn)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#DD88CF]/40 bg-[#F5F5F5] px-4 py-3.5 text-start transition-colors hover:border-[#4B164C]"
                >
                  <div className="flex-1 space-y-1">
                    <p dir="rtl" className="text-xs font-extrabold text-[#4B164C]">{titleAr}</p>
                    <p dir="ltr" className="text-xs text-[#4B164C]/70">{titleEn}</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-xl bg-[#4B164C] px-3 py-1.5 text-xs font-extrabold text-[#F8E7F6]">
                    <Check className="h-3.5 w-3.5 text-[#DD88CF]" /> {t('admin.editor.aiApply')}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {aiPreview?.kind === 'paragraph' && (
          <div className="space-y-4 text-[#4B164C]" dir={isAr ? 'rtl' : 'ltr'}>
            <div>
              <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#4B164C]/60">{t('admin.common.ar')}</p>
              <p dir="rtl" className="whitespace-pre-wrap rounded-2xl border border-[#DD88CF]/40 bg-[#F5F5F5] p-4 text-xs leading-relaxed text-[#4B164C]">{aiPreview.ar}</p>
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#4B164C]/60">{t('admin.common.en')}</p>
              <p dir="ltr" className="whitespace-pre-wrap rounded-2xl border border-[#DD88CF]/40 bg-[#F5F5F5] p-4 text-xs leading-relaxed text-[#4B164C]">{aiPreview.en}</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDrafts((previous) =>
                    previous.map((draft) =>
                      draft.id === aiPreview.blockId
                        ? { ...draft, content: { ar: aiPreview.ar, en: aiPreview.en } }
                        : draft
                    )
                  );
                  setAiPreview(null);
                }}
                className="flex-1 rounded-xl bg-[#4B164C] py-3 text-center text-xs font-extrabold text-[#F8E7F6] transition-all hover:bg-[#4B164C]/90 shadow-sm"
              >
                {t('admin.editor.aiApply')}
              </button>
              <button
                type="button"
                onClick={() => setAiPreview(null)}
                className="rounded-xl border border-[#DD88CF] px-4 py-3 text-xs font-bold text-[#4B164C] bg-[#F8E7F6] hover:bg-[#DD88CF]/30 transition-colors"
              >
                {t('admin.editor.aiDiscard')}
              </button>
            </div>
          </div>
        )}
      </AiModal>

      {aiBusy && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#4B164C] px-5 py-2.5 text-xs font-bold text-[#F8E7F6] shadow-xl border border-[#DD88CF]/50">
          <Loader2 className="h-4 w-4 animate-spin text-[#DD88CF]" />
          <span>{t('admin.editor.aiBusy')}</span>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={deleting?.kind === 'quiz' ? removeQuiz : removeLesson}
        title={deleting?.kind === 'quiz' ? t('admin.common.delete') : t('admin.editor.deleteLessonTitle')}
        message={deleting?.kind === 'quiz' ? t('admin.courses.deleteQuizConfirm') : t('admin.editor.deleteLessonConfirm')}
        confirmLabel={t('admin.common.delete')}
        cancelLabel={t('admin.common.cancel')}
        busy={deleteBusy}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}