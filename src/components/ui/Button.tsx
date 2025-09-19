'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { getAccessibilityClasses, keyboardNavigation } from '@/lib/accessibility'

// Enhanced button variants following Sketch-inspired design system
const buttonVariants = cva(
  // Base styles - Sketch-inspired interactions and states
  'inline-flex items-center justify-center rounded-base text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-98 hover:transition-all hover:duration-150',
  {
    variants: {
      variant: {
        // Primary: Solid Serum Teal with Sketch-inspired states
        primary: 'bg-primary text-white hover:bg-semantic-success-dark shadow-subtle hover:shadow-medium active:bg-semantic-success-dark active:shadow-large',
        
        // Secondary: White background with enhanced hover states
        secondary: 'border border-primary bg-white text-primary hover:bg-semantic-success-light hover:border-semantic-success-dark shadow-subtle active:bg-semantic-success-light',
        
        // Ghost: Enhanced with better hover states
        ghost: 'hover:bg-neutral-100 text-text-primary active:bg-neutral-200',
        
        // Destructive: Enhanced danger states
        destructive: 'bg-semantic-danger text-white hover:bg-semantic-danger-dark shadow-subtle hover:shadow-medium active:bg-semantic-danger-dark active:shadow-large',
        
        // Outline: Enhanced with better contrast
        outline: 'border border-border-default bg-white hover:bg-neutral-50 hover:border-neutral-300 text-text-primary shadow-subtle active:bg-neutral-100',
        
        // Link: Enhanced with better focus states
        link: 'text-primary underline-offset-4 hover:underline hover:text-semantic-info-dark focus:text-semantic-info-dark',
        
        // Sketch-inspired additional variants
        success: 'bg-semantic-success text-white hover:bg-semantic-success-dark shadow-subtle hover:shadow-medium active:bg-semantic-success-dark',
        warning: 'bg-semantic-warning text-white hover:bg-semantic-warning-dark shadow-subtle hover:shadow-medium active:bg-semantic-warning-dark',
        info: 'bg-semantic-info text-white hover:bg-semantic-info-dark shadow-subtle hover:shadow-medium active:bg-semantic-info-dark',
      },
      size: {
        // Sketch-inspired size variants with better touch targets
        xs: 'h-8 px-2 text-xs',           // Extra small for compact layouts
        sm: 'h-9 px-3 text-xs',           // Small for secondary actions
        default: 'h-10 px-4 py-2',        // Default size
        lg: 'h-11 px-8 text-lg',          // Large for primary actions
        xl: 'h-12 px-10 text-lg',         // Extra large for hero CTAs
        '2xl': 'h-14 px-12 text-xl',      // 2XL for display buttons
        icon: 'h-10 w-10',                // Square icon button
        'icon-sm': 'h-8 w-8',             // Small icon button
        'icon-lg': 'h-12 w-12',           // Large icon button
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
