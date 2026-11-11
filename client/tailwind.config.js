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
        plum: '#203562',
        plumDeep: '#203562',
        elegantPink: '#3E588F',
        elegantPinkLight: '#C0C5CD',
        softPink: '#E3E8F8',
        lightGrey: '#C0C5CD',
        lightBg: '#E3E8F8',
        lightSection: '#E3E8F8',
        lightMain: '#203562',
        lightBorder: '#C0C5CD',

        darkBg: '#203562',
        darkCard: '#3E588F',
        darkAccent: '#3E588F',
        darkBorder: '#3E588F',
      },
    },
  },
  plugins: [],
}
