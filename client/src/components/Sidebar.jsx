import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Sparkles } from './icons';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Award, HelpCircle, Bot } from './icons';

export default function Sidebar() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const isAr = i18n.language === 'ar';

  const navLinks = [
    { name: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.myCourses'), path: '/courses', icon: BookOpen },
    { name: t('nav.progress', 'Progress'), path: '/progress', icon: Award },
    { name: t('nav.quizzes', 'Quizzes'), path: '/quizzes', icon: HelpCircle },
    { name: t('nav.aiTutor'), path: '/ai-tutor', icon: Bot },
  ];

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-e border-line bg-surface p-4 text-ink shadow-sm dark:border-line dark:bg-surface-2 md:flex">
      <div className="space-y-6">
        <div className="rounded-2xl border border-line bg-gradient-to-br from-highlight to-surface-2 p-4 dark:border-line dark:from-primary dark:to-surface-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink-soft dark:text-lavender">
            {isAr ? 'مساحة التعلّم' : 'Learning space'}
          </p>
          <p className="mt-1 font-display text-lg font-semibold leading-tight text-ink dark:text-on-dark">
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
                  `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 active:scale-[0.99] ${
                    isActive
                      ? 'bg-highlight text-ink-soft shadow-sm before:absolute before:inset-y-2 before:start-0 before:w-1 before:rounded-full before:bg-primary dark:bg-accent dark:text-on-primary dark:before:bg-lavender'
                      : 'text-ink-soft hover:bg-surface-2 hover:text-ink dark:text-lavender dark:hover:bg-highlight dark:hover:text-on-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? 'text-primary dark:text-lavender' : 'text-ink-soft dark:text-lavender'
                      }`}
                    />
                    <span>{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {user?.role === 'admin' && (
        <Link
          to="/admin"
          className="mt-2 flex items-center gap-3 rounded-xl border border-line bg-surface-2 px-3.5 py-2.5 text-xs font-bold text-ink transition-all duration-200 hover:border-line-strong hover:bg-highlight hover:text-ink active:scale-[0.99] dark:border-line dark:bg-surface-2 dark:text-lavender dark:hover:bg-primary dark:hover:text-on-primary"
        >
          <ShieldCheck className="h-4 w-4 text-ink-soft dark:text-lavender" />
          <span>{isAr ? 'لوحة الإدارة' : 'Admin panel'}</span>
        </Link>
      )}

      <div className="rounded-2xl border border-line bg-surface-2 p-4 shadow-sm dark:border-line dark:bg-surface-2">
        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-ink-soft dark:text-muted">
          <span>{isAr ? 'الإنجاز الكلي' : 'Overall progress'}</span>
          <Sparkles className="h-3.5 w-3.5 text-lavender" />
        </div>
        <p className="mt-2 font-display text-2xl font-semibold text-ink dark:text-on-dark">0%</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-highlight dark:bg-surface">
          <div className="h-full w-0 rounded-full bg-primary transition-all duration-700 dark:bg-accent" />
        </div>
      </div>
    </aside>
  );
}
