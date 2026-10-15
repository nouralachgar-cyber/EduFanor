import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        courses: "الدورات",
        aiTutor: "المساعد الذكي",
        login: "تسجيل الدخول",
        getStarted: "ابدأ الآن",
        dashboard: "لوحة التحكم"
      },
      hero: {
        badge: "منصة الإسعافات الأولية الأكاديمية الأولى",
        titleMain: "تعلم كيف تنقذ حياة",
        titleSub: "بأسلوب أكاديمي تفاعلي",
        description: "منصة EduFanor تقدم دورات موثوقة في الإسعافات الأولية، اختبارات تفاعلية، ومساعد ذكاء اصطناعي لدعمك في حالات الطوارئ والتعلم.",
        btnExplore: "استكشف المساقات"
      },
      features: {
        f1Title: "دروس أكاديمية",
        f1Desc: "شروحات خطوة بخطوة مع تدابير السلامة الطبية المعتمدة.",
        f2Title: "اختبارات تفاعلية",
        f2Desc: "تقييم شامل لفهمك وتأكيد اكتسابك للمهارات الإسعافية.",
        f3Title: "مساعد ذكي",
        f3Desc: "استجابة فورية واستفسارات مدعومة بالذكاء الاصطناعي مع Grok."
      },
      dashboard: {
        welcome: "مرحباً بك",
        subtitle: "إليك ملخص تقدمك الأكاديمي في دورات الإسعافات الأولية.",
        coursesEnrolled: "الدورات المسجلة",
        completedLessons: "الدروس المكتملة",
        quizAverage: "معدل الاختبارات",
        myCoursesTitle: "مساقاتي الحالية",
        myCoursesDesc: "ستظهر هنا الدورات التي ستتم إضافتها قريباً ومتابعة نسب إنجازك.",
        overview: "نظرة عامة",
        coursesTab: "مساقاتي",
        settingsTab: "إعدادات الحساب",
        logout: "تسجيل الخروج"
      }
    }
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        courses: "Courses",
        aiTutor: "AI Tutor",
        login: "Login",
        getStarted: "Get Started",
        dashboard: "Dashboard"
      },
      hero: {
        badge: "Premier Academic First Aid Platform",
        titleMain: "Learn How to Save a Life",
        titleSub: "Interactive Academic Approach",
        description: "EduFanor offers verified first aid courses, interactive quizzes, and an AI learning assistant to support you during emergencies and study.",
        btnExplore: "Explore Courses"
      },
      features: {
        f1Title: "Academic Lessons",
        f1Desc: "Step-by-step explanations with approved medical safety measures.",
        f2Title: "Interactive Quizzes",
        f2Desc: "Comprehensive assessment of your understanding and emergency skills.",
        f3Title: "AI Tutor",
        f3Desc: "Instant response and inquiries powered by Grok AI."
      },
      dashboard: {
        welcome: "Welcome",
        subtitle: "Here is your academic progress summary in first aid courses.",
        coursesEnrolled: "Enrolled Courses",
        completedLessons: "Completed Lessons",
        quizAverage: "Quiz Average",
        myCoursesTitle: "My Current Courses",
        myCoursesDesc: "The courses to be added soon and your progress tracking will appear here.",
        overview: "Overview",
        coursesTab: "My Courses",
        settingsTab: "Account Settings",
        logout: "Logout"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;