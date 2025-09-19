'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Mobbin-Inspired Card Variants
const cardVariants = cva(
  // Base styles - Mobbin-inspired interactions and states
  'rounded-base border bg-background-primary text-text-primary shadow-sm transition-all duration-150 hover:transition-all hover:duration-150',
  {
    variants: {
      variant: {
        // Default: Mobbin-inspired clean card
        default: 'border-border-primary hover:border-border-secondary',
        elevated: 'shadow-md hover:shadow-lg active:shadow-md',
        outlined: 'border-2 border-border-primary shadow-none hover:border-border-secondary',
        ghost: 'border-none shadow-none bg-transparent hover:bg-background-secondary',
        // Mobbin-inspired semantic variants
        success: 'border-semantic-success-200 bg-semantic-success-50 hover:border-semantic-success-300 hover:bg-semantic-success-100',
        warning: 'border-semantic-warning-200 bg-semantic-warning-50 hover:border-semantic-warning-300 hover:bg-semantic-warning-100',
        danger: 'border-semantic-error-200 bg-semantic-error-50 hover:border-semantic-error-300 hover:bg-semantic-error-100',
        info: 'border-semantic-info-200 bg-semantic-info-50 hover:border-semantic-info-300 hover:bg-semantic-info-100',
        // Mobbin-inspired additional variants
        subtle: 'border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100',
        accent: 'border-primary-200 bg-primary-50 hover:border-primary-300 hover:bg-primary-100',
      },
      size: {
        // Mobbin-inspired size variants with systematic spacing
        xs: 'p-3',           // 12px - Extra small for compact layouts
        sm: 'p-4',           // 16px - Small for secondary content
        default: 'p-6',      // 24px - Default size
        lg: 'p-8',           // 32px - Large for primary content
        xl: 'p-10',          // 40px - Extra large for hero content
        '2xl': 'p-12',       // 48px - 2XL for display content
        '3xl': 'p-16',       // 64px - 3XL for massive content
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md hover:border-primary-300 active:shadow-sm active:scale-98 transition-all duration-150',
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
              <h3 className="mobbin-heading-4 text-text-primary">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-1 mobbin-body-small text-text-secondary">
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
    className={cn("mobbin-heading-4 text-text-primary", className)}
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
    className={cn("mobbin-body-small text-text-secondary", className)}
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
