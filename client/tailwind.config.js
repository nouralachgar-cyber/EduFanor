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
        plum: '#4B164C',
        plumDeep: '#3A103B',
        elegantPink: '#DD88CF',
        elegantPinkLight: '#E9A8DE',
        softPink: '#F8E7F6',
        lightGrey: '#F5F5F5',
        lightBg: '#FFFFFF',
        lightSection: '#F8E7F6',
        lightMain: '#4B164C',
        lightBorder: '#E2D5E3',

        darkBg: '#1F1220',
        darkCard: '#36213A',
        darkAccent: '#DD88CF',
        darkBorder: '#47304B',
      },
    },
  },
  plugins: [],
}
