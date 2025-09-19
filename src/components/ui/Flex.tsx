'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FlexProps {
  children: React.ReactNode
  className?: string
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  gap?: 'none' | 'sm' | 'default' | 'lg' | 'xl'
  responsive?: boolean
}

export default function Flex({ 
  children, 
  className = '',
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'start',
  gap = 'default',
  responsive = true // eslint-disable-line @typescript-eslint/no-unused-vars
}: FlexProps) {
  // Sketch-inspired flex direction system
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  }

  // Sketch-inspired flex wrap system
  const wrapClasses = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  }

  // Sketch-inspired justify content system
  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }

  // Sketch-inspired align items system
  const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
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
      'flex',
      directionClasses[direction],
      wrapClasses[wrap],
      justifyClasses[justify],
      alignClasses[align],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

// Flex Item component for better control
interface FlexItemProps {
  children: React.ReactNode
  className?: string
  grow?: boolean
  shrink?: boolean
  basis?: 'auto' | 'full' | '0'
  order?: number
  center?: boolean
}

export function FlexItem({ 
  children, 
  className = '',
  grow = false,
  shrink = true,
  basis = 'auto',
  order,
  center = false
}: FlexItemProps) {
  const basisClasses = {
    auto: 'basis-auto',
    full: 'basis-full',
    '0': 'basis-0',
  }

  return (
    <div className={cn(
      grow && 'flex-grow',
      !shrink && 'flex-shrink-0',
      basisClasses[basis],
      order && `order-${order}`,
      center && 'flex items-center justify-center',
      className
    )}>
      {children}
    </div>
  )
}
