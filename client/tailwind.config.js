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
        // EduFanor Premium Design System Color Palette
        plumDeep: '#49305D',
        plumDeepSoft: 'rgba(73, 48, 93, 0.1)',
        plumLight: '#6B4F78',
        plumLightest: '#F0EFF5',
        lavender: '#8A6BBE',
        lavenderLight: '#F5F0FD',
        lavenderLightest: '#F8F4FC',
        lavenderDark: '#6A529A',
        mainBackground: '#FCFAFF',
        mainBackgroundDark: '#1A162E',
        softAccentPink: '#E9B9C8',
        softAccentPinkLight: '#F7D5DF',
        accentPink: '#E94D65',
        accentPinkLight: '#FDE2E8',
        accentPinkSoft: '#F8C8D5',

        // Neutral shades - improved for consistency
        ink: '#17313E',
        inkMuted: '#6B5B7A',
        inkLight: '#F6F5F2',
        inkMutedLight: '#C5B0CD',
        inkDark: '#0D1420',

        // Dark mode palette
        midnight: '#17313E',
        midnightSoft: 'rgba(23, 49, 62, 0.8)',
        onyx: '#2D1B40',
        onyxSoft: 'rgba(45, 27, 64, 0.5)',

        // Status colors with consistent naming
        success: '#276E58',
        successSoft: '#D0E8E0',
        successContainer: 'rgba(39, 110, 88, 0.1)',
        warning: '#C58A3A',
        warningSoft: '#F4E3D2',
        warningContainer: 'rgba(197, 138, 58, 0.1)',
        error: '#B02A37',
        errorSoft: '#FDE8EC',
        errorContainer: 'rgba(176, 42, 55, 0.1)',
        info: '#2A6E9D',
        infoSoft: '#D6E8F5',
        infoContainer: 'rgba(42, 110, 157, 0.1)',

        // Derived tones for interfaces
        surface: '#F6F5F2',
        surfaceDark: '#17313E',
        surfaceMuted: '#E5E0F0',
        surfaceMutedDark: '#3A254A',
        surfaceSubtle: '#F0EFF5',
        surfaceSubtleDark: '#251E2B',

        // Border and divider colors
        border: '#C5B0CD',
        borderDark: '#4A355A',
        borderMuted: '#A095A8',
        divider: '#E9E0F5',

        // Text colors
        text: '#17313E',
        textMuted: '#6B5B7A',
        textLight: '#F6F5F2',
        textMutedDark: '#A89BBA',
        textOnDark: '#F6F5F2',
        placeholder: '#A095A8',

        // Brand accent for highlights
        brandAccent: '#E94D65',
        brandAccentSoft: '#F8C8D5',
        brandAccentLight: '#FDE2E8',

        // Mapping for existing class names
        plumLightMuted: '#C5B0CD',
        lavenderLightMuted: '#A095A8',
      },
      fontFamily: {
        // Arabic font - IBM Plex Sans Arabic for Arabic content
        arabic: ['IBM Plex Sans Arabic', 'Tajawal', 'Noto Naskh Arabic', 'sans-serif'],
        // English font - Inter for Latin script
        english: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        // Display font for headings
        display: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        // Arabic display for prominent headings
        arabicDisplay: ['IBM Plex Sans Arabic', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography scale - Arabic sizes with improved line heights
        'arabic-h1': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: 1.2, fontWeight: 800 }],
        'arabic-h2': ['clamp(1.8rem, 4.5vw, 3rem)', { lineHeight: 1.3, fontWeight: 700 }],
        'arabic-h3': ['clamp(1.6rem, 4vw, 2.4rem)', { lineHeight: 1.35, fontWeight: 600 }],
        'arabic-h4': ['clamp(1.4rem, 3.5vw, 1.8rem)', { lineHeight: 1.4, fontWeight: 600 }],
        'arabic-body': ['clamp(1rem, 1.8vw, 1.2rem)', { lineHeight: 1.9, fontWeight: 400 }],
        'arabic-sm': ['clamp(0.875rem, 1.5vw, 1rem)', { lineHeight: 1.6, fontWeight: 400 }],

        // Typography scale - English sizes with improved line heights
        'english-h1': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: 1.25, fontWeight: 700 }],
        'english-h2': ['clamp(1.8rem, 4.5vw, 3rem)', { lineHeight: 1.35, fontWeight: 600 }],
        'english-h3': ['clamp(1.5rem, 3.8vw, 2.2rem)', { lineHeight: 1.4, fontWeight: 500 }],
        'english-h4': ['clamp(1.25rem, 3vw, 1.6rem)', { lineHeight: 1.5, fontWeight: 500 }],
        'english-body': ['clamp(0.95rem, 1.7vw, 1.15rem)', { lineHeight: 1.8, fontWeight: 400 }],
        'english-sm': ['clamp(0.8125rem, 1.4vw, 0.95rem)', { lineHeight: 1.5, fontWeight: 400 }],

        // Display/shared sizes
        'display-display': ['clamp(3rem, 8vw, 5.5rem)', { lineHeight: 1.15, fontWeight: 800 }],
        'display-h1': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: 1.25, fontWeight: 700 }],
        'display-h2': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: 1.3, fontWeight: 600 }],
        'display-body': ['clamp(1rem, 1.8vw, 1.3rem)', { lineHeight: 1.8, fontWeight: 400 }],
        'display-sm': ['clamp(0.875rem, 1.5vw, 1.1rem)', { lineHeight: 1.5, fontWeight: 400 }],

        // Button sizes with consistent padding
        'btn-lg': ['clamp(1rem, 4vw, 1.3rem)', { padding: '1rem 1.75rem', fontWeight: 600 }],
        'btn-md': ['clamp(0.875rem, 3.5vw, 1.15rem)', { padding: '0.875rem 1.5rem', fontWeight: 500 }],
        'btn-sm': ['clamp(0.75rem, 3vw, 1rem)', { padding: '0.625rem 1.25rem', fontWeight: 500 }],

        // Label and small text
        'label': ['0.875rem', { fontWeight: 500, lineHeight: 1.5 }],
        'caption': ['0.75rem', { fontWeight: 400, lineHeight: 1.4 }],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        full: '9999px',
        // Rounded corners for components
        component: '0.5rem',
        card: '0.75rem',
        button: '0.5rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -10px rgba(0, 0, 0, 0.15)',
        glass: '0 4px 20px -6px rgba(0, 0, 0, 0.1), 0 2px 6px -1px rgba(0, 0, 0, 0.05)',
        card: '0 4px 20px -6px rgba(23, 49, 62, 0.14)',
        primary: '0 10px 40px -10px rgba(73, 48, 93, 0.3)',
        elevated: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
        focus: '0 0 0 3px rgba(73, 48, 93, 0.15)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
      },
      transitionProperty: {
        DEFAULT: 'color, background-color, border-color, opacity, box-shadow, transform',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        subtle: 'cubic-bezier(0.45, 0, 0.55, 1)',
      },
      borderWidth: {
        DEFAULT: '1px',
        0: '0',
        2: '2px',
        3: '3px',
      },
    },
  },
  plugins: [],
}