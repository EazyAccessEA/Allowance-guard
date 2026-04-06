'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface BlurTextProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  as?: 'p' | 'span' | 'div' | 'h2' | 'h3'
}

/**
 * Text that fades in from a blurred state — materialises into clarity.
 * Respects prefers-reduced-motion.
 */
export default function BlurText({
  children,
  className,
  delay = 0,
  duration = 0.7,
  as: Tag = 'p',
}: BlurTextProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return (
      <Tag className={className} ref={ref as React.RefObject<HTMLParagraphElement>}>
        {children}
      </Tag>
    )
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      initial={{ opacity: 0, filter: 'blur(12px)' }}
      animate={
        isInView
          ? { opacity: 1, filter: 'blur(0px)' }
          : { opacity: 0, filter: 'blur(12px)' }
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
