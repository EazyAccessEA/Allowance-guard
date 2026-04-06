'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

interface SplitTextProps {
  children: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  /** Render function for individual words — enables styled spans within the split */
  renderWord?: (word: string, index: number) => React.ReactNode
}

/**
 * Splits text into words and staggers their entrance.
 * Each word translates up from below and fades in.
 * Respects prefers-reduced-motion.
 */
export default function SplitText({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  as: Tag = 'h1',
  renderWord,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const prefersReduced = useReducedMotion()

  const words = children.split(/\s+/)

  if (prefersReduced) {
    return (
      <Tag className={className} ref={ref as React.RefObject<HTMLHeadingElement>}>
        {renderWord
          ? words.map((word, i) => (
              <span key={i}>
                {renderWord(word, i)}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))
          : children}
      </Tag>
    )
  }

  return (
    <Tag className={className} ref={ref as React.RefObject<HTMLHeadingElement>}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="inline">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: '100%', opacity: 0 }}
              animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
              transition={{
                duration: 0.5,
                delay: delay + i * stagger,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {renderWord ? renderWord(word, i) : word}
            </motion.span>
            {i < words.length - 1 ? '\u00A0' : ''}
          </span>
        ))}
      </span>
    </Tag>
  )
}
