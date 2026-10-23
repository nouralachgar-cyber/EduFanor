/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // تفعيل Dark Mode عبر إضافة كلاس .dark للـ html/body
  theme: {
    extend: {
      colors: {
        // لوحة الألوان البنفسجية والأنيقة الخاصة بالموقع
        plum: {
          DEFAULT: '#49305D',   // Deep Plum الأساسي (مثالي للـ Navbar والروابط)
          dark: '#211526',      // خلفية الصفحة الرئيسية فـ Dark Mode (غامق بحال Navbar)
          card: '#35213D',      // خلفية البطاقات والـ Sections فـ Dark Mode (أفتح شوية)
          sidebar: '#2B1832',   // خلفية القائمة الجانبية فـ Dark Mode
          hover: '#39244A',     // ألوان التمرير (Hover)
        },
        lavender: {
          DEFAULT: '#E9E0F5',   // Light Lavender للبطاقات والـ Accents
          light: '#F5F0FB',     // خلفية Light Mode النظيفة
          dark: '#3B2B4C',      // كروت فاتحة شوية فـ Dark Mode
        },
        softPurple: {
          DEFAULT: '#8A6BBE',   // Soft Purple للأزرار والـ Badges
          hover: '#785AAB',
          light: '#B99AE8',
        },
        pinkAccent: {
          DEFAULT: '#E9B9C8',   // Soft Pink للتفاصيل والأيقونات التجميلية
          hover: '#D8A7B6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Tajawal', 'sans-serif'],
      }
    },
  },
  plugins: [],
}