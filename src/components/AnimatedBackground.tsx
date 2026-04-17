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
 * CSS-only mesh gradient background — Crimson Signal + Volt Mint.
 * Uses layered radial gradients with animation for a smooth shifting effect.
 * Respects prefers-reduced-motion. Dark-first design.
 */
export default function AnimatedBackground({
 className,
 variant = 'hero',
}: AnimatedBackgroundProps) {
 const lightStyles: Record<string, React.CSSProperties> = {
 hero: {
 background: `
 radial-gradient(ellipse 80% 60% at 20% 30%, rgba(229, 62, 62, 0.10) 0%, transparent 60%),
 radial-gradient(ellipse 70% 50% at 80% 20%, rgba(229, 62, 62, 0.07) 0%, transparent 55%),
 radial-gradient(ellipse 60% 70% at 50% 80%, rgba(0, 240, 200, 0.05) 0%, transparent 50%),
 radial-gradient(ellipse 90% 40% at 10% 90%, rgba(229, 62, 62, 0.04) 0%, transparent 50%),
 radial-gradient(ellipse 50% 80% at 90% 60%, rgba(0, 240, 200, 0.03) 0%, transparent 60%)
 `,
 backgroundSize: '200% 200%',
 },
 section: {
 background: `
 radial-gradient(ellipse 60% 50% at 30% 40%, rgba(229, 62, 62, 0.06) 0%, transparent 60%),
 radial-gradient(ellipse 50% 40% at 70% 60%, rgba(0, 240, 200, 0.04) 0%, transparent 50%)
 `,
 backgroundSize: '150% 150%',
 },
 subtle: {
 background: `
 radial-gradient(ellipse 80% 60% at 50% 50%, rgba(229, 62, 62, 0.04) 0%, transparent 60%)
 `,
 backgroundSize: '120% 120%',
 },
 }

 const darkStyles: Record<string, React.CSSProperties> = {
 hero: {
 background: `
 radial-gradient(ellipse 80% 60% at 20% 30%, rgba(229, 62, 62, 0.08) 0%, transparent 60%),
 radial-gradient(ellipse 70% 50% at 80% 20%, rgba(229, 62, 62, 0.05) 0%, transparent 55%),
 radial-gradient(ellipse 60% 70% at 50% 80%, rgba(0, 240, 200, 0.03) 0%, transparent 50%),
 radial-gradient(ellipse 90% 40% at 10% 90%, rgba(229, 62, 62, 0.03) 0%, transparent 50%),
 radial-gradient(ellipse 50% 80% at 90% 60%, rgba(0, 240, 200, 0.02) 0%, transparent 60%)
 `,
 backgroundSize: '200% 200%',
 },
 section: {
 background: `
 radial-gradient(ellipse 60% 50% at 30% 40%, rgba(229, 62, 62, 0.04) 0%, transparent 60%),
 radial-gradient(ellipse 50% 40% at 70% 60%, rgba(0, 240, 200, 0.03) 0%, transparent 50%)
 `,
 backgroundSize: '150% 150%',
 },
 subtle: {
 background: `
 radial-gradient(ellipse 80% 60% at 50% 50%, rgba(229, 62, 62, 0.02) 0%, transparent 60%)
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
 'absolute inset-0 animate-mesh-shift motion-reduce:animate-none ',
 opacityMap[variant],
 className
 )}
 style={lightStyles[variant]}
 aria-hidden="true"
 />
 {/* Dark mode mesh */}
 <div
 className={cn(
 'absolute inset-0 animate-mesh-shift motion-reduce:animate-none hidden ',
 opacityMap[variant],
 className
 )}
 style={darkStyles[variant]}
 aria-hidden="true"
 />
 </>
 )
}
