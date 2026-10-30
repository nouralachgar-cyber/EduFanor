import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, Circle, Flame, TrendingUp, ArrowRight, ArrowLeft, HelpCircle, Sparkles } from 'lucide-react';
import { getLearningStreak, getQuizBest, isCourseCompleted } from '../lib/progress';
import { useCatalog } from '../context/CatalogContext';

export default function Progress() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const { courses } = useCatalog();
  const courseList = Array.isArray(courses) ? courses : [];
  const completed = courseList.filter((course) => isCourseCompleted(course.id));
  const totalCompleted = completed.length;
  const percent = courseList.length ? Math.round((totalCompleted / courseList.length) * 100) : 0;
  const quizBest = getQuizBest();
  const streak = getLearningStreak();

  return (
    <div className="page-container">
      <div className="page-content space-y-8">
        <header>
          <span className="chip bg-brand-soft text-brand-ink">
            <Sparkles className="h-3.5 w-3.5" />
            {isAr ? 'سجل التعلّم' : 'Learning record'}
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {isAr ? 'تقدّمي وإنجازاتي' : 'My progress & achievements'}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            {isAr
              ? 'تابع المساقات التي أكملتها، وأفضل نتائجك في الاختبارات، وأيام تعلّمك المتتالية.'
              : 'Track the courses you completed, your best quiz results, and your learning streak.'}
          </p>
        </header>

        <section className="card overflow-hidden">
          <div className="grid gap-0 md:grid-cols-12">
            <div className="border-b border-line p-6 md:col-span-5 md:border-b-0 md:border-e md:p-8">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                {isAr ? 'الإنجاز الكلي' : 'Overall completion'}
              </p>
              <p className="mt-3 font-display text-6xl font-semibold tracking-tight text-ink">
                {percent}
                <span className="text-2xl text-accent">%</span>
              </p>
              <p className="mt-2 text-xs font-bold text-ink-muted">
                {isAr
                  ? `${totalCompleted} من ${courseList.length} مساقات مكتملة`
                  : `${totalCompleted} of ${courseList.length} courses completed`}
              </p>
              <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-sage to-amber transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-line md:col-span-7">
              {[
                {
                  icon: CheckCircle2,
                  label: isAr ? 'مساقات مكتملة' : 'Courses completed',
                  value: `${totalCompleted} / ${courseList.length}`,
                },
                {
                  icon: Flame,
                  label: isAr ? 'أيام متتالية' : 'Day streak',
                  value: `${streak}`,
                },
                {
                  icon: Award,
                  label: isAr ? 'أفضل اختبار' : 'Best quiz',
                  value: quizBest ? `${quizBest.percent}%` : '—',
                },
                {
                  icon: TrendingUp,
                  label: isAr ? 'الخطوة التالية' : 'Next step',
                  value: totalCompleted < courseList.length ? (isAr ? 'واصل' : 'Continue') : isAr ? 'مكتمل' : 'Complete',
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-card p-5">
                    <span className="icon-box h-9 w-9 bg-surface-muted text-brand-ink">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="mt-3 text-[10px] font-bold text-ink-muted">{stat.label}</p>
                    <p className="mt-0.5 text-lg font-extrabold text-ink">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="section-title">{isAr ? 'المساقات' : 'Courses'}</h2>
              <p className="section-subtitle">
                {isAr ? 'حالة كل مساق في مسارك التعليمي.' : 'The status of each course in your learning path.'}
              </p>
            </div>
            <Link to="/courses" className="btn-secondary px-4 text-xs">
              {t('dashboard.exploreSection.viewAll')}
            </Link>
          </div>

          <div className="card divide-y divide-line overflow-hidden">
            {courseList.map((course) => {
              const done = isCourseCompleted(course.id);
              return (
                <div key={course.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        done ? 'bg-success-soft text-success-ink' : 'bg-surface-muted text-ink-muted'
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-ink">{course.title}</p>
                      <p className="mt-1 text-[11px] font-semibold text-ink-muted">
                        {course.duration} · {course.lessons} {t('coursesPage.lessonsCount')} · {course.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ps-11 sm:ps-0">
                    <span
                      className={`chip ${
                        done ? 'bg-success-soft text-success-ink' : 'bg-surface-muted text-ink-muted'
                      }`}
                    >
                      {done ? t('coursesPage.completed') : isAr ? 'لم يكتمل' : 'Not completed'}
                    </span>
                    <Link
                      to={`/lesson?id=${course.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-ink transition-colors hover:text-accent"
                    >
                      {done ? t('coursesPage.continueCourse') : t('dashboard.learningPath.start')}
                      {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-12">
          <div className="card p-6 lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="icon-box h-10 w-10 bg-amber/15 text-accent">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-ink">
                  {isAr ? 'أوسمة التعلّم' : 'Learning milestones'}
                </h2>
                <p className="text-[11px] text-ink-muted">
                  {isAr ? 'تُفتح تلقائياً عند إكمال المساقات.' : 'Unlocked automatically as you complete courses.'}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {courseList.map((course) => {
                const done = isCourseCompleted(course.id);
                const emoji = course.category === 'cpr' ? '🫀' : course.category === 'choking' ? '🫁' : '🩹';
                return (
                  <div
                    key={course.id}
                    className={`rounded-xl border p-4 ${
                      done
                        ? 'border-line bg-surface-muted'
                        : 'border-dashed border-line bg-surface opacity-60'
                    }`}
                  >
                    <span className="text-xl" aria-hidden="true">
                      {emoji}
                    </span>
                    <p className="mt-2 text-xs font-extrabold leading-snug text-ink">
                      {course.category === 'cpr'
                        ? isAr
                          ? 'أتممت أساسيات الإنعاش'
                          : 'CPR basics completed'
                        : course.category === 'choking'
                        ? isAr
                          ? 'أتممت الاستجابة للاختناق'
                          : 'Choking response completed'
                        : isAr
                        ? 'أتممت العناية بالحروق'
                        : 'Burn care completed'}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-ink-muted">
                      {done
                        ? isAr
                          ? 'مفتوح'
                          : 'Unlocked'
                        : isAr
                        ? 'أكمل المساق لفتحه'
                        : 'Complete the course to unlock'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card flex flex-col gap-4 p-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="icon-box h-10 w-10 bg-brand-soft text-brand-ink">
                <HelpCircle className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-ink">
                  {isAr ? 'أفضل نتيجة اختبار' : 'Best quiz result'}
                </h2>
                <p className="text-[11px] text-ink-muted">
                  {isAr ? 'محفوظة في هذا المتصفح.' : 'Saved in this browser.'}
                </p>
              </div>
            </div>

            {quizBest ? (
              <>
                <p className="font-display text-5xl font-semibold text-ink">
                  {quizBest.percent}
                  <span className="text-xl text-accent">%</span>
                </p>
                <p className="text-xs text-ink-muted">
                  {isAr
                    ? `${quizBest.score} من ${quizBest.total} إجابات صحيحة`
                    : `${quizBest.score} of ${quizBest.total} correct answers`}
                </p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${quizBest.percent}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs leading-relaxed text-ink-muted">
                {isAr
                  ? 'لم تُكمل أي اختبار بعد. ابدأ اختباراً قصيراً لتسجيل أول نتيجة لك.'
                  : 'You have not completed a quiz yet. Take a short quiz to record your first result.'}
              </p>
            )}

            <Link to="/quizzes" className="btn-primary mt-auto px-4 text-xs">
              {quizBest ? (isAr ? 'أعد الاختبار' : 'Retake quiz') : t('dashboard.quizSection.startBtn')}
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
