'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { accessibilityTokens } from '@/lib/accessibility'

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
        accessibilityTokens.srOnly,
        className
      )}
    >
      {children}
    </span>
  )
}

export default ScreenReaderOnly
