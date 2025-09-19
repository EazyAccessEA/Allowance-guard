'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Professional card variants following design system
const cardVariants = cva(
  // Base styles - clean, minimal, with subtle elevation
  'rounded-base border border-border-default bg-white text-text-primary shadow-subtle transition-all duration-150',
  {
    variants: {
      variant: {
        default: 'border-border-default',
        elevated: 'shadow-medium hover:shadow-large',
        outlined: 'border-2 border-border-default shadow-none',
        ghost: 'border-none shadow-none bg-transparent',
      },
      size: {
        sm: 'p-4',
        default: 'p-6', // 1.5rem as per design system
        lg: 'p-8',
        xl: 'p-10',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-medium hover:border-primary/20 transition-all duration-150',
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
