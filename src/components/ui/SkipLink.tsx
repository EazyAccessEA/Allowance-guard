'use client'

import React from 'react'
import { cn } from '@/lib/utils'
// SkipLink component doesn't need accessibility tokens import

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
        'skip-link',
        className
      )}
    >
      {children}
    </a>
  )
}

export default SkipLink
