import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  Brain,
  Target,
  Zap,
  ShieldAlert,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Trash2,
  HeartPulse,
  Droplets,
  Wind,
  Flame,
  UserRound,
  Stethoscope,
  Compass,
  GraduationCap,
  CalendarDays,
  Lightbulb,
  BookCheck,
  CheckCircle2,
  XCircle,
  Award,
} from '../components/icons';
import Toast from '../components/Toast';
import AiMarkdown from '../components/ai/AiMarkdown';
import { aiApi, localizeAiError } from '../lib/ai';

const CHAT_KEY = 'edu_ai_chat_v1';
const PLAN_KEY = 'edu_ai_plan_v1';
const GREETING_ID = 'edu-greeting';

const TOPICS = [
  { key: 'surprise', icon: Compass },
  { key: 'choking', icon: Wind },
  { key: 'burn', icon: Flame },
  { key: 'unconscious', icon: UserRound },
  { key: 'cardiac', icon: HeartPulse },
  { key: 'bleeding', icon: Droplets },
  { key: 'injury', icon: Stethoscope },
];

const LEVELS = ['easy', 'medium', 'hard'];

function loadChatHistory() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CHAT_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored
      .filter((item) => item && (item.role === 'user' || item.role === 'assistant') && item.content)
      .slice(-30)
      .map((item) => ({ id: item.id || `m${Math.random().toString(36).slice(2)}`, role: item.role, content: item.content, error: Boolean(item.error) }));
  } catch {
    return [];
  }
}

function storeChatHistory(messages) {
  try {
    window.localStorage.setItem(
      CHAT_KEY,
      JSON.stringify(messages.slice(-30).map(({ id, role, content, error }) => ({ id, role, content, error: Boolean(error) })))
    );
  } catch {
    /* Storage can be unavailable. */
  }
}

