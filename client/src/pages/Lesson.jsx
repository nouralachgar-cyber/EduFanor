import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import Toast from '../components/Toast';
import { useCatalog } from '../context/CatalogContext';
import { markCourseCompleted, isCourseCompleted, recordActivity, recordCourseStart } from '../lib/progress';

export default function Lesson() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('id') || 'cpr';
  const [currentStep, setCurrentStep] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [completed, setCompleted] = useState(() => isCourseCompleted(courseId));
  const isAr = i18n.language === 'ar';

  const { courses } = useCatalog();
  const courseList = Array.isArray(courses) ? courses : [];
  const course = courseList.find((item) => item.id === courseId) || courseList[0];

  const steps = course?.steps || [];
  const activeStep = steps[currentStep] || steps[0];
  const progress = steps.length > 0 ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;

  useEffect(() => {
    if (courseId) {
      recordActivity();
      recordCourseStart(courseId);
    }
  }, [courseId]);

  if (!course) return null;

  const handleFinishCourse = () => {
    markCourseCompleted(courseId);
    setCompleted(true);
    setToastMsg(t('lessonPage.completedToast'));
  };

  return (
    <div className="page-container">
      <div className="page-content mx-auto max-w-5xl space-y-6">
        {toastMsg && <Toast message={toastMsg} type="success" onClose={() => setToastMsg('')} />}

        <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-ink transition-colors hover:text-accent"
          >
            {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{t('lessonPage.backToCourses')}</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-brand-soft text-brand-ink">
              <BookOpen className="h-3 w-3" />
              {course.level}
            </span>
            {completed && (
              <span className="chip bg-success-soft text-success-ink">
                <CheckCircle2 className="h-3 w-3" />
                {t('coursesPage.completed')}
              </span>
            )}
          </div>
        </div>

        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <span className="chip bg-surface-muted text-ink-muted">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {isAr ? 'درس تفاعلي' : 'Interactive lesson'}
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{course.description}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <span className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-[11px] font-bold text-ink-muted">
              <Clock className="h-3.5 w-3.5 text-accent" />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-[11px] font-bold text-ink-muted">
              <Layers className="h-3.5 w-3.5 text-accent" />
              {steps.length} {isAr ? 'خطوات' : 'steps'}
            </span>
          </div>
        </header>

        {steps.length > 0 && (
          <div className="card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-muted">
                {t('lessonPage.stepTitle')} {currentStep + 1} / {steps.length}
              </span>
              <span className="text-xs font-extrabold text-brand-ink">{progress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-sage transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex gap-1.5 pt-1">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-primary' : 'bg-line hover:bg-line-strong'
                  }`}
                  aria-label={`${t('lessonPage.stepTitle')} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-12">
          <article className="card p-6 sm:p-8 lg:col-span-8">
            {activeStep && (
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="icon-box h-12 w-12 shrink-0 bg-primary text-white">
                    <span className="text-lg font-extrabold">{currentStep + 1}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-muted">
                      {t('lessonPage.stepTitle')} {currentStep + 1}
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold leading-snug text-ink sm:text-2xl">
                      {activeStep.title}
                    </h2>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-ink-muted sm:text-base">{activeStep.content}</p>

                {activeStep.warning && (
                  <div className="flex items-start gap-3 rounded-xl border border-danger/25 bg-danger-soft p-4">
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-danger">{t('lessonPage.safetyWarning')}</h4>
                      <p className="text-xs leading-relaxed text-danger/90">{activeStep.warning}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </article>

          <aside className="card flex flex-col gap-4 p-6 lg:col-span-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
              {isAr ? 'خطوات هذا المساق' : 'Course steps'}
            </p>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-start text-xs font-bold transition-colors ${
                      index === currentStep
                        ? 'bg-brand-soft text-brand-ink'
                        : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] ${
                        index === currentStep ? 'bg-primary text-white' : 'bg-surface-muted'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{step.title}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="mt-auto rounded-xl border border-line bg-surface-muted p-3.5">
              <p className="text-[10px] leading-relaxed text-ink-muted">{t('footer.disclaimer')}</p>
            </div>
          </aside>
        </div>

        <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((previous) => previous - 1)}
            className="btn-secondary px-5"
          >
            {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{t('lessonPage.prevStep')}</span>
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((previous) => previous + 1)}
              className="btn-primary px-5"
            >
              <span>{t('lessonPage.nextStep')}</span>
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          ) : (
            <Link to="/dashboard" onClick={handleFinishCourse} className="btn-primary px-5">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t('lessonPage.startQuiz')}</span>
            </Link>
          )}
        </div>

        <p className="text-center text-[10px] leading-relaxed text-ink-muted">
          {t('lessonPage.finishHint')}
        </p>
      </div>
    </div>
  );
}
