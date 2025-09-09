'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface HexBadgeProps {
  children: React.ReactNode
  variant?: 'brand' | 'danger' | 'warn' | 'info' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function HexBadge({ 
  children, 
  variant = 'neutral', 
  size = 'md',
  className 
}: HexBadgeProps) {
  const baseClasses = 'hex-clip inline-flex items-center font-medium'
  
  const variantClasses = {
    brand: 'bg-primary text-primary-foreground',
    danger: 'bg-destructive text-destructive-foreground',
    warn: 'bg-warning text-foreground',
    info: 'bg-secondary text-secondary-foreground',
    neutral: 'bg-surface text-foreground border border-border',
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }
  
  return (
    <span className={cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  )
}
