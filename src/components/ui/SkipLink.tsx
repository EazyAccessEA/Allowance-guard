'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { accessibilityTokens } from '@/lib/accessibility'

export interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className 
}) => {
  return (
    <a
      href={href}
      className={cn(
        accessibilityTokens.skipLink,
        className
      )}
    >
      {children}
    </a>
  )
}

export default SkipLink
