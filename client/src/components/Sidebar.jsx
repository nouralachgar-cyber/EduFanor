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
} from './icons';
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
    <aside className="hidden w-64 shrink-0 flex-col justify-between bg-[#17313E] p-4 text-[#F6F5F2] md:flex">
      <div className="space-y-6">
        <div className="px-3 pt-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-white/70">
            {isAr ? 'مساحة التعلّم' : 'Learning space'}
          </p>
          <p className="mt-1 font-display text-lg font-semibold leading-tight text-white">
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
                      ? 'bg-[#C5B0CD] text-[#17313E] shadow-sm'
                      : 'text-[#F6F5F2]/75 hover:bg-white/10 hover:text-[#F6F5F2]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-[#17313E]' : 'text-[#C5B0CD]/80'}`} />
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
                  ? 'bg-[#C5B0CD] text-[#17313E]'
                  : 'bg-white/[0.06] text-[#F6F5F2]/75 hover:bg-white/[0.12] hover:text-[#F6F5F2]'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isAr ? 'لوحة الإدارة' : 'Admin panel'}</span>
            </Link>
          )}
        </nav>

        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#F6F5F2]/70">
            <span>{isAr ? 'الإنجاز الكلي' : 'Overall progress'}</span>
            <Sparkles className="h-3.5 w-3.5 text-amber" />
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-[#F6F5F2]">{percent}%</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-[#C5B0CD] transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] font-semibold text-[#F6F5F2]/65">
            {isAr
              ? `${completed} من ${courseList.length} مساقات مكتملة`
              : `${completed} of ${courseList.length} courses completed`}
          </p>
        </div>
      </div>

      <div className="space-y-1 border-t border-line pt-4">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#F6F5F2]/75 transition-colors hover:bg-white/10 hover:text-[#F6F5F2]"
        >
          <Settings className="h-4 w-4 text-[#C5B0CD]" />
          <span>{t('nav.settings')}</span>
        </NavLink>

        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#C5B0CD] transition-colors hover:bg-[#C5B0CD]/15"
        >
          <LogOut className="h-4 w-4" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}
