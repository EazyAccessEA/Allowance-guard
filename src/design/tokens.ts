// AllowanceGuard Design Tokens
// Source of truth: docs/design-tokens-handbook.md
// Palette: "Monochrome Pro" — Institutional Authority
// Philosophy: True black canvas. White commands action. Red signals danger.
// By keeping the site monochrome, red carries 10x more weight.

export const designTokens = {
  colors: {
    // Primary Action — Pure White on True Black
    primary: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A1A1AA',   // Cool Grey accent
      500: '#FFFFFF',   // Primary action color (white)
      600: '#E5E5E5',
      700: '#D4D4D4',
      800: '#A1A1AA',
      900: '#71717A',
      foreground: '#000000', // Text on primary buttons
    },

    // Danger — Vibrant Crimson (the ONLY color on the page)
    danger: {
      50: '#FFF5F5',
      100: '#FFE3E3',
      200: '#FFC9C9',
      300: '#FFA8A8',
      400: '#FF8787',
      500: '#FF4B4B',   // Vibrant Crimson — danger, revoke, threats
      600: '#E03E3E',
      700: '#C53030',
      800: '#9B2C2C',
      900: '#742A2A',
      foreground: '#FFFFFF',
    },

    // Accent/Neutral — Cool Grey
    accent: {
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',   // Cool Grey — accent/neutral
      500: '#71717A',
      600: '#52525B',
      700: '#3F3F46',   // Secondary action border
      800: '#27272A',
      900: '#18181B',
    },

    // Neutral — Zinc scale (monochrome backbone)
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
      950: '#09090B',
    },

    // Semantic (kept for functional use — only red is visually prominent)
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

    // Surface system — True Black foundation
    surface: {
      dark: {
        base: '#000000',        // True Black
        raised: '#0A0A0A',      // Barely lifted
        overlay: '#18181B',     // Cards, panels
        elevated: '#27272A',    // Elevated cards
        glass: 'rgba(10, 10, 10, 0.80)',
        glassBorder: 'rgba(63, 63, 70, 0.3)',
      },
      light: {
        base: '#FFFFFF',
        raised: '#FAFAFA',
        overlay: '#FFFFFF',
        elevated: '#FFFFFF',
      },
    },

    // Text — high contrast on true black
    text: {
      primary: '#FFFFFF',       // Pure white on black
      secondary: '#A1A1AA',     // Cool Grey
      tertiary: '#71717A',      // Muted grey
      inverse: '#000000',       // Black on white
    },

    // Border — subtle zinc borders
    border: {
      default: '#27272A',
      strong: '#3F3F46',        // Secondary action border
      focus: '#FFFFFF',         // White focus ring
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
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 12px rgba(0,0,0,0.4)',
    lg: '0 12px 32px rgba(0,0,0,0.5)',
    glowDanger: '0 0 20px rgba(255,75,75,0.25)',
    glowWhite: '0 0 20px rgba(255,255,255,0.15)',
    focus: '0 0 0 3px rgba(255,255,255,0.2)',
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
