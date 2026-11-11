import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  RefreshCw,
  Target,
  TrendingUp,
  UserPlus,
  Users,
} from '../../components/icons';
import { adminApi, formatNumber, formatPercent, localize } from '../../lib/admin';
import { ErrorState, LoadingState, PageHeader, Panel, StatCard, EmptyState } from '../../components/admin/ui';
import { DistributionBars, LineChart } from '../../components/admin/charts';

const ranges = [7, 30, 90, 365];

export default function AdminAnalytics() {
  const { t, i18n } = useTranslation();
  const [range, setRange] = useState(30);
  const [course, setCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .courses()
      .then((result) => setCourses(result.courses || []))
      .catch(() => setCourses([]));
  }, []);

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .analytics({ range, course })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [range, course]);

  if (loading && !data) return <LoadingState label={t('admin.common.loading')} />;
  if (error && !data) {
    return <ErrorState title={t('admin.errors.loadAnalytics')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />;
  }

  const summary = data?.summary || {};
  const activity = data?.activity || [];
  const registrations = (data?.registrations || []).map((point) => ({ ...point, date: point.date }));
  const topCourses = data?.topCourses || [];
  const topLessons = data?.topLessons || [];
  const distribution = data?.quizDistribution || [];

  return (
    <div className="space-y-6 bg-[#E3E8F8] min-h-screen p-6 text-[#3E588F]">
      <PageHeader
        eyebrow={t('admin.shell.workspace')}
        title={t('admin.analytics.title')}
        subtitle={t('admin.analytics.subtitle')}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-[#C0C5CD] bg-white p-1 shadow-sm">
              {ranges.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRange(option)}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-extrabold transition-colors ${
                    range === option ? 'bg-[#3E588F] text-[#E3E8F8]' : 'text-[#3E588F]/70 hover:bg-[#E3E8F8] hover:text-[#3E588F]'
                  }`}
                >
                  {t('admin.overview.days', { count: option })}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={load}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C0C5CD] bg-[#E3E8F8] text-[#3E588F] transition-colors hover:bg-[#C0C5CD]/30"
              aria-label={t('admin.common.refresh')}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        }
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <select 
          value={course} 
          onChange={(event) => setCourse(event.target.value)} 
          className="rounded-xl border border-[#C0C5CD] bg-white px-4 py-2 text-xs text-[#3E588F] focus:outline-none focus:ring-2 focus:ring-[#3E588F] sm:w-64 shadow-sm" 
          aria-label={t('admin.analytics.allCourses')}
        >
          <option value="">{t('admin.analytics.allCourses')}</option>
          {courses.map((item) => (
            <option key={item._id} value={item.slug}>{localize(item.title, i18n.language)}</option>
          ))}
        </select>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#3E588F]/70">
          <BarChart3 className="h-3.5 w-3.5 text-[#C0C5CD]" /> {t('admin.analytics.range')}: {t('admin.overview.days', { count: data?.range || range })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={UserPlus} label={t('admin.analytics.registrations')} value={formatNumber(summary.registrations, i18n.language)} tone="sage" />
        <StatCard icon={Users} label={t('admin.analytics.activeStudents')} value={formatNumber(summary.activeStudents, i18n.language)} tone="amber" />
        <StatCard icon={BookOpen} label={t('admin.analytics.courseStarts')} value={formatNumber(summary.courseStarts, i18n.language)} tone="surface" />
        <StatCard icon={GraduationCap} label={t('admin.analytics.completions')} value={formatNumber(summary.courseCompletions, i18n.language)} tone="sage" />
        <StatCard icon={Target} label={t('admin.analytics.lessonCompletions')} value={formatNumber(summary.lessonCompletions, i18n.language)} tone="amber" />
        <StatCard icon={ClipboardCheck} label={t('admin.analytics.averageQuiz')} value={formatPercent(summary.averageQuizScore, i18n.language)} hint={`${formatNumber(summary.quizAttempts, i18n.language)} ${t('admin.analytics.quizAttempts')}`} tone="surface" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={t('admin.analytics.activityTrend')} className="bg-white border border-[#C0C5CD]/40 rounded-2xl p-5 shadow-sm">
          <LineChart
            data={activity}
            series={[
              { key: 'courseStarts', label: t('admin.analytics.starts'), color: '#3E588F' },
              { key: 'courseCompletions', label: t('admin.analytics.completionsShort'), color: '#C0C5CD' },
              { key: 'quizAttempts', label: t('admin.analytics.quizAttemptsShort'), color: '#C0C5CD' },
            ]}
            language={i18n.language}
            height={230}
          />
        </Panel>

        <Panel title={t('admin.analytics.registrationTrend')} className="bg-white border border-[#C0C5CD]/40 rounded-2xl p-5 shadow-sm">
          <LineChart
            data={registrations}
            series={[{ key: 'count', label: t('admin.analytics.registrations'), color: '#3E588F' }]}
            language={i18n.language}
            height={230}
          />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title={t('admin.analytics.topCourses')} noPadding className="bg-white border border-[#C0C5CD]/40 rounded-2xl shadow-sm overflow-hidden">
          {topCourses.length === 0 ? (
            <EmptyState title={t('admin.analytics.noData')} icon={TrendingUp} />
          ) : (
            <div className="admin-scroll overflow-x-auto">
              <table className="admin-table w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#C0C5CD]/30 bg-[#E3E8F8]/50 text-[11px] text-[#3E588F]">
                    <th className="p-3">{t('admin.courses.courseTitle')}</th>
                    <th className="p-3">{t('admin.analytics.starts')}</th>
                    <th className="p-3">{t('admin.analytics.completionsShort')}</th>
                    <th className="p-3">{t('admin.analytics.quizAttemptsShort')}</th>
                    <th className="p-3">{t('admin.analytics.completionRate')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C0C5CD]/20 text-xs">
                  {topCourses.map((item) => (
                    <tr key={item.courseKey} className="hover:bg-[#E3E8F8]/60 transition-colors">
                      <td className="p-3">
                        <p className="font-bold text-[#3E588F]">{localize(item.title, i18n.language) || item.courseKey}</p>
                        <p className="text-[10px] text-[#3E588F]/70">{item.category ? t(`admin.courses.categories.${item.category}`, { defaultValue: item.category }) : item.courseKey}</p>
                      </td>
                      <td className="p-3 font-bold text-[#3E588F]">{formatNumber(item.starts, i18n.language)}</td>
                      <td className="p-3 font-bold text-[#3E588F]">{formatNumber(item.completions, i18n.language)}</td>
                      <td className="p-3 font-bold text-[#3E588F]">{formatNumber(item.quizAttempts, i18n.language)}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[#E3E8F8]">
                            <div className="h-full rounded-full bg-[#3E588F]" style={{ width: `${item.completionRate || 0}%` }} />
                          </div>
                          <span className="text-[10px] font-extrabold text-[#3E588F]">{formatPercent(item.completionRate, i18n.language)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title={t('admin.analytics.scoreDistribution')} className="bg-white border border-[#C0C5CD]/40 rounded-2xl p-5 shadow-sm">
          <DistributionBars data={distribution} language={i18n.language} />
        </Panel>
      </div>

      <Panel title={t('admin.analytics.topLessons')} noPadding className="bg-white border border-[#C0C5CD]/40 rounded-2xl shadow-sm overflow-hidden">
        {topLessons.length === 0 ? (
          <EmptyState title={t('admin.analytics.noTopLessons')} icon={GraduationCap} />
        ) : (
          <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
            {topLessons.map((lesson, index) => (
              <div key={lesson.lessonId} className="flex items-start gap-3 rounded-xl border border-[#C0C5CD]/40 bg-[#E3E8F8] p-3.5 shadow-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E3E8F8] text-[10px] font-extrabold text-[#3E588F] border border-[#C0C5CD]/50">
                  {formatNumber(index + 1, i18n.language)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[11px] font-bold text-[#3E588F]">{localize(lesson.title, i18n.language) || t('admin.common.notAvailable')}</p>
                  <p className="mt-0.5 truncate text-[9px] text-[#3E588F]/70">{localize(lesson.course?.title, i18n.language)}</p>
                  <p className="mt-1 text-[10px] font-extrabold text-[#C0C5CD]">
                    {formatNumber(lesson.completions, i18n.language)} {t('admin.analytics.completionsShort')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}