export default function AITutor() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const lang = isAr ? 'ar' : 'en';
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = ['chat', 'scenarios', 'plan'].includes(searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'chat';

  const [tab, setTab] = useState(initialTab);
  const [toastMsg, setToastMsg] = useState('');

  const switchTab = (next) => {
    setTab(next);
    setSearchParams(next === 'chat' ? {} : { tab: next }, { replace: true });
  };

  return (
    <div className="page-container">
      <div className="page-content mx-auto max-w-4xl space-y-6">
        {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />}

        <header className="relative overflow-hidden rounded-3xl border border-line bg-card p-6 shadow-pop sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(circle at 88% 10%, rgba(181, 139, 131, 0.32), transparent 46%), radial-gradient(circle at 4% 100%, rgba(203, 174, 177, 0.5), transparent 52%)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip bg-brand-soft text-brand-ink">
                <Sparkles className="h-3.5 w-3.5" />
                {t('aiTutorPage.badge')}
              </span>
              <span className="chip bg-pink-soft text-[#3E588F] dark:text-[#C0C5CD]">
                <Zap className="h-3 w-3" />
                {t('aiTutorPage.statusChip')}
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              {t('aiTutorPage.title')}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
              {t('aiTutorPage.subtitle')}
            </p>
          </div>
        </header>

        <nav className="flex gap-1.5 rounded-2xl border border-line bg-card p-1.5 shadow-sm" aria-label={t('ai.tabsLabel')}>
          {[
            { key: 'chat', label: t('ai.tab.chat'), icon: MessageCircle },
            { key: 'scenarios', label: t('ai.tab.scenarios'), icon: Target },
            { key: 'plan', label: t('ai.tab.plan'), icon: Brain },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => switchTab(item.key)}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-extrabold transition-all sm:text-xs ${
                  active
                    ? 'bg-[linear-gradient(135deg,#3E588F,#203562)] text-white shadow-[0_10px_26px_-12px_rgba(100,45,61,0.55)] dark:bg-[linear-gradient(135deg,#C0C5CD,#E3E8F8)] dark:text-[#203562]'
                    : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {tab === 'chat' && <ChatPanel isAr={isAr} lang={lang} t={t} />}
        {tab === 'scenarios' && <ScenarioPanel isAr={isAr} lang={lang} t={t} />}
        {tab === 'plan' && <PlanPanel isAr={isAr} lang={lang} t={t} />}

        <section className="card space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="icon-box h-10 w-10 bg-pink-soft text-[#3E588F] dark:text-[#C0C5CD]">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-ink">{t('aiTutorPage.guideTitle')}</h2>
              <p className="text-[11px] text-ink-muted">{t('aiTutorPage.guideSubtitle')}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-danger-soft p-3.5 text-xs text-danger">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="leading-relaxed">{t('aiTutorPage.disclaimer')}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/courses" className="btn-primary px-5 text-xs">
              {isAr ? 'استعرض المساقات' : 'Browse courses'}
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
            <Link to="/quizzes" className="btn-secondary px-5 text-xs">
              {isAr ? 'اختبر معلوماتك' : 'Take a quiz'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ============================== CHAT ============================== */

function ChatPanel({ isAr, lang, t }) {
  const suggestions = useMemo(
    () => [t('aiTutorPage.q1'), t('aiTutorPage.q2'), t('aiTutorPage.q3'), t('ai.suggest.q1'), t('ai.suggest.q2')],
    [t]
  );
  const [messages, setMessages] = useState(loadChatHistory);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && messages.length) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!messages.length && busy !== true) {
      const greeting = {
        id: GREETING_ID,
        role: 'assistant',
        content: t('ai.chat.welcome'),
        local: true,
      };
      setMessages([greeting]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const send = useCallback(
    async (text) => {
      const message = String(text || '').trim();
      if (!message || busy) return;
      setBusy(true);
      setDraft('');

      const userMessage = { id: `u${Date.now()}`, role: 'user', content: message };
      setMessages((previous) => {
        const next = [...previous, userMessage, { id: `p${Date.now()}`, role: 'pending' }];
        storeChatHistory(next.filter((item) => item.role === 'user' || item.role === 'assistant'));
        return next;
      });

      const history = [...(messages || []), userMessage]
        .filter((item) => (item.role === 'user' || item.role === 'assistant') && !item.error && !item.local)
        .slice(-8)
        .map((item) => ({ role: item.role, content: item.content }));

      try {
        const data = await aiApi.chat({ message, history, language: lang });
        setMessages((previous) => {
          const next = previous
            .filter((item) => item.role !== 'pending')
            .concat([{ id: `a${Date.now()}`, role: 'assistant', content: data.reply }]);
          storeChatHistory(next.filter((item) => item.local !== true));
          return next;
        });
      } catch (error) {
        setMessages((previous) => {
          const next = previous
            .filter((item) => item.role !== 'pending')
            .concat([{ id: `e${Date.now()}`, role: 'assistant', content: localizeAiError(error, isAr), error: true }]);
          storeChatHistory(next.filter((item) => item.local !== true));
          return next;
        });
      } finally {
        setBusy(false);
        window.setTimeout(() => inputRef.current?.focus(), 60);
      }
    },
    [busy, messages, lang, isAr]
  );

  const retry = (index) => {
    const target = messages
      .slice(0, index)
      .reverse()
      .find((item) => item.role === 'user');
    if (!target) return;
    setMessages((previous) => {
      const next = previous.filter((item, position) => !(position === index && item.error));
      storeChatHistory(next.filter((item) => item.local !== true));
      return next;
    });
    window.setTimeout(() => send(target.content), 50);
  };

  const copyMessage = async (message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      setCopiedId(null);
    }
  };

  const clearChat = () => {
    window.localStorage.removeItem(CHAT_KEY);
    setMessages([{ id: GREETING_ID, role: 'assistant', content: t('ai.chat.welcome'), local: true }]);
    setToastMsg(isAr ? 'تم مسح المحادثة' : 'Conversation cleared');
  };

  return (
    <section className="card flex flex-col overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
        <span className="inline-flex items-center gap-2 text-[11px] font-extrabold text-ink-muted">
          <Bot className="h-4 w-4 text-primary dark:text-[#C0C5CD]" />
          {t('ai.chat.panelTitle')}
        </span>
        <button
          type="button"
          onClick={clearChat}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[10px] font-extrabold text-ink-muted transition-colors hover:border-danger/40 hover:text-danger disabled:opacity-50"
        >
          <Trash2 className="h-3 w-3" />
          {t('ai.chat.clear')}
        </button>
      </div>

      <div ref={scrollRef} className="max-h-[62vh] min-h-[320px] flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
        {messages.map((message, index) => {
          if (message.role === 'pending') return <PendingBubble key={message.id} isAr={isAr} />;
          const isUser = message.role === 'user';
          return (
            <div key={message.id} className={`group flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[88%] items-start gap-2.5 sm:max-w-[76%] ${isUser ? 'flex-row-reverse' : ''}`}>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                    isUser
                      ? 'bg-ink/[0.07] text-ink-muted'
                      : 'bg-[linear-gradient(135deg,#3E588F,#203562)] text-white dark:bg-[linear-gradient(135deg,#C0C5CD,#E3E8F8)] dark:text-[#203562]'
                  }`}
                >
                  {isUser ? <UserRound className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </span>
                <div className={`min-w-0 space-y-1.5 ${isUser ? 'items-end' : ''}`}>
                  <div
                    className={`rounded-2xl border px-4 py-3 ${
                      isUser
                        ? 'rounded-ss-sm border-transparent bg-primary text-white shadow-[0_10px_26px_-14px_rgba(100,45,61,0.5)] dark:bg-[#C0C5CD] dark:text-[#203562]'
                        : message.error
                        ? 'border-danger/30 bg-danger-soft'
                        : 'rounded-ss-sm border-line bg-surface-muted'
                    }`}
                  >
                    <AiMarkdown content={message.content} className="text-[13px]" />
                  </div>
                  {!isUser && (
                    <div className="flex items-center gap-1.5 opacity-60 transition-opacity group-hover:opacity-100">
                      {message.error ? (
                        <button
                          type="button"
                          onClick={() => retry(index)}
                          className="inline-flex items-center gap-1 rounded-lg border border-line bg-card px-2 py-1 text-[10px] font-extrabold text-ink-muted transition-colors hover:text-danger"
                        >
                          <RefreshCw className="h-3 w-3" />
                          {t('ai.chat.retry')}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => copyMessage(message)}
                          className="inline-flex items-center gap-1 rounded-lg border border-line bg-card px-2 py-1 text-[10px] font-extrabold text-ink-muted transition-colors hover:text-ink"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3 w-3 text-success-ink" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {copiedId === message.id ? t('ai.chat.copied') : t('ai.chat.copy')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 border-t border-line px-4 pb-4 pt-3 sm:px-6">
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={busy}
              onClick={() => send(suggestion)}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-bold text-ink-muted transition-colors hover:border-primary/45 hover:text-ink disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
          className="flex items-end gap-2"
        >
          <textarea
            ref={inputRef}
            value={draft}
            rows={1}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                send(draft);
              }
            }}
            placeholder={t('ai.chat.placeholder')}
            className="input max-h-32 min-h-[46px] flex-1 resize-none"
            aria-label={t('ai.chat.placeholder')}
          />
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            className="btn-primary h-[46px] shrink-0 px-4 disabled:opacity-50"
            aria-label={t('ai.chat.send')}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
        <p className="text-center text-[10px] text-ink-muted">{t('ai.chat.hint')}</p>
      </div>
    </section>
  );
}

function PendingBubble({ isAr }) {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3E588F,#203562)] text-white shadow-sm dark:bg-[linear-gradient(135deg,#C0C5CD,#E3E8F8)] dark:text-[#203562]">
          <Bot className="h-4 w-4" />
        </span>
        <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface-muted px-4 py-3">
          <span className="flex gap-1">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/70"
                style={{ animationDelay: `${dot * 140}ms` }}
              />
            ))}
          </span>
          <span className="text-[11px] font-bold text-ink-muted">{isAr ? 'يكتب...' : 'typing...'}</span>
        </div>
      </div>
    </div>
  );
}

/* ============================ SCENARIOS ============================ */

function ScenarioPanel({ isAr, lang, t }) {
  const [topic, setTopic] = useState('surprise');
  const [difficulty, setDifficulty] = useState('medium');
  const [busy, setBusy] = useState(false);
  const [scenario, setScenario] = useState(null);
  const [chosen, setChosen] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    setBusy(true);
    setError(null);
    setScenario(null);
    setFeedback(null);
    setChosen(null);
    try {
      const data = await aiApi.scenario({ topic: topic, difficulty, language: lang });
      setScenario(data.scenario);
    } catch (requestError) {
      setError(localizeAiError(requestError, isAr));
    } finally {
      setBusy(false);
    }
  };

  const answer = async (optionIndex) => {
    if (!scenario || chosen !== null) return;
    setChosen(optionIndex);
    try {
      const data = await aiApi.evaluateScenario({
        scenarioId: scenario.id,
        optionIndex,
        language: lang,
      });
      setFeedback(data);
    } catch (requestError) {
      setError(localizeAiError(requestError, isAr));
      setChosen(null);
    }
  };

  return (
    <section className="space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="card space-y-4 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="icon-box h-10 w-10 bg-brand-soft text-brand-ink">
            <Target className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-ink">{t('ai.scenario.title')}</h2>
            <p className="text-[11px] text-ink-muted">{t('ai.scenario.subtitle')}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">
            {t('ai.scenario.topicLabel')}
          </p>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((item) => {
              const Icon = item.icon;
              const active = topic === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTopic(item.key)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-bold transition-colors ${
                    active
                      ? 'border-transparent bg-primary text-on-primary dark:bg-[#C0C5CD] dark:text-[#203562]'
                      : 'border-line bg-card text-ink-muted hover:border-primary/40'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t(`ai.scenario.topics.${item.key}`)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-ink-muted">
            {t('ai.difficultyLabel')}
          </p>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`rounded-xl border px-3 py-2 text-[11px] font-bold transition-colors ${
                  difficulty === level
                    ? 'border-transparent bg-primary text-on-primary dark:bg-[#C0C5CD] dark:text-[#203562]'
                    : 'border-line bg-card text-ink-muted hover:border-primary/40'
                }`}
              >
                {t(`ai.difficulty.${level}`)}
              </button>
            ))}
          </div>
        </div>

        {busy && <Thinking isAr={isAr} label={t('ai.scenario.building')} />}

        <button
          type="button"
          onClick={generate}
          disabled={busy}
          className="btn-primary w-full justify-center gap-2 py-3 text-xs disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span>{scenario ? t('ai.scenario.reGenerate') : t('ai.scenario.generate')}</span>
        </button>

        <p className="flex items-start gap-2 rounded-xl bg-amber-soft px-3.5 py-2.5 text-[11px] leading-relaxed text-amber">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t('ai.scenario.disclaimer')}
        </p>
      </div>

      {scenario && (
        <article className="card space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold text-ink">{scenario.title}</h3>
            <span className="chip bg-surface-muted text-ink-muted">
              {t(`ai.difficulty.${scenario.difficulty || difficulty}`)}
            </span>
          </div>
          <div className="rounded-2xl border border-line bg-surface-muted/50 p-4">
            <AiMarkdown content={scenario.narrative} />
          </div>
          <p className="text-sm font-extrabold text-ink">{scenario.question}</p>

          <div className="space-y-2">
            {scenario.options.map((option, index) => {
              const isSelected = chosen === index;
              const revealed = Boolean(feedback);
              const isBest = feedback ? option.label === feedback.correctOptionLabel : false;
              const tone = revealed && isSelected
                ? feedback.correct
                  ? 'border-success/40 bg-success-soft'
                  : 'border-danger/30 bg-danger-soft'
                : revealed && isBest
                ? 'border-success/40 bg-success-soft/70'
                : isSelected
                ? 'border-primary bg-primary/10'
                : 'border-line bg-card hover:border-primary/40';
              return (
                <button
                  key={index}
                  type="button"
                  disabled={chosen !== null}
                  onClick={() => answer(index)}
                  className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-start text-xs font-bold transition-all ${tone}`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-extrabold opacity-70">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option.label}</span>
                  {revealed && isSelected && (
                    feedback.correct ? <CheckCircle2 className="h-4 w-4 text-success-ink" /> : <XCircle className="h-4 w-4 text-danger" />
                  )}
                  {revealed && !isSelected && isBest && <Award className="h-4 w-4 text-success-ink" />}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`space-y-3 rounded-2xl border p-4 ${
                feedback.correct ? 'border-success/40 bg-success-soft/70' : 'border-danger/30 bg-danger-soft/70'
              }`}
            >
              <p className="flex items-center gap-2 text-xs font-extrabold text-ink">
                {feedback.correct ? (
                  <CheckCircle2 className="h-4 w-4 text-success-ink" />
                ) : (
                  <XCircle className="h-4 w-4 text-danger" />
                )}
                {feedback.correct ? t('ai.scenario.correctTitle') : t('ai.scenario.wrongTitle')}
              </p>
              <AiMarkdown content={feedback.feedback} />
              {feedback.suggestedLessonTitle && (
                <p className="inline-flex items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 text-[11px] font-bold text-ink-muted">
                  <Lightbulb className="h-3 w-3 text-amber" />
                  {t('ai.scenario.reviewLesson')}: {feedback.suggestedLessonTitle}
                </p>
              )}
            </div>
          )}
        </article>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-xs font-bold text-danger">
          <XCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}
    </section>
  );
}

/* =========================== STUDY PLAN =========================== */

function PlanPanel({ isAr, lang, t }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState(null);
  const [cached, setCached] = useState(false);

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      const data = await aiApi.studyPlan({ language: lang });
      if (data) {
        setPlan(data);
        setCached(false);
        try {
          window.localStorage.setItem(PLAN_KEY, JSON.stringify({ ...data, savedAt: Date.now(), language: lang }));
        } catch {
          /* Storage can be unavailable. */
        }
      }
    } catch (requestError) {
      setError(localizeAiError(requestError, isAr));
    } finally {
      setBusy(false);
    }
  };

  const loadCached = () => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(PLAN_KEY) || 'null');
      if (stored && stored.savedAt && Date.now() - stored.savedAt < 12 * 60 * 60 * 1000 && stored.summary) {
        setPlan(stored);
        setCached(true);
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    loadCached();
  }, []);

  const ageText = cached && plan?.savedAt
    ? new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(plan.savedAt))
    : '';

  return (
    <section className="space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="card space-y-4 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="icon-box h-10 w-10 bg-mint-soft text-sage-green">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-ink">{t('ai.plan.title')}</h2>
            <p className="text-[11px] text-ink-muted">{t('ai.plan.subtitle')}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="btn-primary gap-2 px-5 text-xs disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>{t('ai.plan.generate')}</span>
          </button>
          {cached && plan && typeof ageText === 'string' && ageText !== '' && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-ink-muted">
              <Clock className="h-3 w-3" />
              {t('ai.plan.cached', { time: ageText })}
            </span>
          )}
        </div>

        <p className="rounded-xl bg-amber-soft px-3.5 py-2.5 text-[11px] leading-relaxed text-amber">
          {t('ai.plan.privacyNote')}
        </p>
      </div>

      {busy && <Thinking isAr={isAr} label={t('ai.plan.thinking')} />}

      {plan && <PlanResults plan={plan} isAr={isAr} t={t} />}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-2.5 text-xs font-bold text-danger">
          <XCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={generate}
            className="flex items-center gap-1 rounded-lg border border-danger/30 px-2 py-1 text-[10px] font-extrabold hover:bg-danger/10"
          >
            <RefreshCw className="h-3 w-3" />
            {t('ai.common.retry')}
          </button>
        </div>
      )}
    </section>
  );
}

