'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Enhanced alert variants following Sketch-inspired design system
const alertVariants = cva(
  // Base styles - Sketch-inspired interactions and states
  'relative w-full rounded-base border px-4 py-3 text-sm transition-all duration-150 hover:transition-all hover:duration-150 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background-light border-border-default text-text-primary hover:border-neutral-300',
        success: 'bg-semantic-success-light border-semantic-success/20 text-semantic-success hover:border-semantic-success/40 hover:bg-semantic-success-light/80',
        danger: 'bg-semantic-danger-light border-semantic-danger/20 text-semantic-danger hover:border-semantic-danger/40 hover:bg-semantic-danger-light/80',
        warning: 'bg-semantic-warning-light border-semantic-warning/20 text-semantic-warning hover:border-semantic-warning/40 hover:bg-semantic-warning-light/80',
        info: 'bg-semantic-info-light border-semantic-info/20 text-semantic-info hover:border-semantic-info/40 hover:bg-semantic-info-light/80',
        // Sketch-inspired additional variants
        subtle: 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100',
        accent: 'bg-primary/5 border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
  icon?: React.ReactNode
  onDismiss?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, icon, onDismiss, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        role="alert"
        {...props}
      >
        {icon && <div className="shrink-0">{icon}</div>}
        
        <div className="flex-1">
          {title && (
            <h5 className="mb-1 font-medium leading-none tracking-tight">
              {title}
            </h5>
          )}
          {children && (
            <div className={cn('text-sm', title && 'mt-1')}>
              {children}
            </div>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Dismiss alert"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

Alert.displayName = 'Alert'

// Toast Component for notifications (disappear after 3s, accessible with role=alert)
export interface ToastProps extends AlertProps {
  isVisible: boolean
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export const Toast: React.FC<ToastProps> = ({
  isVisible,
  duration = 3000,
  position = 'top-right',
  onDismiss,
  className,
  ...props
}) => {
  // Auto-dismiss after duration
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss?.()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onDismiss])

  if (!isVisible) return null

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  }

  return (
    <div className={cn('fixed z-50 max-w-sm animate-sketch-slide-up', positionClasses[position])}>
      <Alert
        className={cn('shadow-large hover:shadow-xl transition-shadow duration-150', className)}
        onDismiss={onDismiss}
        {...props}
      />
    </div>
  )
}

// Success Icons
export const SuccessIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

// Error Icons
export const ErrorIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

// Warning Icons
export const WarningIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
)

// Info Icons
export const InfoIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

export { Alert, alertVariants }
