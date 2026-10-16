/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#810B38',
          dark: '#67082D',
          soft: '#A31B4D',
        },
        cream: {
          DEFAULT: '#F5F0E8',
        },
        beige: {
          DEFAULT: '#F1E2D1',
        },
        navy: {
          DEFAULT: '#102A43',
        },
        teal: {
          DEFAULT: '#B9F3E4',
        },
      },
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
