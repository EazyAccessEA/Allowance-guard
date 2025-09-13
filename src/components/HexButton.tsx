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
    primary: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-transparent hover:from-blue-700 hover:to-blue-600 focus:ring-blue-500/30',
    ghost: 'bg-transparent text-ink border-line hover:bg-mist hover:border-line focus:ring-ink/20',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white border-transparent hover:from-red-700 hover:to-red-600 focus:ring-red-500/30',
    warn: 'bg-gradient-to-r from-amber-500 to-amber-400 text-white border-transparent hover:from-amber-600 hover:to-amber-500 focus:ring-amber-500/30',
    info: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-transparent hover:from-emerald-700 hover:to-emerald-600 focus:ring-emerald-500/30',
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
