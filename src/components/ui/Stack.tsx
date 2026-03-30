'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface StackProps {
  children: React.ReactNode
  className?: string
  direction?: 'vertical' | 'horizontal'
  spacing?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
}

export default function Stack({ 
  children, 
  className = '',
  direction = 'vertical',
  spacing = 'default',
  align = 'start',
  justify = 'start',
  wrap = false
}: StackProps) {
  // Sketch-inspired stack direction system
  const directionClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  }

  // Sketch-inspired spacing system
  const spacingClasses = {
    none: 'gap-0',
    xs: 'gap-1 sm:gap-2',        // 4px mobile, 8px desktop
    sm: 'gap-2 sm:gap-3',        // 8px mobile, 12px desktop
    default: 'gap-3 sm:gap-4',   // 12px mobile, 16px desktop
    lg: 'gap-4 sm:gap-6',        // 16px mobile, 24px desktop
    xl: 'gap-6 sm:gap-8',        // 24px mobile, 32px desktop
  }

  // Sketch-inspired alignment system
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  // Sketch-inspired justify system
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  }

  return (
    <div className={cn(
      'flex',
      directionClasses[direction],
      spacingClasses[spacing],
      alignClasses[align],
      justifyClasses[justify],
      wrap && 'flex-wrap',
      className
    )}>
      {children}
    </div>
  )
}

// Stack Item component for better control
interface StackItemProps {
  children: React.ReactNode
  className?: string
  grow?: boolean
  shrink?: boolean
  center?: boolean
}

export function StackItem({ 
  children, 
  className = '',
  grow = false,
  shrink = true,
  center = false
}: StackItemProps) {
  return (
    <div className={cn(
      grow && 'flex-grow',
      !shrink && 'flex-shrink-0',
      center && 'flex items-center justify-center',
      className
    )}>
      {children}
    </div>
  )
}
