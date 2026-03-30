'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Mobbin-Inspired Card Variants with Glassmorphism
const cardVariants = cva(
  // Base styles with dark mode support
  'rounded-base border bg-background-primary dark:bg-secondary-900 text-text-primary dark:text-secondary-100 shadow-sm dark:shadow-dark-subtle transition-all duration-150',
  {
    variants: {
      variant: {
        // Default: Clean card with dark mode
        default: 'border-border-primary dark:border-secondary-700 hover:border-border-secondary dark:hover:border-secondary-600',
        elevated: 'shadow-md dark:shadow-dark-medium hover:shadow-lg dark:hover:shadow-dark-large active:shadow-md',
        outlined: 'border-2 border-border-primary dark:border-secondary-600 shadow-none hover:border-border-secondary dark:hover:border-secondary-500',
        ghost: 'border-none shadow-none bg-transparent hover:bg-background-secondary dark:hover:bg-secondary-800',
        // Semantic variants with dark mode
        success: 'border-semantic-success-200 dark:border-semantic-success-800 bg-semantic-success-50 dark:bg-semantic-success-900/30 hover:border-semantic-success-300 dark:hover:border-semantic-success-700',
        warning: 'border-semantic-warning-200 dark:border-semantic-warning-800 bg-semantic-warning-50 dark:bg-semantic-warning-900/30 hover:border-semantic-warning-300 dark:hover:border-semantic-warning-700',
        danger: 'border-semantic-error-200 dark:border-semantic-error-800 bg-semantic-error-50 dark:bg-semantic-error-900/30 hover:border-semantic-error-300 dark:hover:border-semantic-error-700',
        info: 'border-semantic-info-200 dark:border-semantic-info-800 bg-semantic-info-50 dark:bg-semantic-info-900/30 hover:border-semantic-info-300 dark:hover:border-semantic-info-700',
        subtle: 'border-neutral-200 dark:border-secondary-700 bg-neutral-50 dark:bg-secondary-800/50 hover:border-neutral-300 dark:hover:border-secondary-600',
        accent: 'border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700',
        // Glassmorphism variants
        glass: 'bg-white/60 dark:bg-secondary-900/60 backdrop-blur-glass border-white/30 dark:border-secondary-600/30 shadow-glass dark:shadow-dark-medium hover:bg-white/70 dark:hover:bg-secondary-800/70',
        'glass-accent': 'bg-primary-50/50 dark:bg-primary-900/20 backdrop-blur-glass border-primary-200/40 dark:border-primary-700/30 shadow-glass hover:bg-primary-50/70 dark:hover:bg-primary-900/30',
      },
      size: {
        xs: 'p-3',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
        '2xl': 'p-12',
        '3xl': 'p-16',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md dark:hover:shadow-dark-medium hover:border-primary-300 dark:hover:border-primary-600 active:shadow-sm active:scale-98 transition-all duration-150',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title?: string
  description?: string
  footer?: React.ReactNode
  header?: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    interactive, 
    title, 
    description, 
    header, 
    footer, 
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, size, interactive, className }))}
        ref={ref}
        {...props}
      >
        {/* Header Section */}
        {(header || title || description) && (
          <div className="mb-4 last:mb-0">
            {header}
            {title && (
              <h3 className="mobbin-heading-4 text-text-primary dark:text-secondary-100">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 mobbin-body-small text-text-secondary dark:text-secondary-400">
                {description}
              </p>
            )}
          </div>
        )}
        
        {/* Content */}
        {children}
        
        {/* Footer Section */}
        {footer && (
          <div className="mt-4 pt-4 border-t border-border-default dark:border-secondary-700">
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Subcomponents for more flexible card composition
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("mobbin-heading-4 text-text-primary dark:text-secondary-100", className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mobbin-body-small text-text-secondary dark:text-secondary-400", className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 mt-4 border-t border-border-default dark:border-secondary-700", className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter, 
  cardVariants 
}
