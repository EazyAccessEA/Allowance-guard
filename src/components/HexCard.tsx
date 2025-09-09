'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface HexCardProps {
  children: React.ReactNode
  className?: string
  eyebrow?: string
  eyebrowColor?: 'brand' | 'danger' | 'warn' | 'info'
  hover?: boolean
}

export function HexCard({ 
  children, 
  className, 
  eyebrow, 
  eyebrowColor = 'brand',
  hover = true 
}: HexCardProps) {
  const eyebrowClasses = {
    brand: 'bg-primary text-primary-foreground',
    danger: 'bg-destructive text-destructive-foreground',
    warn: 'bg-warning text-foreground',
    info: 'bg-secondary text-secondary-foreground',
  }
  
  return (
    <div className={cn(
      'bg-surface border border-border transition-all duration-200',
      hover && 'hover:bg-surface/80 hover:border-primary/50',
      className
    )}>
      {eyebrow && (
        <div className={cn(
          'hex-clip inline-block px-3 py-1 text-xs font-medium mb-4',
          eyebrowClasses[eyebrowColor]
        )}>
          {eyebrow}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
