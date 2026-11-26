import React, { useContext, useEffect, useMemo, useState } from 'react';
import useCertificates from '../hooks/useCertificates';
import { formatCertificateDate } from '../lib/certificateLayout';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
} from '../components/icons';
import {
  getActivityDates,
  getLearningStreak,
  getQuizBest,
  getStudentId,
  isCourseCompleted,
} from '../lib/progress';
import { apiRequest, getStoredToken } from '../lib/api';
import AchievementPanel from '../components/achievement/AchievementPanel';

const categoryIcons = {
  cpr: HeartPulse,
  choking: Wind,
  burns: Flame,
};

const dayKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
};

function streakFromDates(dates) {
  const keys = new Set(dates.filter(Boolean));
  if (keys.size === 0) return 0;
  const cursor = new Date();
  if (!keys.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (keys.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [remote, setRemote] = useState(null);
  const [achievementResponse, setAchievementResponse] = useState(null);

  const { courses } = useCatalog();
  const { certificates, byCourse: certificatesByCourse } = useCertificates();
  const courseList = useMemo(() => (Array.isArray(courses) ? courses : []), [courses]);
  const achievementUserId = String(user?._id || user?.id || user?.email || '');
  const currentAchievementResponse =
    achievementResponse?.userId === achievementUserId ? achievementResponse : null;
  const achievementData = currentAchievementResponse?.data || null;
  const achievementLoading = Boolean(achievementUserId && !currentAchievementResponse);
  const achievementError = Boolean(currentAchievementResponse?.error);

  useEffect(() => {
    if (!getStoredToken()) return undefined;
    let cancelled = false;
    apiRequest('/progress/me', { auth: true })
      .then((data) => {
        if (!cancelled) setRemote(data);
      })
      .catch(() => {
        /* Local progress remains available when the server is offline. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (user?.role !== 'student' || !getStoredToken()) return undefined;
    let cancelled = false;
    apiRequest('/achievements/me', { auth: true })
      .then((data) => {
        if (!cancelled) {
          setAchievementResponse({ userId: achievementUserId, data, error: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAchievementResponse({ userId: achievementUserId, data: null, error: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [achievementUserId, user?.role]);

  useEffect(() => {
    if (location.state?.celebrateAchievement) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const remoteCompletedIds = useMemo(
    () =>
      new Set(
        (remote?.progress?.completedLessons || []).map((lesson) =>
          String(lesson?._id || lesson)
        )
      ),
    [remote]
  );

  const remoteCourseCounts = useMemo(() => {
    const counts = new Map();
    (remote?.progress?.completedLessons || []).forEach((lesson) => {
      const slug = lesson?.course?.slug;
      if (!slug) return;
      counts.set(slug, (counts.get(slug) || 0) + 1);
    });
    return counts;
  }, [remote]);

  const courseStats = useMemo(
    () =>
      courseList.map((course) => {
        const lessonIds = (course.steps || []).map((step) => String(step.id));
        const total = course.lessons || lessonIds.length || 1;
        const completedFromIds = lessonIds.filter((id) => remoteCompletedIds.has(id)).length;
        const completedFromSlug = remoteCourseCounts.get(course.id) || 0;
        const serverDone = Math.max(completedFromIds, completedFromSlug);
        const localDone = isCourseCompleted(course.id);
        const done = localDone ? total : Math.min(total, serverDone);
        const percent = Math.round((done / total) * 100);
        return {
          ...course,
          completed: percent >= 100,
          certificate: certificatesByCourse[course.id] || null,
          done,
          total,
          percent,
        };
      }),
    [courseList, remoteCompletedIds, remoteCourseCounts, certificatesByCourse]
  );

  const totals = useMemo(
    () =>
      courseStats.reduce(
        (accumulator, course) => ({
          lessons: accumulator.lessons + course.total,
          done: accumulator.done + course.done,
        }),
        { lessons: 0, done: 0 }
      ),
    [courseStats]
  );

  const totalCompleted = courseStats.filter((course) => course.completed).length;
  const progressPercent = totals.lessons
    ? Math.round((totals.done / totals.lessons) * 100)
    : 0;

  const serverQuizBest = Math.max(
    0,
    ...(remote?.progress?.quizAttempts || []).map((attempt) => Number(attempt.score) || 0)
  );
  const localQuizBest = getQuizBest();
  const bestPercent = Math.max(localQuizBest?.percent || 0, serverQuizBest);
  const quizBest = bestPercent > 0 ? { percent: bestPercent } : null;

  const remoteStreak = streakFromDates([
    ...(remote?.events || []).map((event) => dayKey(event.occurredAt)),
    ...getActivityDates(),
  ]);
  const streak = Math.max(getLearningStreak(), remoteStreak);
  const studentId = getStudentId(user?.email);
  const firstName = user?.name ? user.name.split(' ')[0] : t('dashboard.studentName');

  const nextCourse =
    courseStats.find((course) => !course.completed) || courseStats[0];

  const stats = [
    {
      icon: BookCheck,
      label: isAr ? 'المساقات المكتملة' : 'Courses completed',
      value: `${totalCompleted} / ${courseStats.length}`,
      color: 'bg-highlight text-ink-soft dark:bg-highlight dark:text-on-primary',
    },
    {
      icon: TrendingUp,
      label: t('dashboard.stats.learningProgress'),
      value: `${progressPercent}%`,
      color: 'bg-positive-soft text-positive-ink dark:bg-positive-soft dark:text-positive-ink',
    },
    {
      icon: Award,
      label: isAr ? 'أفضل نتيجة اختبار' : 'Best quiz score',
      value: quizBest ? `${quizBest.percent}%` : '—',
      color: 'bg-caution-soft text-caution-ink dark:bg-caution-soft dark:text-caution-ink',
    },
    {
      icon: Flame,
      label: t('dashboard.stats.learningStreak'),
      value: `${streak} ${t('dashboard.stats.days')}`,
      color: 'bg-negative-soft text-negative-ink dark:bg-negative-soft dark:text-negative-ink',
    },
  ];

  const arrowClass = isAr
    ? 'transition-transform duration-200 group-hover:-translate-x-1'
    : 'transition-transform duration-200 group-hover:translate-x-1';

  return (
    <div className="page-container min-h-full antialiased">
      <div className="page-content space-y-8">
        <section className="animate-fade-up relative overflow-hidden rounded-3xl border border-line/90 bg-gradient-to-br from-highlight via-on-dark to-positive-soft/60 p-6 shadow-sm dark:border-line dark:from-scrim/40 dark:via-surface-2 dark:to-scrim/30 sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(circle at 88% 12%, var(--palette-lavender), transparent 46%), radial-gradient(circle at 6% 96%, var(--palette-lilac), transparent 52%)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-soft shadow-sm dark:border-primary/60 dark:bg-surface-2/90 dark:text-lavender">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t('dashboard.badge')}
              </span>
              <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink dark:text-on-dark sm:text-4xl lg:text-5xl">
                {t('dashboard.welcomeBack')}{' '}
                <span className="italic text-ink-soft dark:text-lavender">{firstName}</span>
              </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft dark:text-on-dark/80 sm:text-base">
              {t('dashboard.welcomeSubtitle')}
            </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to={nextCourse ? `/lesson?id=${nextCourse.id}` : '/courses'}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-on-primary shadow-md shadow-pop transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg active:scale-[0.98] dark:bg-primary dark:text-on-primary dark:hover:bg-primary-hover sm:px-6"
                >
                  <span>{t('dashboard.continueBtn')}</span>
                  {isAr ? (
                    <ArrowLeft className={`h-4 w-4 ${arrowClass}`} />
                  ) : (
                    <ArrowRight className={`h-4 w-4 ${arrowClass}`} />
                  )}
                </Link>
                <button
                  type="button"
                  onClick={() => setGuideModalOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-3 text-sm font-bold text-ink-soft shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:bg-highlight hover:shadow-md active:scale-[0.98] dark:border-line-strong dark:bg-surface-2 dark:text-lavender dark:hover:bg-primary dark:hover:text-on-primary"
                >
                  <Zap className="h-4 w-4 text-lavender dark:text-lavender" />
                  <span>{t('quickGuide.btnText')}</span>
                </button>
              </div>
            </div>

            <div className="group w-full max-w-xs rounded-2xl border border-line bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md dark:border-line dark:bg-surface-2 dark:hover:border-primary">
              <p className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-soft dark:text-lavender">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {isAr ? 'خطوتك التالية' : 'Your next step'}
              </p>
              {nextCourse ? (
                <>
                  <p className="mt-3 text-base font-bold leading-snug text-ink dark:text-on-dark">
                    {nextCourse.title}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft dark:text-lavender">
                    {nextCourse.duration} · {nextCourse.lessons} {t('coursesPage.lessonsCount')}
                  </p>
                  <Link
                    to={`/lesson?id=${nextCourse.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-ink-soft transition-colors hover:text-ink dark:text-lavender dark:hover:text-lavender"
                  >
                    {isAr ? 'افتح الدرس' : 'Open lesson'}
                    {isAr ? (
                      <ArrowLeft className={`h-3.5 w-3.5 ${arrowClass}`} />
                    ) : (
                      <ArrowRight className={`h-3.5 w-3.5 ${arrowClass}`} />
                    )}
                  </Link>
                </>
              ) : (
                <p className="mt-3 text-sm font-bold text-ink dark:text-on-dark">
                  {t('dashboard.stats.allDone')}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{ animationDelay: `${120 + index * 80}ms` }}
                className="animate-fade-up flex flex-col rounded-2xl border border-line/90 bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md dark:border-line dark:bg-surface-2 dark:hover:border-primary"
              >
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-[11px] font-bold leading-snug text-ink-soft dark:text-lavender">
                  {stat.label}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">
                  {stat.value}
                </h3>
              </div>
            );
          })}
        </section>

        <section
          style={{ animationDelay: '440ms' }}
          className="animate-fade-up rounded-2xl border border-line/90 bg-surface p-5 shadow-sm dark:border-line dark:bg-surface-2 sm:p-6"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-highlight text-lg font-extrabold text-ink-soft dark:border-primary/60 dark:bg-highlight dark:text-on-primary">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-ink dark:text-on-dark">
                  {user?.name || t('dashboard.studentName')}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-positive-soft px-2.5 py-1 text-[11px] font-bold text-positive-ink dark:border-primary/60 dark:bg-positive-soft dark:text-positive-ink">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex h-2 w-2 animate-pulse-dot rounded-full bg-primary dark:bg-primary" />
                  </span>
                  {t('studentCard.active')}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-soft dark:text-lavender">{t('studentCard.subtitle')}</p>
              <p className="mt-1.5 font-mono text-[11px] font-bold text-ink-soft dark:text-lavender">
                {t('studentCard.idLabel')} {studentId}
              </p>
            </div>
            <Link
              to="/profile"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-ink-soft shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-highlight hover:text-ink hover:shadow-md active:scale-[0.98] dark:border-line-strong dark:bg-surface-2 dark:text-on-dark dark:hover:bg-surface-2 sm:self-start"
            >
              {t('nav.profile')}
            </Link>
          </div>
        </section>

        {user?.role === 'student' && getStoredToken() && (
          <AchievementPanel
            achievement={achievementData?.achievement}
            progress={achievementData?.progress}
            studentName={achievementData?.studentName || user?.name || ''}
            newlyCreated={achievementData?.newlyCreated}
            celebrateOnLoad={Boolean(location.state?.celebrateAchievement)}
            loading={achievementLoading}
            error={achievementError}
          />
        )}

        {certificates.length > 0 && (
          <section
            style={{ animationDelay: '400ms' }}
            className="animate-fade-up rounded-2xl border border-line/90 bg-surface p-5 shadow-sm dark:border-line dark:bg-surface-2 sm:p-6"
          >
            <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 dark:border-line sm:flex-row sm:items-end">
              <div>
                <h2 className="section-title">{t('certificate.view')}</h2>
                <p className="section-subtitle">
                  {isAr ? 'شهاداتك المكتملة جاهزة للتنزيل والمشاركة.' : 'Your earned certificates are ready to download and share.'}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {certificates.map((certificate) => (
                <Link
                  key={certificate.id}
                  to={`/certificate/${certificate.courseKey}`}
                  className="group flex items-center gap-3 rounded-xl border border-line bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md dark:border-line dark:bg-surface"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-positive-soft text-positive-ink">
                    <Award className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-ink dark:text-on-dark">
                      {certificate.courseTitle}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-semibold text-ink-soft dark:text-lavender">
                      {formatCertificateDate(certificate.completedAt)} · {certificate.certificateId}
                    </span>
                  </span>
                  <ArrowRight className={`h-4 w-4 shrink-0 text-ink-soft ${arrowClass}`} />
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 dark:border-line sm:flex-row sm:items-end">
            <div>
              <h2 className="section-title">{t('dashboard.continueLearningSection.title')}</h2>
              <p className="section-subtitle">{t('dashboard.learningPath.subtitle')}</p>
            </div>
            <Link
              to="/courses"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold text-ink-soft shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-highlight hover:text-ink hover:shadow-md active:scale-[0.98] dark:border-line-strong dark:bg-surface-2 dark:text-on-dark dark:hover:bg-surface-2"
            >
              {t('dashboard.exploreSection.viewAll')}
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {courseStats.map((course, index) => {
              const Icon = categoryIcons[course.category] || BookOpen;
              const completed = course.completed;
              return (
                <article
                  key={course.id}
                  style={{ animationDelay: `${520 + index * 90}ms` }}
                  className="group flex animate-fade-up flex-col rounded-2xl border border-line/90 bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md dark:border-line dark:bg-surface-2 dark:hover:border-primary"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        completed
                          ? 'bg-positive-soft text-positive-ink dark:bg-positive-soft dark:text-positive-ink'
                          : 'bg-highlight text-ink-soft dark:bg-highlight dark:text-on-primary'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-soft dark:text-lavender">
                      <Clock className="h-3.5 w-3.5" />
                      {course.duration}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-bold text-ink-soft dark:bg-surface-2 dark:text-lavender">
                        {course.level}
                      </span>
                      {completed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-positive-soft px-2.5 py-1 text-[11px] font-bold text-positive-ink dark:bg-positive-soft dark:text-positive-ink">
                          <CheckCircle2 className="h-3 w-3" />
                          {t('coursesPage.completed')}
                        </span>
                      ) : (
                        <span className="rounded-full bg-highlight px-2.5 py-1 text-[11px] font-bold text-ink-soft dark:bg-highlight dark:text-on-primary">
                          {course.percent}%
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold leading-snug text-ink dark:text-on-dark">
                      {course.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft dark:text-lavender">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-ink-soft dark:text-lavender">
                      <span>{isAr ? 'تقدمك' : 'Your progress'}</span>
                      <span className="text-ink-soft dark:text-lavender">
                        {course.done} / {course.total}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2 dark:bg-surface-2">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          completed
                            ? 'bg-primary'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${course.percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-line pt-4 dark:border-line">
                    <span className="text-[11px] font-bold text-ink-soft dark:text-lavender">
                      {course.lessons} {t('coursesPage.lessonsCount')}
                    </span>
                    {course.certificate && (
                      <Link
                        to={`/certificate/${course.certificate.courseKey}`}
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-extrabold text-primary transition-colors hover:bg-highlight"
                      >
                        <Award className="h-3.5 w-3.5" />
                        {t('certificate.view')}
                      </Link>
                    )}
                    <Link
                      to={`/lesson?id=${course.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-extrabold text-ink-soft transition-colors hover:bg-highlight hover:text-ink dark:text-lavender dark:hover:bg-primary/10 dark:hover:text-lavender"
                    >
                      {completed
                        ? t('coursesPage.continueCourse')
                        : t('dashboard.learningPath.start')}
                      {isAr ? (
                        <ArrowLeft className={`h-3.5 w-3.5 ${arrowClass}`} />
                      ) : (
                        <ArrowRight className={`h-3.5 w-3.5 ${arrowClass}`} />
                      )}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-12">
          <div className="rounded-2xl border border-line/90 bg-surface p-6 shadow-sm dark:border-line dark:bg-surface-2 lg:col-span-7">
            <div className="flex items-start gap-3 border-b border-line pb-4 dark:border-line">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-highlight text-ink-soft dark:bg-highlight dark:text-on-primary">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <span className="inline-flex items-center rounded-full bg-caution-soft px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-caution-ink dark:bg-caution-soft dark:text-caution-ink">
                  {t('challenge.title')}
                </span>
                <h2 className="mt-2 text-base font-bold leading-snug text-ink dark:text-on-dark">
                  {t('challenge.question')}
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              {[1, 2, 3].map((num) => {
                const isSelected = selectedOption === num;
                const isCorrect = num === 1;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSelectedOption(num)}
                    className={`w-full rounded-xl border px-4 py-3 text-start text-xs font-bold transition-all duration-200 active:scale-[0.99] ${
                      isSelected && isCorrect
                        ? 'border-primary bg-positive-soft text-positive-ink dark:border-primary/60 dark:bg-positive-soft dark:text-positive-ink'
                        : isSelected
                        ? 'border-line-strong bg-negative-soft text-negative-ink dark:border-line-strong dark:bg-negative-soft dark:text-negative-ink'
                        : 'border-line bg-surface-2 text-ink-soft hover:border-primary hover:bg-highlight dark:border-line dark:bg-surface-2 dark:text-lavender dark:hover:border-primary'
                    }`}
                  >
                    {num}. {t(`challenge.opt${num}`)}
                  </button>
                );
              })}
            </div>

            {selectedOption === 1 && (
              <div className="animate-fade-up mt-4 flex items-center gap-2 rounded-xl border border-line bg-positive-soft p-4 text-xs font-bold text-positive-ink dark:border-primary dark:bg-positive-soft dark:text-positive-ink">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{t('challenge.correctMsg')}</span>
              </div>
            )}
            {(selectedOption === 2 || selectedOption === 3) && (
              <div className="animate-fade-up mt-4 flex items-center gap-2 rounded-xl border border-line bg-negative-soft p-4 text-xs font-bold text-negative-ink dark:border-line-strong dark:bg-negative-soft dark:text-negative-ink">
                <XCircle className="h-5 w-5 shrink-0" />
                <span>{t('challenge.wrongMsg')}</span>
              </div>
            )}
          </div>

          <div className="grid gap-4 lg:col-span-5">
            <Link
              to="/quizzes"
              className="group flex flex-col gap-3 rounded-2xl border border-line/90 bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md dark:border-line dark:bg-surface-2 dark:hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-caution-soft text-caution-ink dark:bg-caution-soft dark:text-caution-ink">
                  <Award className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-soft dark:text-lavender">
                  {isAr ? 'اختبار قصير' : 'Quick quiz'}
                </span>
              </div>
              <h3 className="text-base font-bold text-ink dark:text-on-dark">
                {t('dashboard.quizSection.title')}
              </h3>
              <p className="text-xs leading-relaxed text-ink-soft dark:text-lavender">
                {t('dashboard.quizSection.desc')}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-extrabold text-ink-soft dark:text-lavender">
                {t('dashboard.quizSection.startBtn')}
                {isAr ? (
                  <ArrowLeft className={`h-3.5 w-3.5 ${arrowClass}`} />
                ) : (
                  <ArrowRight className={`h-3.5 w-3.5 ${arrowClass}`} />
                )}
              </span>
            </Link>

            <Link
              to="/ai-tutor"
              className="group flex flex-col gap-3 rounded-2xl border border-line/90 bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md dark:border-line dark:bg-surface-2 dark:hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-highlight text-ink-soft dark:bg-highlight dark:text-on-primary">
                  <Bot className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-caution-soft px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-caution-ink dark:bg-caution-soft dark:text-caution-ink">
                  {t('aiTutorPage.statusChip')}
                </span>
              </div>
              <h3 className="text-base font-bold text-ink dark:text-on-dark">
                {t('dashboard.aiSection.title')}
              </h3>
              <p className="text-xs leading-relaxed text-ink-soft dark:text-lavender">
                {t('dashboard.aiSection.desc')}
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-extrabold text-ink-soft dark:text-lavender">
                {isAr ? 'معاينة المساعد' : 'Preview the tutor'}
                {isAr ? (
                  <ArrowLeft className={`h-3.5 w-3.5 ${arrowClass}`} />
                ) : (
                  <ArrowRight className={`h-3.5 w-3.5 ${arrowClass}`} />
                )}
              </span>
            </Link>
          </div>
        </section>

        <p className="flex items-start gap-2 rounded-2xl border border-line bg-surface-2/70 px-4 py-3 text-[11px] leading-relaxed text-ink-soft dark:border-line dark:bg-surface-2 dark:text-lavender">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lavender" />
          {t('footer.disclaimer')}
        </p>
      </div>

      {guideModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/50 p-4 backdrop-blur-sm"
          onClick={() => setGuideModalOpen(false)}
          role="presentation"
        >
          <div
            className="animate-fade-up w-full max-w-lg space-y-5 rounded-2xl border border-line bg-surface p-6 shadow-xl dark:border-line dark:bg-surface-2"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-guide-title"
          >
            <div className="flex items-center justify-between border-b border-line pb-4 dark:border-line">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-lavender dark:text-lavender" />
                <h3 id="quick-guide-title" className="text-lg font-bold text-ink dark:text-on-dark">
                  {t('quickGuide.title')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                className="rounded-lg bg-surface-2 p-2 text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink active:scale-95 dark:bg-surface-2 dark:text-lavender dark:hover:bg-surface-2"
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
                  <div key={item.title} className="space-y-1.5 rounded-xl border border-line bg-surface-2 p-4 dark:border-line dark:bg-surface-2">
                    <h4 className="flex items-center gap-2 text-xs font-bold text-ink-soft dark:text-lavender">
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-xs leading-relaxed text-ink-soft dark:text-lavender">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] leading-relaxed text-ink-soft dark:text-lavender">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
