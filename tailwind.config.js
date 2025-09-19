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
        
        // Design System Semantic Colors
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
        // Professional Typography Scale
        'xs': ['0.75rem', { lineHeight: '1.125rem', fontWeight: '500' }], // 12px
        'sm': ['0.875rem', { lineHeight: '1.3125rem', fontWeight: '400' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }], // 16px
        'lg': ['1.125rem', { lineHeight: '1.6875rem', fontWeight: '400' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.875rem', fontWeight: '600' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2.25rem', fontWeight: '600' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.8125rem', fontWeight: '700' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '3.375rem', fontWeight: '700' }], // 36px
        '5xl': ['3rem', { lineHeight: '4.5rem', fontWeight: '700' }], // 48px
        '6xl': ['4rem', { lineHeight: '6rem', fontWeight: '700' }], // 64px
      },
      letterSpacing: {
        'heading': '-0.005em', // -0.5% for headings
        'body': '0', // default for body
      },
      spacing: {
        // Design System Spacing Tokens
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
        // Professional Motion System
        'fade-in': 'fadeIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in': 'slideIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        'button-press': 'buttonPress 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        'modal-in': 'modalIn 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        'tab-switch': 'tabSwitch 200ms cubic-bezier(0.4, 0, 0.2, 1)',
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