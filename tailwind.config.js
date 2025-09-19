/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mobbin-Inspired Primary Color Scale (9-step)
        primary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#00C2B3',  // Base Serum Teal
          600: '#00A896',
          700: '#008B7A',
          800: '#006B5F',
          900: '#004B44',
          // Legacy support
          accent: '#00C2B3',
          foreground: '#FFFFFF',
        },
        
        // Mobbin-Inspired Secondary Color Scale (9-step)
        secondary: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        
        // Mobbin-Inspired Neutral Color Scale (9-step)
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        
        // Mobbin-Inspired Background System
        background: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
          inverse: '#0F172A',
          // Legacy support
          light: '#F9FAFB',
          dark: '#111827',
          white: '#FFFFFF',
        },
        
        // Mobbin-Inspired Text System
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          tertiary: '#94A3B8',
          inverse: '#FFFFFF',
          // Legacy support
          muted: '#9CA3AF',
        },
        
        // Mobbin-Inspired Border System
        border: {
          primary: '#E2E8F0',
          secondary: '#CBD5E1',
          tertiary: '#F1F5F9',
          focus: '#00C2B3',
          // Legacy support
          DEFAULT: '#E5E7EB',
        },
        
        // Mobbin-Inspired Semantic Color System
        semantic: {
          success: {
            50: '#F0FDF4',
            100: '#DCFCE7',
            200: '#BBF7D0',
            300: '#86EFAC',
            400: '#4ADE80',
            500: '#22C55E',
            600: '#16A34A',
            700: '#15803D',
            800: '#166534',
            900: '#14532D',
          },
          warning: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
          },
          error: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            300: '#FCA5A5',
            400: '#F87171',
            500: '#EF4444',
            600: '#DC2626',
            700: '#B91C1C',
            800: '#991B1B',
            900: '#7F1D1D',
          },
          info: {
            50: '#F0F9FF',
            100: '#E0F2FE',
            200: '#BAE6FD',
            300: '#7DD3FC',
            400: '#38BDF8',
            500: '#0EA5E9',
            600: '#0284C7',
            700: '#0369A1',
            800: '#075985',
            900: '#0C4A6E',
          },
        },
        
        // Legacy support
        ink: '#0A0A0A',
        stone: '#6B7280',
        mist: '#F6F7F9',
        line: '#E5E7EB',
        cobalt: '#2563EB',
        white: '#FFFFFF',
        danger: '#EF4444',
        success: '#22C55E',
        info: '#0EA5E9',
        warning: '#F59E0B',
      },
      fontFamily: {
        // Mobbin-Inspired Typography System
        'heading': ['Satoshi', 'Inter', 'ui-sans-serif', 'system-ui'], // For headings
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'], // For body text
        'display': ['Satoshi', 'Inter', 'ui-sans-serif', 'system-ui'], // For large displays
        'caption': ['Inter', 'ui-sans-serif', 'system-ui'], // For small text
        'button': ['Inter', 'ui-sans-serif', 'system-ui'], // For buttons and CTAs
      },
      fontSize: {
        // Mobbin-Inspired Typography Scale (Mobile-first with systematic scaling)
        'xs': ['0.75rem', { lineHeight: '1.25rem', fontWeight: '500', letterSpacing: '0.025em' }], // 12px - Mobile captions
        'sm': ['0.875rem', { lineHeight: '1.375rem', fontWeight: '400', letterSpacing: '0.01em' }], // 14px - Mobile body
        'base': ['1rem', { lineHeight: '1.5rem', fontWeight: '400', letterSpacing: '0' }], // 16px - Base body
        'lg': ['1.125rem', { lineHeight: '1.625rem', fontWeight: '400', letterSpacing: '-0.01em' }], // 18px - Large body
        'xl': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600', letterSpacing: '-0.01em' }], // 20px - Small headings
        '2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '600', letterSpacing: '-0.02em' }], // 24px - Medium headings
        '3xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700', letterSpacing: '-0.025em' }], // 30px - Large headings
        '4xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700', letterSpacing: '-0.03em' }], // 36px - XL headings
        '5xl': ['3rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.035em' }], // 48px - Display headings
        '6xl': ['3.75rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.04em' }], // 60px - Large display
        '7xl': ['4.5rem', { lineHeight: '1.05', fontWeight: '800', letterSpacing: '-0.045em' }], // 72px - Hero headings
        '8xl': ['6rem', { lineHeight: '1', fontWeight: '800', letterSpacing: '-0.05em' }], // 96px - Massive display
      },
      letterSpacing: {
        // Enhanced Letter Spacing - Sketch-Inspired
        'heading': '-0.02em',    // -2% for headings (improved)
        'body': '0',             // Default for body
        'display': '-0.03em',    // -3% for display text
        'caption': '0.025em',    // +2.5% for captions
        'button': '0.01em',      // +1% for buttons
      },
      spacing: {
        // Mobbin-Inspired 4px/8px Grid System
        '0': '0',           // 0px
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '1.5': '0.375rem',  // 6px
        '2': '0.5rem',      // 8px
        '2.5': '0.625rem',  // 10px
        '3': '0.75rem',     // 12px
        '3.5': '0.875rem',  // 14px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '7': '1.75rem',     // 28px
        '8': '2rem',        // 32px
        '9': '2.25rem',     // 36px
        '10': '2.5rem',     // 40px
        '11': '2.75rem',    // 44px
        '12': '3rem',       // 48px
        '14': '3.5rem',     // 56px
        '16': '4rem',       // 64px
        '18': '4.5rem',     // 72px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
        '28': '7rem',       // 112px
        '32': '8rem',       // 128px
        '36': '9rem',       // 144px
        '40': '10rem',      // 160px
        '44': '11rem',      // 176px
        '48': '12rem',      // 192px
        '52': '13rem',      // 208px
        '56': '14rem',      // 224px
        '60': '15rem',      // 240px
        '64': '16rem',      // 256px
        '72': '18rem',      // 288px
        '80': '20rem',      // 320px
        '96': '24rem',      // 384px
        
        // Legacy semantic spacing (maintained for compatibility)
        'xs': '0.5rem',  // 8px
        'sm': '1rem',    // 16px
        'md': '2rem',    // 32px
        'lg': '4rem',    // 64px
        'xl': '8rem',    // 128px
        
        // Legacy spacing
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        'container': '1200px', // Container max-width
        'wrap': '1120px',
        'reading': '720px',
      },
      borderRadius: {
        'sm': '0.25rem',   // 4px
        'DEFAULT': '0.5rem', // 8px - Design System standard
        'md': '0.75rem',   // 12px
        'lg': '1rem',      // 16px
        'xl': '1.5rem',    // 24px
        'full': '9999px',
      },
      boxShadow: {
        // Professional Shadow System
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'large': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'focus': '0 0 0 3px rgba(0, 194, 179, 0.1)', // Serum Teal focus
        'focus-danger': '0 0 0 3px rgba(239, 68, 68, 0.1)',
        'focus-success': '0 0 0 3px rgba(34, 197, 94, 0.1)',
        'focus-info': '0 0 0 3px rgba(14, 165, 233, 0.1)',
      },
      animation: {
        // Enhanced Motion System - Sketch-Inspired
        'fade-in': 'fadeIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-in': 'slideIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'button-press': 'buttonPress 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'modal-in': 'modalIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'tab-switch': 'tabSwitch 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Sketch-inspired additional animations
        'sketch-fade-in': 'fadeIn 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'sketch-slide-up': 'slideUp 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'sketch-scale-in': 'scaleIn 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'sketch-bounce': 'bounce 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'sketch-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        // Sketch-inspired additional keyframes
        bounce: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      // Professional Component Styles
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