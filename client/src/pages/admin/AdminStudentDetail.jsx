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
} from 'lucide-react';
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

  if (loading && !data) return <LoadingState label={t('admin.common.loading')} />;
  if (error && !data) {
    return <ErrorState title={t('admin.errors.loadStudent')} message={error} onRetry={load} retryLabel={t('admin.common.retry')} />;
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
    <div className="space-y-5">
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/students')}
          className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" /> {t('admin.students.title')}
        </button>

        <div className="admin-card admin-rise flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3.5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-extrabold text-white">
              {initials(student.name)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">{student.name}</h1>
                <Badge tone={suspended ? 'red' : 'green'}>
                  {suspended ? t('admin.common.suspended') : t('admin.common.active')}
                </Badge>
              </div>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-ink-muted" dir="ltr">
                <Mail className="h-3 w-3 shrink-0" /> {student.email}
              </p>
              <p className="mt-1 text-[10px] font-semibold text-ink-muted">
                {t('admin.students.memberSince')} {formatDate(student.createdAt, i18n.language)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/admin/students" className="btn-secondary h-9 px-3 text-[10px]">
              {t('admin.common.back')}
            </Link>
            <button
              type="button"
              onClick={() => setConfirm(true)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-[10px] font-bold text-white transition-opacity hover:opacity-90 ${
                suspended ? 'bg-primary' : 'bg-danger'
              }`}
            >
              {suspended ? <ShieldCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
              {suspended ? t('admin.students.activate') : t('admin.students.suspend')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label={t('admin.students.lessonsDone')} value={formatNumber(completedLessons.length, i18n.language)} tone="sage" />
        <StatCard icon={ClipboardCheck} label={t('admin.students.quizzesTaken')} value={formatNumber(attempts.length, i18n.language)} tone="surface" />
        <StatCard icon={Trophy} label={t('admin.students.bestScore')} value={formatPercent(best, i18n.language)} tone="amber" />
        <StatCard icon={Clock} label={t('admin.students.lastActive')} value={student.lastLoginAt ? relativeTime(student.lastLoginAt, i18n.language) : t('admin.students.neverActive')} tone="sage" />
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.25fr_1fr]">
        <Panel title={t('admin.students.learningProgress')} noPadding>
          <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
            <div className="rounded-xl border border-line bg-surface-muted p-3">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">{t('admin.students.coursesStarted')}</p>
              <p className="mt-1 font-display text-xl font-bold text-ink">{formatNumber(courses.length, i18n.language)}</p>
            </div>
            <div className="rounded-xl border border-line bg-surface-muted p-3">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">{t('admin.students.coursesCompleted')}</p>
              <p className="mt-1 font-display text-xl font-bold text-ink">
                {formatNumber(events.filter((event) => event.type === 'course_complete').length, i18n.language)}
              </p>
            </div>
          </div>

          <div className="border-t border-line px-4 py-3 sm:px-5">
            <p className="mb-2 text-xs font-extrabold text-ink">{t('admin.students.completedLessons')}</p>
            {completedLessons.length === 0 ? (
              <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-[11px] font-semibold text-ink-muted">
                {t('admin.common.noResults')}
              </p>
            ) : (
              <div className="admin-scroll max-h-64 space-y-1.5 overflow-y-auto">
                {completedLessons.map((lesson) => (
                  <div key={lesson._id} className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success-ink" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-ink">{localize(lesson.title, i18n.language)}</p>
                      <p className="truncate text-[9px] text-ink-muted">{localize(lesson.course?.title, i18n.language)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        <Panel title={t('admin.students.account')}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <span className="text-[11px] font-semibold text-ink-muted">{t('admin.common.status')}</span>
              <Badge tone={suspended ? 'red' : 'green'}>{suspended ? t('admin.common.suspended') : t('admin.common.active')}</Badge>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <span className="text-[11px] font-semibold text-ink-muted">{t('admin.students.joined')}</span>
              <span className="text-[11px] font-bold text-ink">{formatDate(student.createdAt, i18n.language)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <span className="text-[11px] font-semibold text-ink-muted">{t('admin.students.lastActive')}</span>
              <span className="text-[11px] font-bold text-ink">{progress?.lastActive ? formatDateTime(progress.lastActive, i18n.language) : student.lastLoginAt ? formatDateTime(student.lastLoginAt, i18n.language) : t('admin.common.notAvailable')}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
              <span className="text-[11px] font-semibold text-ink-muted">{t('admin.students.bestScore')}</span>
              <span className="text-[11px] font-extrabold text-ink">{formatPercent(best, i18n.language)}</span>
            </div>
            <div className="rounded-xl border border-line bg-surface-muted p-3">
              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">{t('admin.students.courses')}</p>
              {courses.length === 0 ? (
                <p className="text-[11px] font-semibold text-ink-muted">{t('admin.students.noCourses')}</p>
              ) : (
                <div className="space-y-1.5">
                  {courses.map((course) => (
                    <Link key={course.slug} to={`/admin/courses/${course._id}`} className="flex items-center gap-2 rounded-lg border border-line bg-card px-2.5 py-2 transition-colors hover:border-line-strong">
                      <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary dark:text-brand-ink" />
                      <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-ink">{localize(course.title, i18n.language)}</span>
                      <span className="text-[9px] font-semibold text-ink-muted">{course.estimatedMinutes} {t('admin.common.minutes')}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.15fr_1fr]">
        <Panel title={t('admin.students.quizAttempts')} noPadding>
          {attempts.length === 0 ? (
            <EmptyState title={t('admin.common.noResults')} icon={Target} />
          ) : (
            <div className="admin-scroll overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.activity.lesson')}</th>
                    <th>{t('admin.common.score')}</th>
                    <th>{t('admin.common.status')}</th>
                    <th>{t('admin.activity.time')}</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.slice().reverse().map((attempt, index) => (
                    <tr key={attempt._id || index}>
                      <td>
                        <p className="text-[11px] font-bold text-ink">{localize(attempt.lesson?.title, i18n.language) || t('admin.common.notAvailable')}</p>
                        <p className="text-[9px] text-ink-muted">{localize(attempt.lesson?.course?.title, i18n.language)}</p>
                      </td>
                      <td className="font-extrabold">{formatPercent(attempt.score, i18n.language)}</td>
                      <td>
                        <Badge tone={attempt.passed ? 'green' : 'amber'}>{attempt.passed ? t('admin.common.yes') : t('admin.common.no')}</Badge>
                      </td>
                      <td className="text-[10px] text-ink-muted">{formatDateTime(attempt.attemptedAt, i18n.language)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title={t('admin.students.recentEvents')} noPadding>
          {events.length === 0 ? (
            <EmptyState title={t('admin.students.noEvents')} icon={Activity} />
          ) : (
            <div className="admin-scroll max-h-[26rem] divide-y divide-line overflow-y-auto">
              {events.map((event) => {
                const Icon = eventIcons[event.type] || Activity;
                return (
                  <div key={event._id} className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary dark:text-brand-ink">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-extrabold text-ink">{t(eventLabels[event.type] || 'admin.activity.event')}</p>
                      <p className="truncate text-[10px] text-ink-muted">
                        {event.lesson ? localize(event.lesson.title, i18n.language) : eventCourse(event) || t('admin.common.notAvailable')}
                      </p>
                    </div>
                    <div className="shrink-0 text-end">
                      {event.percent !== undefined && event.percent !== null && (
                        <p className="text-[11px] font-extrabold text-ink">{formatPercent(event.percent, i18n.language)}</p>
                      )}
                      <p className="text-[9px] text-ink-muted">{relativeTime(event.occurredAt, i18n.language)}</p>
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
