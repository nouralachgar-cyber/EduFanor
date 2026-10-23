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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#49305D] text-white shadow-lg">
            <Bot className="h-8 w-8 text-[#8A6BBE]" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E9E0F5] text-[#49305D] dark:bg-[#2B2037] dark:text-[#E9E0F5]">
                <Sparkles className="h-3 w-3 text-[#8A6BBE]" />
                {t('aiTutorPage.badge')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                {t('aiTutorPage.statusChip')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#49305D] dark:text-white tracking-tight">
              {t('aiTutorPage.title')}
            </h1>
            <p className="text-[#6B5E7C] dark:text-[#C9BED5] text-sm leading-relaxed max-w-lg mx-auto">
              {t('aiTutorPage.subtitle')}
            </p>
          </div>
        </div>

        {/* Preview Card */}
        <div className="rounded-3xl bg-white dark:bg-[#21192B] border border-[#EDE6F5] dark:border-[#3B2B4C] p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6B5E7C] dark:text-[#C9BED5]">
            <BookOpen className="h-4 w-4" />
            <span>{t('aiTutorPage.previewLabel')}</span>
          </div>

          {/* Chat Preview */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center rounded-xl h-9 w-9 bg-[#49305D] text-white shrink-0">
                <Bot className="h-4 w-4 text-[#8A6BBE]" />
              </div>
              <div className="rounded-2xl rounded-ts-sm bg-[#F4EFFB] dark:bg-[#2B2037] border border-[#EDE6F5] dark:border-[#3B2B4C] px-4 py-3 max-w-[85%]">
                <p className="text-xs text-[#1F142E] dark:text-[#F8F4FC] leading-relaxed">
                  {t('aiTutorPage.botGreeting')}
                </p>
              </div>
            </div>
          </div>

          {/* Sample Questions */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#6B5E7C] dark:text-[#C9BED5]">
              {t('aiTutorPage.sampleQuestionsTitle')}
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={handleAsk}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold bg-[#F4EFFB] dark:bg-[#2B2037] border border-[#EDE6F5] dark:border-[#3B2B4C] text-[#49305D] dark:text-[#F8F4FC] hover:border-[#8A6BBE] transition-all text-start cursor-pointer"
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
              className="w-full rounded-xl border border-[#EDE6F5] dark:border-[#3B2B4C] bg-white dark:bg-[#17121D] px-4 py-3 text-sm font-semibold text-[#1F142E] dark:text-[#F8F4FC] opacity-60 outline-none"
            />
            <button
              onClick={handleAsk}
              className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold bg-[#49305D] text-white px-4 py-3 shrink-0 opacity-60 cursor-not-allowed"
              disabled
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-center text-lg font-extrabold text-[#49305D] dark:text-white">
            {t('aiTutorPage.featuresTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="rounded-3xl bg-white dark:bg-[#21192B] border border-[#EDE6F5] dark:border-[#3B2B4C] p-5 space-y-3 text-center shadow-sm">
                  <div className="mx-auto flex items-center justify-center rounded-xl h-11 w-11 bg-[#E9E0F5] dark:bg-[#2B2037] text-[#49305D] dark:text-[#E9E0F5]">
                    <Icon className="h-5 w-5 text-[#8A6BBE]" />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#49305D] dark:text-white">{feature.title}</h3>
                  <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5] leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Guide Link */}
        <div className="max-w-2xl mx-auto rounded-3xl bg-white dark:bg-[#21192B] border border-[#EDE6F5] dark:border-[#3B2B4C] p-6 space-y-4 text-center shadow-sm">
          <div className="mx-auto flex items-center justify-center rounded-xl h-11 w-11 bg-[#8A6BBE]/20 text-[#49305D] dark:text-white">
            <Zap className="h-5 w-5 text-[#8A6BBE]" />
          </div>
          <h3 className="text-base font-extrabold text-[#49305D] dark:text-white">{t('aiTutorPage.guideTitle')}</h3>
          <p className="text-xs text-[#6B5E7C] dark:text-[#C9BED5]">{t('aiTutorPage.guideSubtitle')}</p>
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs text-start">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{t('aiTutorPage.disclaimer')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}