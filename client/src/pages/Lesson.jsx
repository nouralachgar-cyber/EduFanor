import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Clock,
  Layers,
  Sparkles,
  Lock,
  PlayCircle
} from '../components/icons';
import Toast from '../components/Toast';
import LessonBlocks from '../components/LessonBlocks';
import AiLessonTools, { stepContentText } from '../components/ai/AiLessonTools';
import { useCatalog } from '../context/CatalogContext';
import {
  completeVerifiedLesson,
  isCourseCompleted,
  markCourseCompleted,
  recordActivity,
  recordCourseStart,
  startVerifiedLesson,
} from '../lib/progress';
import { getStoredToken } from '../lib/api';

export default function Lesson() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get('id') || 'cpr';
  const [currentStep, setCurrentStep] = useState(0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0); // نظام قفل الدروس (Progress Lock)
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [completionPending, setCompletionPending] = useState(false);
  const [assessmentRequired, setAssessmentRequired] = useState('');
  const [completed, setCompleted] = useState(() => isCourseCompleted(courseId));
  
  // حالات الاختبار التابع للدرس (Quiz)
  const [selectedQuizOpt, setSelectedQuizOpt] = useState(null);
  const [quizPassed, setQuizPassed] = useState(false);

  const isAr = i18n.language === 'ar';

  const { courses } = useCatalog();
  const courseList = Array.isArray(courses) ? courses : [];
  const course = courseList.find((item) => item.id === courseId) || courseList[0];

  const steps = course?.steps || [];
  const activeStep = steps[currentStep] || steps[0];
  const progress = steps.length > 0 ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;

  // تحويل رابط يوتيوب العادي إلى رابط Embed مدمج للتفرج وسط الموقع
  const getEmbedYouTubeUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const blocks = useMemo(() => {
    if (!activeStep) return [];
    let result = [];
    
    if (Array.isArray(activeStep.blocks) && activeStep.blocks.length > 0) {
      result = [...activeStep.blocks];
    } else {
      if (activeStep.content) {
        result.push({ type: 'paragraph', content: activeStep.content });
      }
      if (activeStep.warning) {
        result.push({ type: 'warning', content: activeStep.warning });
      }
    }

    // دمج فيديو يوتيوب مباشرة داخل البلوكات إذا كان متوفراً في الخطوة
    if (activeStep.videoUrl) {
      const embedUrl = getEmbedYouTubeUrl(activeStep.videoUrl);
      if (embedUrl) {
        result.push({ type: 'video', data: { url: embedUrl } });
      }
    }

    return result;
  }, [activeStep]);

  useEffect(() => {
    if (courseId) {
      recordActivity();
      recordCourseStart(courseId);
    }
  }, [courseId]);

  // إعادة ضبط حالة الاختبار عند الانتقال لخطوة جديدة
  useEffect(() => {
    setSelectedQuizOpt(null);
    setQuizPassed(false);
  }, [currentStep]);

  useEffect(() => {
    if (!activeStep?.id || !getStoredToken()) return undefined;
    let cancelled = false;
    startVerifiedLesson(activeStep.id).catch((error) => {
      if (cancelled) return;
      setToastType('error');
      setToastMsg(
        error.code === 'PREVIOUS_LESSONS_REQUIRED'
          ? t('achievement.previousLessonRequired')
          : t('achievement.lessonStartError')
      );
    });
    return () => {
      cancelled = true;
    };
  }, [activeStep?.id, t]);

  if (!course) return null;

  const handleQuizAnswer = (optIdx, correctIdx) => {
    setSelectedQuizOpt(optIdx);
    if (optIdx === correctIdx) {
      setQuizPassed(true);
      setToastType('success');
      setToastMsg(isAr ? 'ممتاز! تم اجتياز اختبار الخطوة بنجاح 🚀' : 'Great! Step quiz passed successfully 🚀');
      // فتح الخطوة الموالية تلقائياً
      if (currentStep >= maxUnlockedStep) {
        setMaxUnlockedStep(currentStep + 1);
      }
    } else {
      setToastType('error');
      setToastMsg(isAr ? 'إجابة خاطئة، حاول مرة أخرى.' : 'Incorrect answer, try again.');
    }
  };

  const completeActiveLesson = async () => {
    if (!activeStep?.id || !getStoredToken()) return { localOnly: true };

    setCompletionPending(true);
    setAssessmentRequired('');
    try {
      await startVerifiedLesson(activeStep.id);
      return await completeVerifiedLesson(activeStep.id);
    } catch (error) {
      setToastType('error');
      if (error.code === 'ASSESSMENT_REQUIRED') {
        setAssessmentRequired(error.payload?.quizId || '');
        setToastMsg(t('achievement.assessmentRequired'));
      } else if (error.code === 'PREVIOUS_LESSONS_REQUIRED') {
        setToastMsg(t('achievement.previousLessonRequired'));
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'API_NOT_CONFIGURED') {
        setToastMsg(t('achievement.serverConnectionError'));
      } else {
        setToastMsg(t('achievement.lessonCompleteError'));
      }
      return null;
    } finally {
      setCompletionPending(false);
    }
  };

  const handleAdvance = async () => {
    const result = await completeActiveLesson();
    if (!result) return;
    if (result.achievementCreated) {
      navigate('/dashboard', { state: { celebrateAchievement: true } });
      return;
    }
    const nextIdx = currentStep + 1;
    setMaxUnlockedStep((previous) => Math.max(previous, nextIdx));
    setCurrentStep(nextIdx);
  };

  const handleFinishCourse = async () => {
    const result = await completeActiveLesson();
    if (!result) return;
    markCourseCompleted(courseId);
    setCompleted(true);
    if (result.achievementCreated) {
      navigate('/dashboard', { state: { celebrateAchievement: true } });
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="page-container">
      <div className="page-content space-y-6">
        {toastMsg && (
          <Toast
            message={toastMsg}
            type={toastType}
            onClose={() => setToastMsg('')}
          />
        )}

        <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 sm:flex-row sm:items-center">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition-colors hover:text-primary"
          >
            {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{t('lessonPage.backToCourses')}</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-highlight text-ink-soft">
              <BookOpen className="h-3 w-3" />
              {course.level}
            </span>
            {completed && (
              <span className="chip bg-positive-soft text-positive-ink">
                <CheckCircle2 className="h-3 w-3" />
                {t('coursesPage.completed')}
              </span>
            )}
          </div>
        </div>

        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <span className="chip bg-surface-2 text-ink-soft">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {isAr ? 'درس تفاعلي متقدم' : 'Interactive advanced lesson'}
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{course.description}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <span className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-[11px] font-bold text-ink-soft">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {course.duration}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2 text-[11px] font-bold text-ink-soft">
              <Layers className="h-3.5 w-3.5 text-primary" />
              {steps.length} {isAr ? 'خطوات' : 'steps'}
            </span>
          </div>
        </header>

        {steps.length > 0 && (
          <div className="card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-soft">
                {t('lessonPage.stepTitle')} {currentStep + 1} / {steps.length}
              </span>
              <span className="text-xs font-extrabold text-ink-soft">{progress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-positive-soft transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex gap-1.5 pt-1">
              {steps.map((step, index) => (
                <button
                  key={step.title || index}
                  type="button"
                  disabled={index > maxUnlockedStep}
                  onClick={() => setCurrentStep(index)}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-primary' : index <= maxUnlockedStep ? 'bg-primary/60' : 'bg-line cursor-not-allowed'
                  }`}
                  aria-label={`${t('lessonPage.stepTitle')} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-12">
          <article className="card p-6 sm:p-8 lg:col-span-8 space-y-6">
            {activeStep && (
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="icon-box h-12 w-12 shrink-0 bg-primary text-on-primary">
                    <span className="text-lg font-extrabold">{currentStep + 1}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-soft">
                      {t('lessonPage.stepTitle')} {currentStep + 1}
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold leading-snug text-ink sm:text-2xl">
                      {activeStep.title}
                    </h2>
                  </div>
                </div>

                {/* عرض فيديو يوتيوب مباشرة إن وجد في الخطوة */}
                {activeStep.videoUrl && (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-line shadow-md my-4">
                    <iframe
                      src={getEmbedYouTubeUrl(activeStep.videoUrl)}
                      title="Lesson YouTube Video"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}

                <AiLessonTools
                  lessonId={activeStep?.id || null}
                  courseTitle={course?.title || ''}
                  title={activeStep?.title || ''}
                  content={stepContentText(activeStep, isAr)}
                  safetyNotes={activeStep?.warning || ''}
                />

                <div className="prose prose-sm max-w-none">
                  <LessonBlocks blocks={blocks} isAr={isAr} />
                </div>

                {!blocks.length && activeStep.content && (
                  <p className="text-sm leading-relaxed text-ink-soft sm:text-base">{activeStep.content}</p>
                )}

                {activeStep.warning && blocks.every((b) => b.type !== 'warning') && (
                  <div className="flex items-start gap-3 rounded-xl border border-line-strong/25 bg-negative-soft p-4">
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-negative-ink" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-negative-ink">{t('lessonPage.safetyWarning')}</h4>
                      <p className="text-xs leading-relaxed text-negative-ink/90">{activeStep.warning}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* قسم الاختبار التقييم القصير لكل خطوة (Quiz Integration) */}
            {activeStep?.quiz && (
              <div className="mt-6 rounded-2xl border border-line bg-surface-2/60 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">
                    {isAr ? 'اختبار استيعاب الخطوة' : 'Step Comprehension Quiz'}
                  </h3>
                </div>
                <p className="text-sm font-bold text-ink">{activeStep.quiz.question}</p>
                <div className="space-y-2">
                  {activeStep.quiz.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleQuizAnswer(optIdx, activeStep.quiz.correctIndex ?? 0)}
                      className={`w-full text-start px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                        selectedQuizOpt === optIdx
                          ? optIdx === (activeStep.quiz.correctIndex ?? 0)
                            ? 'bg-positive-soft text-positive-ink border-primary'
                            : 'bg-negative-soft text-negative-ink border-line-strong'
                          : 'bg-card border-line hover:border-primary'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside className="card flex flex-col gap-4 p-6 lg:col-span-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-soft">
              {isAr ? 'خطوات هذا المساق (مقفل تتابعياً)' : 'Course steps (Sequential Lock)'}
            </p>
            <ol className="space-y-3">
              {steps.map((step, index) => {
                const isLocked = index > maxUnlockedStep;
                return (
                  <li key={step.title || index}>
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => !isLocked && setCurrentStep(index)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-xs font-bold transition-colors ${
                        index === currentStep
                          ? 'bg-highlight text-ink-soft'
                          : isLocked
                          ? 'opacity-50 cursor-not-allowed text-ink-soft'
                          : 'text-ink-soft hover:bg-surface-2 hover:text-ink'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] ${
                            index === currentStep ? 'bg-primary text-on-primary' : 'bg-surface-2'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="truncate max-w-[160px]">{step.title}</span>
                      </div>
                      {isLocked ? <Lock className="h-3.5 w-3.5 text-ink-soft" /> : <CheckCircle2 className="h-3.5 w-3.5 text-positive-ink" />}
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-auto rounded-xl border border-line bg-surface-2 p-3.5">
              <p className="text-[10px] leading-relaxed text-ink-soft">{t('footer.disclaimer')}</p>
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
              disabled={
                completionPending ||
                (currentStep >= maxUnlockedStep && activeStep?.quiz && !quizPassed)
              }
              onClick={handleAdvance}
              className={`btn-primary px-5 ${
                completionPending ||
                (currentStep >= maxUnlockedStep && activeStep?.quiz && !quizPassed)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <span>
                {completionPending
                  ? t('achievement.savingProgress')
                  : t('lessonPage.nextStep')}
              </span>
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishCourse}
              disabled={completionPending}
              className={`btn-primary px-5 ${completionPending ? 'cursor-wait opacity-60' : ''}`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {completionPending
                  ? t('achievement.savingProgress')
                  : t('lessonPage.startQuiz')}
              </span>
            </button>
          )}
        </div>

        {assessmentRequired && (
          <div className="flex flex-col gap-3 rounded-xl border border-line/30 bg-caution-soft/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold leading-relaxed text-ink">
              {t('achievement.assessmentRequired')}
            </p>
            <Link
              to={`/quizzes?lesson=${encodeURIComponent(activeStep.id)}&quiz=${encodeURIComponent(assessmentRequired)}`}
              className="btn-secondary shrink-0 justify-center px-4 text-xs"
            >
              {t('achievement.goToAssessment')}
            </Link>
          </div>
        )}

        <p className="text-center text-[10px] leading-relaxed text-ink-soft">
          {t('lessonPage.finishHint')}
        </p>
      </div>
    </div>
  );
}