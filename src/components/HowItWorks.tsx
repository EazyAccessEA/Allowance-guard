'use client'

/**
 * HowItWorks — Ledger aesthetic
 *
 * Paper section with a featured step on the left and two compact steps
 * stacked on the right. Ink line-art icons drawn inline — no more
 * dark-mode amber-glow treatments. Each step gets its own roman numeral.
 */

import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import Highlight from '@/components/ui/Highlight'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'
import type { ReactNode } from 'react'

interface Step {
  number: string
  title: string
  description: string
  icon: ReactNode
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Connect & Scan',
    description:
      'Link your wallet or paste any address. We read public blockchain data — your keys never leave your device.',
    icon: <ScanIcon />,
  },
  {
    number: '02',
    title: 'See the Risk',
    description:
      'Every approval gets a risk score. Unlimited amounts, unverified contracts, and known threats — flagged instantly.',
    icon: <RiskIcon />,
  },
  {
    number: '03',
    title: 'Revoke & Secure',
    description:
      'One click to revoke. Batch multiple approvals to save gas. Every transaction signs in your own wallet.',
    icon: <RevokeIcon />,
  },
]

export default function HowItWorks() {
  const [featured, ...rest] = STEPS

  return (
    <section className="paper grain relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      <Container>
        <div className="mb-20 lg:mb-24">
          <SectionHeader
            number="03"
            eyebrow="How it works"
            title={
              <>
                Three steps.
                <br />
                <span className="text-ink-muted"><Highlight>Under a minute.</Highlight></span>
              </>
            }
            lede="Paste an address or connect your wallet. We do the rest. Every transaction signs in your own wallet — we never touch your tokens."
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Featured step */}
          <CascadingScrollAnimation direction="up" distance={40} delay={0} className="lg:col-span-7">
            <FeaturedStep {...featured} />
          </CascadingScrollAnimation>

          {/* Compact steps */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            {rest.map((step, i) => (
              <CascadingScrollAnimation key={step.number} direction="up" distance={40} delay={120 + i * 120}>
                <CompactStep {...step} />
              </CascadingScrollAnimation>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

function FeaturedStep({ number, title, description, icon }: Step) {
  return (
    <div className="paper-card-raised h-full p-10 lg:p-14 relative overflow-hidden">
      <div className="flex items-baseline gap-4 mb-10">
        <span className="font-plex font-bold text-7xl lg:text-8xl text-ink leading-none tracking-[-0.05em] tabular-nums">
          {number}
        </span>
        <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
          Step
        </span>
      </div>

      <div className="mb-10 text-ink">{icon}</div>

      <h3 className="font-display-tight text-4xl lg:text-5xl text-ink mb-5 leading-[1.05]">
        {title}
      </h3>
      <p className="font-plex text-base lg:text-lg text-ink-muted leading-[1.6] max-w-md">
        {description}
      </p>

      {/* Decorative amber corner */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-24 h-24"
        style={{
          background:
            'linear-gradient(225deg, rgba(245,158,11,0.12) 0%, transparent 55%)',
        }}
      />
    </div>
  )
}

function CompactStep({ number, title, description, icon }: Step) {
  return (
    <div className="paper-card p-7 lg:p-8 flex gap-5 h-full">
      <div className="shrink-0 text-ink">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-plex font-bold text-3xl text-ink leading-none tracking-[-0.04em] tabular-nums">
            {number}
          </span>
          <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-ink-whisper">
            Step
          </span>
        </div>
        <h3 className="font-display-tight text-2xl lg:text-3xl text-ink mb-2 leading-[1.1]">
          {title}
        </h3>
        <p className="font-plex text-sm text-ink-muted leading-[1.55]">{description}</p>
      </div>
    </div>
  )
}

/* ============================================================================
 * Ink line-art icons — 1.5px stroke, currentColor, editorial weight
 * ============================================================================ */

function ScanIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Shield */}
      <path d="M36 6 L60 14 V36 C60 50 48 60 36 66 C24 60 12 50 12 36 V14 Z" />
      {/* Scan line */}
      <line x1="18" y1="36" x2="54" y2="36" stroke="#F59E0B" strokeWidth="2" />
      {/* Inner checkmark */}
      <path d="M26 40 L34 48 L48 30" />
      {/* Tick marks */}
      <line x1="20" y1="20" x2="24" y2="20" />
      <line x1="48" y1="20" x2="52" y2="20" />
      <line x1="20" y1="52" x2="24" y2="52" />
      <line x1="48" y1="52" x2="52" y2="52" />
    </svg>
  )
}

function RiskIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 72 72" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Magnifying glass */}
      <circle cx="30" cy="30" r="18" />
      <line x1="44" y1="44" x2="58" y2="58" strokeWidth="2" />
      {/* Inside: warning triangle */}
      <path d="M30 22 L40 38 H20 Z" stroke="#DC2626" />
      <line x1="30" y1="28" x2="30" y2="32" stroke="#DC2626" strokeWidth="2" />
      <circle cx="30" cy="35" r="0.8" fill="#DC2626" stroke="#DC2626" />
    </svg>
  )
}

function RevokeIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 72 72" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Lock body */}
      <rect x="16" y="32" width="40" height="30" rx="3" />
      {/* Shackle */}
      <path d="M24 32 V22 C24 15 29 10 36 10 C43 10 48 15 48 22 V32" />
      {/* Keyhole */}
      <circle cx="36" cy="44" r="3" fill="#F59E0B" stroke="#F59E0B" />
      <line x1="36" y1="47" x2="36" y2="54" stroke="#F59E0B" strokeWidth="2" />
    </svg>
  )
}
