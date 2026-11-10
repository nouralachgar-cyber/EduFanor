import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  ArrowLeft,
  Ban,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  GraduationCap,
  Mail,
  ShieldCheck,
  Target,
  Trophy,
} from '../../components/icons';
import { adminApi, formatDate, formatDateTime, formatNumber, formatPercent, initials, localize, relativeTime } from '../../lib/admin';
import { Badge, ConfirmDialog, EmptyState, ErrorState, LoadingState, Panel, StatCard } from '../../components/admin/ui';
import Toast from '../../components/Toast';

const eventIcons = {
  course_start: BookOpen,
  course_complete: GraduationCap,
  lesson_complete: CheckCircle2,
  quiz_attempt: ClipboardCheck,
};

const eventLabels = {
  course_start: 'admin.activity.courseStart',
  course_complete: 'admin.activity.courseComplete',
  lesson_complete: 'admin.activity.lessonComplete',
  quiz_attempt: 'admin.activity.quizAttempt',
};

export default function AdminStudentDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const load = () => {
    setLoading(true);
    setError('');
    adminApi
      .student(id)
      .then(setData)
      .catch((err) => setError(err.status === 404 ? t('admin.students.notFound') : err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const courseBySlug = useMemo(() => {
    const map = new Map();
    (data?.courses || []).forEach((course) => map.set(course.slug, course));
    return map;
  }, [data]);

  if (loading && !data) {
    return (
      <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C]">
        <LoadingState label={t('admin.common.loading')} />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C]">
        <ErrorState title={t('admin.errors.loadStudent')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />
      </div>
    );
  }

  const student = data.student;
  const progress = data.progress;
  const events = data.events || [];
  const courses = data.courses || [];
  const completedLessons = progress?.completedLessons || [];
  const attempts = progress?.quizAttempts || [];
  const best = attempts.length ? Math.max(...attempts.map((attempt) => Number(attempt.score) || 0)) : null;
  const suspended = student.status === 'suspended';

  const updateStatus = async () => {
    setBusy(true);
    try {
      const nextStatus = suspended ? 'active' : 'suspended';
      const result = await adminApi.updateStudentStatus(student._id, nextStatus);
      setData((previous) => ({ ...previous, student: { ...previous.student, ...result.student } }));
      setToast({ type: 'success', message: t('admin.students.statusUpdated') });
      setConfirm(false);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setBusy(false);
    }
  };

  const eventCourse = (event) => {
    if (event.lesson?.course) return localize(event.lesson.course.title, i18n.language);
    const course = courseBySlug.get(event.courseKey);
    return course ? localize(course.title, i18n.language) : event.courseKey || '';
  };

  return (
    <div className="space-y-6 bg-[#F5F5F5] min-h-screen p-6 text-[#4B164C]">
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/students')}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#4B164C]/70 transition-colors hover:text-[#4B164C]"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180 text-[#DD88CF]" /> {t('admin.students.title')}
        </button>

        <div className="rounded-3xl border border-[#DD88CF]/40 bg-white p-6 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#4B164C] text-lg font-extrabold text-[#F8E7F6] shadow-sm">
              {initials(student.name)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight text-[#4B164C] sm:text-2xl">{student.name}</h1>
                <Badge tone={suspended ? 'red' : 'green'} className={suspended ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}>
                  {suspended ? t('admin.common.suspended') : t('admin.common.active')}
                </Badge>
              </div>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#4B164C]/70" dir="ltr">
                <Mail className="h-3.5 w-3.5 shrink-0 text-[#DD88CF]" /> {student.email}
              </p>
              <p className="mt-1 text-[10px] font-semibold text-[#4B164C]/60">
                {t('admin.students.memberSince')} {formatDate(student.createdAt, i18n.language)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/admin/students" className="rounded-xl border border-[#DD88CF] bg-[#F8E7F6] px-4 py-2 text-xs font-bold text-[#4B164C] hover:bg-[#DD88CF]/30 transition-colors shadow-sm">
              {t('admin.common.back')}
            </Link>
            <button
              type="button"
              onClick={() => setConfirm(true)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-4 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-sm ${
                suspended ? 'bg-[#4B164C]' : 'bg-red-600'
              }`}
            >
              {suspended ? <ShieldCheck className="h-4 w-4 text-[#DD88CF]" /> : <Ban className="h-4 w-4" />}
              {suspended ? t('admin.students.activate') : t('admin.students.suspend')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label={t('admin.students.lessonsDone')} value={formatNumber(completedLessons.length, i18n.language)} tone="sage" />
        <StatCard icon={ClipboardCheck} label={t('admin.students.quizzesTaken')} value={formatNumber(attempts.length, i18n.language)} tone="surface" />
        <StatCard icon={Trophy} label={t('admin.students.bestScore')} value={formatPercent(best, i18n.language)} tone="amber" />
        <StatCard icon={Clock} label={t('admin.students.lastActive')} value={student.lastLoginAt ? relativeTime(student.lastLoginAt, i18n.language) : t('admin.students.neverActive')} tone="sage" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <Panel title={t('admin.students.learningProgress')} className="bg-white border border-[#DD88CF]/40 rounded-2xl shadow-sm overflow-hidden" noPadding>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#DD88CF]/30 bg-[#F5F5F5] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#4B164C]/60">{t('admin.students.coursesStarted')}</p>
              <p className="mt-1 font-display text-xl font-bold text-[#4B164C]">{formatNumber(courses.length, i18n.language)}</p>
            </div>
            <div className="rounded-2xl border border-[#DD88CF]/30 bg-[#F5F5F5] p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#4B164C]/60">{t('admin.students.coursesCompleted')}</p>
              <p className="mt-1 font-display text-xl font-bold text-[#4B164C]">
                {formatNumber(events.filter((event) => event.type === 'course_complete').length, i18n.language)}
              </p>
            </div>
          </div>

          <div className="border-t border-[#DD88CF]/30 p-5">
            <p className="mb-3 text-xs font-extrabold text-[#4B164C]">{t('admin.students.completedLessons')}</p>
            {completedLessons.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[#DD88CF] px-4 py-6 text-center text-xs font-semibold text-[#4B164C]/70 bg-[#F5F5F5]">
                {t('admin.common.noResults')}
              </p>
            ) : (
              <div className="admin-scroll max-h-64 space-y-2 overflow-y-auto">
                {completedLessons.map((lesson) => (
                  <div key={lesson._id} className="flex items-center gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] px-3.5 py-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[#4B164C]">{localize(lesson.title, i18n.language)}</p>
                      <p className="truncate text-[10px] text-[#4B164C]/70">{localize(lesson.course?.title, i18n.language)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        <Panel title={t('admin.students.account')} className="bg-white border border-[#DD88CF]/40 rounded-2xl p-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] px-4 py-3">
              <span className="text-xs font-semibold text-[#4B164C]/70">{t('admin.common.status')}</span>
              <Badge tone={suspended ? 'red' : 'green'} className={suspended ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}>
                {suspended ? t('admin.common.suspended') : t('admin.common.active')}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] px-4 py-3">
              <span className="text-xs font-semibold text-[#4B164C]/70">{t('admin.students.joined')}</span>
              <span className="text-xs font-bold text-[#4B164C]">{formatDate(student.createdAt, i18n.language)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] px-4 py-3">
              <span className="text-xs font-semibold text-[#4B164C]/70">{t('admin.students.lastActive')}</span>
              <span className="text-xs font-bold text-[#4B164C]">{progress?.lastActive ? formatDateTime(progress.lastActive, i18n.language) : student.lastLoginAt ? formatDateTime(student.lastLoginAt, i18n.language) : t('admin.common.notAvailable')}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#DD88CF]/30 bg-[#F5F5F5] px-4 py-3">
              <span className="text-xs font-semibold text-[#4B164C]/70">{t('admin.students.bestScore')}</span>
              <span className="text-xs font-extrabold text-[#4B164C]">{formatPercent(best, i18n.language)}</span>
            </div>
            <div className="rounded-2xl border border-[#DD88CF]/30 bg-[#F5F5F5] p-4">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-wider text-[#4B164C]/60">{t('admin.students.courses')}</p>
              {courses.length === 0 ? (
                <p className="text-xs font-semibold text-[#4B164C]/70">{t('admin.students.noCourses')}</p>
              ) : (
                <div className="space-y-2">
                  {courses.map((course) => (
                    <Link key={course.slug} to={`/admin/courses/${course._id}`} className="flex items-center gap-3 rounded-xl border border-[#DD88CF]/30 bg-white px-3.5 py-2.5 transition-colors hover:border-[#4B164C]">
                      <BookOpen className="h-4 w-4 shrink-0 text-[#DD88CF]" />
                      <span className="min-w-0 flex-1 truncate text-xs font-bold text-[#4B164C]">{localize(course.title, i18n.language)}</span>
                      <span className="text-[10px] font-semibold text-[#4B164C]/60">{course.estimatedMinutes} {t('admin.common.minutes')}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <Panel title={t('admin.students.quizAttempts')} noPadding className="bg-white border border-[#DD88CF]/40 rounded-2xl shadow-sm overflow-hidden">
          {attempts.length === 0 ? (
            <EmptyState title={t('admin.common.noResults')} icon={Target} />
          ) : (
            <div className="admin-scroll overflow-x-auto">
              <table className="admin-table w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#DD88CF]/30 bg-[#F8E7F6]/50 text-xs text-[#4B164C]">
                    <th className="p-3.5">{t('admin.activity.lesson')}</th>
                    <th className="p-3.5">{t('admin.common.score')}</th>
                    <th className="p-3.5">{t('admin.common.status')}</th>
                    <th className="p-3.5">{t('admin.activity.time')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DD88CF]/20 text-xs">
                  {attempts.slice().reverse().map((attempt, index) => (
                    <tr key={attempt._id || index} className="hover:bg-[#F5F5F5]/60 transition-colors">
                      <td className="p-3.5">
                        <p className="text-xs font-bold text-[#4B164C]">{localize(attempt.lesson?.title, i18n.language) || t('admin.common.notAvailable')}</p>
                        <p className="text-[10px] text-[#4B164C]/70">{localize(attempt.lesson?.course?.title, i18n.language)}</p>
                      </td>
                      <td className="p-3.5 font-extrabold text-[#4B164C]">{formatPercent(attempt.score, i18n.language)}</td>
                      <td className="p-3.5">
                        <Badge tone={attempt.passed ? 'green' : 'amber'} className={attempt.passed ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}>
                          {attempt.passed ? t('admin.common.yes') : t('admin.common.no')}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-xs text-[#4B164C]/70">{formatDateTime(attempt.attemptedAt, i18n.language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title={t('admin.students.recentEvents')} noPadding className="bg-white border border-[#DD88CF]/40 rounded-2xl shadow-sm overflow-hidden">
          {events.length === 0 ? (
            <EmptyState title={t('admin.students.noEvents')} icon={Activity} />
          ) : (
            <div className="admin-scroll max-h-[26rem] divide-y divide-[#DD88CF]/20 overflow-y-auto">
              {events.map((event) => {
                const Icon = eventIcons[event.type] || Activity;
                return (
                  <div key={event._id} className="flex items-start gap-3.5 px-4 py-3.5 hover:bg-[#F5F5F5]/60 transition-colors">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F8E7F6] text-[#4B164C] border border-[#DD88CF]/50">
                      <Icon className="h-4 w-4 text-[#DD88CF]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-[#4B164C]">{t(eventLabels[event.type] || 'admin.activity.event')}</p>
                      <p className="truncate text-[10px] text-[#4B164C]/70">
                        {event.lesson ? localize(event.lesson.title, i18n.language) : eventCourse(event) || t('admin.common.notAvailable')}
                      </p>
                    </div>
                    <div className="shrink-0 text-end">
                      {event.percent !== undefined && event.percent !== null && (
                        <p className="text-xs font-extrabold text-[#4B164C]">{formatPercent(event.percent, i18n.language)}</p>
                      )}
                      <p className="text-[10px] text-[#4B164C]/60">{relativeTime(event.occurredAt, i18n.language)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={updateStatus}
        title={suspended ? t('admin.students.activate') : t('admin.students.suspend')}
        message={suspended ? t('admin.students.activateConfirm') : t('admin.students.suspendConfirm')}
        confirmLabel={suspended ? t('admin.students.activate') : t('admin.students.suspend')}
        cancelLabel={t('admin.common.cancel')}
        busy={busy}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}