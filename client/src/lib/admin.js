import { apiRequest } from './api';

const query = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  const result = search.toString();
  return result ? `?${result}` : '';
};

export const adminApi = {
  overview: (range = 30) => apiRequest(`/admin/overview${query({ range })}`, { auth: true }),
  students: (params) => apiRequest(`/admin/students${query(params)}`, { auth: true }),
  student: (id) => apiRequest(`/admin/students/${id}`, { auth: true }),
  updateStudentStatus: (id, status) =>
    apiRequest(`/admin/students/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
  courses: (params) => apiRequest(`/admin/courses${query(params)}`, { auth: true }),
  course: (id) => apiRequest(`/admin/courses/${id}`, { auth: true }),
  createCourse: (body) => apiRequest('/admin/courses', { method: 'POST', body, auth: true }),
  updateCourse: (id, body) => apiRequest(`/admin/courses/${id}`, { method: 'PATCH', body, auth: true }),
  deleteCourse: (id) => apiRequest(`/admin/courses/${id}`, { method: 'DELETE', auth: true }),
  lessons: (params) => apiRequest(`/admin/lessons${query(params)}`, { auth: true }),
  lesson: (id) => apiRequest(`/admin/lessons/${id}`, { auth: true }),
  createLesson: (body) => apiRequest('/admin/lessons', { method: 'POST', body, auth: true }),
  updateLesson: (id, body) => apiRequest(`/admin/lessons/${id}`, { method: 'PATCH', body, auth: true }),
  deleteLesson: (id) => apiRequest(`/admin/lessons/${id}`, { method: 'DELETE', auth: true }),
  quizzes: (params) => apiRequest(`/admin/quizzes${query(params)}`, { auth: true }),
  quiz: (id) => apiRequest(`/admin/quizzes/${id}`, { auth: true }),
  createQuiz: (body) => apiRequest('/admin/quizzes', { method: 'POST', body, auth: true }),
  updateQuiz: (id, body) => apiRequest(`/admin/quizzes/${id}`, { method: 'PATCH', body, auth: true }),
  deleteQuiz: (id) => apiRequest(`/admin/quizzes/${id}`, { method: 'DELETE', auth: true }),
  analytics: (params) => apiRequest(`/admin/analytics${query(params)}`, { auth: true }),
  activity: (params) => apiRequest(`/admin/activity${query(params)}`, { auth: true }),
  audit: (params) => apiRequest(`/admin/audit${query(params)}`, { auth: true }),
  profile: () => apiRequest('/admin/profile', { auth: true }),
  updateProfile: (body) => apiRequest('/admin/profile', { method: 'PATCH', body, auth: true }),
  updatePassword: (body) => apiRequest('/admin/password', { method: 'PATCH', body, auth: true }),
};

export const localize = (value, language) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[language] || value.en || value.ar || '';
};

export const formatNumber = (value, language) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(Number(value));
};

export const formatPercent = (value, language) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return `${formatNumber(value, language)}%`;
};

export const formatDate = (value, language, options = {}) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    dateStyle: 'medium',
    ...options,
  }).format(date);
};

export const formatDateTime = (value, language) =>
  formatDate(value, language, { dateStyle: 'medium', timeStyle: 'short' });

export const relativeTime = (value, language) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const diff = date.getTime() - Date.now();
  const abs = Math.abs(diff);
  const units = [
    ['year', 31536000000],
    ['month', 2592000000],
    ['day', 86400000],
    ['hour', 3600000],
    ['minute', 60000],
  ];
  const formatter = new Intl.RelativeTimeFormat(language === 'ar' ? 'ar' : 'en', { numeric: 'auto' });
  for (const [unit, ms] of units) {
    if (abs >= ms || unit === 'minute') {
      return formatter.format(Math.round(diff / ms), unit);
    }
  }
  return '—';
};

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'A';

export const emptyBilingual = () => ({ ar: '', en: '' });
