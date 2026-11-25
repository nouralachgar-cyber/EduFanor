import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from '../components/icons';
import { getQuizBest, saveQuizResult } from '../lib/progress';
import { apiRequest } from '../lib/api';
import AchievementCelebration from '../components/achievement/AchievementCelebration';

export default function Quizzes() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const isAr = i18n.language === 'ar';
  const lessonIdParam = searchParams.get('lesson') || '';
  const quizIdParam = searchParams.get('quiz') || '';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [best, setBest] = useState(() => getQuizBest());
  const [databaseQuiz, setDatabaseQuiz] = useState(null);
  const [loadedQuizQuery, setLoadedQuizQuery] = useState('');
  const [quizLoadError, setQuizLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [assessmentPassed, setAssessmentPassed] = useState(null);
  const [earnedAchievement, setEarnedAchievement] = useState(null);
  const quizQueryKey = `${isAr ? 'ar' : 'en'}:${lessonIdParam}:${quizIdParam}`;
  const quizLoading = loadedQuizQuery !== quizQueryKey;

  useEffect(() => {
    let cancelled = false;
    const query = lessonIdParam ? `?lesson=${encodeURIComponent(lessonIdParam)}` : '';
    apiRequest(`/quizzes${query}`)
      .then((data) => {
        if (cancelled) return;
        const quizzes = Array.isArray(data?.quizzes) ? data.quizzes : [];
        const quiz =
          quizzes.find((item) => String(item._id) === quizIdParam) ||
          quizzes[0] ||
          null;
        if (quiz?.questions?.length) {
          setDatabaseQuiz({
            id: String(quiz._id),
            title: quiz.title?.[isAr ? 'ar' : 'en'] || quiz.title?.en || '',
            lessonId: quiz.lesson?._id,
            courseKey: quiz.lesson?.course?.slug,
            passingScore: Number.isFinite(quiz.passingScore) ? quiz.passingScore : 70,
            questions: quiz.questions.map((question) => ({
              question: question.question?.[isAr ? 'ar' : 'en'] || question.question?.en || '',
              options: question.options?.[isAr ? 'ar' : 'en'] || question.options?.en || [],
              explanation: question.explanation?.[isAr ? 'ar' : 'en'] || question.explanation?.en || '',
            })),
          });
          setQuizLoadError('');
        } else if (lessonIdParam) {
          setDatabaseQuiz(null);
          setQuizLoadError(t('achievement.assessmentNotFound'));
        } else {
          setDatabaseQuiz(null);
          setQuizLoadError('');
        }
        setCurrentQuestion(0);
        setSelectedOption(null);
        setAnswers([]);
        setScore(0);
        setShowResult(false);
        setAssessmentPassed(null);
        setSubmitError('');
        setEarnedAchievement(null);
      })
      .catch(() => {
        if (cancelled) return;
        setDatabaseQuiz(null);
        setQuizLoadError(lessonIdParam ? t('achievement.assessmentLoadError') : '');
        setCurrentQuestion(0);
        setSelectedOption(null);
        setAnswers([]);
        setScore(0);
        setShowResult(false);
        setAssessmentPassed(null);
        setSubmitError('');
        setEarnedAchievement(null);
      })
      .finally(() => {
        if (!cancelled) setLoadedQuizQuery(quizQueryKey);
      });
    return () => {
      cancelled = true;
    };
  }, [isAr, lessonIdParam, quizIdParam, quizQueryKey, t]);

  const fallbackQuestions = [
    {
      question: isAr
        ? 'ما هو المعدل الصحيح للضغطات الصدرية أثناء الإنعاش القلبي الرئوي (CPR)؟'
        : 'What is the correct rate for chest compressions during CPR?',
      options: [
        isAr ? '60 - 80 ضغطة في الدقيقة' : '60 - 80 compressions per minute',
        isAr ? '100 - 120 ضغطة في الدقيقة' : '100 - 120 compressions per minute',
        isAr ? '140 - 160 ضغطة في الدقيقة' : '140 - 160 compressions per minute',
      ],
      correct: 1,
    },
    {
      question: isAr
        ? 'ما هو الإجراء الأول الصحيح عند التعامل مع شخص يغص ويتعذر عليه التنفس؟'
        : 'What is the first step when aiding a conscious choking adult?',
      options: [
        isAr ? 'إعطاؤه الماء فوراً' : 'Give them water immediately',
        isAr ? 'تطبيق 5 ضربات على الظهر و5 ضغطات على البطن' : 'Perform 5 back blows and 5 abdominal thrusts',
        isAr ? 'جعله يستلقي على ظهره' : 'Lay them flat on their back',
      ],
      correct: 1,
    },
    {
      question: isAr
        ? 'كيف يجب التعامل مع الحروق البسيطة من الدرجة الأولى؟'
        : 'How should you treat a minor first-degree burn?',
      options: [
        isAr ? 'وضع الثلج المباشر على الحرق' : 'Apply ice directly to the burn',
        isAr ? 'تبريد مكان الحرق بالماء الفاتر المنساب لمدة 10-15 دقيقة' : 'Cool under cool running water for 10-15 minutes',
        isAr ? 'دهن مكان الحرق بالمعجون' : 'Apply toothpaste to the burn',
      ],
      correct: 1,
    },
  ];

  const questions = databaseQuiz?.questions?.length ? databaseQuiz.questions : fallbackQuestions;

  const active = questions[currentQuestion];
  const isAnswered = selectedOption !== null;
  const progressPercent = Math.round(((currentQuestion + 1) / questions.length) * 100);
  const hasAnswerKey = Number.isInteger(active?.correct);
  const answerFeedback = hasAnswerKey
    ? selectedOption === active.correct
      ? isAr ? 'إجابة صحيحة.' : 'Correct answer.'
      : isAr ? 'الإجابة الصحيحة موضّحة بالأعلى.' : 'The correct answer is highlighted above.'
    : t('achievement.answerRecorded');
  const nextButtonLabel = submitting
    ? t('achievement.verifyingAssessment')
    : currentQuestion < questions.length - 1
      ? isAr ? 'السؤال التالي' : 'Next question'
      : isAr ? 'إرسال التقييم' : 'Submit assessment';

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    if (databaseQuiz) {
      setAnswers((previous) => {
        const next = [...previous];
        next[currentQuestion] = index;
        return next;
      });
    } else if (index === active.correct) {
      setScore((previous) => previous + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedOption(null);
      return;
    }

    if (databaseQuiz?.id) {
      setSubmitting(true);
      setSubmitError('');
      try {
        const result = await apiRequest(`/quizzes/${encodeURIComponent(databaseQuiz.id)}/attempt`, {
          method: 'POST',
          body: { answers },
          auth: true,
        });
        const serverScore = result?.score;
        if (!serverScore || typeof serverScore.correct !== 'number') {
          throw new Error('Invalid assessment response.');
        }
        setScore(serverScore.correct);
        setAssessmentPassed(Boolean(serverScore.passed));
        saveQuizResult(serverScore.correct, serverScore.total, {
          courseKey: databaseQuiz.courseKey,
          lessonId: databaseQuiz.lessonId,
          serverRecorded: true,
        });
        setBest(getQuizBest());
        setShowResult(true);
        if (result.achievement?.newlyCreated && result.achievement.record) {
          setEarnedAchievement({
            record: result.achievement.record,
            studentName: result.achievement.studentName,
          });
        }
      } catch (error) {
        setSubmitError(
          error.code === 'NETWORK_ERROR' || error.status === 0
            ? t('achievement.assessmentNetworkError')
            : t('achievement.assessmentSubmitError')
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    saveQuizResult(score, questions.length, {
      courseKey: databaseQuiz?.courseKey,
      lessonId: databaseQuiz?.lessonId,
    });
    setBest(getQuizBest());
    setShowResult(true);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswers([]);
    setScore(0);
    setShowResult(false);
    setAssessmentPassed(null);
    setSubmitError('');
    setEarnedAchievement(null);
  };

  const finalPercent = Math.round((score / questions.length) * 100);

  return (
    <div className="page-container">
      <div className="page-content mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="chip bg-highlight text-ink-soft">
              <Sparkles className="h-3.5 w-3.5" />
              {isAr ? 'تدرّب على المعرفة' : 'Practice your knowledge'}
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {databaseQuiz?.title || (isAr ? 'اختبار الإسعافات الأولية' : 'First Aid Knowledge Quiz')}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
              {isAr
                ? 'اختبر معلوماتك الأساسية وتأكد من جاهزيتك للتعامل مع الحالات الطارئة.'
                : 'Test your essential knowledge and evaluate your readiness for emergency situations.'}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3">
            <Award className="h-5 w-5 text-on-primary" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft">
                {isAr ? 'أفضل نتيجة' : 'Best score'}
              </p>
              <p className="text-sm font-extrabold text-ink">{best ? `${best.percent}%` : '—'}</p>
            </div>
          </div>
        </header>

        {quizLoading ? (
          <section className="card p-6 text-sm font-semibold text-ink-soft" role="status">
            {t('achievement.loadingAssessment')}
          </section>
        ) : quizLoadError ? (
          <section className="card p-6 text-sm font-semibold text-negative-ink" role="alert">
            {quizLoadError}
          </section>
        ) : !showResult ? (
          <section className="card space-y-6 p-6 sm:p-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-ink-soft">
                <span>
                  {isAr
                    ? `السؤال ${currentQuestion + 1} من ${questions.length}`
                    : `Question ${currentQuestion + 1} of ${questions.length}`}
                </span>
                <span className="text-ink-soft">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-positive-soft transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <h2 className="text-lg font-extrabold leading-snug text-ink sm:text-xl">{active.question}</h2>

            <div className="space-y-3">
              {active.options.map((option, index) => {
                const isCorrect = hasAnswerKey && index === active.correct;
                const isSelected = index === selectedOption;
                let style = 'border-line bg-surface-2 text-ink hover:border-primary/40';
                if (isAnswered && isCorrect) {
                  style = 'border-positive-ink/40 bg-positive-soft text-positive-ink';
                } else if (isAnswered && isSelected && hasAnswerKey) {
                  style = 'border-line-strong/40 bg-negative-soft text-negative-ink';
                } else if (isAnswered && isSelected) {
                  style = 'border-primary/40 bg-highlight text-ink-soft';
                }

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelectOption(index)}
                    disabled={isAnswered}
                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-start text-xs font-bold transition-all disabled:cursor-default sm:text-sm ${style}`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current/30 text-[10px] font-extrabold">
                      {index + 1}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                      {isAnswered && hasAnswerKey && isCorrect && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
                      {isAnswered && hasAnswerKey && isSelected && !isCorrect && <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {submitError && (
              <p role="alert" className="rounded-xl border border-line-strong/20 bg-negative-soft p-3 text-xs font-semibold text-negative-ink">
                {submitError}
              </p>
            )}

            {isAnswered && (
              <div className="flex animate-fade-in flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className={`flex items-center gap-2 text-xs font-bold ${hasAnswerKey && selectedOption === active.correct ? 'text-positive-ink' : 'text-ink-soft'}`}>
                  {answerFeedback}
                </p>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={submitting}
                  className="btn-primary px-6 text-xs disabled:cursor-wait disabled:opacity-60"
                >
                  {nextButtonLabel}
                  {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="card space-y-6 p-8 text-center sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-highlight text-ink-soft dark:text-lavender">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                {isAr ? 'اكتمل الاختبار' : 'Quiz completed'}
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                {isAr
                  ? `حصلت على ${score} من أصل ${questions.length} إجابات صحيحة.`
                  : `You scored ${score} out of ${questions.length}.`}
              </p>
              {databaseQuiz && assessmentPassed !== null && (
                <p className={`mt-2 text-sm font-bold ${assessmentPassed ? 'text-positive-ink' : 'text-negative-ink'}`}>
                  {assessmentPassed
                    ? t('achievement.assessmentPassed')
                    : t('achievement.assessmentPassingScore', { score: databaseQuiz.passingScore })}
                </p>
              )}
            </div>

            <div className="mx-auto flex max-w-sm flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-extrabold text-ink-soft">
                <span>{isAr ? 'نتيجتك' : 'Your result'}</span>
                <span className="text-ink-soft">{finalPercent}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-caution-soft transition-all duration-700"
                  style={{ width: `${finalPercent}%` }}
                />
              </div>
              <p className="text-[11px] leading-relaxed text-ink-soft">
                {databaseQuiz
                  ? isAr
                    ? 'تم التحقق من نتيجتك وحفظها في حسابك.'
                    : 'Your result was verified and saved to your account.'
                  : isAr
                  ? 'يُحفظ أفضل نتيجة لك في هذا المتصفح ويمكنك مراجعتها من صفحة التقدّم.'
                  : 'Your best score is saved in this browser and can be reviewed on the progress page.'}
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={handleRestart} className="btn-primary px-6 text-xs">
                <RefreshCw className="h-4 w-4" />
                {isAr ? 'إعادة الاختبار' : 'Retake quiz'}
              </button>
              {databaseQuiz && assessmentPassed && databaseQuiz.courseKey && (
                <Link to={`/lesson?id=${encodeURIComponent(databaseQuiz.courseKey)}`} className="btn-secondary px-6 text-xs">
                  {t('achievement.returnToLesson')}
                </Link>
              )}
              <Link to="/progress" className="btn-secondary px-6 text-xs">
                <HelpCircle className="h-4 w-4" />
                {isAr ? 'عرض التقدّم' : 'View progress'}
              </Link>
            </div>
          </section>
        )}

        <p className="text-center text-[10px] leading-relaxed text-ink-soft">
          {isAr
            ? 'هذا الاختبار تعليمي ولا يُغني عن التدريب المعتمد أو خدمات الطوارئ.'
            : 'This quiz is educational and does not replace certified training or emergency services.'}
        </p>
      </div>
      <AchievementCelebration
        open={!quizLoading && Boolean(earnedAchievement)}
        onClose={() => setEarnedAchievement(null)}
        achievement={earnedAchievement?.record}
        studentName={earnedAchievement?.studentName}
      />
    </div>
  );
}
