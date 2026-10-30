import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import {
  BookCheck,
  TrendingUp,
  Award,
  Flame,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Bot,
  Zap,
  X,
  HeartPulse,
  CheckCircle2,
  XCircle,
  Clock,
  Wind,
  Target,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import {
  getLearningStreak,
  getQuizBest,
  getStudentId,
  isCourseCompleted,
} from '../lib/progress';

const categoryIcons = {
  cpr: HeartPulse,
  choking: Wind,
  burns: Flame,
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const isAr = i18n.language === 'ar';

  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const { courses } = useCatalog();
  const courseList = Array.isArray(courses) ? courses : [];

  const completedCourses = courseList.filter((course) => isCourseCompleted(course.id));
  const totalCompleted = completedCourses.length;
  const progressPercent = courseList.length
    ? Math.round((totalCompleted / courseList.length) * 100)
    : 0;

  const quizBest = getQuizBest();
  const streak = getLearningStreak();
  const studentId = getStudentId(user?.email);
  const firstName = user?.name ? user.name.split(' ')[0] : t('dashboard.studentName');

  const nextCourse =
    courseList.find((course) => !isCourseCompleted(course.id)) || courseList[0];

  const stats = [
    {
      icon: BookCheck,
      label: isAr ? 'المساقات المكتملة' : 'Courses completed',
      value: `${totalCompleted} / ${courseList.length}`,
      color: 'bg-brand-soft text-brand-ink',
    },
    {
      icon: TrendingUp,
      label: t('dashboard.stats.learningProgress'),
      value: `${progressPercent}%`,
      color: 'bg-teal/20 text-teal-deep',
    },
    {
      icon: Award,
      label: isAr ? 'أفضل نتيجة اختبار' : 'Best quiz score',
      value: quizBest ? `${quizBest.percent}%` : '—',
      color: 'bg-brand-soft text-brand-ink',
    },
    {
      icon: Flame,
      label: t('dashboard.stats.learningStreak'),
      value: `${streak} ${t('dashboard.stats.days')}`,
      color: 'bg-amber/15 text-accent',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-content space-y-8">
        <section className="relative overflow-hidden rounded-3xl border border-line bg-card p-6 shadow-pop sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(circle at 88% 12%, rgba(245,158,66,0.14), transparent 46%), radial-gradient(circle at 6% 96%, rgba(120,155,131,0.18), transparent 52%)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="chip bg-brand-soft text-brand-ink">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t('dashboard.badge')}
              </span>
              <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
                {t('dashboard.welcomeBack')}{' '}
                <span className="italic text-accent">{firstName}</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
                {t('dashboard.welcomeSubtitle')}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={nextCourse ? `/lesson?id=${nextCourse.id}` : '/courses'}
                  className="btn-primary px-6"
                >
                  <span>{t('dashboard.continueBtn')}</span>
                  {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Link>
                <button
                  type="button"
                  onClick={() => setGuideModalOpen(true)}
                  className="btn-secondary px-5"
                >
                  <Zap className="h-4 w-4 text-accent" />
                  <span>{t('quickGuide.btnText')}</span>
                </button>
              </div>
            </div>

            <div className="w-full max-w-xs rounded-2xl border border-line bg-surface/80 p-5 backdrop-blur-sm">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-muted">
                {isAr ? 'خطوتك التالية' : 'Your next step'}
              </p>
              {nextCourse ? (
                <>
                  <p className="mt-2 text-sm font-extrabold leading-snug text-ink">
                    {nextCourse.title}
                  </p>
                  <p className="mt-1 text-[11px] text-ink-muted">
                    {nextCourse.duration} · {nextCourse.lessons} {t('coursesPage.lessonsCount')}
                  </p>
                  <Link
                    to={`/lesson?id=${nextCourse.id}`}
                    className="mt-3 inline-flex items-center gap-2 text-[11px] font-extrabold text-brand-ink hover:text-accent"
                  >
                    {isAr ? 'افتح الدرس' : 'Open lesson'}
                    {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                  </Link>
                </>
              ) : (
                <p className="mt-2 text-sm font-bold text-ink">
                  {t('dashboard.stats.allDone')}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="stat-card">
                <div className={`icon-box h-10 w-10 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-[11px] font-bold text-ink-muted">{stat.label}</p>
                <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{stat.value}</h3>
              </div>
            );
          })}
        </section>

        <section className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface-muted text-lg font-extrabold text-ink">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-ink">
                {user?.name || t('dashboard.studentName')}
              </h2>
              <span className="chip bg-success-soft text-success-ink">{t('studentCard.active')}</span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">{t('studentCard.subtitle')}</p>
            <p className="mt-1.5 font-mono text-[11px] font-bold text-brand-ink">
              {t('studentCard.idLabel')} {studentId}
            </p>
          </div>
          <Link to="/profile" className="btn-secondary shrink-0 px-4 text-xs">
            {t('nav.profile')}
          </Link>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="section-title">{t('dashboard.continueLearningSection.title')}</h2>
              <p className="section-subtitle">{t('dashboard.learningPath.subtitle')}</p>
            </div>
            <Link to="/courses" className="btn-secondary px-4 text-xs">
              {t('dashboard.exploreSection.viewAll')}
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {courseList.map((course) => {
              const Icon = categoryIcons[course.category] || BookOpen;
              const completed = isCourseCompleted(course.id);
              return (
                <article key={course.id} className="course-card">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`icon-box h-11 w-11 ${
                        completed ? 'bg-success-soft text-success-ink' : 'bg-brand-soft text-brand-ink'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-muted">
                      <Clock className="h-3.5 w-3.5" />
                      {course.duration}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="chip bg-surface-muted text-ink-muted">{course.level}</span>
                      {completed && (
                        <span className="chip bg-success-soft text-success-ink">
                          <CheckCircle2 className="h-3 w-3" />
                          {t('coursesPage.completed')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold leading-snug text-ink">{course.title}</h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-ink-muted">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
                    <span className="text-[11px] font-bold text-ink-muted">
                      {course.lessons} {t('coursesPage.lessonsCount')}
                    </span>
                    <Link
                      to={`/lesson?id=${course.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-ink transition-colors hover:text-accent"
                    >
                      {completed
                        ? t('coursesPage.continueCourse')
                        : t('dashboard.learningPath.start')}
                      {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-12">
          <div className="card space-y-4 p-6 lg:col-span-7">
            <div className="flex items-start gap-3">
              <div className="icon-box h-10 w-10 bg-primary text-white">
                <Target className="h-5 w-5 text-amber-soft" />
              </div>
              <div>
                <span className="chip bg-brand-soft text-brand-ink">{t('challenge.title')}</span>
                <h2 className="mt-2 text-base font-extrabold leading-snug text-ink">
                  {t('challenge.question')}
                </h2>
              </div>
            </div>

            <div className="space-y-2.5">
              {[1, 2, 3].map((num) => {
                const isSelected = selectedOption === num;
                const isCorrect = num === 1;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSelectedOption(num)}
                    className={`w-full rounded-xl border p-4 text-start text-xs font-bold transition-all ${
                      isSelected && isCorrect
                        ? 'border-success-ink/40 bg-success-soft text-success-ink'
                        : isSelected
                        ? 'border-danger/40 bg-danger-soft text-danger'
                        : 'border-line bg-surface-muted text-ink hover:border-primary/40'
                    }`}
                  >
                    {num}. {t(`challenge.opt${num}`)}
                  </button>
                );
              })}
            </div>

            {selectedOption === 1 && (
              <div className="animate-fade-in flex items-center gap-2 rounded-xl bg-success-soft p-4 text-xs font-bold text-success-ink">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{t('challenge.correctMsg')}</span>
              </div>
            )}
            {(selectedOption === 2 || selectedOption === 3) && (
              <div className="animate-fade-in flex items-center gap-2 rounded-xl bg-danger-soft p-4 text-xs font-bold text-danger">
                <XCircle className="h-5 w-5 shrink-0" />
                <span>{t('challenge.wrongMsg')}</span>
              </div>
            )}
          </div>

          <div className="grid gap-4 lg:col-span-5">
            <Link to="/quizzes" className="card-hover card flex flex-col gap-3 p-6">
              <div className="flex items-center justify-between">
                <span className="icon-box h-10 w-10 bg-amber/15 text-accent">
                  <Award className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-muted">
                  {isAr ? 'اختبار قصير' : 'Quick quiz'}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-ink">{t('dashboard.quizSection.title')}</h3>
              <p className="text-xs leading-relaxed text-ink-muted">{t('dashboard.quizSection.desc')}</p>
              <span className="mt-auto inline-flex items-center gap-2 text-xs font-extrabold text-brand-ink">
                {t('dashboard.quizSection.startBtn')}
                {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              </span>
            </Link>

            <Link to="/ai-tutor" className="card-hover card flex flex-col gap-3 p-6">
              <div className="flex items-center justify-between">
                <span className="icon-box h-10 w-10 bg-primary text-white">
                  <Bot className="h-5 w-5 text-amber-soft" />
                </span>
                <span className="chip bg-amber/15 text-accent">{t('aiTutorPage.statusChip')}</span>
              </div>
              <h3 className="text-base font-extrabold text-ink">{t('dashboard.aiSection.title')}</h3>
              <p className="text-xs leading-relaxed text-ink-muted">{t('dashboard.aiSection.desc')}</p>
              <span className="mt-auto inline-flex items-center gap-2 text-xs font-extrabold text-brand-ink">
                {isAr ? 'معاينة المساعد' : 'Preview the tutor'}
                {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              </span>
            </Link>
          </div>
        </section>

        <p className="flex items-start gap-2 rounded-2xl border border-line bg-surface-muted px-4 py-3 text-[11px] leading-relaxed text-ink-muted">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          {t('footer.disclaimer')}
        </p>
      </div>

      {guideModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setGuideModalOpen(false)}
          role="presentation"
        >
          <div
            className="card animate-rise w-full max-w-lg space-y-5 p-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-guide-title"
          >
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                <h3 id="quick-guide-title" className="text-lg font-extrabold text-ink">
                  {t('quickGuide.title')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                className="rounded-lg bg-surface-muted p-2 text-ink-muted transition-colors hover:bg-line hover:text-ink"
                aria-label={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { icon: Wind, title: t('quickGuide.chokingTitle'), desc: t('quickGuide.chokingDesc') },
                { icon: HeartPulse, title: t('quickGuide.cprTitle'), desc: t('quickGuide.cprDesc') },
                { icon: Flame, title: t('quickGuide.burnsTitle'), desc: t('quickGuide.burnsDesc') },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="space-y-1.5 rounded-xl border border-line bg-surface-muted p-4">
                    <h4 className="flex items-center gap-2 text-xs font-extrabold text-brand-ink">
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-xs leading-relaxed text-ink-muted">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] leading-relaxed text-ink-muted">{t('footer.disclaimer')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
            