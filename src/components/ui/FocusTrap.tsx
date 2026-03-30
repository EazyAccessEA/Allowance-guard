'use client'

import React, { useEffect, useRef } from 'react'
import { ariaHelpers } from '@/lib/accessibility'

export interface FocusTrapProps {
  children: React.ReactNode
  active?: boolean
  className?: string
}

const FocusTrap: React.FC<FocusTrapProps> = ({ 
  children, 
  active = true,
  className 
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!active || !containerRef.current) return
    
    const cleanup = ariaHelpers.focus.trap(containerRef.current)
    
    return cleanup
  }, [active])
  
  return (
    <div 
      ref={containerRef}
      className={className}
    >
      {children}
    </div>
  )
}

export default FocusTrap
