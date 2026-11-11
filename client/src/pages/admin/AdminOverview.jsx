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
} from '../../components/icons';
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
    return (
      <div className="space-y-6 bg-[#E3E8F8] min-h-screen p-6 text-[#3E588F]">
        <LoadingState label={t('admin.common.loading')} />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-6 bg-[#E3E8F8] min-h-screen p-6 text-[#3E588F]">
        <ErrorState
          title={t('admin.errors.loadOverview')}
          message={error}
          onRetry={load}
          retryLabel={t('admin.common.retry')}
        />
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const activity = data?.activity || [];
  const topCourses = data?.topCourses || [];
  const recentStudents = data?.recentStudents || [];
  const recentAudit = data?.recentAudit || [];
  const health = data?.health || {};
  const registrationSeries = (data?.registrations || []).map((point) => ({
    ...point,
    date: `${point.date}-01`,
  }));

  const healthItems = [
    { key: 'coursesWithoutLessons', value: health.coursesWithoutLessons, to: '/admin/courses' },
    { key: 'awaitingReview', value: health.awaitingReview, to: '/admin/courses' },
    { key: 'quizzesMissingQuestions', value: health.quizzesMissingQuestions, to: '/admin/courses' },
    { key: 'studentsWithoutActivity', value: health.studentsWithoutActivity, to: '/admin/students?activity=inactive' },
  ];

  const greeting = isAr ? `مرحباً، ${user?.name?.split(' ')[0] || ''}` : `Welcome back, Admin, ${user?.name?.split(' ')[0] || ''}`;

  return (
    <div className="space-y-6 bg-[#E3E8F8] min-h-screen p-6 text-[#3E588F]">
      <PageHeader
        eyebrow={t('admin.shell.title')}
        title={t('admin.overview.title')}
        subtitle={t('admin.overview.subtitle')}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-[#C0C5CD] bg-white p-1 shadow-sm">
              {ranges.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRange(option)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors ${
                    range === option
                      ? 'bg-[#3E588F] text-[#E3E8F8]'
                      : 'text-[#3E588F]/70 hover:bg-[#E3E8F8] hover:text-[#3E588F]'
                  }`}
                >
                  {t('admin.overview.days', { count: option })}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={load}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C0C5CD] bg-[#E3E8F8] text-[#3E588F] transition-colors hover:bg-[#C0C5CD]/30 shadow-sm"
              aria-label={t('admin.common.refresh')}
              title={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        }
      />

      <section className="rounded-3xl border border-[#C0C5CD]/50 bg-[#3E588F] p-6 text-white shadow-lg flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C0C5CD]/30 bg-[#C0C5CD]/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#E3E8F8]">
            <Sparkles className="h-3.5 w-3.5 text-[#C0C5CD]" />
            {t('admin.shell.systemOnline')}
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{greeting}</h2>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#E3E8F8]/80">
            {isAr
              ? 'إليك ملخص أداء المنصة خلال الفترة المحددة. يمكنك إدارة الطلاب والمحتوى ومتابعة كل نشاط من مكان واحد.'
              : 'Here is how the platform is performing in the selected period. Manage students, content and activity from one place.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:shrink-0">
          <div className="rounded-2xl border border-[#C0C5CD]/30 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E3E8F8]/70">
              {t('admin.overview.activeStudents')}
            </p>
            <p className="mt-1 font-display text-xl font-bold text-white">{formatNumber(metrics.activeStudents, i18n.language)}</p>
          </div>
          <div className="rounded-2xl border border-[#C0C5CD]/30 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E3E8F8]/70">
              {t('admin.overview.completionRate')}
            </p>
            <p className="mt-1 font-display text-xl font-bold text-white">{formatPercent(metrics.completionRate, i18n.language)}</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-[#C0C5CD]/30 bg-white/10 px-4 py-3 sm:col-span-1 backdrop-blur-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E3E8F8]/70">
              {t('admin.overview.averageQuiz')}
            </p>
            <p className="mt-1 font-display text-xl font-bold text-white">{formatPercent(metrics.averageQuizScore, i18n.language)}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Users} label={t('admin.overview.totalStudents')} value={formatNumber(metrics.totalStudents, i18n.language)} hint={`+${formatNumber(metrics.newStudents, i18n.language)} ${t('admin.overview.inRange')}`} tone="sage" />
        <StatCard icon={UserPlus} label={t('admin.overview.newStudents')} value={formatNumber(metrics.newStudents, i18n.language)} tone="amber" />
        <StatCard icon={BookOpen} label={t('admin.overview.publishedCourses')} value={formatNumber(metrics.publishedCourses, i18n.language)} hint={`${formatNumber(metrics.draftCourses, i18n.language)} ${t('admin.common.draft')}`} tone="sage" />
        <StatCard icon={ClipboardCheck} label={t('admin.overview.quizAttempts')} value={formatNumber(metrics.quizAttempts, i18n.language)} tone="surface" />
        <StatCard icon={CheckCircle2} label={t('admin.overview.completions')} value={formatNumber(metrics.courseCompletions, i18n.language)} hint={`${formatNumber(metrics.courseStarts, i18n.language)} ${t('admin.overview.courseStarts')}`} tone="sage" />
        <StatCard icon={GraduationCap} label={t('admin.overview.lessonCompletions')} value={formatNumber(metrics.lessonCompletions, i18n.language)} tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Panel
          title={t('admin.overview.learningActivity')}
          subtitle={t('admin.overview.inRange')}
          className="bg-white border border-[#C0C5CD]/40 rounded-2xl p-6 shadow-sm"
          actions={
            <span className="text-xs font-bold text-[#3E588F]/70">
              {t('admin.overview.generated')}: {formatDateTime(data?.generatedAt, i18n.language)}
            </span>
          }
        >
          <ActivityBars data={activity} language={i18n.language} height={170} />
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3E588F]/80"><span className="h-2.5 w-2.5 rounded-full bg-[#3E588F]" />{t('admin.overview.courseStarts')}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3E588F]/80"><span className="h-2.5 w-2.5 rounded-full bg-[#C0C5CD]" />{t('admin.overview.completions')}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3E588F]/80"><span className="h-2.5 w-2.5 rounded-full bg-[#C0C5CD]" />{t('admin.overview.quizAttempts')}</span>
          </div>
        </Panel>

        <Panel title={t('admin.overview.platformHealth')} className="bg-white border border-[#C0C5CD]/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <Donut value={metrics.completionRate || 0} label={formatPercent(metrics.completionRate, i18n.language)} sublabel={t('admin.overview.completionRate')} tone="#3E588F" />
            <div className="min-w-0 flex-1 space-y-3">
              {healthItems.map((item) => (
                <Link key={item.key} to={item.to} className="flex items-center justify-between gap-2 rounded-xl bg-[#E3E8F8] px-3 py-2 transition-colors hover:bg-[#E3E8F8] border border-[#C0C5CD]/30">
                  <span className="text-xs font-semibold text-[#3E588F]">{t(`admin.overview.health${item.key.charAt(0).toUpperCase()}${item.key.slice(1)}`)}</span>
                  <Badge tone={item.value ? 'amber' : 'green'} className="bg-white text-[#3E588F] border border-[#C0C5CD]">{formatNumber(item.value, i18n.language)}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel
          title={t('admin.overview.registrations')}
          subtitle={t('admin.overview.days', { count: 365 })}
          className="bg-white border border-[#C0C5CD]/40 rounded-2xl p-6 shadow-sm"
          actions={<CalendarDays className="h-4 w-4 text-[#C0C5CD]" />}
        >
          <LineChart
            data={registrationSeries}
            series={[{ key: 'count', label: t('admin.overview.registrations'), color: '#3E588F' }]}
            language={i18n.language}
            height={200}
          />
        </Panel>

        <Panel title={t('admin.overview.topCourses')} noPadding className="bg-white border border-[#C0C5CD]/40 rounded-2xl shadow-sm overflow-hidden">
          {topCourses.length === 0 ? (
            <EmptyState title={t('admin.overview.noTopCourses')} icon={Trophy} />
          ) : (
            <div className="admin-scroll overflow-x-auto">
              <table className="admin-table w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#C0C5CD]/30 bg-[#E3E8F8]/50 text-xs text-[#3E588F]">
                    <th className="p-3.5">{t('admin.courses.courseTitle')}</th>
                    <th className="p-3.5">{t('admin.analytics.starts')}</th>
                    <th className="p-3.5">{t('admin.analytics.completionsShort')}</th>
                    <th className="p-3.5">{t('admin.analytics.quizAttemptsShort')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C0C5CD]/20 text-xs">
                  {topCourses.map((course) => (
                    <tr key={course.courseKey} className="hover:bg-[#E3E8F8]/60 transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-[#3E588F]">{localize(course.title, i18n.language) || course.courseKey}</p>
                        <p className="text-[10px] text-[#3E588F]/70">{course.courseKey}</p>
                      </td>
                      <td className="p-3.5 font-bold text-[#3E588F]">{formatNumber(course.starts, i18n.language)}</td>
                      <td className="p-3.5 font-bold text-[#3E588F]">{formatNumber(course.completions, i18n.language)}</td>
                      <td className="p-3.5 font-bold text-[#3E588F]">{formatNumber(course.quizAttempts, i18n.language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr_1fr]">
        <Panel
          title={t('admin.overview.recentStudents')}
          className="bg-white border border-[#C0C5CD]/40 rounded-2xl shadow-sm overflow-hidden"
          actions={<Link to="/admin/students" className="text-xs font-extrabold text-[#3E588F] hover:text-[#C0C5CD] transition-colors">{t('admin.common.view')}<ArrowUpRight className="ms-1 inline h-3.5 w-3.5 text-[#C0C5CD]" /></Link>}
          noPadding
        >
          {recentStudents.length === 0 ? (
            <EmptyState title={t('admin.overview.noStudents')} icon={Users} />
          ) : (
            <div className="divide-y divide-[#C0C5CD]/20">
              {recentStudents.map((student) => (
                <Link key={student._id} to={`/admin/students/${student._id}`} className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-[#E3E8F8]/60">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E3E8F8] text-xs font-extrabold text-[#3E588F] border border-[#C0C5CD]/50">
                    {initials(student.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-extrabold text-[#3E588F]">{student.name}</p>
                    <p className="truncate text-[10px] text-[#3E588F]/70" dir="ltr">{student.email}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-[#3E588F]/60">{relativeTime(student.createdAt, i18n.language)}</span>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel title={t('admin.overview.recentActivity')} className="bg-white border border-[#C0C5CD]/40 rounded-2xl shadow-sm overflow-hidden" noPadding>
          {recentAudit.length === 0 ? (
            <EmptyState title={t('admin.overview.noAudit')} icon={ShieldAlert} />
          ) : (
            <div className="divide-y divide-[#C0C5CD]/20">
              {recentAudit.map((log) => (
                <div key={log._id} className="px-4 py-3.5 hover:bg-[#E3E8F8]/60 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-extrabold text-[#3E588F]">
                      {t(`admin.audit.actions.${log.action}`, { defaultValue: log.action })}
                    </p>
                    <span className="shrink-0 text-[10px] text-[#3E588F]/60">{relativeTime(log.createdAt, i18n.language)}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-[#3E588F]/70">{log.targetLabel || log.targetType}</p>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title={t('admin.overview.completions')} className="bg-white border border-[#C0C5CD]/40 rounded-2xl p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E3E8F8] text-[#3E588F] border border-[#C0C5CD]/50"><TrendingUp className="h-4 w-4 text-[#C0C5CD]" /></span>
              <div className="flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#3E588F]/60">{t('admin.overview.courseStarts')}</p>
                <p className="font-display text-lg font-bold text-[#3E588F]">{formatNumber(metrics.courseStarts, i18n.language)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E3E8F8] text-[#3E588F] border border-[#C0C5CD]/50"><Target className="h-4 w-4 text-[#C0C5CD]" /></span>
              <div className="flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#3E588F]/60">{t('admin.overview.completions')}</p>
                <p className="font-display text-lg font-bold text-[#3E588F]">{formatNumber(metrics.courseCompletions, i18n.language)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E3E8F8] text-[#3E588F] border border-[#C0C5CD]/50"><Layers className="h-4 w-4 text-[#C0C5CD]" /></span>
              <div className="flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#3E588F]/60">{t('admin.overview.lessonCompletions')}</p>
                <p className="font-display text-lg font-bold text-[#3E588F]">{formatNumber(metrics.lessonCompletions, i18n.language)}</p>
              </div>
            </div>
            <div className="rounded-xl border border-[#C0C5CD]/30 bg-[#E3E8F8] p-3">
              <p className="flex items-center gap-1.5 text-xs font-bold text-[#3E588F]/70"><Clock className="h-3.5 w-3.5 text-[#C0C5CD]" />{t('admin.overview.generated')} {formatDateTime(data?.generatedAt, i18n.language)}</p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}