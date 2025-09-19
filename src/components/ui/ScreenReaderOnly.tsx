'use client'

import React from 'react'
import { cn } from '@/lib/utils'
// Screen reader only component doesn't need accessibility tokens import

export interface ScreenReaderOnlyProps {
  children: React.ReactNode
  className?: string
}

const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  className 
}) => {
  return (
    <span 
      className={cn(
        'sr-only',
        className
      )}
    >
      {children}
    </span>
  )
}

export default ScreenReaderOnly
