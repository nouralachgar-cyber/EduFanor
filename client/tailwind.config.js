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
        canvas: 'var(--palette-canvas)',
        surface: 'var(--palette-surface)',
        'surface-2': 'var(--palette-surface-2)',
        highlight: 'var(--palette-highlight)',
        lavender: 'var(--palette-lavender)',
        lilac: 'var(--palette-lilac)',
        muted: 'var(--palette-muted)',
        ink: 'var(--palette-ink)',
        'ink-soft': 'var(--palette-ink-soft)',
        'ink-muted': 'var(--palette-ink-soft)',
        line: 'var(--palette-line)',
        'line-strong': 'var(--palette-line-strong)',
        primary: 'var(--palette-primary)',
        'primary-hover': 'var(--palette-primary-hover)',
        'on-primary': 'var(--palette-on-primary)',
        'on-dark': 'var(--palette-on-dark)',
        scrim: 'var(--palette-scrim)',
        accent: 'var(--palette-accent)',
        'accent-soft': 'var(--palette-accent-soft)',
        'on-accent': 'var(--palette-on-accent)',
        card: 'var(--palette-surface)',
        'surface-muted': 'var(--palette-surface-2)',
        lift: 'var(--palette-primary)',

        plumDeep: 'var(--palette-ink)',
        plumDeepSoft: 'var(--palette-line)',
        plumLight: 'var(--palette-lavender)',
        plumLightest: 'var(--palette-canvas)',
        lavenderLight: 'var(--palette-highlight)',
        lavenderLightest: 'var(--palette-highlight)',
        lavenderDark: 'var(--palette-line-strong)',
        mainBackground: 'var(--palette-canvas)',
        mainBackgroundDark: 'var(--palette-canvas)',
        softAccentPink: 'var(--palette-muted)',
        softAccentPinkLight: 'var(--palette-highlight)',
        accentPink: 'var(--palette-lavender)',
        accentPinkLight: 'var(--palette-highlight)',
        accentPinkSoft: 'var(--palette-highlight)',

        inkMuted: 'var(--palette-ink-soft)',
        inkLight: 'var(--palette-on-dark)',
        inkMutedLight: 'var(--palette-line-strong)',
        inkDark: 'var(--palette-ink)',

        midnight: 'var(--palette-surface-2)',
        midnightSoft: 'var(--palette-surface-2)',
        onyx: 'var(--palette-surface)',
        onyxSoft: 'var(--palette-surface)',

        success: 'var(--palette-positive)',
        successSoft: 'var(--palette-positive-soft)',
        successContainer: 'var(--palette-positive-soft)',
        warning: 'var(--palette-caution)',
        warningSoft: 'var(--palette-caution-soft)',
        warningContainer: 'var(--palette-caution-soft)',
        error: 'var(--palette-negative)',
        errorSoft: 'var(--palette-negative-soft)',
        errorContainer: 'var(--palette-negative-soft)',
        info: 'var(--palette-lavender)',
        infoSoft: 'var(--palette-highlight)',
        infoContainer: 'var(--palette-highlight)',

        surfaceDark: 'var(--palette-surface)',
        surfaceMuted: 'var(--palette-surface-2)',
        surfaceMutedDark: 'var(--palette-surface-2)',
        surfaceSubtle: 'var(--palette-highlight)',
        surfaceSubtleDark: 'var(--palette-highlight)',

        border: 'var(--palette-line)',
        borderDark: 'var(--palette-line-strong)',
        borderMuted: 'var(--palette-muted)',
        divider: 'var(--palette-line)',

        text: 'var(--palette-ink)',
        textMuted: 'var(--palette-ink-soft)',
        textLight: 'var(--palette-on-dark)',
        textMutedDark: 'var(--palette-lilac)',
        textOnDark: 'var(--palette-on-dark)',
        placeholder: 'var(--palette-muted)',

        brandAccent: 'var(--palette-lavender)',
        brandAccentSoft: 'var(--palette-highlight)',
        brandAccentLight: 'var(--palette-highlight)',

        bgPrimary: 'var(--palette-surface)',
        bgSecondary: 'var(--palette-surface-2)',
        purpleAccent: 'var(--palette-primary)',
        pinkHighlight: 'var(--palette-lilac)',

        plumLightMuted: 'var(--palette-line-strong)',
        lavenderLightMuted: 'var(--palette-muted)',
      },
      fontFamily: {
        inter: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
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
        sm: '0 1px 2px 0 rgba(24, 18, 43, 0.05)',
        md: '0 4px 6px -1px rgba(24, 18, 43, 0.1), 0 2px 4px -1px rgba(24, 18, 43, 0.06)',
        lg: '0 10px 15px -3px rgba(24, 18, 43, 0.1), 0 4px 6px -2px rgba(24, 18, 43, 0.05)',
        xl: '0 20px 25px -5px rgba(24, 18, 43, 0.1), 0 10px 10px -5px rgba(24, 18, 43, 0.04)',
        '2xl': '0 25px 50px -10px rgba(24, 18, 43, 0.15)',
        glass: '0 4px 20px -6px rgba(99, 89, 133, 0.12), 0 2px 6px -1px rgba(24, 18, 43, 0.05)',
        card: '0 4px 20px -6px rgba(99, 89, 133, 0.18)',
        primary: '0 10px 40px -10px rgba(99, 89, 133, 0.35)',
        elevated: '0 20px 40px -10px rgba(24, 18, 43, 0.2)',
        focus: '0 0 0 3px rgba(191, 162, 219, 0.25)',
        inset: 'inset 0 1px 0 rgba(243, 241, 245, 0.5)',
        lift: '0 18px 40px -20px rgba(24, 18, 43, 0.35)',
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