'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

interface CountUpProps {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  delay?: number
  className?: string
}

/**
 * Animates a number from 0 to target value when scrolled into view.
 * Respects prefers-reduced-motion.
 */
export default function CountUp({
  value,
  suffix = '',
  prefix = '',
  duration = 1.2,
  delay = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const prefersReduced = useReducedMotion()
  const [display, setDisplay] = useState(prefersReduced ? value : 0)

  useEffect(() => {
    if (!isInView || prefersReduced) return

    const start = performance.now()
    const delayMs = delay * 1000
    let rafId: number

    function tick(now: number) {
      const elapsed = now - start - delayMs
      if (elapsed < 0) {
        rafId = requestAnimationFrame(tick)
        return
      }
      const progress = Math.min(elapsed / (duration * 1000), 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isInView, value, duration, delay, prefersReduced])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  )
}
