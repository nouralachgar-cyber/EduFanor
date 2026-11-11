import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, FileText, ClipboardCheck, Loader2, Copy, Check, RefreshCw, XCircle, Sparkles, Languages } from '../icons';
import { aiApi, localizeAiError } from '../../lib/ai';
import AiModal from './AiModal';
import AiMarkdown from './AiMarkdown';
import AiQuizRunner, { RetryHint } from './AiQuizRunner';

export function stepContentText(step, isAr) {
  const lang = isAr ? 'ar' : 'en';
  const parts = [];
  const pushText = (text) => {
    if (typeof text === 'string' && text.trim()) parts.push(text.trim());
    else if (typeof text === 'number') parts.push(String(text));
  };

  pushText(step?.title);
  const hasBlocks = Array.isArray(step?.blocks) && step.blocks.length > 0;
  if (step?.content && !hasBlocks) {
    const value =
      typeof step.content === 'object' && !Array.isArray(step.content)
        ? step.content[lang] || step.content.en || step.content.ar || ''
        : step.content;
    pushText(value);
  }
  hasBlocks && (Array.isArray(step?.blocks) ? step.blocks : []).forEach((block) => {
    let content = block?.content;
    if (Array.isArray(content)) {
      const joined = content
        .map((item) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            return item[lang] || item.text?.[lang] || item.text || item.title?.[lang] || item.title || item.label || '';
          }
          return '';
        })
        .filter(Boolean)
        .join('\n');
      content = joined;
    } else if (content && typeof content === 'object') {
      content = content[lang] || content.en || content.ar || '';
    }
    if (typeof content === 'string' && content.trim()) {
      const marker = ['heading', 'subheading'].includes(block?.type) ? '## ' : '';
      pushText(marker + content);
    }
  });

  const safety = step?.safetyNotes || step?.warning;
  if (safety) pushText(`${isAr ? 'ملاحظات السلامة' : 'Safety notes'}: ${safety}`);

  return parts.join('\n\n').slice(0, 5500);
}

const MODES = [
  { key: 'explain', label: { ar: 'اشرح بالذكاء الاصطناعي', en: 'Explain with AI' }, icon: BookOpen },
  { key: 'summary', label: { ar: 'ملخص ذكي', en: 'AI Summary' }, icon: FileText },
  { key: 'quiz', label: { ar: 'اختبار ذكي', en: 'AI Quiz' }, icon: ClipboardCheck },
];

const QUIZ_COUNTS = [3, 5, 8];
const QUIZ_LEVELS = [
  { key: 'easy', label: { ar: 'سهل', en: 'Easy' } },
  { key: 'medium', label: { ar: 'متوسط', en: 'Medium' } },
  { key: 'hard', label: { ar: 'صعب', en: 'Hard' } },
];

