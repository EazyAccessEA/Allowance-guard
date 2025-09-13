// PureEdgeOS 4.0 - Fireart Studio Design Tokens
// Enterprise-grade minimalism with sophisticated aesthetics

export const colors = {
  // Core colors - Fireart-inspired palette
  obsidian: '#1E1F23',        // Primary dark background
  platinum: '#F8FAFC',        // Ultra-light backgrounds
  charcoal: '#64748B',        // Subtle text and borders
  sandstone: '#E4E2DD',       // Light background/text
  
  // Brand colors - Sophisticated accent system
  cobalt: '#2563EB',          // Primary brand accent (single brand color)
  teal: '#00C2B2',            // Secondary accent
  warmGray: '#F1F5F9',        // Card backgrounds
  
  // Semantic colors
  emerald: '#10B981',         // Success states
  amber: '#F59E0B',           // Warning states
  crimson: '#EF4444',         // Error states
  navy: '#121D2B',            // Alternate dark background
  
  // Interactive states
  cobaltHover: '#1D4ED8',
  cobaltActive: '#1E40AF',
  tealHover: '#00A896',
  tealActive: '#008B7A',
  emeraldHover: '#059669',
  emeraldActive: '#047857',
  amberHover: '#D97706',
  amberActive: '#B45309',
  crimsonHover: '#DC2626',
  crimsonActive: '#B91C1C',
  
  // Neutral variants
  obsidianHover: '#25262B',
  platinumHover: '#F1F5F9',
  charcoalHover: '#475569',
  sandstoneHover: '#F0F0ED',
} as const

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
} as const

export const typography = {
  fontFamily: {
    // Fireart-inspired typography system
    satoshi: ['Satoshi', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    inter: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
  },
  fontSize: {
    // Fireart-style typography scale with generous spacing
    xs: ['0.75rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
    sm: ['0.875rem', { lineHeight: '1.375rem', letterSpacing: '0.025em' }],
    base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
    lg: ['1.125rem', { lineHeight: '1.625rem', letterSpacing: '0' }],
    xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0' }],
    '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
    '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
    '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

export const shadows = {
  // Fireart-inspired subtle shadows
  subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
  large: '0 10px 15px rgba(0, 0, 0, 0.1)',
  focus: '0 0 0 3px rgba(37, 99, 235, 0.1)',
  focusDanger: '0 0 0 3px rgba(239, 68, 68, 0.1)',
  focusWarn: '0 0 0 3px rgba(245, 158, 11, 0.1)',
  focusInfo: '0 0 0 3px rgba(16, 185, 129, 0.1)',
} as const

export const transitions = {
  // Fireart-style natural timing functions
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const

// Fireart-inspired component tokens
export const components = {
  button: {
    height: '44px',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
  },
  card: {
    padding: '24px',
    borderRadius: '16px',
    shadow: shadows.subtle,
  },
  input: {
    height: '44px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid',
  },
} as const

// Risk levels for allowance scoring - updated with new colors
export const riskLevels = {
  low: {
    color: colors.emerald,
    label: 'Low Risk',
    description: 'Standard allowance with normal usage patterns',
  },
  medium: {
    color: colors.amber,
    label: 'Medium Risk', 
    description: 'Unusual patterns or high amounts detected',
  },
  high: {
    color: colors.crimson,
    label: 'High Risk',
    description: 'Unlimited allowance or suspicious activity',
  },
} as const
