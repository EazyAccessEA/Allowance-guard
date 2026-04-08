'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { getAccessibilityClasses, keyboardNavigation } from '@/lib/accessibility'

// Ledger Button Variants — paper theme, WCAG-verified contrast pairs
// Primary = Amber + ink (8.9:1). Secondary = Ink border + ink text.
// Destructive = Crimson-paper + cream (6.4:1).
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-base font-button transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary — Amber gradient, ink text (8.9:1 AAA verified)
        primary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-ink font-semibold hover:from-amber-400 hover:to-amber-500 active:from-amber-600 active:to-amber-700 shadow-sm',

        // Secondary — 2px ink border for strong button affordance on paper
        // (replaces the old 1px ink-rule at 0.14 opacity which was invisible)
        secondary: 'border-2 border-ink bg-transparent text-ink font-medium hover:bg-ink hover:text-paper',

        // Ghost — no border, subtle hover
        ghost: 'text-ink-muted hover:bg-paper-sub hover:text-ink active:bg-paper-sub',

        // Destructive — deep crimson + cream (6.4:1 AA verified)
        // Was bg-crimson-500 text-ink = 4.4:1, FAILED AA-normal
        destructive: 'bg-crimson-paper text-cream font-semibold hover:opacity-90 active:opacity-80 shadow-sm',

        // Outline — same as secondary (strong ink border)
        outline: 'border-2 border-ink bg-transparent text-ink font-medium hover:bg-ink hover:text-paper',

        // Link — amber-deep (text-grade amber, AA on paper)
        link: 'text-amber-deep underline-offset-4 hover:underline font-medium',

        // Semantic variants — cream text on dark backgrounds for AA
        success: 'bg-semantic-success-700 text-cream hover:bg-semantic-success-800 active:bg-semantic-success-900 font-semibold shadow-sm',
        warning: 'bg-amber-500 text-ink hover:bg-amber-600 active:bg-amber-700 font-semibold shadow-sm',
        info: 'bg-ink-blue text-cream hover:opacity-90 active:opacity-80 font-semibold shadow-sm',

        // Subtle — paper-sub chip
        subtle: 'bg-paper-sub text-ink-soft hover:bg-paper-deep hover:text-ink',
        accent: 'bg-paper-sub text-amber-deep hover:bg-paper-deep font-medium',
      },
      size: {
        // Mobbin-inspired size variants with systematic scaling
        xs: 'h-8 px-3 text-xs',           // 32px - Extra small for compact layouts
        sm: 'h-9 px-3.5 text-sm',         // 36px - Small for secondary actions
        default: 'h-10 px-4 text-sm',     // 40px - Default size
        lg: 'h-11 px-6 text-base',        // 44px - Large for primary actions
        xl: 'h-12 px-8 text-lg',          // 48px - Extra large for hero CTAs
        '2xl': 'h-14 px-10 text-xl',      // 56px - 2XL for display buttons
        '3xl': 'h-16 px-12 text-2xl',     // 64px - 3XL for massive CTAs
        icon: 'h-10 w-10',                // 40px - Square icon button
        'icon-sm': 'h-8 w-8',             // 32px - Small icon button
        'icon-lg': 'h-12 w-12',           // 48px - Large icon button
        'icon-xl': 'h-14 w-14',           // 56px - Extra large icon button
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  // Accessibility enhancements
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaExpanded?: boolean
  ariaPressed?: boolean
  ariaControls?: string
  // Keyboard navigation
  onEnter?: () => void
  onEscape?: () => void
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    loading = false, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    // Accessibility props
    ariaLabel,
    ariaDescribedBy,
    ariaExpanded,
    ariaPressed,
    ariaControls,
    onEnter,
    onEscape,
    ...props 
  }, ref) => {
    // Enhanced keyboard navigation
    const keyboardHandlers = {
      ...keyboardNavigation.onEnter(() => {
        if (onEnter && !disabled && !loading) {
          onEnter()
        }
      }),
      ...keyboardNavigation.onEscape(() => {
        if (onEscape && !disabled && !loading) {
          onEscape()
        }
      }),
    }
    
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, fullWidth }),
          getAccessibilityClasses({
            focus: 'ring',
            reducedMotion: true,
          }),
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={ariaExpanded}
        aria-pressed={ariaPressed}
        aria-controls={ariaControls}
        aria-busy={loading}
        {...keyboardHandlers}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
