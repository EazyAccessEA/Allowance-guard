'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { getAccessibilityClasses, keyboardNavigation } from '@/lib/accessibility'

// Mobbin-Inspired Button Variants
const buttonVariants = cva(
  // Base styles - Mobbin-inspired interactions and states
  'inline-flex items-center justify-center rounded-base font-button transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-98 hover:transition-all hover:duration-150',
  {
    variants: {
      variant: {
        // Primary: Mobbin-inspired primary with systematic color scale
        primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md active:shadow-lg',
        
        // Secondary: Mobbin-inspired secondary with subtle background
        secondary: 'border border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 hover:border-primary-300 active:bg-primary-200 shadow-sm',
        
        // Ghost: Mobbin-inspired ghost with neutral colors
        ghost: 'hover:bg-neutral-100 text-neutral-700 active:bg-neutral-200',
        
        // Destructive: Mobbin-inspired danger with systematic color scale
        destructive: 'bg-semantic-error-500 text-white hover:bg-semantic-error-600 active:bg-semantic-error-700 shadow-sm hover:shadow-md active:shadow-lg',
        
        // Outline: Mobbin-inspired outline with better contrast
        outline: 'border border-neutral-300 bg-white hover:bg-neutral-50 hover:border-neutral-400 text-neutral-700 shadow-sm active:bg-neutral-100',
        
        // Link: Mobbin-inspired link with primary colors
        link: 'text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 focus:text-primary-700',
        
        // Mobbin-inspired semantic variants
        success: 'bg-semantic-success-500 text-white hover:bg-semantic-success-600 active:bg-semantic-success-700 shadow-sm hover:shadow-md active:shadow-lg',
        warning: 'bg-semantic-warning-500 text-white hover:bg-semantic-warning-600 active:bg-semantic-warning-700 shadow-sm hover:shadow-md active:shadow-lg',
        info: 'bg-semantic-info-500 text-white hover:bg-semantic-info-600 active:bg-semantic-info-700 shadow-sm hover:shadow-md active:shadow-lg',
        
        // Mobbin-inspired additional variants
        subtle: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300',
        accent: 'bg-primary-100 text-primary-800 hover:bg-primary-200 active:bg-primary-300',
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
