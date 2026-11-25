import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardCheck,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from '../../components/icons';
import { AuthContext } from '../../context/AuthContext';
import EduFanorWordmark from '../../components/EduFanorWordmark';

export default function AdminLayout() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAr = i18n.language === 'ar';

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: t('admin.nav.overview', 'Overview') },
    { to: '/admin/courses', icon: BookOpen, label: t('admin.nav.courses', 'Courses') },
    { to: '/admin/lessons', icon: FileText, label: t('admin.nav.lessons', 'Lessons') },
    { to: '/admin/quizzes', icon: ClipboardCheck, label: t('admin.nav.quizzes', 'Quizzes') },
    { to: '/admin/students', icon: Users, label: t('admin.nav.students', 'Students') },
    { to: '/admin/settings', icon: Settings, label: t('admin.nav.settings', 'Settings') },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-scrim/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 z-50 flex w-72 flex-col border-e border-line bg-surface shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : isAr ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex h-20 items-center justify-between border-b border-[#BFA2DB]/60 px-6 bg-[#F3F1F5]">
          <div className="flex min-w-0 items-center gap-3">
            <EduFanorWordmark className="w-32 text-[#18122B]" />
            <div>
              <p className="font-display text-sm font-extrabold text-[#18122B]">Admin</p>
              <p className="text-[10px] font-bold text-[#443C68]">Management Console</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setSidebarOpen(false)} 
            className="rounded-xl p-2 text-ink-soft hover:bg-highlight lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-muted">
            {t('admin.shell.navigation', 'Navigation')}
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-xs font-extrabold transition-all ${
                  active 
                    ? 'bg-[#BFA2DB]/45 text-[#18122B] font-semibold'
                    : '[&]:not(.dark):text-[#443C68] [&]:not(.dark):hover:bg-[#F3F1F5] [&]:not(.dark):hover:text-[#18122B] [&].dark:text-[#635985] [&].dark:hover:bg-[#F3F1F5] [&].dark:hover:text-[#18122B]'
                }`}
              >
                <Icon className={`h-4 w-4 bg-[#F3F1F5] text-[#635985] rounded px-2 ${active ? 'text-[#18122B]' : ''} dark:text-[#18122B]`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-[#BFA2DB]/60 p-4 bg-[#F3F1F5]">
          <div className="flex items-center gap-3 rounded-2xl border border-[#BFA2DB]/60 bg-[#F3F1F5] p-3.5 shadow-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-extrabold text-on-primary">
              {user?.name?.[0] || 'A'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-extrabold text-[#18122B]">{user?.name || 'Administrator'}</p>
              <p className="truncate text-[10px] [&]:not(.dark):text-[#635985] [&].dark:text-[#635985]" dir="ltr">{user?.email || 'admin@edufanor.com'}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="rounded-xl p-2 border border-[#BFA2DB]/60 bg-[#F3F1F5] [&]:not(.dark):text-[#18122B] [&].dark:text-[#18122B] hover:bg-[#F3F1F5] transition-colors"
              title={t('admin.settings.signOut', 'Sign Out')}
            >
              <LogOut className="h-4 w-4 [&]:not(.dark):text-[#18122B] [&].dark:text-[#18122B]" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-line bg-surface/95 px-6 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-2 text-ink lg:hidden shadow-sm"
            >
              <Menu className="h-5 w-5 text-lavender" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-extrabold text-ink">
                <Sparkles className="h-3.5 w-3.5 text-lavender" />
                EduFanor Control Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
              className="rounded-xl border border-line bg-surface-2 px-3.5 py-2 text-xs font-extrabold text-ink hover:bg-highlight transition-colors shadow-sm"
            >
              {isAr ? 'English' : 'العربية'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
