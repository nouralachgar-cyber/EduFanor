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
        forestGreen: '#24483F',
        freshGreen: '#789B83',
        warmOrange: '#E69A55',
        softOrange: '#F2C49B',
        warmWhite: '#FAF8F2',
        lightBeige: '#E8EFE7',
        deepCharcoal: '#26332F',
        lightBg: '#FFFFFF',
        lightSection: '#FAF8F2',
        lightMain: '#24483F',
        lightBorder: '#DCE5DD',

        darkBg: '#17231F',
        darkCard: '#24352E',
        darkAccent: '#789B83',
        darkBorder: '#35483F',
      },
    },
  },
  plugins: [],
}