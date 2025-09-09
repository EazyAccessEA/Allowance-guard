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
    brand: 'bg-ag-brand text-ag-bg',
    danger: 'bg-ag-danger text-ag-bg',
    warn: 'bg-ag-warn text-ag-bg',
    info: 'bg-ag-info text-ag-bg',
  }
  
  return (
    <div className={cn(
      'bg-ag-panel border-2 border-ag-line transition-normal',
      hover && 'hover:bg-ag-panel-hover hover:border-ag-line-hover',
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
