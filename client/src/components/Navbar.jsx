import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Globe, 
  Sun, 
  Moon, 
  Bell, 
  ChevronDown, 
  User, 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  HelpCircle, 
  Bot 
} from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  const isAr = i18n.language === 'ar';

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const currentLang = i18n.language || 'ar';
    const isArabic = currentLang === 'ar';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    localStorage.setItem('i18nextLng', currentLang);
  }, [i18n.language]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const toggleLang = () => {
    const nextLang = isAr ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    navigate('/');
  };

  const navLinks = [
    { name: t('nav.dashboard', { defaultValue: isAr ? 'لوحة التحكم' : 'Dashboard' }), path: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.myCourses', { defaultValue: isAr ? 'مساقاتي' : 'My Courses' }), path: '/courses', icon: BookOpen },
    { name: t('nav.myProgress', { defaultValue: isAr ? 'تقدمي' : 'My Progress' }), path: '/progress', icon: Award },
    { name: t('nav.quizzes', { defaultValue: isAr ? 'الاختبارات' : 'Quizzes' }), path: '/quizzes', icon: HelpCircle },
    { name: t('nav.aiTutor', { defaultValue: isAr ? 'المساعد الذكي' : 'AI Tutor' }), path: '/ai-tutor', icon: Bot },
  ];

  return (
    <header className="bg-[#49305D] text-white sticky top-0 z-50 shadow-md h-16 flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          {/* خلفية بيضاء خفيفة خلف اللوجو لكي يبرز بوضوح فائق */}
          <div className="bg-white/95 px-2 py-1 rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105">
            <img
              src="/edufanor.png"
              alt="EduFanor Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all ${
                  isActive ? 'bg-white/20 text-white font-bold shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleLang}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition-all cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#E9B9C8]" />
          <span>{isAr ? 'English' : 'عربي'}</span>
        </button>

        <button
          onClick={toggleTheme}
          type="button"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#E9B9C8]" />}
        </button>

        <button type="button" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#E9B9C8] rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen(prev => !prev)}
            type="button"
            className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-all cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-[#E9B9C8] object-cover"
            />
            <ChevronDown className="w-3.5 h-3.5 text-white/70" />
          </button>

          {profileOpen && (
            <div className={`absolute top-full mt-2 ${isAr ? 'left-0' : 'right-0'} w-48 bg-white dark:bg-[#2B2037] text-[#1F142E] dark:text-[#F8F4FC] rounded-2xl shadow-xl p-2 border border-[#EDE6F5] dark:border-[#493B58] text-xs space-y-1 z-50`}>
              <div className="px-3 py-2 font-bold border-b border-gray-100 dark:border-gray-700">
                نورة
              </div>
              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold hover:bg-[#F4EFFB] dark:hover:bg-[#3B2B4C]"
              >
                <User className="w-4 h-4 text-[#8A6BBE]" />
                <span>{t('nav.profile', { defaultValue: isAr ? 'الملف الشخصي' : 'Profile' })}</span>
              </Link>
              <button
                onClick={handleLogout}
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.logout', { defaultValue: isAr ? 'تسجيل الخروج' : 'Logout' })}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}