export default function AiLessonTools({ lessonId, courseTitle = '', title = '', content = '', safetyNotes = '' }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const lang = isAr ? 'ar' : 'en';

  const hasContent = Boolean(content && content.trim());
  const [mode, setMode] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [quizStage, setQuizStage] = useState('config');
  const [quiz, setQuiz] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!mode) {
      setAnswer(null);
      setError(null);
      setQuiz(null);
      setQuizStage('config');
      setCopied(false);
    }
  }, [mode]);

  const requestLanguage = async (targetLang, overrideMode) => {
    setBusy(true);
    setError(null);
    try {
      const activeMode = overrideMode || mode;
      const payload = {
        language: targetLang,
        inline: lessonId ? undefined : { title, content, safetyNotes, courseTitle },
        lessonId: lessonId || undefined,
      };
      const data =
        activeMode === 'explain'
          ? await aiApi.explainLesson(payload)
          : await aiApi.summarize({ lessonId: payload.lessonId, inline: payload.inline, language: targetLang });
      setAnswer(data);
    } catch (requestError) {
      setError(localizeAiError(requestError, isAr));
    } finally {
      setBusy(false);
    }
  };

  const openMode = async (key) => {
    setMode(key);
    if (key === 'quiz') return;
    await requestLanguage(lang, key);
  };

  const generateQuiz = async () => {
    setBusy(true);
    setError(null);
    try {
      const data = await aiApi.generateQuiz({
        lessonId: lessonId || undefined,
        inline: lessonId ? undefined : { title, content, safetyNotes, courseTitle },
        language: lang,
        difficulty,
        count,
      });
      setQuiz(data?.quiz || null);
      setQuizStage('run');
      if (!data?.quiz) setError(t('ai.genericError'));
    } catch (requestError) {
      setError(localizeAiError(requestError, isAr));
    } finally {
      setBusy(false);
    }
  };

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(answer?.content || '');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (!hasContent) return null;

  return (
    <div className="not-prose space-y-3" data-ai-tools>
      <div className="flex flex-wrap items-center gap-2">
        {MODES.map((item) => {
          const Icon = item.icon;
          const active = mode === item.key;
          return (
            <button
              key={item.key}
              type="button"
              disabled={busy && mode === item.key}
              onClick={() => openMode(item.key)}
              className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-extrabold transition-all ${
                active
                  ? 'border-transparent bg-[linear-gradient(135deg,#642D3D,#4F2230)] text-white shadow-[0_10px_26px_-12px_rgba(100,45,61,0.55)] dark:bg-[linear-gradient(135deg,#B58B83,#EFDADB)] dark:text-[#4F2230]'
                  : 'border-line bg-card text-ink-muted hover:border-primary/40 hover:text-primary dark:hover:border-[#B58B83]/40 dark:hover:text-[#B58B83]'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${busy && mode === item.key ? 'animate-pulse' : ''}`} />
              <span>{item.label[lang]}</span>
            </button>
          );
        })}
      </div>

      {mode === 'quiz' ? null : (
        <AiModal
          open={Boolean(mode)}
          onClose={() => setMode(null)}
          title={mode === 'explain' ? (isAr ? 'شرح الدرس بالذكاء الاصطناعي' : 'AI lesson explanation') : isAr ? 'ملخص الدرس الذكي' : 'AI study summary'}
          subtitle={isAr ? 'إجابة مبنية على محتوى هذا الدرس - مولدة بواسطة Grok' : 'Grounded in this lesson content - powered by Grok'}
          icon={<Sparkles className="h-4 w-4" />}
        >
          <div className="space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="flex flex-wrap items-center gap-1.5">
              <Languages className="h-3.5 w-3.5 text-ink-muted" />
              {['ar', 'en'].map((code) => (
                <button
                  key={code}
                  type="button"
                  disabled={busy}
                  onClick={() => requestLanguage(code)}
                  className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                    answer?.language === code
                      ? 'bg-primary text-on-primary'
                      : 'border border-line bg-card text-ink-muted hover:border-primary/40'
                  }`}
                >
                  {code === 'ar' ? 'العربية' : 'English'}
                </button>
              ))}
            </div>

            {busy && !answer && <ThinkingIndicator isAr={isAr} />}

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-xs font-bold text-danger">
                <XCircle className="h-4 w-4 shrink-0" />
                <span className="flex-1">{error}</span>
                <button
                  type="button"
                  onClick={() => requestLanguage(answer?.language || lang)}
                  className="flex items-center gap-1 rounded-lg border border-danger/30 px-2 py-1 text-[10px] font-extrabold hover:bg-danger/10"
                >
                  <RefreshCw className="h-3 w-3" />
                  {isAr ? 'إعادة' : 'Retry'}
                </button>
              </div>
            )}

            {answer && (
              <article className="rounded-2xl border border-line bg-surface-muted/50 p-4 dark:bg-white/[0.03]">
                <AiMarkdown content={answer.content} />
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                    Powered by {answer.model ? `Grok · ${answer.model}` : 'Grok'}
                  </span>
                  <button
                    type="button"
                    onClick={copyAnswer}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 py-1.5 text-[10px] font-extrabold text-ink-muted transition-colors hover:text-ink"
                  >
                    {copied ? <Check className="h-3 w-3 text-success-ink" /> : <Copy className="h-3 w-3" />}
                    {copied ? (isAr ? 'تم النسخ' : 'Copied') : isAr ? 'نسخ' : 'Copy'}
                  </button>
                </div>
              </article>
            )}
          </div>
        </AiModal>
      )}

      {mode === 'quiz' && (
        <AiModal
          open
          onClose={() => setMode(null)}
          wide
          title={quizStage === 'config' ? (isAr ? 'إنشاء اختبار ذكي' : 'Generate an AI quiz') : isAr ? 'اختبارك الذكي' : 'Your AI quiz'}
          subtitle={quizStage === 'config' ? (isAr ? 'اختر الصعوبة وعدد الأسئلة' : 'Choose difficulty and length') : isAr ? 'مولد من محتوى الدرس' : 'Generated from the lesson content'}
          icon={<ClipboardCheck className="h-4 w-4" />}
        >
          {quizStage === 'config' ? (
            <div className="space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
              <ChipRow
                title={isAr ? 'مستوى الصعوبة' : 'Difficulty'}
                items={QUIZ_LEVELS}
                value={difficulty}
                langOf={(item) => item.label[lang]}
                onSelect={setDifficulty}
              />
              <ChipRow
                title={isAr ? 'عدد الأسئلة' : 'Number of questions'}
                items={QUIZ_COUNTS.map((value) => ({ key: String(value), label: { ar: `${value} أسئلة`, en: `${value} questions` } }))}
                value={String(count)}
                langOf={(item) => item.label[lang]}
                onSelect={(key) => setCount(Number(key))}
              />
              {busy && <ThinkingIndicator isAr={isAr} />}
              {error && (
                <RetryHint
                  isAr={isAr}
                  error={error}
                  onRetry={() => {
                    setError(null);
                    generateQuiz();
                  }}
                />
              )}
              <button type="button" disabled={busy} onClick={generateQuiz} className="btn-primary w-full justify-center gap-2 py-3 text-xs">
                <Sparkles className="h-4 w-4" />
                <span>{busy ? (isAr ? 'قيد الإنشاء...' : 'Generating...') : isAr ? 'أنشئ الاختبار' : 'Generate quiz'}</span>
              </button>
            </div>
          ) : quiz ? (
            <AiQuizRunner quiz={quiz} onDone={() => setMode(null)} />
          ) : null}
        </AiModal>
      )}
    </div>
  );
}

function ChipRow({ title, items, value, langOf, onSelect }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={`rounded-full border px-3.5 py-1.5 text-[11px] font-bold transition-colors ${
                value === item.key
                  ? 'border-transparent bg-primary text-on-primary dark:bg-[#CBAEB1] dark:text-[#4F2230]'
                  : 'border-line bg-card text-ink-muted hover:border-primary/40'
              }`}
            >
              {langOf(item)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ThinkingIndicator({ isAr }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-muted/50 px-4 py-3">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span className="text-xs font-bold text-ink-muted">
        {isAr ? 'الذكاء الاصطناعي يفكر...' : 'AI is thinking...'}
      </span>
      <span className="flex gap-1">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
            style={{ animationDelay: `${dot * 140}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

export { RetryHint };
