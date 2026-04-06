'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { getAccessibilityClasses, keyboardNavigation } from '@/lib/accessibility'

// Monochrome Pro Button Variants
// Primary = Pure White. Destructive = Vibrant Crimson. Everything else = zinc.
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-base font-button transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary — Pure White button, black text
        primary: 'bg-white text-black hover:bg-neutral-200 active:bg-neutral-300 shadow-sm hover:shadow-md',

        // Secondary — transparent with zinc border
        secondary: 'border border-secondary-700 bg-transparent text-neutral-300 hover:bg-secondary-800 hover:border-secondary-500 hover:text-white',

        // Ghost — no border, subtle hover
        ghost: 'text-neutral-400 hover:bg-secondary-800 hover:text-white active:bg-secondary-700',

        // Destructive — Vibrant Crimson (THE color)
        destructive: 'bg-crimson-500 text-white hover:bg-crimson-600 active:bg-crimson-700 shadow-sm hover:shadow-glow-crimson',

        // Outline — zinc border
        outline: 'border border-secondary-700 bg-transparent text-neutral-300 hover:bg-secondary-800 hover:border-secondary-500 hover:text-white',

        // Link
        link: 'text-neutral-400 underline-offset-4 hover:underline hover:text-white',

        // Semantic variants
        success: 'bg-semantic-success-500 text-white hover:bg-semantic-success-600 active:bg-semantic-success-700 shadow-sm',
        warning: 'bg-semantic-warning-500 text-white hover:bg-semantic-warning-600 active:bg-semantic-warning-700 shadow-sm',
        info: 'bg-semantic-info-500 text-white hover:bg-semantic-info-600 active:bg-semantic-info-700 shadow-sm',

        // Subtle — barely-there zinc
        subtle: 'bg-secondary-800 text-neutral-300 hover:bg-secondary-700 hover:text-white',
        accent: 'bg-secondary-800 text-neutral-300 hover:bg-secondary-700 hover:text-white',
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
