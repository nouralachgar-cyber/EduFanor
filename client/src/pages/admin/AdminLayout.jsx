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
    <div className="min-h-screen bg-[#E3E8F8] text-[#3E588F] flex font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#3E588F]/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 z-50 flex w-72 flex-col border-e border-[#C0C5CD]/40 bg-white shadow-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : isAr ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex h-20 items-center justify-between border-b border-[#C0C5CD]/30 px-6 bg-[#E3E8F8]/50">
          <div className="flex items-center gap-3">
            <img
              src="/edufanor.png"
              alt="EduFanor Logo"
              className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <div>
              <p className="font-display text-sm font-extrabold text-[#3E588F]">EduFanor Admin</p>
              <p className="text-[10px] font-bold text-[#3E588F]/60">Management Console</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setSidebarOpen(false)} 
            className="rounded-xl p-2 text-[#3E588F]/70 hover:bg-[#C0C5CD]/20 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-[#3E588F]/50">
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
                    ? 'bg-[#3E588F] text-[#E3E8F8] shadow-md shadow-[#3E588F]/15' 
                    : 'text-[#3E588F]/80 hover:bg-[#E3E8F8] hover:text-[#3E588F]'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-[#C0C5CD]' : 'text-[#3E588F]/60'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-[#C0C5CD]/30 p-4 bg-[#E3E8F8]/30">
          <div className="flex items-center gap-3 rounded-2xl border border-[#C0C5CD]/40 bg-white p-3.5 shadow-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3E588F] text-xs font-extrabold text-[#E3E8F8]">
              {user?.name?.[0] || 'A'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-extrabold text-[#3E588F]">{user?.name || 'Administrator'}</p>
              <p className="truncate text-[10px] text-[#3E588F]/60" dir="ltr">{user?.email || 'admin@edufanor.com'}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="rounded-xl p-2 text-red-600 hover:bg-red-50 transition-colors"
              title={t('admin.settings.signOut', 'Sign Out')}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#C0C5CD]/40 bg-white/95 px-6 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C0C5CD] bg-[#E3E8F8] text-[#3E588F] lg:hidden shadow-sm"
            >
              <Menu className="h-5 w-5 text-[#C0C5CD]" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C0C5CD]/50 bg-[#E3E8F8] px-3 py-1 text-xs font-extrabold text-[#3E588F]">
                <Sparkles className="h-3.5 w-3.5 text-[#C0C5CD]" />
                EduFanor Control Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => i18n.changeLanguage(isAr ? 'en' : 'ar')}
              className="rounded-xl border border-[#C0C5CD] bg-[#E3E8F8] px-3.5 py-2 text-xs font-extrabold text-[#3E588F] hover:bg-[#C0C5CD]/30 transition-colors shadow-sm"
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