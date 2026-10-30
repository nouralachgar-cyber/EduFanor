import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import Toast from '../components/Toast';

export default function AITutor() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [toastMsg, setToastMsg] = useState('');

  const features = [
    { icon: MessageCircle, title: t('aiTutorPage.f1Title'), desc: t('aiTutorPage.f1Desc') },
    { icon: Brain, title: t('aiTutorPage.f2Title'), desc: t('aiTutorPage.f2Desc') },
    { icon: Target, title: t('aiTutorPage.f3Title'), desc: t('aiTutorPage.f3Desc') },
  ];

  const sampleQuestions = [t('aiTutorPage.q1'), t('aiTutorPage.q2'), t('aiTutorPage.q3')];

  return (
    <div className="page-container">
      <div className="page-content mx-auto max-w-4xl space-y-8">
        {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />}

        <header className="relative overflow-hidden rounded-3xl border border-line bg-card p-6 shadow-pop sm:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(circle at 88% 10%, rgba(245,158,66,0.14), transparent 46%), radial-gradient(circle at 4% 100%, rgba(120,155,131,0.18), transparent 52%)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip bg-brand-soft text-brand-ink">
                <Sparkles className="h-3.5 w-3.5" />
                {t('aiTutorPage.badge')}
              </span>
              <span className="chip bg-amber/15 text-accent">
                <Clock className="h-3 w-3" />
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

        <section className="card space-y-6 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-muted">
            <BookOpen className="h-4 w-4 text-accent" />
            <span>{t('aiTutorPage.previewLabel')}</span>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
              <Bot className="h-4 w-4 text-amber-soft" />
            </span>
            <div className="max-w-[85%] rounded-2xl rounded-ts-sm border border-line bg-surface-muted px-4 py-3">
              <p className="text-xs leading-relaxed text-ink">{t('aiTutorPage.botGreeting')}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="text-xs font-bold text-ink-muted">{t('aiTutorPage.sampleQuestionsTitle')}</p>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => setToastMsg(t('aiTutorPage.comingSoonToast'))}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-start text-[11px] font-bold text-ink transition-colors hover:border-line-strong hover:bg-surface-muted"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              disabled
              placeholder={t('aiTutorPage.inputPlaceholder')}
              className="input opacity-60"
              aria-label={t('aiTutorPage.inputPlaceholder')}
            />
            <button
              type="button"
              onClick={() => setToastMsg(t('aiTutorPage.comingSoonToast'))}
              className="btn-primary shrink-0 px-4 opacity-70"
              aria-label={t('aiTutorPage.sendBtn')}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-center font-display text-xl font-semibold text-ink">
            {t('aiTutorPage.featuresTitle')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card p-5">
                  <span className="icon-box h-10 w-10 bg-brand-soft text-brand-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-sm font-extrabold text-ink">{feature.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card space-y-4 p-6">
          <div className="flex items-center gap-3">
            <span className="icon-box h-10 w-10 bg-amber/15 text-accent">
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
