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
    brand: 'bg-ag-brand text-ag-bg',
    danger: 'bg-ag-danger text-ag-bg',
    warn: 'bg-ag-warn text-ag-bg',
    info: 'bg-ag-info text-ag-bg',
    neutral: 'bg-ag-panel text-ag-text border border-ag-line',
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
