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
        // Professional Design System Colors
        primary: '#00C2B3',         // Serum Teal
        'sandstone-fog': '#F9FAFB', // Background Light
        'obsidian-graphite': '#111827', // Background Dark
        'slate-700': '#374151',     // Neutral Text
        'slate-200': '#E5E7EB',     // Borders
        'solar-red': '#EF4444',     // Danger
        'botanical-green': '#22C55E', // Success
        'sky-500': '#0EA5E9',       // Info
        
        // Enhanced Design System Semantic Colors - Sketch-Inspired
        background: {
          light: '#F9FAFB',
          dark: '#111827'
        },
        text: {
          primary: '#374151',
          secondary: '#6B7280',
          muted: '#9CA3AF'
        },
        border: {
          DEFAULT: '#E5E7EB',
          focus: '#00C2B3'
        },
        danger: '#EF4444',
        success: '#22C55E',
        info: '#0EA5E9',
        warning: '#F59E0B',
        
        // Enhanced Semantic Colors - Sketch-Inspired
        semantic: {
          danger: '#EF4444',
          'danger-light': '#FEE2E2',
          'danger-dark': '#DC2626',
          success: '#22C55E',
          'success-light': '#DCFCE7',
          'success-dark': '#16A34A',
          info: '#0EA5E9',
          'info-light': '#DBEAFE',
          'info-dark': '#0284C7',
          warning: '#F59E0B',
          'warning-light': '#FEF3C7',
          'warning-dark': '#D97706',
        },
        
        // Sketch-Inspired Neutral Palette
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
        
        // Legacy support
        ink: '#0A0A0A',
        stone: '#6B7280',
        mist: '#F6F7F9',
        line: '#E5E7EB',
        cobalt: '#2563EB',
        white: '#FFFFFF',
      },
      fontFamily: {
        // Design System Typography
        'heading': ['Satoshi', 'Inter', 'ui-sans-serif', 'system-ui'], // For headings
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'], // For body text
      },
      fontSize: {
        // Enhanced Typography Scale - Sketch-Inspired
        'xs': ['0.75rem', { lineHeight: '1.25rem', fontWeight: '500', letterSpacing: '0.025em' }], // 12px
        'sm': ['0.875rem', { lineHeight: '1.375rem', fontWeight: '400', letterSpacing: '0.01em' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem', fontWeight: '400', letterSpacing: '0' }], // 16px
        'lg': ['1.125rem', { lineHeight: '1.625rem', fontWeight: '400', letterSpacing: '-0.01em' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600', letterSpacing: '-0.01em' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '600', letterSpacing: '-0.02em' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700', letterSpacing: '-0.025em' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700', letterSpacing: '-0.03em' }], // 36px
        '5xl': ['3rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.035em' }], // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.04em' }], // 60px
        // Sketch-inspired additional sizes
        '7xl': ['4.5rem', { lineHeight: '1.05', fontWeight: '800', letterSpacing: '-0.045em' }], // 72px
        '8xl': ['6rem', { lineHeight: '1', fontWeight: '800', letterSpacing: '-0.05em' }], // 96px
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
        // Enhanced Spacing System - Sketch-Inspired 8pt Grid
        '0': '0',           // 0px
        '1': '0.25rem',     // 4px
        '2': '0.5rem',      // 8px
        '3': '0.75rem',     // 12px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '8': '2rem',        // 32px
        '10': '2.5rem',     // 40px
        '12': '3rem',       // 48px
        '16': '4rem',       // 64px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
        '32': '8rem',       // 128px
        '40': '10rem',      // 160px
        '48': '12rem',      // 192px
        '56': '14rem',      // 224px
        '64': '16rem',      // 256px
        
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