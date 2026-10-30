import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, BookOpen, Award, HelpCircle, Bot } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const mobileLinks = [
  { key: 'dashboard', path: '/dashboard', icon: LayoutDashboard },
  { key: 'myCourses', path: '/courses', icon: BookOpen },
  { key: 'progress', path: '/progress', icon: Award },
  { key: 'quizzes', path: '/quizzes', icon: HelpCircle },
  { key: 'aiTutor', path: '/ai-tutor', icon: Bot },
];

export default function StudentLayout() {
  const { t } = useTranslation();

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        {t('common.skipToContent', 'Skip to content')}
      </a>

      <Navbar />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        <Sidebar />
        <main id="main-content" className="min-w-0 flex-1 pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>

      <nav
        aria-label={t('nav.studentNavigation', 'Student navigation')}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
      >
        <ul className="mx-auto flex max-w-md items-center justify-between">
          {mobileLinks.map((link) => {
            const Icon = link.icon;
            const label =
              link.key === 'progress'
                ? t('nav.progress', 'Progress')
                : link.key === 'quizzes'
                ? t('nav.quizzes', 'Quizzes')
                : t(`nav.${link.key}`);
            return (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-bold transition-colors ${
                      isActive ? 'text-primary dark:text-brand-ink' : 'text-ink-muted hover:text-ink'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
