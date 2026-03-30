'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { getAccessibilityClasses, keyboardNavigation } from '@/lib/accessibility'

// Mobbin-Inspired Button Variants with Dark Mode + Glow
const buttonVariants = cva(
  // Base styles with dark mode support
  'inline-flex items-center justify-center rounded-base font-button mobbin-focus-ring mobbin-button-press transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 dark:focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary-900 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary with glow effect in dark mode
        primary: 'bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900 shadow-sm hover:shadow-md active:shadow-lg mobbin-hover-lift dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700 dark:hover:shadow-glow-primary',

        // Secondary with dark mode adaptation
        secondary: 'border border-primary-300 bg-primary-50 text-primary-800 hover:bg-primary-100 hover:border-primary-400 active:bg-primary-200 shadow-sm dark:border-primary-700 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/40 dark:hover:border-primary-600',

        // Ghost with dark mode
        ghost: 'hover:bg-neutral-100 text-neutral-800 active:bg-neutral-200 dark:text-secondary-200 dark:hover:bg-secondary-800 dark:active:bg-secondary-700',

        // Destructive with dark mode
        destructive: 'bg-semantic-error-500 text-white hover:bg-semantic-error-600 active:bg-semantic-error-700 shadow-sm hover:shadow-md active:shadow-lg dark:bg-semantic-error-600 dark:hover:bg-semantic-error-500',

        // Outline with dark mode
        outline: 'border border-neutral-400 bg-white hover:bg-neutral-50 hover:border-neutral-500 text-neutral-800 shadow-sm active:bg-neutral-100 dark:border-secondary-600 dark:bg-transparent dark:text-secondary-200 dark:hover:bg-secondary-800 dark:hover:border-secondary-500',

        // Link with dark mode
        link: 'text-primary-700 underline-offset-4 hover:underline hover:text-primary-800 focus:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300',

        // Semantic variants with dark mode
        success: 'bg-semantic-success-500 text-white hover:bg-semantic-success-600 active:bg-semantic-success-700 shadow-sm hover:shadow-md dark:bg-semantic-success-600 dark:hover:bg-semantic-success-500',
        warning: 'bg-semantic-warning-500 text-white hover:bg-semantic-warning-600 active:bg-semantic-warning-700 shadow-sm hover:shadow-md dark:bg-semantic-warning-600 dark:hover:bg-semantic-warning-500',
        info: 'bg-semantic-info-500 text-white hover:bg-semantic-info-600 active:bg-semantic-info-700 shadow-sm hover:shadow-md dark:bg-semantic-info-600 dark:hover:bg-semantic-info-500',

        // Additional variants with dark mode
        subtle: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700',
        accent: 'bg-primary-100 text-primary-900 hover:bg-primary-200 active:bg-primary-300 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50',
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