function PlanResults({ plan, isAr, t }) {
  return (
    <div className="space-y-4">
      {plan.summary && (
        <div className="card space-y-2 p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-muted">{t('ai.plan.summaryLabel')}</p>
          <AiMarkdown content={plan.summary} />
          {plan.encouragement && (
            <p className="mt-2 rounded-xl bg-mint-soft px-3.5 py-2.5 text-[11px] font-bold text-sage-green">
              {plan.encouragement}
            </p>
          )}
        </div>
      )}

      {Array.isArray(plan.nextSteps) && plan.nextSteps.length > 0 && (
        <div className="card space-y-3 p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-muted">{t('ai.plan.nextLabel')}</p>
          {plan.nextSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-3 rounded-xl border border-line bg-surface-muted/50 p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-extrabold text-white dark:bg-[#C0C5CD] dark:text-[#203562]">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-ink">{step.lesson}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">{step.why}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(plan.revisionTopics) && plan.revisionTopics.length > 0 && (
        <div className="card space-y-3 p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-muted">{t('ai.plan.revisionLabel')}</p>
          <div className="flex flex-wrap gap-2">
            {plan.revisionTopics.map((topic, index) => (
              <span key={index} className="chip bg-brand-soft text-brand-ink">
                <BookOpen className="h-3 w-3" />
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(plan.sevenDayPlan) && plan.sevenDayPlan.length > 0 && (
        <div className="card space-y-3 p-5">
          <p className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-muted">
            <CalendarDays className="h-3.5 w-3.5" />
            {t('ai.plan.weekLabel')}
          </p>
          {plan.sevenDayPlan.map((session, index) => (
            <div key={index} className="flex items-start gap-3 rounded-xl border border-line bg-surface-muted/50 p-3">
              <span className="chip shrink-0 bg-pink-soft text-[#3E588F] dark:text-[#C0C5CD]">
                {isAr ? 'يوم' : 'Day'} {session.day}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-ink">{session.focus}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">{session.activity}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {Array.isArray(plan.practiceAdvice) && plan.practiceAdvice.length > 0 && (
        <div className="card space-y-2.5 p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-muted">{t('ai.plan.practiceLabel')}</p>
          {plan.practiceAdvice.map((advice, index) => (
            <p key={index} className="flex items-start gap-2 text-xs leading-relaxed text-ink">
              <BookCheck />
              <span>{advice}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function Thinking({ isAr, label }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-muted/50 px-4 py-3">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span className="text-xs font-bold text-ink-muted">{label}</span>
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
