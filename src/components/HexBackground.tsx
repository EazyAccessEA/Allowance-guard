'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface HexBackgroundProps {
  children: React.ReactNode
  className?: string
  pattern?: boolean
}

export function HexBackground({ 
  children, 
  className, 
  pattern = true 
}: HexBackgroundProps) {
  return (
    <div className={cn(
      'relative',
      pattern && 'hex-background',
      className
    )}>
      {children}
    </div>
  )
}
