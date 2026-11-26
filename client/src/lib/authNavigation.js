export function navigationOnlyClick(event, callbacks = []) {
  event?.stopPropagation?.();
  callbacks.forEach((callback) => callback?.());
}

export function landingDashboardPath(role) {
  return String(role || '').toLowerCase() === 'admin' ? '/admin' : '/dashboard';
}

export function landingDashboardLabel(role, isAr) {
  const admin = String(role || '').toLowerCase() === 'admin';
  if (isAr) return admin ? 'لوحة التحكم' : 'لوحة الطالب';
  return admin ? 'Admin panel' : 'Dashboard';
}

export function landingProfileLabel(isAr) {
  return isAr ? 'ملفي' : 'My profile';
}
