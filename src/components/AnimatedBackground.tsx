'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedBackgroundProps {
  className?: string
  variant?: 'hero' | 'section' | 'subtle'
  /** Legacy props — ignored when variant is used */
  images?: string[]
  delay?: number
}

/**
 * CSS-only mesh gradient background — replaces image/video backgrounds.
 * Uses layered radial gradients with animation for a smooth shifting effect.
 * Respects prefers-reduced-motion. Supports dark mode.
 */
export default function AnimatedBackground({
  className,
  variant = 'hero',
}: AnimatedBackgroundProps) {
  const lightStyles: Record<string, React.CSSProperties> = {
    hero: {
      background: `
        radial-gradient(ellipse 80% 60% at 20% 30%, rgba(0, 194, 179, 0.15) 0%, transparent 60%),
        radial-gradient(ellipse 70% 50% at 80% 20%, rgba(45, 212, 191, 0.12) 0%, transparent 55%),
        radial-gradient(ellipse 60% 70% at 50% 80%, rgba(0, 168, 150, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse 90% 40% at 10% 90%, rgba(94, 234, 212, 0.06) 0%, transparent 50%),
        radial-gradient(ellipse 50% 80% at 90% 60%, rgba(0, 139, 122, 0.05) 0%, transparent 60%)
      `,
      backgroundSize: '200% 200%',
    },
    section: {
      background: `
        radial-gradient(ellipse 60% 50% at 30% 40%, rgba(0, 194, 179, 0.08) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 70% 60%, rgba(45, 212, 191, 0.06) 0%, transparent 50%)
      `,
      backgroundSize: '150% 150%',
    },
    subtle: {
      background: `
        radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0, 194, 179, 0.05) 0%, transparent 60%)
      `,
      backgroundSize: '120% 120%',
    },
  }

  const darkStyles: Record<string, React.CSSProperties> = {
    hero: {
      background: `
        radial-gradient(ellipse 80% 60% at 20% 30%, rgba(0, 194, 179, 0.08) 0%, transparent 60%),
        radial-gradient(ellipse 70% 50% at 80% 20%, rgba(45, 212, 191, 0.06) 0%, transparent 55%),
        radial-gradient(ellipse 60% 70% at 50% 80%, rgba(0, 168, 150, 0.04) 0%, transparent 50%),
        radial-gradient(ellipse 90% 40% at 10% 90%, rgba(94, 234, 212, 0.03) 0%, transparent 50%),
        radial-gradient(ellipse 50% 80% at 90% 60%, rgba(0, 139, 122, 0.02) 0%, transparent 60%)
      `,
      backgroundSize: '200% 200%',
    },
    section: {
      background: `
        radial-gradient(ellipse 60% 50% at 30% 40%, rgba(0, 194, 179, 0.04) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 70% 60%, rgba(45, 212, 191, 0.03) 0%, transparent 50%)
      `,
      backgroundSize: '150% 150%',
    },
    subtle: {
      background: `
        radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0, 194, 179, 0.02) 0%, transparent 60%)
      `,
      backgroundSize: '120% 120%',
    },
  }

  const opacityMap = { hero: '', section: 'opacity-60', subtle: 'opacity-40' }

  return (
    <>
      {/* Light mode mesh */}
      <div
        className={cn(
          'absolute inset-0 animate-mesh-shift motion-reduce:animate-none dark:hidden',
          opacityMap[variant],
          className
        )}
        style={lightStyles[variant]}
        aria-hidden="true"
      />
      {/* Dark mode mesh */}
      <div
        className={cn(
          'absolute inset-0 animate-mesh-shift motion-reduce:animate-none hidden dark:block',
          opacityMap[variant],
          className
        )}
        style={darkStyles[variant]}
        aria-hidden="true"
      />
    </>
  )
}
