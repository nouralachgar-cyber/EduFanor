import { apiRequest, getStoredToken } from './api';

const ACTIVITY_KEY = 'edu_activity_dates';
const QUIZ_BEST_KEY = 'edu_quiz_best';
const startedThisSession = new Set();

function syncEvent(payload) {
  if (!getStoredToken()) return;
  apiRequest('/progress/event', { method: 'POST', body: payload, auth: true }).catch(() => {
    /* Offline or expired session: local progress remains authoritative in this browser. */
  });
}

export function isCourseCompleted(courseId) {
  if (!courseId) return false;
  try {
    return localStorage.getItem(`completed_${courseId}`) === 'true';
  } catch {
    return false;
  }
}

function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function recordActivity() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    const dates = new Set(Array.isArray(stored) ? stored : []);
    dates.add(todayKey());
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify([...dates].sort()));
  } catch {
    /* Ignore unavailable storage. */
  }
}

export function recordCourseStart(courseId) {
  if (!courseId || startedThisSession.has(courseId)) return;
  startedThisSession.add(courseId);
  syncEvent({ type: 'course_start', courseKey: courseId });
}

export function markCourseCompleted(courseId) {
  if (!courseId) return;
  try {
    localStorage.setItem(`completed_${courseId}`, 'true');
  } catch {
    /* Ignore unavailable storage. */
  }
  recordActivity();
  syncEvent({ type: 'course_complete', courseKey: courseId, percent: 100 });
}

export function getActivityDates() {
  try {
    const stored = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function getLearningStreak() {
  const dates = new Set(getActivityDates());
  if (dates.size === 0) return 0;

  const cursor = new Date();
  if (!dates.has(todayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dates.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getQuizBest() {
  try {
    const stored = JSON.parse(localStorage.getItem(QUIZ_BEST_KEY) || 'null');
    if (!stored || typeof stored.percent !== 'number') return null;
    return stored;
  } catch {
    return null;
  }
}

export function saveQuizResult(score, total, meta = {}) {
  if (!total) return null;
  const percent = Math.round((score / total) * 100);
  const current = getQuizBest();
  const next = {
    score,
    total,
    percent,
    attemptedAt: new Date().toISOString(),
  };

  if (!current || percent >= current.percent) {
    try {
      localStorage.setItem(QUIZ_BEST_KEY, JSON.stringify(next));
    } catch {
      /* Ignore unavailable storage. */
    }
  }

  recordActivity();
  syncEvent({
    type: 'quiz_attempt',
    courseKey: meta.courseKey,
    lessonId: meta.lessonId,
    score: percent,
    total: 100,
    percent,
  });
  return next;
}

export function getStudentId(email) {
  const source = (email || 'edufanor-student').trim().toLowerCase();
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }
  const year = new Date().getFullYear();
  return `EDU-${year}-${`${hash % 10000}`.padStart(4, '0')}`;
}

export function getCoursePrintedDate() {
  try {
    return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date());
  } catch {
    return String(new Date().getFullYear());
  }
}
