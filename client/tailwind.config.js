/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        plum: '#17313E',
        plumDeep: '#17313E',
        elegantPink: '#415E72',
        elegantPinkLight: '#C5B0CD',
        softPink: '#F6F5F2',
        lightGrey: '#C5B0CD',
        lightBg: '#F6F5F2',
        lightSection: '#C5B0CD',
        lightMain: '#17313E',
        lightBorder: '#C5B0CD',
        darkBg: '#17313E',
        darkCard: '#415E72',
        darkAccent: '#C5B0CD',
        darkBorder: '#C5B0CD',
        brandPurple: '#415E72',
        brandPurpleLight: 'rgba(65, 94, 114, 0.1)',
        brandPurpleHover: 'rgba(65, 94, 114, 0.15)',
      },
    },
  },
  plugins: [],
}
