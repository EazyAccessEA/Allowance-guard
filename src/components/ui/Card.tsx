'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Enhanced card variants following Sketch-inspired design system
const cardVariants = cva(
  // Base styles - Sketch-inspired interactions and states
  'rounded-base border border-border-default bg-white text-text-primary shadow-subtle transition-all duration-150 hover:transition-all hover:duration-150',
  {
    variants: {
      variant: {
        default: 'border-border-default hover:border-neutral-300',
        elevated: 'shadow-medium hover:shadow-large active:shadow-medium',
        outlined: 'border-2 border-border-default shadow-none hover:border-neutral-400',
        ghost: 'border-none shadow-none bg-transparent hover:bg-neutral-50',
        // Sketch-inspired additional variants
        success: 'border-semantic-success-light bg-semantic-success-light/10 hover:border-semantic-success hover:bg-semantic-success-light/20',
        warning: 'border-semantic-warning-light bg-semantic-warning-light/10 hover:border-semantic-warning hover:bg-semantic-warning-light/20',
        danger: 'border-semantic-danger-light bg-semantic-danger-light/10 hover:border-semantic-danger hover:bg-semantic-danger-light/20',
        info: 'border-semantic-info-light bg-semantic-info-light/10 hover:border-semantic-info hover:bg-semantic-info-light/20',
      },
      size: {
        xs: 'p-3',           // Extra small for compact layouts
        sm: 'p-4',           // Small for secondary content
        default: 'p-6',      // Default size
        lg: 'p-8',           // Large for primary content
        xl: 'p-10',          // Extra large for hero content
        '2xl': 'p-12',       // 2XL for display content
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-medium hover:border-primary/20 active:shadow-subtle active:scale-98 transition-all duration-150',
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
              <h3 className="text-lg font-semibold leading-tight text-text-primary">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-text-secondary">
                {description}
              </p>
            )}
          </div>
        )}
        
        {/* Content */}
        {children}
        
        {/* Footer Section */}
        {footer && (
          <div className="mt-4 pt-4 border-t border-border-default">
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
    className={cn("text-lg font-semibold leading-tight text-text-primary", className)}
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
    className={cn("text-sm text-text-secondary", className)}
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
    className={cn("flex items-center pt-4 mt-4 border-t border-border-default", className)}
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
