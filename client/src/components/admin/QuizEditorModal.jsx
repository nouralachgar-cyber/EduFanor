import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Sparkles, Trash2, Loader2, Plus } from '../../components/icons';
import AiModal from '../ai/AiModal';
import { aiApi, localizeAiError } from '../../lib/ai';
import { adminApi, localize } from '../../lib/admin';
import { Field, Modal, SectionLabel } from './ui';

const newQuestion = () => ({
  question: { ar: '', en: '' },
  options: { ar: ['', ''], en: ['', ''] },
  correctAnswer: 0,
  explanation: { ar: '', en: '' },
});

const emptyQuiz = ({ lessonId } = {}) => ({
  title: { ar: '', en: '' },
  lesson: lessonId || '',
  passingScore: 70,
  published: true,
  questions: [newQuestion()],
});

const shapeQuestion = (question) => ({
  question: { ar: question.question?.ar || '', en: question.question?.en || '' },
  options: {
    ar: question.options?.ar?.length ? [...question.options.ar] : ['', ''],
    en: question.options?.en?.length ? [...question.options.en] : ['', ''],
  },
  correctAnswer: question.correctAnswer || 0,
  explanation: { ar: question.explanation?.ar || '', en: question.explanation?.en || '' },
});

export default function QuizEditorModal({ open, quiz, lessons = [], defaultLessonId = '', prefillQuestion, onClose, onSaved }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [form, setForm] = useState(emptyQuiz());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiPreview, setAiPreview] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    setError('');
    setAiError('');
    setAiPreview(null);
    if (prefillQuestion) {
      const question = shapeQuestion(prefillQuestion);
      setForm({
        title: { ar: '', en: '' },
        lesson: quiz?.lesson?._id || quiz?.lesson || defaultLessonId || lessons[0]?._id || '',
        passingScore: quiz?.passingScore ?? 70,
        published: quiz?.published ?? true,
        questions: [question],
      });
      return undefined;
    }
    if (quiz) {
      setForm({
        title: { ar: quiz.title?.ar || '', en: quiz.title?.en || '' },
        lesson: quiz.lesson?._id || quiz.lesson || '',
        passingScore: quiz.passingScore ?? 70,
        published: Boolean(quiz.published),
        questions: (quiz.questions || []).map(shapeQuestion),
      });
    } else {
      setForm(emptyQuiz({ lessonId: defaultLessonId || lessons[0]?._id || '' }));
    }
    return undefined;
  }, [open, quiz, prefillQuestion, defaultLessonId, lessons]);

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson._id === form.lesson) || null,
    [lessons, form.lesson]
  );

  const updateQuestion = (index, updater) =>
    setForm((previous) => ({
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

  const draftWithAi = async () => {
    const material = [
      selectedLesson ? localize(selectedLesson.title, i18n.language) : '',
      localize(form.title, i18n.language),
    ]
      .filter(Boolean)
      .join('\n');
    if (!material.trim()) {
      setAiError(t('admin.quizzesPage.aiNeedsContext'));
      return;
    }
    setAiBusy(true);
    setAiError('');
    try {
      const data = await aiApi.adminGenerate({ task: 'quiz_draft', language: isAr ? 'ar' : 'en', sourceText: material });
      if (data?.result) {
        setAiPreview({ result: data.result, model: data.model });
      }
    } catch (err) {
      setAiError(localizeAiError(err, isAr));
    } finally {
      setAiBusy(false);
    }
  };

  const applyAiDraft = () => {
    if (!aiPreview?.result) return;
    const draft = aiPreview.result;
    setForm((previous) => ({
      ...previous,
      questions: [
        ...previous.questions,
        {
          question: { ar: draft.question?.ar || '', en: draft.question?.en || '' },
          options: {
            ar: (draft.options?.ar || []).map(String),
            en: (draft.options?.en || []).map(String),
          },
          correctAnswer: Number(draft.suggestedCorrectIndex) || 0,
          explanation: { ar: draft.explanation?.ar || '', en: draft.explanation?.en || '' },
        },
      ].filter(
        (question) =>
          question.options.ar.length >= 2 &&
          question.options.en.length === question.options.ar.length
      ),
    }));
    setAiPreview(null);
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.title.ar.trim() || !form.title.en.trim() || !form.lesson) {
      setError(t('admin.courses.fieldsRequired'));
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        passingScore: Number(form.passingScore) || 70,
        questions: form.questions.map((question) => ({
          ...question,
          correctAnswer: Number(question.correctAnswer) || 0,
        })),
      };
      const saved = quiz
        ? await adminApi.updateQuiz(quiz._id, payload)
        : await adminApi.createQuiz(payload);
      onSaved?.(saved?.quiz || null, Boolean(quiz));
    } catch (err) {
      setError(err.message || t('admin.courseEditor.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={quiz ? t('admin.courses.editQuiz') : t('admin.courses.createQuiz')}
        subtitle={t('admin.courses.bilingualHint')}
        size="lg"
        footer={
          <>
            <button type="button" onClick={onClose} className="btn-secondary h-9 px-4 text-xs">
              {t('admin.common.cancel')}
            </button>
            <button type="submit" form="admin-quiz-form" disabled={saving} className="btn-primary h-9 px-4 text-xs">
              {saving ? t('admin.common.saving') : t('admin.common.save')}
            </button>
          </>
        }
      >
        <form id="admin-quiz-form" onSubmit={save} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={`${t('admin.courses.quizTitle')} (${t('admin.common.ar')})`} required>
              <input
                value={form.title.ar}
                onChange={(event) => setForm((previous) => ({ ...previous, title: { ...previous.title, ar: event.target.value } }))}
                className="input"
                dir="rtl"
              />
            </Field>
            <Field label={`${t('admin.courses.quizTitle')} (${t('admin.common.en')})`} required>
              <input
                value={form.title.en}
                onChange={(event) => setForm((previous) => ({ ...previous, title: { ...previous.title, en: event.target.value } }))}
                className="input"
                dir="ltr"
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label={t('admin.courses.lesson')} required>
              <select
                value={form.lesson}
                onChange={(event) => setForm((previous) => ({ ...previous, lesson: event.target.value }))}
                className="input"
              >
                <option value="">{t('admin.courses.selectLesson')}</option>
                {lessons.map((lesson) => (
                  <option key={lesson._id} value={lesson._id}>
                    {localize(lesson.title, i18n.language)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('admin.courses.passingScore')}>
              <input
                type="number"
                min="0"
                max="100"
                value={form.passingScore}
                onChange={(event) => setForm((previous) => ({ ...previous, passingScore: event.target.value }))}
                className="input"
              />
            </Field>
            <Field label={t('admin.common.status')}>
              <select
                value={form.published ? 'published' : 'draft'}
                onChange={(event) => setForm((previous) => ({ ...previous, published: event.target.value === 'published' }))}
                className="input"
              >
                <option value="published">{t('admin.common.published')}</option>
                <option value="draft">{t('admin.common.draft')}</option>
              </select>
            </Field>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionLabel>
              {t('admin.courses.questionsCount')} ({form.questions.length})
            </SectionLabel>
            <button
              type="button"
              onClick={draftWithAi}
              disabled={aiBusy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/35 px-3 py-1.5 text-[11px] font-bold text-primary transition-colors hover:bg-primary/10 disabled:opacity-50 dark:text-brand-ink"
            >
              {aiBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              {t('admin.quizzesPage.aiDraft')}
            </button>
          </div>

          <div className="space-y-4">
            {form.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="rounded-xl border border-line bg-surface-muted/50 p-3.5">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
                    {t('admin.courses.question')} {questionIndex + 1}
                  </p>
                  {form.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setForm((previous) => ({ ...previous, questions: previous.questions.filter((_, index) => index !== questionIndex) }))}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-danger hover:underline"
                    >
                      <Trash2 className="h-3 w-3" /> {t('admin.courses.removeQuestion')}
                    </button>
                  )}
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <input
                    value={question.question.ar}
                    onChange={(event) => updateQuestionText(questionIndex, 'question', 'ar', event.target.value)}
                    className="input h-10 text-xs"
                    placeholder={`${t('admin.courses.question')} (${t('admin.common.ar')})`}
                    dir="rtl"
                  />
                  <input
                    value={question.question.en}
                    onChange={(event) => updateQuestionText(questionIndex, 'question', 'en', event.target.value)}
                    className="input h-10 text-xs"
                    placeholder={`${t('admin.courses.question')} (${t('admin.common.en')})`}
                    dir="ltr"
                  />
                </div>

                <div className="mt-3 space-y-2">
                  <p className="text-[10px] font-extrabold text-ink-muted">{t('admin.courses.options')}</p>
                  {question.options.ar.map((option, optionIndex) => (
                    <div key={optionIndex} className="grid grid-cols-[auto_1fr] gap-2 rounded-lg border border-line bg-card p-2">
                      <button
                        type="button"
                        onClick={() => updateQuestion(questionIndex, (previous) => ({ ...previous, correctAnswer: optionIndex }))}
                        className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${question.correctAnswer === optionIndex ? 'border-primary bg-primary text-on-primary' : 'border-line-strong text-transparent hover:border-primary'}`}
                        aria-label={t('admin.courses.correctAnswer')}
                        title={t('admin.courses.correctAnswer')}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </button>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          value={option}
                          onChange={(event) => updateOption(questionIndex, 'ar', optionIndex, event.target.value)}
                          className="input h-8 text-[11px]"
                          placeholder={`${t('admin.courses.option')} ${optionIndex + 1} (${t('admin.common.ar')})`}
                          dir="rtl"
                        />
                        <input
                          value={question.options.en[optionIndex] || ''}
                          onChange={(event) => updateOption(questionIndex, 'en', optionIndex, event.target.value)}
                          className="input h-8 text-[11px]"
                          placeholder={`${t('admin.courses.option')} ${optionIndex + 1} (${t('admin.common.en')})`}
                          dir="ltr"
                        />
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
                  <button
                    type="button"
                    onClick={() => addOption(questionIndex)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline dark:text-brand-ink"
                  >
                    <Plus className="h-3 w-3" /> {t('admin.courses.addOption')}
                  </button>
                </div>

                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  <input
                    value={question.explanation.ar}
                    onChange={(event) => updateQuestionText(questionIndex, 'explanation', 'ar', event.target.value)}
                    className="input h-9 text-[11px]"
                    placeholder={`${t('admin.courses.explanation')} (${t('admin.common.ar')})`}
                    dir="rtl"
                  />
                  <input
                    value={question.explanation.en}
                    onChange={(event) => updateQuestionText(questionIndex, 'explanation', 'en', event.target.value)}
                    className="input h-9 text-[11px]"
                    placeholder={`${t('admin.courses.explanation')} (${t('admin.common.en')})`}
                    dir="ltr"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setForm((previous) => ({ ...previous, questions: [...previous.questions, newQuestion()] }))}
            className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-line-strong px-3.5 py-2 text-[11px] font-bold text-ink transition-colors hover:bg-surface-muted"
          >
            <Plus className="h-3.5 w-3.5" /> {t('admin.courses.addQuestion')}
          </button>

          {error && (
            <p className="rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-[11px] font-bold text-danger">{error}</p>
          )}
          {aiError && !aiBusy && (
            <p className="rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-[11px] font-bold text-danger">{aiError}</p>
          )}
        </form>
      </Modal>

      <AiModal
        open={Boolean(aiPreview)}
        onClose={() => setAiPreview(null)}
        title={t('admin.quizzesPage.aiDraftTitle')}
        subtitle={aiPreview?.model ? `Grok · ${aiPreview.model}` : 'Grok'}
        icon={<Sparkles className="h-4 w-4" />}
      >
        {aiPreview?.result && (
          <div className="space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
            <div>
              <p dir="rtl" className="text-xs font-extrabold text-ink">{aiPreview.result.question?.ar}</p>
              <p dir="ltr" className="mt-1 text-[11px] text-ink-muted">{aiPreview.result.question?.en}</p>
            </div>
            <div className="space-y-2">
              {(aiPreview.result.options?.ar || []).map((optionAr, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 ${
                    aiPreview.result.suggestedCorrectIndex === index ? 'border-success/40 bg-success-soft' : 'border-line bg-card'
                  }`}
                >
                  {aiPreview.result.suggestedCorrectIndex === index && <CheckCircle2 className="h-4 w-4 shrink-0 text-success-ink" />}
                  <span dir="rtl" className="flex-1 text-xs font-bold text-ink">{optionAr}</span>
                  <span dir="ltr" className="text-[11px] text-ink-muted">{aiPreview.result.options?.en?.[index]}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-ink-muted">{t('admin.quizzesPage.aiDraftHint')}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={applyAiDraft}
                className="flex-1 rounded-xl bg-primary py-3 text-center text-xs font-extrabold text-on-primary transition-all hover:-translate-y-0.5"
              >
                {t('admin.editor.aiApply')}
              </button>
              <button
                type="button"
                onClick={() => setAiPreview(null)}
                className="rounded-xl border border-line px-4 text-xs font-bold text-ink-muted hover:bg-surface-muted"
              >
                {t('admin.editor.aiDiscard')}
              </button>
            </div>
          </div>
        )}
      </AiModal>
    </>
  );
}
