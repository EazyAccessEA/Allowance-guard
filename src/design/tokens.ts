// Design System Tokens
// Professional design system following the Serum Teal theme specification

export const designTokens = {
  colors: {
    // Primary Brand
    primary: {
      accent: '#00C2B3', // Serum Teal
      foreground: '#FFFFFF',
    },
    
    // Backgrounds
    background: {
      light: '#F9FAFB',     // Sandstone Fog
      dark: '#111827',      // Obsidian Graphite
      white: '#FFFFFF',
    },
    
    // Text Colors
    text: {
      primary: '#374151',   // Slate Gray 700
      secondary: '#6B7280', // Gray 500
      muted: '#9CA3AF',     // Gray 400
      inverse: '#FFFFFF',
    },
    
    // Borders
    border: {
      default: '#E5E7EB',   // Slate Gray 200
      focus: '#00C2B3',     // Serum Teal
      muted: '#F3F4F6',     // Gray 100
    },
    
    // Semantic Colors
    semantic: {
      danger: '#EF4444',    // Solar Red
      success: '#22C55E',   // Botanical Green
      info: '#0EA5E9',      // Sky 500
      warning: '#F59E0B',   // Amber 500
    },
    
    // Semantic Backgrounds
    semanticBg: {
      danger: '#FEF2F2',
      success: '#F0FDF4',
      info: '#F0F9FF',
      warning: '#FFFBEB',
    },
  },
  
  typography: {
    fonts: {
      heading: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
    },
    
    sizes: {
      xs: { size: '0.75rem', lineHeight: '1.25rem', weight: '500' },   // 12px
      sm: { size: '0.875rem', lineHeight: '1.375rem', weight: '400' }, // 14px  
      base: { size: '1rem', lineHeight: '1.5rem', weight: '400' },     // 16px
      lg: { size: '1.125rem', lineHeight: '1.625rem', weight: '400' }, // 18px
      xl: { size: '1.25rem', lineHeight: '1.75rem', weight: '600' },   // 20px
      '2xl': { size: '1.5rem', lineHeight: '2rem', weight: '600' },    // 24px
      '3xl': { size: '1.875rem', lineHeight: '2.25rem', weight: '700' }, // 30px
      '4xl': { size: '2.25rem', lineHeight: '2.5rem', weight: '700' },  // 36px
      '5xl': { size: '3rem', lineHeight: '1.1', weight: '700' },        // 48px
      '6xl': { size: '3.75rem', lineHeight: '1.1', weight: '700' },     // 60px
    },
    
    letterSpacing: {
      heading: '-0.005em', // -0.5% for headings
      body: '0',           // Default for body
    },
  },
  
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '2rem',     // 32px
    lg: '4rem',     // 64px
    xl: '8rem',     // 128px
  },
  
  layout: {
    containerMaxWidth: '1200px',
    navbarHeight: '4rem',
    cardPadding: '1.5rem',
    mobileMargin: '1rem',
  },
  
  borderRadius: {
    sm: '0.125rem',   // 2px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    full: '9999px',
  },
  
  shadows: {
    subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    large: '0 10px 15px rgba(0, 0, 0, 0.1)',
    focus: '0 0 0 3px rgba(0, 194, 179, 0.1)',
    focusDanger: '0 0 0 3px rgba(239, 68, 68, 0.1)',
    focusSuccess: '0 0 0 3px rgba(34, 197, 94, 0.1)',
    focusInfo: '0 0 0 3px rgba(14, 165, 233, 0.1)',
  },
  
  motion: {
    durations: {
      fast: '150ms',
      base: '250ms',
      slow: '500ms',
    },
    
    easings: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const

// Export individual token categories for easier importing
export const colors = designTokens.colors
export const typography = designTokens.typography
export const spacing = designTokens.spacing
export const layout = designTokens.layout
export const borderRadius = designTokens.borderRadius
export const shadows = designTokens.shadows
export const motion = designTokens.motion

// Utility function to get design token values
export function getToken(path: string): string | number {
  const keys = path.split('.')
  let value: unknown = designTokens
  
  for (const key of keys) {
    value = (value as Record<string, unknown>)?.[key]
  }
  
  return (typeof value === 'string' || typeof value === 'number') ? value : ''
}