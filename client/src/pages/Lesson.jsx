import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2, BookOpen } from 'lucide-react';
import Toast from '../components/Toast';

export default function Lesson() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('id') || 'cpr';
  const [currentStep, setCurrentStep] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const isAr = i18n.language === 'ar';

  const courses = t('coursesData', { returnObjects: true }) || [];
  const course = courses.find(c => c.id === courseId) || courses[0];

  if (!course) return null;

  const steps = course.steps || [];
  const activeStep = steps[currentStep] || steps[0];
  const progress = steps.length > 0 ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;

  const handleFinishCourse = () => {
    localStorage.setItem(`completed_${courseId}`, 'true');
    setToastMsg(t('lessonPage.completedToast'));
  };

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover transition-colors">
            {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{t('lessonPage.backToCourses')}</span>
          </Link>
          <span className="chip bg-brand-soft text-brand-ink">
            <BookOpen className="h-3 w-3" />
            {course.title}
          </span>
        </div>

        {/* Progress */}
        {steps.length > 0 && (
          <div className="card p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-ink-muted">
                {t('lessonPage.stepTitle')} {currentStep + 1} / {steps.length}
              </span>
              <span className="text-xs font-extrabold text-primary">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Step indicators */}
            <div className="flex gap-1.5 pt-1">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    idx <= currentStep ? 'bg-primary' : 'bg-line hover:bg-line-strong'
                  }`}
                  aria-label={`Step ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step Content */}
        {activeStep && (
          <div className="card p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-4">
              <div className="icon-box h-12 w-12 bg-primary text-white shrink-0">
                <span className="text-lg font-extrabold">{currentStep + 1}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-ink">
                {activeStep.title}
              </h2>
            </div>

            <p className="text-ink-muted leading-relaxed text-sm sm:text-base">
              {activeStep.content}
            </p>

            {activeStep.warning && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-red-600 dark:text-red-400">
                    {t('lessonPage.safetyWarning')}
                  </h4>
                  <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
                    {activeStep.warning}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="btn-secondary px-5 py-3 text-sm"
          >
            {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{t('lessonPage.prevStep')}</span>
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="btn-primary px-5 py-3 text-sm"
            >
              <span>{t('lessonPage.nextStep')}</span>
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          ) : (
            <Link
              to="/dashboard"
              onClick={handleFinishCourse}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{t('lessonPage.startQuiz')}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
