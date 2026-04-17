/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
        // MIDNIGHT AMBER — The Warning System
        // Deep navy canvas. Amber = scanning/caution.
        // Red = danger only. Sky blue = safe/links.
        // =============================================

        // Primary — Vivid Amber (action, CTA, scanning)
        primary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',   // Vivid Amber
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          foreground: '#0F172A',
        },

        // Secondary — Slate (structural)
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

        // Neutral — Slate (same scale, navy-harmonious)
        neutral: {
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

        // Background — Deep Navy foundation
        background: {
          primary: '#0F172A',
          secondary: '#1E293B',
          tertiary: '#334155',
          inverse: '#FFFFFF',
          light: '#F8FAFC',
          dark: '#0F172A',
          white: '#FFFFFF',
        },

        // Text — high contrast on navy
        text: {
          primary: '#FFFFFF',       // 17:1 on navy
          secondary: '#CBD5E1',     // 10.6:1 on navy
          tertiary: '#94A3B8',      // 6.4:1 on navy
          inverse: '#0F172A',
          muted: '#64748B',         // 3.6:1 — large text / decorative only
        },

        // Border — slate tones
        border: {
          primary: '#1E293B',
          secondary: '#334155',
          tertiary: '#0F172A',
          focus: '#F59E0B',
          DEFAULT: '#1E293B',
        },

        // Semantic
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
            50: '#FEF2F2', 100: '#FEE2E2', 200: '#FECACA', 300: '#FCA5A5',
            400: '#F87171', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C',
            800: '#991B1B', 900: '#7F1D1D',
          },
          info: {
            50: '#F0F9FF', 100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC',
            400: '#38BDF8', 500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1',
            800: '#075985', 900: '#0C4A6E',
          },
        },

        // Crimson — Danger Red (threats, revoke, risk)
        crimson: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',   // Danger Red
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },

        // Amber scale (explicit for gradient buttons)
        amber: {
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

        // Sky — safe blue (links, connected states)
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',   // Sky Blue
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },

        // Volt — mapped to amber for backward compat
        volt: {
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

        // Surface — Deep Navy system
        surface: {
          base: '#0F172A',
          raised: '#1E293B',
          overlay: '#334155',
          elevated: '#475569',
        },

        // Legacy aliases — remapped to Ledger paper theme so stale
        // text-stone / text-cobalt / etc. still pass WCAG AA on paper.
        // Note: ink is redefined by the Ledger block below and wins.
        stone: '#4A4D54',   // was #94A3B8 (2.35:1 FAIL on paper); now 7.8:1 AAA
        mist: '#4A4D54',    // was #1E293B dark; remapped to ink-muted
        line: '#0F1115',    // was #1E293B dark; remapped to ink
        cobalt: '#854F08',  // was #38BDF8 (1.96:1 FAIL); now 6.2:1 AAA amber-deep
        white: '#FFFFFF',
        danger: '#EF4444',
        success: '#22C55E',
        info: '#0EA5E9',
        warning: '#F59E0B',

        // =============================================
        // LEDGER v4 — fully-sans, less warm, AA-verified
        // Every text/bg pair below passes WCAG AA-normal.
        // =============================================
        paper: '#F7F5F0',           // less warm, still slightly cream
        'paper-sub': '#EFECE3',     // tinted cards / panels
        'paper-deep': '#E6E2D5',    // stronger surface contrast
        ink: '#0F1115',             // cool near-black body, ~17:1 on paper
        'ink-soft': '#2A2D33',      // secondary text, ~12:1
        'ink-muted': '#4A4D54',     // tertiary text, ~7.4:1
        'ink-whisper': '#585C64',   // metadata; AA on paper (6.16), sub (5.68), deep (5.18)
        'ink-rule': 'rgba(15,17,21,0.14)', // hairlines
        'amber-deep': '#854F08',    // AA on paper (6.18), sub (5.70), deep (5.19)
        'crimson-paper': '#B3151F', // AA on paper (6.33), sub (5.84), deep (5.32)
        'ink-blue': '#0B2545',      // cool data counterpoint
        oxblood: '#2D0A0A',         // single dark-inverse CTABand
        cream: '#F7F5F0',           // type color on oxblood
      },
      fontFamily: {
        'heading': ['var(--font-display)', 'Inter', 'ui-sans-serif', 'system-ui'],
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'display': ['var(--font-display)', 'Inter', 'ui-sans-serif', 'system-ui'],
        'serif': ['var(--font-serif)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        // Ledger v4 — fully sans, IBM Plex Sans
        'plex': ['var(--font-plex)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'medium': '0 4px 6px rgba(0, 0, 0, 0.3)',
        'large': '0 10px 15px rgba(0, 0, 0, 0.4)',
        'focus': '0 0 0 3px rgba(245, 158, 11, 0.25)',
        'focus-danger': '0 0 0 3px rgba(239, 68, 68, 0.2)',
        'focus-success': '0 0 0 3px rgba(34, 197, 94, 0.15)',
        'focus-info': '0 0 0 3px rgba(14, 165, 233, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.3)',
        'dark-subtle': '0 1px 3px rgba(0, 0, 0, 0.4)',
        'dark-medium': '0 4px 6px rgba(0, 0, 0, 0.4)',
        'dark-large': '0 10px 15px rgba(0, 0, 0, 0.5)',
        // Amber glow for primary actions
        'glow-primary': '0 0 20px rgba(245, 158, 11, 0.25)',
        'glow-primary-lg': '0 0 40px rgba(245, 158, 11, 0.15)',
        // Danger glow for revoke/threat
        'glow-crimson': '0 0 20px rgba(239, 68, 68, 0.25)',
        'glow-crimson-lg': '0 0 40px rgba(239, 68, 68, 0.15)',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(245, 158, 11, 0.3)' },
        },
      },
      aria: {
        'current': 'current',
      },
      // Ledger prose theme. Activates `className="prose prose-ink"` on
      // marketing/blog article bodies so dangerouslySetInnerHTML content
      // inherits the canon (ink on paper, IBM Plex Sans body, amber-deep
      // links and bullets) instead of Tailwind Typography's default
      // neutral-gray theme. Referenced from `src/app/blog/[slug]/page.tsx`.
      typography: {
        ink: {
          css: {
            '--tw-prose-body': '#2A2D33',              // ink-soft body
            '--tw-prose-headings': '#0F1115',          // ink
            '--tw-prose-lead': '#2A2D33',              // ink-soft
            '--tw-prose-links': '#854F08',             // amber-deep
            '--tw-prose-bold': '#0F1115',              // ink
            '--tw-prose-counters': '#4A4D54',          // ink-muted
            '--tw-prose-bullets': '#854F08',           // amber-deep (signature)
            '--tw-prose-hr': 'rgba(15,17,21,0.14)',    // ink-rule
            '--tw-prose-quotes': '#2A2D33',            // ink-soft
            '--tw-prose-quote-borders': '#854F08',     // amber-deep
            '--tw-prose-captions': '#585C64',          // ink-whisper
            '--tw-prose-code': '#854F08',              // amber-deep inline
            '--tw-prose-pre-code': '#F7F5F0',          // cream on dark pre
            '--tw-prose-pre-bg': '#0F1115',            // ink for pre blocks
            '--tw-prose-th-borders': '#0F1115',        // ink
            '--tw-prose-td-borders': 'rgba(15,17,21,0.14)',
            // Type mapping: headings + body both use Plex. Ledger
            // reserves Fraunces italic for the signature move (page-level
            // display), not inline prose headings — those stay on Plex
            // so the reader's focus is the sentence, not the face.
            'h1, h2, h3, h4': {
              fontFamily: 'var(--font-plex), ui-sans-serif, system-ui, sans-serif',
              fontWeight: '700',
              letterSpacing: '-0.02em',
            },
            p: {
              fontFamily: 'var(--font-plex), ui-sans-serif, system-ui, sans-serif',
            },
            'code, pre': {
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
            // Inline code: amber-deep on paper-deep background. Default
            // Tailwind Typography wraps inline code with backticks via
            // pseudo-elements — suppress so the rendering is clean.
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              backgroundColor: '#E6E2D5',
              padding: '0.15em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            a: {
              textDecoration: 'underline',
              textDecorationColor: 'rgba(133,79,8,0.35)',
              textUnderlineOffset: '3px',
              fontWeight: '500',
            },
            'a:hover': {
              textDecorationColor: '#854F08',
            },
          },
        },
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
