// AllowanceGuard Design Tokens
// Source of truth: docs/design-tokens-handbook.md
// Palette: "Midnight Amber" — The Warning System
// Philosophy: Deep navy canvas. Amber = scanning/caution. Red = danger only.
// Amber is the universal color for "Caution" and "Scanning."

export const designTokens = {
  colors: {
    // Primary Action — Vivid Amber (caution, scanning, CTAs)
    primary: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',   // Vivid Amber — primary action
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
      foreground: '#0F172A', // Dark text on amber buttons
    },

    // Danger — Red (reserved for threats, revoke, risk)
    danger: {
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
      foreground: '#FFFFFF',
    },

    // Accent — Sky Blue (links, safe indicators)
    accent: {
      50: '#F0F9FF',
      100: '#E0F2FE',
      200: '#BAE6FD',
      300: '#7DD3FC',
      400: '#38BDF8',   // Sky Blue — safe, links
      500: '#0EA5E9',
      600: '#0284C7',
      700: '#0369A1',
      800: '#075985',
      900: '#0C4A6E',
    },

    // Neutral — Slate (the structural backbone on deep navy)
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',   // Secondary text (10.6:1 on navy)
      400: '#94A3B8',   // Muted text (6.4:1 on navy)
      500: '#64748B',   // Decorative only (3.6:1)
      600: '#475569',
      700: '#334155',
      800: '#1E293B',   // Background glow / raised surface
      850: '#172033',
      900: '#0F172A',   // Deep Navy — base background
      950: '#0A0F1E',
    },

    // Semantic
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

    // Surface system — Deep Navy foundation
    surface: {
      dark: {
        base: '#0F172A',        // Deep Navy
        raised: '#1E293B',      // Subtle lift
        overlay: '#334155',     // Cards, panels
        elevated: '#475569',    // Elevated elements
        glass: 'rgba(30, 41, 59, 0.80)',
        glassBorder: 'rgba(71, 85, 105, 0.3)',
      },
      light: {
        base: '#FFFFFF',
        raised: '#F8FAFC',
        overlay: '#FFFFFF',
        elevated: '#FFFFFF',
      },
    },

    // Text — high contrast on deep navy
    text: {
      primary: '#FFFFFF',       // White on navy (17:1)
      secondary: '#CBD5E1',     // Slate 300 (10.6:1)
      tertiary: '#94A3B8',      // Slate 400 (6.4:1)
      inverse: '#0F172A',       // Navy on light bg
    },

    // Border
    border: {
      default: '#1E293B',       // Slate 800 — subtle
      strong: '#334155',        // Slate 700
      focus: '#F59E0B',         // Amber focus ring
    },
  },

  typography: {
    fonts: {
      display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },

    scale: {
      xs:   { size: '0.75rem',   lineHeight: '1.25rem',  weight: '500', letterSpacing: '0.025em' },
      sm:   { size: '0.875rem',  lineHeight: '1.375rem', weight: '400', letterSpacing: '0.01em' },
      base: { size: '1rem',      lineHeight: '1.5rem',   weight: '400', letterSpacing: '0' },
      lg:   { size: '1.125rem',  lineHeight: '1.625rem', weight: '400', letterSpacing: '-0.01em' },
      xl:   { size: '1.25rem',   lineHeight: '1.75rem',  weight: '600', letterSpacing: '-0.01em' },
      '2xl': { size: '1.5rem',   lineHeight: '2rem',     weight: '600', letterSpacing: '-0.02em' },
      '3xl': { size: '1.875rem', lineHeight: '2.25rem',  weight: '700', letterSpacing: '-0.025em' },
      '4xl': { size: '2.25rem',  lineHeight: '2.5rem',   weight: '700', letterSpacing: '-0.03em' },
      '5xl': { size: '3rem',     lineHeight: '1.1',      weight: '700', letterSpacing: '-0.035em' },
      '6xl': { size: '3.75rem',  lineHeight: '1.1',      weight: '700', letterSpacing: '-0.04em' },
      '7xl': { size: '4.5rem',   lineHeight: '1.05',     weight: '800', letterSpacing: '-0.045em' },
      '8xl': { size: '6rem',     lineHeight: '1',        weight: '800', letterSpacing: '-0.05em' },
    },

    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  spacing: {
    '0': '0',
    '0.5': '0.125rem',
    '1': '0.25rem',
    '1.5': '0.375rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.2)',
    md: '0 4px 12px rgba(0,0,0,0.3)',
    lg: '0 12px 32px rgba(0,0,0,0.4)',
    glowAmber: '0 0 20px rgba(245,158,11,0.25)',
    glowDanger: '0 0 20px rgba(239,68,68,0.25)',
    focus: '0 0 0 3px rgba(245,158,11,0.3)',
  },

  motion: {
    durations: {
      instant: '0ms',
      fast: '120ms',
      base: '200ms',
      slow: '400ms',
      slower: '600ms',
    },
    easings: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.55, 0, 1, 0.45)',
      out: 'cubic-bezier(0, 0.55, 0.45, 1)',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      sharp: 'cubic-bezier(0.25, 0, 0, 1)',
    },
    stagger: '50ms',
  },

  layout: {
    containerMax: '1280px',
    containerNarrow: '800px',
    navHeight: '4rem',
    navHeightMobile: '3.5rem',
    gridColumns: 12,
    gridGap: '1rem',
    gridGapLarge: '1.5rem',
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    zIndex: {
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modalBackdrop: 1040,
      modal: 1050,
      popover: 1060,
      tooltip: 1070,
      toast: 1080,
    },
  },
} as const

export const colors = designTokens.colors
export const typography = designTokens.typography
export const spacing = designTokens.spacing
export const layout = designTokens.layout
export const borderRadius = designTokens.borderRadius
export const shadows = designTokens.shadows
export const motion = designTokens.motion
