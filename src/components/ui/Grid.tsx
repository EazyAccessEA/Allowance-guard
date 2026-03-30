'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface GridProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  gap?: 'none' | 'sm' | 'default' | 'lg' | 'xl'
  responsive?: boolean
  center?: boolean
}

export default function Grid({ 
  children, 
  className = '',
  cols = 3,
  gap = 'default',
  responsive = true,
  center = false
}: GridProps) {
  // Sketch-inspired responsive grid system
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-12',
  }

  // Sketch-inspired gap system
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2 sm:gap-4',        // 8px mobile, 16px desktop
    default: 'gap-4 sm:gap-6',   // 16px mobile, 24px desktop
    lg: 'gap-6 sm:gap-8',        // 24px mobile, 32px desktop
    xl: 'gap-8 sm:gap-12',       // 32px mobile, 48px desktop
  }

  return (
    <div className={cn(
      'grid',
      responsive ? gridCols[cols] : `grid-cols-${cols}`,
      gapClasses[gap],
      center && 'justify-items-center',
      className
    )}>
      {children}
    </div>
  )
}

// Grid Item component for better control
interface GridItemProps {
  children: React.ReactNode
  className?: string
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  center?: boolean
}

export function GridItem({ 
  children, 
  className = '',
  span = 1,
  start,
  center = false
}: GridItemProps) {
  return (
    <div className={cn(
      `col-span-${span}`,
      start && `col-start-${start}`,
      center && 'flex items-center justify-center',
      className
    )}>
      {children}
    </div>
  )
}
