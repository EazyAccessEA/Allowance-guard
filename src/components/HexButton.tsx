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
    primary: 'bg-black text-white border-transparent hover:bg-gray-800 focus:ring-gray-500/30',
    ghost: 'bg-black text-white border-transparent hover:bg-gray-800 focus:ring-gray-500/30',
    danger: 'bg-black text-white border-transparent hover:bg-gray-800 focus:ring-gray-500/30',
    warn: 'bg-black text-white border-transparent hover:bg-gray-800 focus:ring-gray-500/30',
    info: 'bg-black text-white border-transparent hover:bg-gray-800 focus:ring-gray-500/30',
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
