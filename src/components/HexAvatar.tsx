'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface HexAvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  className?: string
}

export function HexAvatar({ 
  src, 
  alt = '', 
  size = 'md', 
  fallback = 'AG',
  className 
}: HexAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg',
  }
  
  return (
    <div className={cn(
      'hex-clip bg-ag-panel border-2 border-ag-line flex items-center justify-center font-semibold text-ag-text relative',
      sizeClasses[size],
      className
    )}>
      {src ? (
        <Image 
          src={src} 
          alt={alt}
          fill
          className="object-cover hex-clip"
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  )
}
