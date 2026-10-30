/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ضروري باش يخدم Dark Mode بالـ class
  theme: {
    extend: {
      colors: {
        lightBg: '#FCFAF6',
        lightSection: '#F5F0E7',
        lightMain: '#24483F',
        lightBorder: '#E7DFD1',

        darkBg: '#191F1B',
        darkCard: '#242D26',
        darkAccent: '#789B83',
        darkBorder: '#343C33',
      },
    },
  },
  plugins: [],
}