import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        dashboard: "Dashboard",
        myCourses: "My Courses",
        myProgress: "My Progress",
        quizzes: "Quizzes",
        aiTutor: "AI Tutor",
        profile: "Profile",
        logout: "Logout"
      },
      dashboard: {
        welcome: "Welcome back, Sara!",
        subtitle: "Continue your medical first aid learning journey.",
        stats: {
          completed: "Completed Courses",
          certificates: "Certificates Earned",
          hours: "Learning Hours"
        }
      }
    }
  },
  ar: {
    translation: {
      nav: {
        dashboard: "لوحة التحكم",
        myCourses: "مساقاتي",
        myProgress: "تقدمي",
        quizzes: "الاختبارات",
        aiTutor: "المساعد الذكي",
        profile: "الملف الشخصي",
        logout: "تسجيل الخروج"
      },
      dashboard: {
        welcome: "مرحباً بعودتك، سارة!",
        subtitle: "دورة الإسعافات الأولية الشاملة - واصلي تعلمك اليوم.",
        stats: {
          completed: "المساقات المكتملة",
          certificates: "الشهادات المكتسبة",
          hours: "ساعات التعلم"
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;