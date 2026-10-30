import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  GraduationCap,
  Layers,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { adminApi, formatDateTime, formatNumber, formatPercent, initials, localize, relativeTime } from '../../lib/admin';
import { PageHeader, Panel, StatCard, Badge, LoadingState, ErrorState, EmptyState } from '../../components/admin/ui';
import { ActivityBars, Donut, LineChart } from '../../components/admin/charts';

const ranges = [7, 30, 90, 365];

export default function AdminOverview() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const isAr = i18n.language === 'ar';
  const [range, setRange] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .overview(range)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [range]);

  if (loading && !data) {
    return <LoadingState label={t('admin.common.loading')} />;
  }

  if (error && !data) {
    return (
      <ErrorState
        title={t('admin.errors.loadOverview')}
        message={error}
        onRetry={load}
        retryLabel={t('admin.common.retry')}
      />
    );
  }

  const metrics = data.metrics;
  const activity = data.activity || [];
  const topCourses = data.topCourses || [];
  const recentStudents = data.recentStudents || [];
  const recentAudit = data.recentAudit || [];
  const health = data.health || {};
  const registrationSeries = (data.registrations || []).map((point) => ({
    ...point,
    date: `${point.date}-01`,
  }));

  const healthItems = [
    { key: 'coursesWithoutLessons', value: health.coursesWithoutLessons, to: '/admin/courses' },
    { key: 'awaitingReview', value: health.awaitingReview, to: '/admin/courses' },
    { key: 'quizzesMissingQuestions', value: health.quizzesMissingQuestions, to: '/admin/courses' },
    { key: 'studentsWithoutActivity', value: health.studentsWithoutActivity, to: '/admin/students?activity=inactive' },
  ];

  const greeting = isAr ? `مرحباً، ${user?.name?.split(' ')[0] || ''}` : `Welcome back, ${user?.name?.split(' ')[0] || ''}`;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={t('admin.shell.title')}
        title={t('admin.overview.title')}
        subtitle={t('admin.overview.subtitle')}
        actions={
          <>
            <div className="flex items-center gap-1 rounded-xl border border-line bg-card p-1">
              {ranges.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRange(option)}
                  className={`rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold transition-colors ${
                    range === option
                      ? 'bg-primary text-white'
                      : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
                  }`}
                >
                  {t('admin.overview.days', { count: option })}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={load}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-card text-ink transition-colors hover:bg-surface-muted"
              aria-label={t('admin.common.refresh')}
              title={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </>
        }
      />

      <section className="admin-hero admin-rise flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/80">
            <Sparkles className="h-3 w-3 text-amber-soft" />
            {t('admin.shell.systemOnline')}
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{greeting}</h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/65">
            {isAr
              ? 'إليك ملخص أداء المنصة خلال الفترة المحددة. يمكنك إدارة الطلاب والمحتوى ومتابعة كل نشاط من مكان واحد.'
              : 'Here is how the platform is performing in the selected period. Manage students, content and activity from one place.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:shrink-0">
          <div className="rounded-xl border border-white/10 bg-white/[0.08] px-3.5 py-2.5">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/50">
              {t('admin.overview.activeStudents')}
            </p>
            <p className="mt-0.5 font-display text-xl font-bold text-white">{formatNumber(metrics.activeStudents, i18n.language)}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.08] px-3.5 py-2.5">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/50">
              {t('admin.overview.completionRate')}
            </p>
            <p className="mt-0.5 font-display text-xl font-bold text-white">{formatPercent(metrics.completionRate, i18n.language)}</p>
          </div>
          <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.08] px-3.5 py-2.5 sm:col-span-1">
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/50">
              {t('admin.overview.averageQuiz')}
            </p>
            <p className="mt-0.5 font-display text-xl font-bold text-white">{formatPercent(metrics.averageQuizScore, i18n.language)}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Users} label={t('admin.overview.totalStudents')} value={formatNumber(metrics.totalStudents, i18n.language)} hint={`+${formatNumber(metrics.newStudents, i18n.language)} ${t('admin.overview.inRange')}`} tone="sage" />
        <StatCard icon={UserPlus} label={t('admin.overview.newStudents')} value={formatNumber(metrics.newStudents, i18n.language)} tone="amber" />
        <StatCard icon={BookOpen} label={t('admin.overview.publishedCourses')} value={formatNumber(metrics.publishedCourses, i18n.language)} hint={`${formatNumber(metrics.draftCourses, i18n.language)} ${t('admin.common.draft')}`} tone="sage" />
        <StatCard icon={ClipboardCheck} label={t('admin.overview.quizAttempts')} value={formatNumber(metrics.quizAttempts, i18n.language)} tone="surface" />
        <StatCard icon={CheckCircle2} label={t('admin.overview.completions')} value={formatNumber(metrics.courseCompletions, i18n.language)} hint={`${formatNumber(metrics.courseStarts, i18n.language)} ${t('admin.overview.courseStarts')}`} tone="sage" />
        <StatCard icon={GraduationCap} label={t('admin.overview.lessonCompletions')} value={formatNumber(metrics.lessonCompletions, i18n.language)} tone="amber" />
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.7fr_1fr]">
        <Panel
          title={t('admin.overview.learningActivity')}
          subtitle={t('admin.overview.inRange')}
          actions={
            <span className="text-[10px] font-bold text-ink-muted">
              {t('admin.overview.generated')}: {formatDateTime(data.generatedAt, i18n.language)}
            </span>
          }
        >
          <ActivityBars data={activity} language={i18n.language} height={170} />
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-ink-muted"><span className="h-2 w-2 rounded-full bg-[#24483f]" />{t('admin.overview.courseStarts')}</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-ink-muted"><span className="h-2 w-2 rounded-full bg-[#e88736]" />{t('admin.overview.completions')}</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-ink-muted"><span className="h-2 w-2 rounded-full bg-[#789b83]" />{t('admin.overview.quizAttempts')}</span>
          </div>
        </Panel>

        <Panel title={t('admin.overview.platformHealth')}>
          <div className="flex items-center justify-between gap-3">
            <Donut value={metrics.completionRate || 0} label={formatPercent(metrics.completionRate, i18n.language)} sublabel={t('admin.overview.completionRate')} tone="#e88736" />
            <div className="min-w-0 flex-1 space-y-2.5">
              {healthItems.map((item) => (
                <Link key={item.key} to={item.to} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-muted">
                  <span className="text-[11px] font-semibold text-ink-muted">{t(`admin.overview.health${item.key.charAt(0).toUpperCase()}${item.key.slice(1)}`)}</span>
                  <Badge tone={item.value ? 'amber' : 'green'}>{formatNumber(item.value, i18n.language)}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1fr_1fr]">
        <Panel
          title={t('admin.overview.registrations')}
          subtitle={t('admin.overview.days', { count: 365 })}
          actions={<CalendarDays className="h-4 w-4 text-ink-muted" />}
        >
          <LineChart
            data={registrationSeries}
            series={[{ key: 'count', label: t('admin.overview.registrations'), color: '#24483f' }]}
            language={i18n.language}
            height={200}
          />
        </Panel>

        <Panel title={t('admin.overview.topCourses')} noPadding>
          {topCourses.length === 0 ? (
            <EmptyState title={t('admin.overview.noTopCourses')} icon={Trophy} />
          ) : (
            <div className="admin-scroll overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.courses.courseTitle')}</th>
                    <th>{t('admin.analytics.starts')}</th>
                    <th>{t('admin.analytics.completionsShort')}</th>
                    <th>{t('admin.analytics.quizAttemptsShort')}</th>
                  </tr>
                </thead>
                <tbody>
                  {topCourses.map((course) => (
                    <tr key={course.courseKey}>
                      <td>
                        <p className="font-bold text-ink">{localize(course.title, i18n.language) || course.courseKey}</p>
                        <p className="text-[10px] text-ink-muted">{course.courseKey}</p>
                      </td>
                      <td className="font-bold">{formatNumber(course.starts, i18n.language)}</td>
                      <td className="font-bold">{formatNumber(course.completions, i18n.language)}</td>
                      <td className="font-bold">{formatNumber(course.quizAttempts, i18n.language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.15fr_1fr_1fr]">
        <Panel
          title={t('admin.overview.recentStudents')}
          actions={<Link to="/admin/students" className="text-[10px] font-extrabold text-primary hover:underline dark:text-brand-ink">{t('admin.common.view')}<ArrowUpRight className="ms-1 inline h-3 w-3" /></Link>}
          noPadding
        >
          {recentStudents.length === 0 ? (
            <EmptyState title={t('admin.overview.noStudents')} icon={Users} />
          ) : (
            <div className="divide-y divide-line">
              {recentStudents.map((student) => (
                <Link key={student._id} to={`/admin/students/${student._id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-muted">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-[11px] font-extrabold text-success-ink">
                    {initials(student.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-extrabold text-ink">{student.name}</p>
                    <p className="truncate text-[10px] text-ink-muted" dir="ltr">{student.email}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-ink-muted">{relativeTime(student.createdAt, i18n.language)}</span>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel title={t('admin.overview.recentActivity')} noPadding>
          {recentAudit.length === 0 ? (
            <EmptyState title={t('admin.overview.noAudit')} icon={ShieldAlert} />
          ) : (
            <div className="divide-y divide-line">
              {recentAudit.map((log) => (
                <div key={log._id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-extrabold text-ink">
                      {t(`admin.audit.actions.${log.action}`, { defaultValue: log.action })}
                    </p>
                    <span className="shrink-0 text-[10px] text-ink-muted">{relativeTime(log.createdAt, i18n.language)}</span>
                  </div>
                  <p className="mt-0.5 truncate text-[10px] text-ink-muted">{log.targetLabel || log.targetType}</p>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title={t('admin.overview.completions')}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="icon-box h-9 w-9 bg-brand-soft text-success-ink"><TrendingUp className="h-4 w-4" /></span>
              <div className="flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">{t('admin.overview.courseStarts')}</p>
                <p className="font-display text-lg font-bold text-ink">{formatNumber(metrics.courseStarts, i18n.language)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="icon-box h-9 w-9 bg-amber-soft/50 text-amber"><Target className="h-4 w-4" /></span>
              <div className="flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">{t('admin.overview.completions')}</p>
                <p className="font-display text-lg font-bold text-ink">{formatNumber(metrics.courseCompletions, i18n.language)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="icon-box h-9 w-9 bg-surface-muted text-ink-muted"><Layers className="h-4 w-4" /></span>
              <div className="flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">{t('admin.overview.lessonCompletions')}</p>
                <p className="font-display text-lg font-bold text-ink">{formatNumber(metrics.lessonCompletions, i18n.language)}</p>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-surface-muted p-3">
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-ink-muted"><Clock className="h-3 w-3" />{t('admin.overview.generated')} {formatDateTime(data.generatedAt, i18n.language)}</p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
