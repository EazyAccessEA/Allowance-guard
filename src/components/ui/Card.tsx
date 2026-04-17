'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Card primitive — unified Ledger canon (ADR 0007).
// Glass / glass-accent variants retired. `dark:` branches stripped —
// AllowanceGuard is a single-theme product. Semantic tints calibrated
// for paper (semantic-*-600/700 text; -50 paper-sub-tinted backgrounds).
const cardVariants = cva(
 'border bg-paper-deep text-ink shadow-sm transition-all duration-150',
 {
 variants: {
 variant: {
 default: 'border-ink-rule hover:border-amber-deep/40',
 elevated: 'shadow-md hover:shadow-lg active:shadow-md border-ink-rule',
 outlined: 'border-2 border-ink-rule shadow-none hover:border-amber-deep/60',
 ghost: 'border-none shadow-none bg-transparent hover:bg-paper-sub',
 // Semantic tints — paper-sub-tinted backgrounds, semantic-600/700 hairlines.
 success: 'border-semantic-success-600/40 bg-paper-sub hover:border-semantic-success-700/60',
 warning: 'border-semantic-warning-600/40 bg-paper-sub hover:border-semantic-warning-700/60',
 danger: 'border-crimson-paper/40 bg-paper-sub hover:border-crimson-paper/60',
 info: 'border-ink-blue/30 bg-paper-sub hover:border-ink-blue/50',
 subtle: 'border-ink-rule bg-paper-sub hover:border-ink-rule/80',
 accent: 'border-amber-deep/40 bg-paper-sub hover:border-amber-deep/60',
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
 true: 'cursor-pointer hover:shadow-md hover:border-amber-deep/40 active:shadow-sm transition-all duration-150',
 false: '',
 },
 },
 defaultVariants: {
 variant: 'default',
 size: 'default',
 interactive: false,
 },
 },
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
 <h3 className="mobbin-heading-4 text-ink">
 {title}
 </h3>
 )}
 {description && (
 <p className="mt-1 mobbin-body-small text-ink-muted">
 {description}
 </p>
 )}
 </div>
 )}
 
 {/* Content */}
 {children}
 
 {/* Footer Section */}
 {footer && (
 <div className="mt-4 pt-4 border-t border-ink-rule">
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
 className={cn("mobbin-heading-4 text-ink", className)}
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
 className={cn("mobbin-body-small text-ink-muted", className)}
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
 className={cn("flex items-center pt-4 mt-4 border-t border-ink-rule", className)}
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
