import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  HelpCircle, 
  Bot, 
  Settings, 
  LogOut,
  ShieldCheck 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const isAr = i18n.language === 'ar';

  const handleLogout = () => {
    if (logout) {
      logout(); // مسح الـ State والـ LocalStorage بالكامل
    } else {
      localStorage.clear();
    }
    navigate('/', { replace: true }); // التوجيه المباشر إلى الصفحة الرئيسية Landing Page
  };

  const navLinks = [
    { 
      name: isAr ? 'لوحة التحكم' : 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: isAr ? 'مساقاتي' : 'My Courses', 
      path: '/courses', 
      icon: BookOpen 
    },
    { 
      name: isAr ? 'تقدمي' : 'My Progress', 
      path: '/progress', 
      icon: Award 
    },
    { 
      name: isAr ? 'الاختبارات' : 'Quizzes', 
      path: '/quizzes', 
      icon: HelpCircle 
    },
    { 
      name: isAr ? 'المساعد الذكي' : 'AI Tutor', 
      path: '/ai-tutor', 
      icon: Bot 
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#2B1832] border-e border-[#ECE1F2] dark:border-[#493B58] min-h-[calc(100vh-4rem)] p-4 hidden md:flex flex-col justify-between transition-colors duration-300">
      
      {/* Upper Navigation Links */}
      <div className="space-y-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all ${
                isActive
                  ? 'bg-[#49305D] text-white shadow-sm'
                  : 'text-[#796882] dark:text-[#C4B8CC] hover:bg-[#F6F0FA] dark:hover:bg-[#35213D] hover:text-[#49305D] dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}

        {/* زر لوحة الأدمن يظهر فقط إذا كان المستخدم هو المدير (Noura) */}
        {user && user.role === 'admin' && (
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold transition-all ${
              location.pathname === '/admin'
                ? 'bg-[#8A6BBE] text-white shadow-sm'
                : 'text-[#8A6BBE] bg-[#8A6BBE]/10 hover:bg-[#8A6BBE]/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? 'لوحة الأدمن' : 'Admin Panel'}</span>
          </Link>
        )}
      </div>

      {/* Bottom Settings & Logout */}
      <div className="pt-4 border-t border-[#ECE1F2] dark:border-[#493B58] space-y-2">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold text-[#796882] dark:text-[#C4B8CC] hover:bg-[#F6F0FA] dark:hover:bg-[#35213D] hover:text-[#49305D] dark:hover:text-white transition-all"
        >
          <Settings className="w-4 h-4" />
          <span>{isAr ? 'الإعدادات' : 'Settings'}</span>
        </Link>

        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-extrabold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
        </button>
      </div>

    </aside>
  );
}