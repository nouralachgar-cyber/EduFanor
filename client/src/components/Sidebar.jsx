import React, { useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  HelpCircle,
  Bot,
  Settings,
  LogOut,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { isCourseCompleted } from '../lib/progress';

export default function Sidebar() {
  const { t, i18n } = useTranslation();
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';

  const { courses } = useCatalog();
  const courseList = Array.isArray(courses) ? courses : [];
  const completed = courseList.filter((course) => isCourseCompleted(course.id)).length;
  const percent = courseList.length ? Math.round((completed / courseList.length) * 100) : 0;

  const handleLogout = () => {
    if (logout) logout();
    navigate('/', { replace: true });
  };

  const navLinks = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.myCourses'), path: '/courses', icon: BookOpen },
    { name: t('nav.progress', 'Progress'), path: '/progress', icon: Award },
    { name: t('nav.quizzes', 'Quizzes'), path: '/quizzes', icon: HelpCircle },
    { name: t('nav.aiTutor'), path: '/ai-tutor', icon: Bot },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-e border-line bg-card/70 p-4 md:flex md:flex-col md:justify-between">
      <div className="space-y-6">
        <div className="px-3 pt-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink-muted">
            {isAr ? 'مساحة التعلّم' : 'Learning space'}
          </p>
          <p className="mt-1 font-display text-lg font-semibold leading-tight text-ink">
            {isAr ? 'رحلتك الإسعافية' : 'Your first-aid path'}
          </p>
        </div>

        <nav aria-label={t('nav.studentNavigation', 'Student navigation')} className="space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-amber-soft' : 'text-teal-deep'}`} />
                    <span>{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`mt-2 flex items-center gap-3 rounded-xl border border-amber/30 px-3.5 py-2.5 text-xs font-bold transition-all ${
                location.pathname === '/admin'
                  ? 'bg-amber text-primary'
                  : 'bg-amber/10 text-ink hover:bg-amber/20'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isAr ? 'لوحة الإدارة' : 'Admin panel'}</span>
            </Link>
          )}
        </nav>

        <div className="rounded-2xl border border-line bg-surface-muted p-4">
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-ink-muted">
            <span>{isAr ? 'الإنجاز الكلي' : 'Overall progress'}</span>
            <Sparkles className="h-3.5 w-3.5 text-amber" />
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">{percent}%</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-sage transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] font-semibold text-ink-muted">
            {isAr
              ? `${completed} من ${courseList.length} مساقات مكتملة`
              : `${completed} of ${courseList.length} courses completed`}
          </p>
        </div>
      </div>

      <div className="space-y-1 border-t border-line pt-4">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <Settings className="h-4 w-4 text-teal-deep" />
          <span>{t('nav.settings')}</span>
        </NavLink>

        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-danger transition-colors hover:bg-danger-soft"
        >
          <LogOut className="h-4 w-4" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
