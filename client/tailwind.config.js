/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#800020',
          hover: '#600018',
          light: '#a00028',
        },
        cream: {
          DEFAULT: '#F3E6D5',
          light: '#FFF9F2',
        },
        medicalRed: {
          DEFAULT: '#D45060',
          hover: '#bf3d4d',
        }
      },
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'], // خط ممتاز يدعم العربية والإنجليزي بجمالية
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // تفعيل الوضع الليلي عبر الكلاس
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#800020',
          hover: '#600018',
          light: '#a00028',
        },
        cream: {
          DEFAULT: '#F3E6D5',
          light: '#FFF9F2',
          dark: '#1a1214', // لون داكن متناسق مع البورجوندي
          darkCard: '#261b1e',
        },
        medicalRed: {
          DEFAULT: '#D45060',
          hover: '#bf3d4d',
        }
      },
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
      }
    },
  },
  plugins: [],
}