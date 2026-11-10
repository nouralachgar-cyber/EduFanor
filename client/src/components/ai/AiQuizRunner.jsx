import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, RefreshCw, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Award } from '../icons';
import { aiApi, localizeAiError } from '../../lib/ai';
import { saveQuizResult } from '../../lib/progress';
import AiMarkdown from './AiMarkdown';

export default function AiQuizRunner({ quiz, onDone }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const lang = isAr ? 'ar' : 'en';

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => Array(quiz.questions.length).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const questions = quiz.questions || [];
  const answeredCount = answers.filter((value) => value !== null).length;
  const progress = Math.round(((step + 1) / Math.max(1, questions.length)) * 100);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const data = await aiApi.evaluateQuiz({ quizId: quiz.id, answers, language: lang });
      setResult(data);
      if (data?.score) {
        saveQuizResult(data.score.correct, data.score.total, {});
      }
    } catch (requestError) {
      setError(localizeAiError(requestError, isAr));
    } finally {
      setSubmitting(false);
    }
  };

  const choose = (optionIndex) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[step] = optionIndex;
      return next;
    });
  };

  if (result) return <ResultView result={result} quiz={quiz} onDone={onDone} isAr={isAr} />;

  return (
    <div className="space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-ink-muted">
          <span>
            {isAr ? 'السؤال' : 'Question'} {step + 1} / {questions.length}
          </span>
          <span className="text-brand-ink">{answeredCount}/{questions.length}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-sage transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface-muted/60 p-4">
        <p className="text-[13px] font-extrabold leading-relaxed text-ink sm:text-sm">
          {questions[step]?.question}
        </p>
        <div className="mt-3.5 space-y-2">
          {(questions[step]?.options || []).map((option, optionIndex) => {
            const active = answers[step] === optionIndex;
            return (
              <button
                key={optionIndex}
                type="button"
                onClick={() => choose(optionIndex)}
                className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-start text-xs font-bold transition-all ${
                  active
                    ? 'border-primary bg-primary/10 text-ink'
                    : 'border-line bg-card text-ink hover:border-primary/50'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-extrabold ${
                    active ? 'border-primary bg-primary text-on-primary' : 'border-line text-ink-muted'
                  }`}
                >
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-xs font-bold text-danger">
          <XCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={step === 0 || submitting}
          onClick={() => setStep((previous) => Math.max(0, previous - 1))}
          className="btn-secondary px-4 text-xs disabled:opacity-50"
        >
          {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{isAr ? 'السابق' : 'Back'}</span>
        </button>

        {step < questions.length - 1 ? (
          <button
            type="button"
            disabled={answers[step] === null || submitting}
            onClick={() => setStep((previous) => previous + 1)}
            className="btn-primary px-5 text-xs disabled:opacity-50"
          >
            <span>{isAr ? 'التالي' : 'Next'}</span>
            {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        ) : (
          <button
            type="button"
            disabled={answeredCount < questions.length || submitting}
            onClick={submit}
            className="btn-primary px-5 text-xs disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            <span>{submitting ? (isAr ? 'جارٍ التصحيح...' : 'Scoring...') : isAr ? 'تصحيح الإجابات' : 'Submit answers'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

function ResultView({ result, quiz, onDone, isAr }) {
  const score = result.score || { correct: 0, total: 0, percent: 0, passed: false };
  const ring = useMemo(() => {
    const value = Math.max(0, Math.min(100, score.percent));
    return {
      background: `conic-gradient(${value >= 70 ? 'var(--color-sage)' : 'var(--color-primary)'} ${value * 3.6}deg, var(--color-surface-muted) 0deg)`,
    };
  }, [score.percent]);

  return (
    <div className="space-y-5" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface-muted/60 p-5 text-center sm:flex-row sm:text-start">
        <div
          className="relative flex h-24 w-24 items-center justify-center rounded-full"
          style={ring.background}
        >
          <div className="flex h-[76px] w-[76px] flex-col items-center justify-center rounded-full bg-card">
            <span className="font-display text-xl font-bold text-ink">{score.percent}%</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-ink-muted">
              {score.correct}/{score.total}
            </span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="flex items-center justify-center gap-2 text-sm font-extrabold text-ink sm:justify-start">
            <Award className="h-4 w-4 text-brand-ink" />
            {score.passed
              ? isAr
                ? 'أحسنت! اجتزت الاختبار'
                : 'Great job — quiz passed'
              : isAr
              ? 'راجع الدرس وأعد المحاولة'
              : 'Review the lesson and try again'}
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">
            {quiz.lessonTitle ? `${isAr ? 'من' : 'from'}: ${quiz.lessonTitle}` : ''}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {result.results?.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl border p-4 ${
              item.isCorrect ? 'border-success/35 bg-success-soft/60' : 'border-danger/25 bg-danger-soft/60'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {item.isCorrect ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-ink" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
              )}
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-xs font-extrabold leading-relaxed text-ink">
                  {index + 1}. {item.question}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-ink-muted">
                  <span>
                    {isAr ? 'إجابتك' : 'Your answer'}:{' '}
                    <span className={item.chosen === null ? 'text-danger' : 'text-ink'}>
                      {item.chosen === null
                        ? isAr
                          ? 'بدون إجابة'
                          : 'not answered'
                        : item.options?.[item.chosen] || '—'}
                    </span>
                  </span>
                  <span>
                    {isAr ? 'الصحيحة' : 'Correct'}:{' '}
                    <span className="text-success-ink">
                      {item.options?.[item.correctAnswer] || '—'}
                    </span>
                  </span>
                </div>
                {item.explanation && <AiMarkdown content={item.explanation} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={onDone} className="btn-primary px-5 text-xs">
          <span>{isAr ? 'إغلاق' : 'Close'}</span>
        </button>
      </div>
    </div>
  );
}

export function RetryHint({ isAr, error, onRetry }) {
  if (!error) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-xs font-bold text-danger">
      <XCircle className="h-4 w-4 shrink-0" />
      <span className="flex-1">{error}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1 rounded-lg border border-danger/30 px-2 py-1 text-[10px] font-extrabold hover:bg-danger/10"
        >
          <RefreshCw className="h-3 w-3" />
          {isAr ? 'إعادة' : 'Retry'}
        </button>
      )}
    </div>
  );
}
