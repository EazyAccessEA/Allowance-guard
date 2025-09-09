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
  const baseClasses = 'hex-clip hex-focus transition-normal font-medium inline-flex items-center justify-center border-2'
  
  const variantClasses = {
    primary: 'bg-ag-brand text-ag-bg border-ag-brand hover:bg-ag-brand-hover hover:border-ag-brand-hover',
    ghost: 'bg-transparent text-ag-text border-ag-line hover:bg-ag-panel-hover hover:border-ag-line-hover',
    danger: 'bg-ag-danger text-ag-bg border-ag-danger hover:bg-ag-danger-hover hover:border-ag-danger-hover',
    warn: 'bg-ag-warn text-ag-bg border-ag-warn hover:bg-ag-warn-hover hover:border-ag-warn-hover',
    info: 'bg-ag-info text-ag-bg border-ag-info hover:bg-ag-info-hover hover:border-ag-info-hover',
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
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
