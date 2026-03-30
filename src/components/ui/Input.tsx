'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Professional input variants following design system
const inputVariants = cva(
  // Base styles - clean, minimal, accessible
  'flex w-full border border-border-default bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'rounded-base',
        rounded: 'rounded-lg',
      },
      inputSize: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-10 px-3 py-2',
        lg: 'h-11 px-4 py-3',
      },
      state: {
        default: '',
        error: 'border-semantic-danger focus-visible:ring-semantic-danger',
        success: 'border-semantic-success focus-visible:ring-semantic-success',
        warning: 'border-semantic-warning focus-visible:ring-semantic-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
      state: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  description?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    inputSize, 
    state, 
    label, 
    description, 
    error, 
    leftIcon, 
    rightIcon, 
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = error || state === 'error'
    const currentState = hasError ? 'error' : state

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(
              inputVariants({ variant, inputSize, state: currentState }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
        
        {description && !error && (
          <p className="mt-1 text-xs text-text-tertiary">
            {description}
          </p>
        )}
        
        {error && (
          <p className="mt-1 text-xs text-semantic-danger">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
