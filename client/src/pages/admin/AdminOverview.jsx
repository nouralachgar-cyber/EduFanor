import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Plus,
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
import CourseFormModal from '../../components/admin/CourseFormModal';

const ranges = [7, 30, 90, 365];

export default function AdminOverview() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAr = i18n.language === 'ar';
  const [courseFormOpen, setCourseFormOpen] = useState(false);
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
      <div className="space-y-6 bg-[#F6F5F2] min-h-screen p-4 sm:p-6 text-[#415E72]">
        <LoadingState label={t('admin.common.loading')} />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-6 bg-[#F6F5F2] min-h-screen p-4 sm:p-6 text-[#415E72]">
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
    <div className="space-y-6 bg-[#F6F5F2] min-h-screen p-4 sm:p-6 text-[#415E72]">
      <PageHeader
        eyebrow={t('admin.shell.title')}
        title={t('admin.overview.title')}
        subtitle={t('admin.overview.subtitle')}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-[#C5B0CD] bg-white p-1 shadow-sm">
              {ranges.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRange(option)}
                  className={`min-h-11 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors xl:min-h-0 ${
                    range === option
                      ? 'bg-[#415E72] text-[#F6F5F2]'
                      : 'text-[#415E72]/70 hover:bg-[#F6F5F2] hover:text-[#415E72]'
                  }`}
                >
                  {t('admin.overview.days', { count: option })}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={load}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5B0CD] bg-[#F6F5F2] text-[#415E72] transition-colors hover:bg-[#C5B0CD]/30 shadow-sm xl:h-10 xl:w-10"
              aria-label={t('admin.common.refresh')}
              title={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        }
      />

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setCourseFormOpen(true)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#415E72] px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition-colors hover:bg-[#415E72]/90"
        >
          <Plus className="h-4 w-4 text-[#C5B0CD]" />
          {t('admin.courses.newCourse')}
        </button>
        <Link
          to="/admin/lessons/new"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#C5B0CD] bg-white px-4 py-2.5 text-xs font-extrabold text-[#415E72] shadow-sm transition-colors hover:bg-[#F6F5F2]"
        >
          <Plus className="h-4 w-4 text-[#C5B0CD]" />
          {t('admin.lessonsPage.newLesson')}
        </Link>
      </div>

      <CourseFormModal
        open={courseFormOpen}
        course={null}
        onClose={() => setCourseFormOpen(false)}
        onSaved={(course) => {
          setCourseFormOpen(false);
          if (course?._id) navigate(`/admin/courses/${course._id}`);
          else load();
        }}
      />

      <section className="rounded-3xl border border-[#C5B0CD]/50 bg-[#415E72] p-6 text-white shadow-lg flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5B0CD]/30 bg-[#C5B0CD]/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#F6F5F2]">
            <Sparkles className="h-3.5 w-3.5 text-[#C5B0CD]" />
            {t('admin.shell.systemOnline')}
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{greeting}</h2>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#F6F5F2]/80">
            {isAr
              ? 'إليك ملخص أداء المنصة خلال الفترة المحددة. يمكنك إدارة الطلاب والمحتوى ومتابعة كل نشاط من مكان واحد.'
              : 'Here is how the platform is performing in the selected period. Manage students, content and activity from one place.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:shrink-0">
          <div className="rounded-2xl border border-[#C5B0CD]/30 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#F6F5F2]/70">
              {t('admin.overview.activeStudents')}
            </p>
            <p className="mt-1 font-display text-xl font-bold text-white">{formatNumber(metrics.activeStudents, i18n.language)}</p>
          </div>
          <div className="rounded-2xl border border-[#C5B0CD]/30 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#F6F5F2]/70">
              {t('admin.overview.completionRate')}
            </p>
            <p className="mt-1 font-display text-xl font-bold text-white">{formatPercent(metrics.completionRate, i18n.language)}</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-[#C5B0CD]/30 bg-white/10 px-4 py-3 sm:col-span-1 backdrop-blur-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#F6F5F2]/70">
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
          className="bg-white border border-[#C5B0CD]/40 rounded-2xl p-6 shadow-sm"
          actions={
            <span className="text-xs font-bold text-[#415E72]/70">
              {t('admin.overview.generated')}: {formatDateTime(data?.generatedAt, i18n.language)}
            </span>
          }
        >
          <ActivityBars data={activity} language={i18n.language} height={170} />
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#415E72]/80"><span className="h-2.5 w-2.5 rounded-full bg-[#415E72]" />{t('admin.overview.courseStarts')}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#415E72]/80"><span className="h-2.5 w-2.5 rounded-full bg-[#C5B0CD]" />{t('admin.overview.completions')}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#415E72]/80"><span className="h-2.5 w-2.5 rounded-full bg-[#C5B0CD]" />{t('admin.overview.quizAttempts')}</span>
          </div>
        </Panel>

        <Panel title={t('admin.overview.platformHealth')} className="bg-white border border-[#C5B0CD]/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <Donut value={metrics.completionRate || 0} label={formatPercent(metrics.completionRate, i18n.language)} sublabel={t('admin.overview.completionRate')} tone="#415E72" />
            <div className="min-w-0 flex-1 space-y-3">
              {healthItems.map((item) => (
                <Link key={item.key} to={item.to} className="flex items-center justify-between gap-2 rounded-xl bg-[#F6F5F2] px-3 py-2 transition-colors hover:bg-[#F6F5F2] border border-[#C5B0CD]/30">
                  <span className="text-xs font-semibold text-[#415E72]">{t(`admin.overview.health${item.key.charAt(0).toUpperCase()}${item.key.slice(1)}`)}</span>
                  <Badge tone={item.value ? 'amber' : 'green'} className="bg-white text-[#415E72] border border-[#C5B0CD]">{formatNumber(item.value, i18n.language)}</Badge>
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
          className="bg-white border border-[#C5B0CD]/40 rounded-2xl p-6 shadow-sm"
          actions={<CalendarDays className="h-4 w-4 text-[#C5B0CD]" />}
        >
          <LineChart
            data={registrationSeries}
            series={[{ key: 'count', label: t('admin.overview.registrations'), color: '#415E72' }]}
            language={i18n.language}
            height={200}
          />
        </Panel>

        <Panel title={t('admin.overview.topCourses')} noPadding className="bg-white border border-[#C5B0CD]/40 rounded-2xl shadow-sm overflow-hidden">
          {topCourses.length === 0 ? (
            <EmptyState title={t('admin.overview.noTopCourses')} icon={Trophy} />
          ) : (
            <div className="admin-scroll overflow-x-auto">
              <table className="admin-table w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#C5B0CD]/30 bg-[#F6F5F2]/50 text-xs text-[#415E72]">
                    <th className="p-3.5">{t('admin.courses.courseTitle')}</th>
                    <th className="p-3.5">{t('admin.analytics.starts')}</th>
                    <th className="p-3.5">{t('admin.analytics.completionsShort')}</th>
                    <th className="p-3.5">{t('admin.analytics.quizAttemptsShort')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C5B0CD]/20 text-xs">
                  {topCourses.map((course) => (
                    <tr key={course.courseKey} className="hover:bg-[#F6F5F2]/60 transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-[#415E72]">{localize(course.title, i18n.language) || course.courseKey}</p>
                        <p className="text-[10px] text-[#415E72]/70">{course.courseKey}</p>
                      </td>
                      <td className="p-3.5 font-bold text-[#415E72]">{formatNumber(course.starts, i18n.language)}</td>
                      <td className="p-3.5 font-bold text-[#415E72]">{formatNumber(course.completions, i18n.language)}</td>
                      <td className="p-3.5 font-bold text-[#415E72]">{formatNumber(course.quizAttempts, i18n.language)}</td>
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
          className="bg-white border border-[#C5B0CD]/40 rounded-2xl shadow-sm overflow-hidden"
          actions={<Link to="/admin/students" className="text-xs font-extrabold text-[#415E72] hover:text-[#C5B0CD] transition-colors">{t('admin.common.view')}<ArrowUpRight className="ms-1 inline h-3.5 w-3.5 text-[#C5B0CD]" /></Link>}
          noPadding
        >
          {recentStudents.length === 0 ? (
            <EmptyState title={t('admin.overview.noStudents')} icon={Users} />
          ) : (
            <div className="divide-y divide-[#C5B0CD]/20">
              {recentStudents.map((student) => (
                <Link key={student._id} to={`/admin/students/${student._id}`} className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-[#F6F5F2]/60">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F6F5F2] text-xs font-extrabold text-[#415E72] border border-[#C5B0CD]/50">
                    {initials(student.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-extrabold text-[#415E72]">{student.name}</p>
                    <p className="truncate text-[10px] text-[#415E72]/70" dir="ltr">{student.email}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-[#415E72]/60">{relativeTime(student.createdAt, i18n.language)}</span>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <Panel title={t('admin.overview.recentActivity')} className="bg-white border border-[#C5B0CD]/40 rounded-2xl shadow-sm overflow-hidden" noPadding>
          {recentAudit.length === 0 ? (
            <EmptyState title={t('admin.overview.noAudit')} icon={ShieldAlert} />
          ) : (
            <div className="divide-y divide-[#C5B0CD]/20">
              {recentAudit.map((log) => (
                <div key={log._id} className="px-4 py-3.5 hover:bg-[#F6F5F2]/60 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-extrabold text-[#415E72]">
                      {t(`admin.audit.actions.${log.action}`, { defaultValue: log.action })}
                    </p>
                    <span className="shrink-0 text-[10px] text-[#415E72]/60">{relativeTime(log.createdAt, i18n.language)}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-[#415E72]/70">{log.targetLabel || log.targetType}</p>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title={t('admin.overview.completions')} className="bg-white border border-[#C5B0CD]/40 rounded-2xl p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F5F2] text-[#415E72] border border-[#C5B0CD]/50"><TrendingUp className="h-4 w-4 text-[#C5B0CD]" /></span>
              <div className="flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#415E72]/60">{t('admin.overview.courseStarts')}</p>
                <p className="font-display text-lg font-bold text-[#415E72]">{formatNumber(metrics.courseStarts, i18n.language)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F5F2] text-[#415E72] border border-[#C5B0CD]/50"><Target className="h-4 w-4 text-[#C5B0CD]" /></span>
              <div className="flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#415E72]/60">{t('admin.overview.completions')}</p>
                <p className="font-display text-lg font-bold text-[#415E72]">{formatNumber(metrics.courseCompletions, i18n.language)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F5F2] text-[#415E72] border border-[#C5B0CD]/50"><Layers className="h-4 w-4 text-[#C5B0CD]" /></span>
              <div className="flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#415E72]/60">{t('admin.overview.lessonCompletions')}</p>
                <p className="font-display text-lg font-bold text-[#415E72]">{formatNumber(metrics.lessonCompletions, i18n.language)}</p>
              </div>
            </div>
            <div className="rounded-xl border border-[#C5B0CD]/30 bg-[#F6F5F2] p-3">
              <p className="flex items-center gap-1.5 text-xs font-bold text-[#415E72]/70"><Clock className="h-3.5 w-3.5 text-[#C5B0CD]" />{t('admin.overview.generated')} {formatDateTime(data?.generatedAt, i18n.language)}</p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}