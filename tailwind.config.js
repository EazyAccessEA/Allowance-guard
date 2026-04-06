/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Performance optimizations
  corePlugins: {
    preflight: true,
    container: false,
    accessibility: true,
    float: false,
    clear: false,
    skew: false,
    caretColor: false,
    sepia: false,
  },
  safelist: [
    'animate-scroll',
    'brand-logos-mobile',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        // =============================================
        // MONOCHROME PRO — Institutional Authority
        // True black canvas. White commands action.
        // Red is the ONLY color — reserved for danger.
        // =============================================

        // Primary — Pure White (action color)
        primary: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A1A1AA',
          500: '#FFFFFF',   // Primary action — Pure White
          600: '#E5E5E5',
          700: '#D4D4D4',
          800: '#A1A1AA',
          900: '#71717A',
          foreground: '#000000',
        },

        // Secondary — Zinc (monochrome structural scale)
        secondary: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },

        // Neutral — Zinc
        neutral: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },

        // Background System — True Black foundation
        background: {
          primary: '#000000',
          secondary: '#0A0A0A',
          tertiary: '#18181B',
          inverse: '#FFFFFF',
          light: '#FAFAFA',
          dark: '#000000',
          white: '#FFFFFF',
        },

        // Text System — high contrast on black
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          tertiary: '#71717A',
          inverse: '#000000',
          muted: '#52525B',
        },

        // Border System — subtle zinc
        border: {
          primary: '#27272A',
          secondary: '#3F3F46',
          tertiary: '#18181B',
          focus: '#FFFFFF',
          DEFAULT: '#27272A',
        },

        // Semantic Colors
        semantic: {
          success: {
            50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 300: '#86EFAC',
            400: '#4ADE80', 500: '#22C55E', 600: '#16A34A', 700: '#15803D',
            800: '#166534', 900: '#14532D',
          },
          warning: {
            50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D',
            400: '#FBBF24', 500: '#F59E0B', 600: '#D97706', 700: '#B45309',
            800: '#92400E', 900: '#78350F',
          },
          error: {
            50: '#FFF5F5', 100: '#FFE3E3', 200: '#FFC9C9', 300: '#FFA8A8',
            400: '#FF8787', 500: '#FF4B4B', 600: '#E03E3E', 700: '#C53030',
            800: '#9B2C2C', 900: '#742A2A',
          },
          info: {
            50: '#F0F9FF', 100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC',
            400: '#38BDF8', 500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1',
            800: '#075985', 900: '#0C4A6E',
          },
        },

        // Danger — Vibrant Crimson (THE color, the only one)
        crimson: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC9C9',
          300: '#FFA8A8',
          400: '#FF8787',
          500: '#FF4B4B',   // Vibrant Crimson
          600: '#E03E3E',
          700: '#C53030',
          800: '#9B2C2C',
          900: '#742A2A',
        },

        // Volt Mint removed — monochrome palette has no teal.
        // "volt" classes will resolve to accent grey for graceful fallback.
        volt: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },

        // Surface — True Black system
        surface: {
          base: '#000000',
          raised: '#0A0A0A',
          overlay: '#18181B',
          elevated: '#27272A',
        },

        // Legacy support (mapped to monochrome)
        ink: '#FFFFFF',
        stone: '#71717A',
        mist: '#18181B',
        line: '#27272A',
        cobalt: '#A1A1AA',
        white: '#FFFFFF',
        danger: '#FF4B4B',
        success: '#22C55E',
        info: '#0EA5E9',
        warning: '#F59E0B',
      },
      fontFamily: {
        'heading': ['var(--font-display)', 'Inter', 'ui-sans-serif', 'system-ui'],
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'display': ['var(--font-display)', 'Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['var(--font-serif)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        'caption': ['Inter', 'ui-sans-serif', 'system-ui'],
        'button': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.25rem', fontWeight: '500', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.375rem', fontWeight: '400', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.5rem', fontWeight: '400', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.625rem', fontWeight: '400', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '600', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.035em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.04em' }],
        '7xl': ['4.5rem', { lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.045em' }],
        '8xl': ['6rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.05em' }],
      },
      letterSpacing: {
        'heading': '-0.02em',
        'body': '0',
        'display': '-0.03em',
        'caption': '0.025em',
        'button': '0.01em',
      },
      spacing: {
        '0': '0',
        '0.5': '0.125rem',
        '1': '0.25rem',
        '1.5': '0.375rem',
        '2': '0.5rem',
        '2.5': '0.625rem',
        '3': '0.75rem',
        '3.5': '0.875rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '11': '2.75rem',
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
        '18': '4.5rem',
        '20': '5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
        '36': '9rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
        '52': '13rem',
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '2rem',
        'lg': '4rem',
        'xl': '8rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        'container': '1200px',
        'wrap': '1120px',
        'reading': '720px',
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        // Monochrome Pro shadow system — deeper shadows on true black
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.4)',
        'medium': '0 4px 6px rgba(0, 0, 0, 0.4)',
        'large': '0 10px 15px rgba(0, 0, 0, 0.5)',
        'focus': '0 0 0 3px rgba(255, 255, 255, 0.15)',
        'focus-danger': '0 0 0 3px rgba(255, 75, 75, 0.15)',
        'focus-success': '0 0 0 3px rgba(34, 197, 94, 0.1)',
        'focus-info': '0 0 0 3px rgba(14, 165, 233, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.4)',
        'dark-subtle': '0 1px 3px rgba(0, 0, 0, 0.5)',
        'dark-medium': '0 4px 6px rgba(0, 0, 0, 0.5)',
        'dark-large': '0 10px 15px rgba(0, 0, 0, 0.6)',
        // Danger glow — the ONLY glow in Monochrome Pro
        'glow-primary': '0 0 20px rgba(255, 255, 255, 0.1)',
        'glow-primary-lg': '0 0 40px rgba(255, 255, 255, 0.08)',
        'glow-crimson': '0 0 20px rgba(255, 75, 75, 0.25)',
        'glow-crimson-lg': '0 0 40px rgba(255, 75, 75, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
        'glass-lg': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-in': 'slideIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'button-press': 'buttonPress 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'modal-in': 'modalIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'tab-switch': 'tabSwitch 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'mesh-shift': 'meshShift 15s ease infinite',
        'scroll-reveal': 'scrollReveal 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        buttonPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
        modalIn: {
          '0%': { transform: 'translateY(-16px) scale(0.95)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        tabSwitch: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        meshShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        scrollReveal: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 75, 75, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 75, 75, 0.3)' },
        },
      },
      aria: {
        'current': 'current',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/forms'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
  ],
}
