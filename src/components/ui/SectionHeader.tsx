'use client'

/**
 * SectionHeader v3 — stripped of editorial pastiche
 *
 * v2 used § symbols and roman numerals (II, III, V…) — that was a UX
 * writer-veto miss. Roman numerals impose cognitive load for zero
 * information gain. v3 uses plain mono numerals and plain category
 * names. The IBM Plex Sans display headline is preserved as the one
 * editorial moment per section. Marginalia numeral kept as the
 * recurring signature but in plain digits.
 *
 * Council: Maren (one editorial moment per section), #13 UX writer
 * (every word earns its place), Noor (AAA preserved).
 */

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  number: string                // "01", "02", "03"...
  eyebrow: string               // plain category name
  title: ReactNode              // IBM Plex Sans display headline
  lede?: string                 // Optional supporting paragraph
  align?: 'left' | 'center'
  theme?: 'paper' | 'ink'       // 'ink' = cream-on-oxblood (CTABand)
  className?: string
}

export default function SectionHeader({
  number,
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
  const numeralColor = isInk ? 'text-cream/70' : 'text-ink/80'

  return (
    <div
      className={[
        'relative',
        isCenter ? 'max-w-3xl mx-auto text-center' : 'max-w-4xl',
        className,
      ].join(' ')}
    >
      <div
        className={[
          'flex items-baseline gap-5 sm:gap-8 mb-6 sm:mb-7',
          isCenter ? 'justify-center' : '',
        ].join(' ')}
      >
        {/* Plain mono numeral — not roman, not § */}
        <motion.span
          aria-hidden="true"
          className={`font-mono text-[11px] font-bold tracking-[0.22em] uppercase ${numeralColor} flex-shrink-0`}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          {number}
        </motion.span>

        {/* Hairline + plain category eyebrow */}
        <div className="flex-1 pt-1 min-w-0">
          <motion.div
            className="h-px mb-3"
            aria-hidden="true"
            style={{
              background: isInk
                ? 'linear-gradient(90deg, rgba(245,158,11,0.6) 0%, rgba(245,158,11,0.2) 60%, transparent 100%)'
                : 'linear-gradient(90deg, #F59E0B 0%, rgba(245,158,11,0.3) 60%, transparent 100%)',
              transformOrigin: 'left',
            }}
            initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          />
          <motion.span
            className={`font-mono text-[11px] font-bold tracking-[0.22em] uppercase ${whisperText}`}
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {eyebrow}
          </motion.span>
        </div>
      </div>

      {/* Display headline — Fraunces italic */}
      <motion.h2
        className={[
          'font-display-tight leading-[0.95] mb-6',
          'text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem]',
          headText,
          isCenter ? 'mx-auto' : '',
        ].join(' ')}
        initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
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
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {lede}
        </motion.p>
      )}
    </div>
  )
}
