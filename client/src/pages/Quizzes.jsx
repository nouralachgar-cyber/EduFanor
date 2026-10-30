import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { getQuizBest, saveQuizResult } from '../lib/progress';
import { apiRequest } from '../lib/api';

export default function Quizzes() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [best, setBest] = useState(() => getQuizBest());
  const [databaseQuiz, setDatabaseQuiz] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest('/quizzes')
      .then((data) => {
        if (cancelled) return;
        const quiz = Array.isArray(data?.quizzes) ? data.quizzes[0] : null;
        if (quiz?.questions?.length) {
          setDatabaseQuiz({
            lessonId: quiz.lesson?._id,
            courseKey: quiz.lesson?.course?.slug,
            questions: quiz.questions.map((question) => ({
              question: question.question?.[isAr ? 'ar' : 'en'] || question.question?.en || '',
              options: question.options?.[isAr ? 'ar' : 'en'] || question.options?.en || [],
              correct: question.correctAnswer,
              explanation: question.explanation?.[isAr ? 'ar' : 'en'] || question.explanation?.en || '',
            })),
          });
        }
      })
      .catch(() => {
        /* Keep the existing local quiz as a fallback. */
      });
    return () => {
      cancelled = true;
    };
  }, [isAr]);

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

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    if (index === active.correct) {
      setScore((previous) => previous + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedOption(null);
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
    setScore(0);
    setShowResult(false);
  };

  const finalPercent = Math.round((score / questions.length) * 100);

  return (
    <div className="page-container">
      <div className="page-content mx-auto max-w-4xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="chip bg-brand-soft text-brand-ink">
              <Sparkles className="h-3.5 w-3.5" />
              {isAr ? 'تدرّب على المعرفة' : 'Practice your knowledge'}
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {isAr ? 'اختبار الإسعافات الأولية' : 'First Aid Knowledge Quiz'}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
              {isAr
                ? 'اختبر معلوماتك الأساسية وتأكد من جاهزيتك للتعامل مع الحالات الطارئة.'
                : 'Test your essential knowledge and evaluate your readiness for emergency situations.'}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3">
            <Award className="h-5 w-5 text-accent" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-muted">
                {isAr ? 'أفضل نتيجة' : 'Best score'}
              </p>
              <p className="text-sm font-extrabold text-ink">{best ? `${best.percent}%` : '—'}</p>
            </div>
          </div>
        </header>

        {!showResult ? (
          <section className="card space-y-6 p-6 sm:p-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-ink-muted">
                <span>
                  {isAr
                    ? `السؤال ${currentQuestion + 1} من ${questions.length}`
                    : `Question ${currentQuestion + 1} of ${questions.length}`}
                </span>
                <span className="text-brand-ink">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-sage transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <h2 className="text-lg font-extrabold leading-snug text-ink sm:text-xl">{active.question}</h2>

            <div className="space-y-3">
              {active.options.map((option, index) => {
                const isCorrect = index === active.correct;
                const isSelected = index === selectedOption;
                let style = 'border-line bg-surface-muted text-ink hover:border-primary/40';
                if (isAnswered && isCorrect) {
                  style = 'border-success-ink/40 bg-success-soft text-success-ink';
                } else if (isAnswered && isSelected) {
                  style = 'border-danger/40 bg-danger-soft text-danger';
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
                    {isAnswered && isCorrect && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="mt-0.5 h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="flex animate-fade-in flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p
                  className={`flex items-center gap-2 text-xs font-bold ${
                    selectedOption === active.correct ? 'text-success-ink' : 'text-danger'
                  }`}
                >
                  {selectedOption === active.correct ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {selectedOption === active.correct
                    ? isAr
                      ? 'إجابة صحيحة.'
                      : 'Correct answer.'
                    : isAr
                    ? 'الإجابة الصحيحة موضّحة بالأعلى.'
                    : 'The correct answer is highlighted above.'}
                </p>
                <button type="button" onClick={handleNext} className="btn-primary px-6 text-xs">
                  {currentQuestion < questions.length - 1
                    ? isAr
                      ? 'السؤال التالي'
                      : 'Next question'
                    : isAr
                    ? 'عرض النتيجة'
                    : 'See results'}
                  {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="card space-y-6 p-8 text-center sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber/15 text-accent">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                {isAr ? 'اكتمل الاختبار' : 'Quiz completed'}
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                {isAr
                  ? `حصلت على ${score} من أصل ${questions.length} إجابات صحيحة.`
                  : `You scored ${score} out of ${questions.length}.`}
              </p>
            </div>

            <div className="mx-auto flex max-w-sm flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-extrabold text-ink-muted">
                <span>{isAr ? 'نتيجتك' : 'Your result'}</span>
                <span className="text-brand-ink">{finalPercent}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-amber transition-all duration-700"
                  style={{ width: `${finalPercent}%` }}
                />
              </div>
              <p className="text-[11px] leading-relaxed text-ink-muted">
                {isAr
                  ? 'يُحفظ أفضل نتيجة لك في هذا المتصفح ويمكنك مراجعتها من صفحة التقدّم.'
                  : 'Your best score is saved in this browser and can be reviewed on the progress page.'}
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={handleRestart} className="btn-primary px-6 text-xs">
                <RefreshCw className="h-4 w-4" />
                {isAr ? 'إعادة الاختبار' : 'Retake quiz'}
              </button>
              <Link to="/progress" className="btn-secondary px-6 text-xs">
                <HelpCircle className="h-4 w-4" />
                {isAr ? 'عرض التقدّم' : 'View progress'}
              </Link>
            </div>
          </section>
        )}

        <p className="text-center text-[10px] leading-relaxed text-ink-muted">
          {isAr
            ? 'هذا الاختبار تعليمي ولا يُغني عن التدريب المعتمد أو خدمات الطوارئ.'
            : 'This quiz is educational and does not replace certified training or emergency services.'}
        </p>
      </div>
    </div>
  );
}
