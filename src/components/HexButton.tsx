'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface HexButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'warn' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function HexButton({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: HexButtonProps) {
  const baseClasses = 'rounded-full transition-all duration-200 font-medium inline-flex items-center justify-center border-2 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/90',
    ghost: 'bg-transparent text-foreground border-border hover:bg-surface hover:border-border',
    danger: 'bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90 hover:border-destructive/90',
    warn: 'bg-warning text-foreground border-warning hover:bg-warning/90 hover:border-warning/90',
    info: 'bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/90 hover:border-secondary/90',
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
  }
  
  const focusClasses = {
    primary: 'hex-focus',
    ghost: 'hex-focus',
    danger: 'hex-focus-danger',
    warn: 'hex-focus-warn',
    info: 'hex-focus-info',
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        focusClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
