'use client'

/**
 * SectionHeader — the ONE signature move, repeated section-to-section.
 *
 * Amber hairline + mono eyebrow + display headline. Replaces the
 * italic-serif / gradient-split pattern that was diluting every section.
 * Design Council: Maren (saturation), Kael (systems), Noor (contrast veto),
 * Idris (motion), Thane (reuses existing motion primitives — no new deps).
 */

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  index: string                 // "01", "02"...
  eyebrow: string               // "HOW IT WORKS"
  title: ReactNode              // display headline
  lede?: string                 // optional subheadline
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const prefersReduced = useReducedMotion()
  const isCenter = align === 'center'

  return (
    <div
      className={[
        'relative',
        isCenter ? 'max-w-3xl mx-auto text-center' : 'max-w-4xl',
        className,
      ].join(' ')}
    >
      {/* Signature hairline — amber, animated in */}
      <motion.div
        className={[
          'h-px mb-5',
          isCenter ? 'w-24 mx-auto' : 'w-24',
        ].join(' ')}
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, #F59E0B 0%, rgba(245,158,11,0.4) 60%, transparent 100%)',
          boxShadow: '0 0 8px rgba(245,158,11,0.2)',
          transformOrigin: 'left',
        }}
        initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      />

      {/* Eyebrow — mono uppercase, amber numeral */}
      <motion.div
        className={[
          'flex items-center gap-3 mb-6',
          isCenter ? 'justify-center' : '',
        ].join(' ')}
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase text-amber-400">
          {index}
        </span>
        <span className="h-px w-8 bg-amber-400/40" aria-hidden="true" />
        <span className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase text-slate-400">
          {eyebrow}
        </span>
      </motion.div>

      {/* Display headline */}
      <motion.h2
        className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] mb-6 bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-transparent"
        initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {title}
      </motion.h2>

      {lede && (
        <motion.p
          className={[
            'text-lg sm:text-xl text-slate-400 leading-relaxed',
            isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl',
          ].join(' ')}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {lede}
        </motion.p>
      )}
    </div>
  )
}
