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
      // Mobbin-Inspired Font System
      heading: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      display: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'], // For large displays
      // Mobbin-inspired additional font families
      caption: ['Inter', 'system-ui', 'sans-serif'], // For small text
      button: ['Inter', 'system-ui', 'sans-serif'], // For buttons and CTAs
    },
    
    // Mobbin-Inspired Typography Scale (Systematic 8px-based scale)
    sizes: {
      // Mobile-first approach with systematic scaling
      xs: { 
        size: '0.75rem',      // 12px - Mobile captions
        lineHeight: '1.25rem', // 20px
        weight: '500', 
        letterSpacing: '0.025em',
        mobile: { size: '0.75rem', lineHeight: '1.25rem' }
      },
      sm: { 
        size: '0.875rem',     // 14px - Mobile body
        lineHeight: '1.375rem', // 22px
        weight: '400', 
        letterSpacing: '0.01em',
        mobile: { size: '0.875rem', lineHeight: '1.375rem' }
      },
      base: { 
        size: '1rem',         // 16px - Base body
        lineHeight: '1.5rem', // 24px
        weight: '400', 
        letterSpacing: '0',
        mobile: { size: '0.875rem', lineHeight: '1.375rem' }
      },
      lg: { 
        size: '1.125rem',     // 18px - Large body
        lineHeight: '1.625rem', // 26px
        weight: '400', 
        letterSpacing: '-0.01em',
        mobile: { size: '1rem', lineHeight: '1.5rem' }
      },
      xl: { 
        size: '1.25rem',      // 20px - Small headings
        lineHeight: '1.75rem', // 28px
        weight: '600', 
        letterSpacing: '-0.01em',
        mobile: { size: '1.125rem', lineHeight: '1.625rem' }
      },
      '2xl': { 
        size: '1.5rem',       // 24px - Medium headings
        lineHeight: '2rem',   // 32px
        weight: '600', 
        letterSpacing: '-0.02em',
        mobile: { size: '1.25rem', lineHeight: '1.75rem' }
      },
      '3xl': { 
        size: '1.875rem',     // 30px - Large headings
        lineHeight: '2.25rem', // 36px
        weight: '700', 
        letterSpacing: '-0.025em',
        mobile: { size: '1.5rem', lineHeight: '2rem' }
      },
      '4xl': { 
        size: '2.25rem',      // 36px - XL headings
        lineHeight: '2.5rem', // 40px
        weight: '700', 
        letterSpacing: '-0.03em',
        mobile: { size: '1.875rem', lineHeight: '2.25rem' }
      },
      '5xl': { 
        size: '3rem',         // 48px - Display headings
        lineHeight: '1.1',    // 52.8px
        weight: '700', 
        letterSpacing: '-0.035em',
        mobile: { size: '2.25rem', lineHeight: '2.5rem' }
      },
      '6xl': { 
        size: '3.75rem',      // 60px - Large display
        lineHeight: '1.1',    // 66px
        weight: '700', 
        letterSpacing: '-0.04em',
        mobile: { size: '2.5rem', lineHeight: '1.2' }
      },
      // Mobbin-inspired additional sizes
      '7xl': { 
        size: '4.5rem',       // 72px - Hero headings
        lineHeight: '1.05',   // 75.6px
        weight: '800', 
        letterSpacing: '-0.045em',
        mobile: { size: '3rem', lineHeight: '1.1' }
      },
      '8xl': { 
        size: '6rem',         // 96px - Massive display
        lineHeight: '1',      // 96px
        weight: '800', 
        letterSpacing: '-0.05em',
        mobile: { size: '3.75rem', lineHeight: '1.1' }
      },
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
  
  // Mobbin-Inspired Spacing System (Systematic 4px/8px Grid)
  spacing: {
    // Base 4px grid system (Mobbin's systematic approach)
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
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '2rem',     // 32px
    lg: '4rem',     // 64px
    xl: '8rem',     // 128px
  },
  
  // Mobbin-Inspired Layout System
  layout: {
    // Container System
    containerMaxWidth: '1200px',
    containerMaxWidthNarrow: '800px',
    containerMaxWidthWide: '1400px',
    
    // Navigation System
    navbarHeight: '4rem',        // 64px
    navbarHeightMobile: '3.5rem', // 56px
    sidebarWidth: '16rem',       // 256px
    sidebarWidthCollapsed: '4rem', // 64px
    
    // Card System
    cardPadding: '1.5rem',       // 24px
    cardPaddingSmall: '1rem',    // 16px
    cardPaddingLarge: '2rem',    // 32px
    cardGap: '1rem',             // 16px
    cardGapLarge: '1.5rem',      // 24px
    
    // Mobile System
    mobileMargin: '1rem',        // 16px
    mobilePadding: '1rem',       // 16px
    mobileGap: '0.75rem',        // 12px
    
    // Grid System
    gridColumns: 12,
    gridGap: '1rem',             // 16px
    gridGapLarge: '1.5rem',      // 24px
    
    // Breakpoints (Mobbin-inspired)
    breakpoints: {
      xs: '320px',   // Mobile small
      sm: '640px',   // Mobile large
      md: '768px',   // Tablet
      lg: '1024px',  // Desktop small
      xl: '1280px',  // Desktop large
      '2xl': '1536px' // Desktop extra large
    },
    
    // Z-Index System
    zIndex: {
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modalBackdrop: 1040,
      modal: 1050,
      popover: 1060,
      tooltip: 1070,
      toast: 1080
    }
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