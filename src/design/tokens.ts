// AG Hex System Design Tokens
// Solids only - no gradients, no blur effects

export const colors = {
  // Core colors
  bg: '#0B0C0E',
  panel: '#111317', 
  line: '#1B1E24',
  text: '#E7E9ED',
  muted: '#A7AEBB',
  
  // Brand colors
  brand: '#27E3A1',
  danger: '#FF4D4F',
  warn: '#FFC53D',
  info: '#3DA9FF',
  
  // Semantic variants
  brandHover: '#1FCB8A',
  brandActive: '#17A673',
  dangerHover: '#FF3333',
  dangerActive: '#E63939',
  warnHover: '#FFB800',
  warnActive: '#E6A600',
  infoHover: '#1A8CE6',
  infoActive: '#0D73CC',
  
  // Neutral variants
  bgHover: '#0F1012',
  panelHover: '#15171B',
  lineHover: '#202329',
  textHover: '#F0F2F5',
  mutedHover: '#B8BFC9',
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
    sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

export const shadows = {
  // Solid shadows only - no blur
  focus: '0 0 0 3px var(--bg), 0 0 0 5px var(--brand)',
  focusDanger: '0 0 0 3px var(--bg), 0 0 0 5px var(--danger)',
  focusWarn: '0 0 0 3px var(--bg), 0 0 0 5px var(--warn)',
  focusInfo: '0 0 0 3px var(--bg), 0 0 0 5px var(--info)',
} as const

export const transitions = {
  fast: '150ms ease-out',
  normal: '200ms ease-out',
  slow: '300ms ease-out',
} as const

// Risk levels for allowance scoring
export const riskLevels = {
  low: {
    color: colors.info,
    label: 'Low Risk',
    description: 'Standard allowance with normal usage patterns',
  },
  medium: {
    color: colors.warn,
    label: 'Medium Risk', 
    description: 'Unusual patterns or high amounts detected',
  },
  high: {
    color: colors.danger,
    label: 'High Risk',
    description: 'Unlimited allowance or suspicious activity',
  },
} as const
