import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Sparkles, Send, BookOpen, Brain, Target, Zap, ShieldAlert, MessageCircle } from 'lucide-react';
import Toast from '../components/Toast';

export default function AITutor() {
  const { t } = useTranslation();
  const [toastMsg, setToastMsg] = useState('');

  const features = [
    { icon: MessageCircle, title: t('aiTutorPage.f1Title'), desc: t('aiTutorPage.f1Desc') },
    { icon: Brain, title: t('aiTutorPage.f2Title'), desc: t('aiTutorPage.f2Desc') },
    { icon: Target, title: t('aiTutorPage.f3Title'), desc: t('aiTutorPage.f3Desc') },
  ];

  const sampleQuestions = [
    t('aiTutorPage.q1'),
    t('aiTutorPage.q2'),
    t('aiTutorPage.q3'),
  ];

  const handleAsk = () => {
    setToastMsg(t('aiTutorPage.comingSoonToast'));
  };

  return (
    <div className="page-container">
      <div className="page-content py-10 space-y-10">
        {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />}

        {/* Hero */}
        <div className="text-center space-y-5 max-w-2xl mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lift">
            <Bot className="h-8 w-8 text-teal" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="chip bg-brand-soft text-brand-ink">
                <Sparkles className="h-3 w-3" />
                {t('aiTutorPage.badge')}
              </span>
              <span className="chip bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                {t('aiTutorPage.statusChip')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight text-balance">
              {t('aiTutorPage.title')}
            </h1>
            <p className="text-ink-muted text-sm leading-relaxed max-w-lg mx-auto">
              {t('aiTutorPage.subtitle')}
            </p>
          </div>
        </div>

        {/* Preview Card */}
        <div className="card max-w-2xl mx-auto p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
            <BookOpen className="h-4 w-4" />
            <span>{t('aiTutorPage.previewLabel')}</span>
          </div>

          {/* Chat Preview */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="icon-box h-9 w-9 bg-primary text-white shrink-0">
                <Bot className="h-4 w-4 text-teal" />
              </div>
              <div className="rounded-2xl rounded-ts-sm bg-surface-muted border border-line px-4 py-3 max-w-[85%]">
                <p className="text-xs text-ink leading-relaxed">
                  {t('aiTutorPage.botGreeting')}
                </p>
              </div>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-ink-muted">
              {t('aiTutorPage.sampleQuestionsTitle')}
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={handleAsk}
                  className="chip bg-surface-muted border border-line text-ink hover:border-primary/40 hover:bg-brand-soft transition-all text-start"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Preview */}
          <div className="flex gap-2">
            <input
              type="text"
              disabled
              placeholder={t('aiTutorPage.inputPlaceholder')}
              className="input flex-1 opacity-60"
            />
            <button
              onClick={handleAsk}
              className="btn-primary px-4 py-3 shrink-0"
              disabled
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-center text-lg font-extrabold text-ink">
            {t('aiTutorPage.featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="card p-5 space-y-3 text-center">
                  <div className="mx-auto icon-box h-11 w-11 bg-brand-soft text-brand-ink">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-ink">{feature.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Guide Link */}
        <div className="max-w-2xl mx-auto card p-6 space-y-4 text-center">
          <div className="mx-auto icon-box h-11 w-11 bg-teal/20 text-teal-deep">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-extrabold text-ink">{t('aiTutorPage.guideTitle')}</h3>
          <p className="text-xs text-ink-muted">{t('aiTutorPage.guideSubtitle')}</p>
          <div className="flex items-start gap-2 p-3 rounded-xl bg-warning-soft text-warning-ink text-xs text-start">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{t('aiTutorPage.disclaimer')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
