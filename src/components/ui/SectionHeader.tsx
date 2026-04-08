'use client'

/**
 * SectionHeader — Ledger aesthetic
 *
 * Oversized Fraunces italic roman numeral (the marginalia signature) inline
 * with a mono eyebrow and double ledger-rule. Fraunces italic display
 * headline. Optional `theme: 'ink'` inverts for the single dark CTABand.
 *
 * Design Council: signature move preserved (amber hairline lives in
 * .ledger-rule), marginalia numeral as the new recurring ritual. Maren +
 * Sable approved the editorial-magazine hierarchy.
 */

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  roman: string                // "I", "II", "III"...
  eyebrow: string              // "THE NUMBERS"
  title: ReactNode             // Fraunces italic display headline
  lede?: string                // Optional supporting paragraph
  align?: 'left' | 'center'
  theme?: 'paper' | 'ink'      // 'ink' = cream-on-oxblood (CTABand only)
  className?: string
}

export default function SectionHeader({
  roman,
  eyebrow,
  title,
  lede,
  align = 'left',
  theme = 'paper',
  className = '',
}: SectionHeaderProps) {
  const prefersReduced = useReducedMotion()
  const isCenter = align === 'center'
  const isInk = theme === 'ink'

  const headText = isInk ? 'text-cream' : 'text-ink'
  const bodyText = isInk ? 'text-cream/70' : 'text-ink-muted'
  const whisperText = isInk ? 'text-cream/50' : 'text-ink-whisper'
  const numeralColor = isInk ? 'text-cream' : 'text-ink'
  const accentColor = isInk ? 'text-amber-500' : 'text-amber-deep'

  return (
    <div
      className={[
        'relative',
        isCenter ? 'max-w-3xl mx-auto text-center' : 'max-w-4xl',
        className,
      ].join(' ')}
    >
      {/* Top row: oversized Fraunces italic roman numeral + ledger rule + eyebrow */}
      <div
        className={[
          'flex items-start gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10',
          isCenter ? 'justify-center' : '',
        ].join(' ')}
      >
        {/* The margin numeral — Fraunces italic, oversized, the signature move */}
        <motion.div
          aria-hidden="true"
          className={[
            'font-fraunces italic font-bold leading-[0.8] flex-shrink-0 select-none',
            'text-6xl sm:text-7xl lg:text-8xl',
            numeralColor,
          ].join(' ')}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontOpticalSizing: 'auto' }}
        >
          {roman}.
        </motion.div>

        {/* Double rule + eyebrow stacked */}
        <div className="flex-1 pt-3 sm:pt-4 min-w-0">
          <motion.div
            className="ledger-rule mb-4"
            aria-hidden="true"
            initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ transformOrigin: 'left' }}
          />
          <motion.div
            className="flex items-baseline gap-3 flex-wrap"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <span className={`font-mono text-[10px] font-bold tracking-[0.22em] uppercase ${accentColor}`}>
              § {roman}
            </span>
            <span className={`font-mono text-[10px] font-bold tracking-[0.22em] uppercase ${whisperText}`}>
              {eyebrow}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Display headline — Fraunces italic */}
      <motion.h2
        className={[
          'font-fraunces-display italic font-normal tracking-tight leading-[0.95] mb-6',
          'text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem]',
          headText,
          isCenter ? 'mx-auto' : '',
        ].join(' ')}
        initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {title}
      </motion.h2>

      {lede && (
        <motion.p
          className={[
            'font-plex text-lg sm:text-xl leading-[1.55]',
            bodyText,
            isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl',
          ].join(' ')}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {lede}
        </motion.p>
      )}
    </div>
  )
}
