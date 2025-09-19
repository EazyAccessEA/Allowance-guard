// Design System Tokens
// Professional design system following the Serum Teal theme specification

export const designTokens = {
  colors: {
    // Mobbin-Inspired Primary Color Scale (9-step)
    primary: {
      50: '#F0FDFA',   // Lightest teal
      100: '#CCFBF1',  // Very light teal
      200: '#99F6E4',  // Light teal
      300: '#5EEAD4',  // Medium light teal
      400: '#2DD4BF',  // Medium teal
      500: '#00C2B3',  // Base Serum Teal (brand color)
      600: '#00A896',  // Medium dark teal
      700: '#008B7A',  // Dark teal
      800: '#006B5F',  // Very dark teal
      900: '#004B44',  // Darkest teal
      // Legacy support
      accent: '#00C2B3',
      foreground: '#FFFFFF',
    },
    
    // Mobbin-Inspired Secondary Color Scale (9-step)
    secondary: {
      50: '#F8FAFC',   // Lightest slate
      100: '#F1F5F9',  // Very light slate
      200: '#E2E8F0',  // Light slate
      300: '#CBD5E1',  // Medium light slate
      400: '#94A3B8',  // Medium slate
      500: '#64748B',  // Base slate
      600: '#475569',  // Medium dark slate
      700: '#334155',  // Dark slate
      800: '#1E293B',  // Very dark slate
      900: '#0F172A',  // Darkest slate
    },
    
    // Mobbin-Inspired Neutral Color Scale (9-step)
    neutral: {
      50: '#FAFAFA',   // Lightest neutral
      100: '#F5F5F5',  // Very light neutral
      200: '#E5E5E5',  // Light neutral
      300: '#D4D4D4',  // Medium light neutral
      400: '#A3A3A3',  // Medium neutral
      500: '#737373',  // Base neutral
      600: '#525252',  // Medium dark neutral
      700: '#404040',  // Dark neutral
      800: '#262626',  // Very dark neutral
      900: '#171717',  // Darkest neutral
    },
    
    // Mobbin-Inspired Background System
    background: {
      primary: '#FFFFFF',     // White background
      secondary: '#F8FAFC',   // Light background
      tertiary: '#F1F5F9',    // Muted background
      inverse: '#0F172A',     // Dark background
      // Legacy support
      light: '#F9FAFB',
      dark: '#111827',
      white: '#FFFFFF',
    },
    
    // Mobbin-Inspired Text System
    text: {
      primary: '#0F172A',     // Darkest text
      secondary: '#475569',   // Medium text
      tertiary: '#94A3B8',    // Muted text
      inverse: '#FFFFFF',     // Light text
      // Legacy support
      muted: '#9CA3AF',
    },
    
    // Mobbin-Inspired Border System
    border: {
      primary: '#E2E8F0',     // Primary border
      secondary: '#CBD5E1',   // Secondary border
      tertiary: '#F1F5F9',    // Tertiary border
      focus: '#00C2B3',       // Focus border (Serum Teal)
      // Legacy support
      default: '#E5E7EB',
      muted: '#F3F4F6',
    },
    
    // Mobbin-Inspired Semantic Color System
    semantic: {
      // Success Color Scale (9-step)
      success: {
        50: '#F0FDF4',   // Lightest green
        100: '#DCFCE7',  // Very light green
        200: '#BBF7D0',  // Light green
        300: '#86EFAC',  // Medium light green
        400: '#4ADE80',  // Medium green
        500: '#22C55E',  // Base green
        600: '#16A34A',  // Medium dark green
        700: '#15803D',  // Dark green
        800: '#166534',  // Very dark green
        900: '#14532D',  // Darkest green
        // Legacy support
        light: '#DCFCE7',
        dark: '#16A34A',
      },
      
      // Warning Color Scale (9-step)
      warning: {
        50: '#FFFBEB',   // Lightest amber
        100: '#FEF3C7',  // Very light amber
        200: '#FDE68A',  // Light amber
        300: '#FCD34D',  // Medium light amber
        400: '#FBBF24',  // Medium amber
        500: '#F59E0B',  // Base amber
        600: '#D97706',  // Medium dark amber
        700: '#B45309',  // Dark amber
        800: '#92400E',  // Very dark amber
        900: '#78350F',  // Darkest amber
        // Legacy support
        light: '#FEF3C7',
        dark: '#D97706',
      },
      
      // Error Color Scale (9-step)
      error: {
        50: '#FEF2F2',   // Lightest red
        100: '#FEE2E2',  // Very light red
        200: '#FECACA',  // Light red
        300: '#FCA5A5',  // Medium light red
        400: '#F87171',  // Medium red
        500: '#EF4444',  // Base red
        600: '#DC2626',  // Medium dark red
        700: '#B91C1C',  // Dark red
        800: '#991B1B',  // Very dark red
        900: '#7F1D1D',  // Darkest red
        // Legacy support
        danger: '#EF4444',
        light: '#FEE2E2',
        dark: '#DC2626',
      },
      
      // Info Color Scale (9-step)
      info: {
        50: '#F0F9FF',   // Lightest blue
        100: '#E0F2FE',  // Very light blue
        200: '#BAE6FD',  // Light blue
        300: '#7DD3FC',  // Medium light blue
        400: '#38BDF8',  // Medium blue
        500: '#0EA5E9',  // Base blue
        600: '#0284C7',  // Medium dark blue
        700: '#0369A1',  // Dark blue
        800: '#075985',  // Very dark blue
        900: '#0C4A6E',  // Darkest blue
        // Legacy support
        light: '#DBEAFE',
        dark: '#0284C7',
      },
    },
    
    // Enhanced Semantic Backgrounds - Sketch-Inspired
    semanticBg: {
      danger: '#FEF2F2',
      success: '#F0FDF4',
      info: '#F0F9FF',
      warning: '#FFFBEB',
      
      // Enhanced variants for better contrast
      dangerSubtle: '#FEF7F7',
      successSubtle: '#F7FEF7',
      infoSubtle: '#F7FBFF',
      warningSubtle: '#FFFDF7',
    },
  },
  
  typography: {
    fonts: {
      heading: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      // Sketch-inspired additional font weights
      display: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'], // For large displays
    },
    
    // Enhanced Typography Scale - Sketch-Inspired
    sizes: {
      xs: { size: '0.75rem', lineHeight: '1.25rem', weight: '500', letterSpacing: '0.025em' },   // 12px
      sm: { size: '0.875rem', lineHeight: '1.375rem', weight: '400', letterSpacing: '0.01em' }, // 14px  
      base: { size: '1rem', lineHeight: '1.5rem', weight: '400', letterSpacing: '0' },     // 16px
      lg: { size: '1.125rem', lineHeight: '1.625rem', weight: '400', letterSpacing: '-0.01em' }, // 18px
      xl: { size: '1.25rem', lineHeight: '1.75rem', weight: '600', letterSpacing: '-0.01em' },   // 20px
      '2xl': { size: '1.5rem', lineHeight: '2rem', weight: '600', letterSpacing: '-0.02em' },    // 24px
      '3xl': { size: '1.875rem', lineHeight: '2.25rem', weight: '700', letterSpacing: '-0.025em' }, // 30px
      '4xl': { size: '2.25rem', lineHeight: '2.5rem', weight: '700', letterSpacing: '-0.03em' },  // 36px
      '5xl': { size: '3rem', lineHeight: '1.1', weight: '700', letterSpacing: '-0.035em' },        // 48px
      '6xl': { size: '3.75rem', lineHeight: '1.1', weight: '700', letterSpacing: '-0.04em' },     // 60px
      // Sketch-inspired additional sizes
      '7xl': { size: '4.5rem', lineHeight: '1.05', weight: '800', letterSpacing: '-0.045em' },    // 72px
      '8xl': { size: '6rem', lineHeight: '1', weight: '800', letterSpacing: '-0.05em' },          // 96px
    },
    
    // Enhanced Letter Spacing - Sketch-Inspired
    letterSpacing: {
      heading: '-0.02em',    // -2% for headings (improved)
      body: '0',             // Default for body
      display: '-0.03em',    // -3% for display text
      caption: '0.025em',    // +2.5% for captions
      button: '0.01em',      // +1% for buttons
    },
    
    // Sketch-Inspired Font Weights
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
  
  // Enhanced Spacing System - Sketch-Inspired 8pt Grid
  spacing: {
    // Base 8pt grid system
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
  
  // Enhanced Motion System - Sketch-Inspired
  motion: {
    durations: {
      instant: '0ms',        // Instant transitions
      fast: '150ms',         // Quick interactions
      base: '250ms',         // Standard transitions
      slow: '500ms',         // Slow transitions
      slower: '750ms',       // Very slow transitions
      slowest: '1000ms',     // Slowest transitions
    },
    
    // Sketch-Inspired Easing Functions
    easings: {
      // Standard easings
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      
      // Sketch-inspired enhanced easings
      easeInQuart: 'cubic-bezier(0.5, 0, 0.75, 0)',
      easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
      easeInOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
      easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
      easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
      easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
      
      // Sketch-specific easings
      sketchEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      sketchEaseIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
      sketchEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      sketchEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    },
    
    // Sketch-Inspired Animation Presets
    presets: {
      fadeIn: {
        duration: '250ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        properties: ['opacity'],
      },
      slideUp: {
        duration: '300ms',
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        properties: ['transform', 'opacity'],
      },
      scaleIn: {
        duration: '200ms',
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        properties: ['transform', 'opacity'],
      },
      buttonPress: {
        duration: '150ms',
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        properties: ['transform'],
      },
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