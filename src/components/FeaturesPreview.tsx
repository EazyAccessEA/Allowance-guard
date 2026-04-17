'use client'

/**
 * FeaturesPreview — Ledger aesthetic
 *
 * Paper section with alternating editorial rows. Ink line-art diagrams
 * replace the old amber-glow icons — on paper we want engraved quality,
 * not bloom. Each feature gets an IBM Plex Sans Bold display headline.
 */

import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'
import type { ReactNode } from 'react'

interface Feature {
  title: string
  description: string
  eyebrow: string
  diagram: ReactNode
}

const FEATURES: Feature[] = [
  {
    title: 'Non-custodial by default.',
    description:
      'Your keys stay in your wallet. We read public data, you sign every transaction. No permissions to move funds — ever.',
    eyebrow: 'Custody',
    diagram: <NonCustodialDiagram />,
  },
  {
    title: 'A dashboard built for decisions.',
    description:
      'Every approval, risk score, and action in one view. No jargon. No hunting. See your security posture and act on it.',
    eyebrow: 'Clarity',
    diagram: <DashboardDiagram />,
  },
  {
    title: 'Real-time risk scoring.',
    description:
      'Every approval is scored against live threat data — flagging unlimited amounts, unverified code, and known exploit contracts the moment they appear.',
    eyebrow: 'Intelligence',
    diagram: <RiskDiagram />,
  },
  {
    title: 'Batch revoke.',
    description:
      'On wallets that support EIP-5792 (Coinbase Smart Wallet, Base Smart Wallet), batch revoke bundles multiple approvals into one transaction — one fee, one signature. Elsewhere it signs each revoke in turn. You keep custody either way.',
    eyebrow: 'Efficiency',
    diagram: <BatchDiagram />,
  },
]

export default function FeaturesPreview() {
  return (
    <section className="paper grain relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      <Container>
        <div className="mb-24 lg:mb-32">
          <SectionHeader
            number="04"
            eyebrow="Why this tool"
            title={
              <>
                Built for security.
                <br />
                <span className="text-ink-muted">Built for clarity.</span>
              </>
            }
            lede="Every feature earns its place. If it doesn't make your wallet safer, it doesn't ship."
          />
        </div>

        <div className="space-y-24 lg:space-y-32">
          {FEATURES.map((feature, i) => (
            <CascadingScrollAnimation key={feature.title} direction="up" distance={40} delay={0}>
              <FeatureRow {...feature} flip={i % 2 === 1} />
            </CascadingScrollAnimation>
          ))}
        </div>
      </Container>
    </section>
  )
}

function FeatureRow({ title, description, eyebrow, diagram, flip }: Feature & { flip: boolean }) {
  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      {/* Diagram column */}
      <div className={['lg:col-span-5', flip ? 'lg:order-2' : ''].join(' ')}>
        <div className="paper-card-raised relative aspect-square max-w-sm mx-auto flex items-center justify-center p-10 text-ink">
          {diagram}
        </div>
      </div>

      {/* Copy column */}
      <div className={['lg:col-span-7', flip ? 'lg:order-1' : ''].join(' ')}>
        <div className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep mb-4">
          {eyebrow}
        </div>
        <h3 className="font-display-tight text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.02] mb-6 max-w-xl">
          {title}
        </h3>
        <p className="font-plex text-base lg:text-lg text-ink-muted leading-[1.6] max-w-xl">
          {description}
        </p>
      </div>
    </div>
  )
}

/* ============================================================================
 * Ink line-art feature diagrams
 * ============================================================================ */

function NonCustodialDiagram() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Wallet */}
      <rect x="30" y="50" width="120" height="90" rx="4" />
      <path d="M30 70 H150" />
      <circle cx="130" cy="95" r="6" fill="#F59E0B" stroke="#F59E0B" />
      {/* Key inside */}
      <g transform="translate(55, 95)">
        <circle cx="6" cy="0" r="6" />
        <line x1="12" y1="0" x2="35" y2="0" strokeWidth="2" />
        <line x1="25" y1="0" x2="25" y2="5" strokeWidth="2" />
        <line x1="32" y1="0" x2="32" y2="7" strokeWidth="2" />
      </g>
      {/* Shield above */}
      <path d="M90 15 L105 20 V32 C105 40 98 45 90 48 C82 45 75 40 75 32 V20 Z" fill="rgba(245,158,11,0.1)" />
      <path d="M85 31 L89 35 L96 26" />
    </svg>
  )
}

function DashboardDiagram() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Frame */}
      <rect x="20" y="25" width="140" height="130" rx="3" />
      <line x1="20" y1="48" x2="160" y2="48" />
      {/* Top dots */}
      <circle cx="30" cy="37" r="2" fill="currentColor" />
      <circle cx="38" cy="37" r="2" fill="currentColor" />
      <circle cx="46" cy="37" r="2" fill="currentColor" />
      {/* Chart bars */}
      <rect x="32" y="110" width="12" height="30" fill="rgba(20,18,16,0.08)" />
      <rect x="50" y="95" width="12" height="45" fill="#F59E0B" stroke="#F59E0B" />
      <rect x="68" y="80" width="12" height="60" fill="rgba(20,18,16,0.08)" />
      <rect x="86" y="100" width="12" height="40" fill="rgba(20,18,16,0.08)" />
      {/* KPI cards */}
      <rect x="110" y="60" width="40" height="24" rx="2" />
      <line x1="116" y1="68" x2="132" y2="68" strokeWidth="2" />
      <line x1="116" y1="75" x2="144" y2="75" />
      <rect x="110" y="92" width="40" height="24" rx="2" />
      <circle cx="130" cy="104" r="6" stroke="#DC2626" />
    </svg>
  )
}

function RiskDiagram() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Radar circles */}
      <circle cx="90" cy="90" r="65" />
      <circle cx="90" cy="90" r="45" strokeDasharray="2 3" />
      <circle cx="90" cy="90" r="25" />
      {/* Crosshair */}
      <line x1="90" y1="25" x2="90" y2="155" />
      <line x1="25" y1="90" x2="155" y2="90" />
      {/* Sweep beam */}
      <path d="M90 90 L140 50 A65 65 0 0 1 148 95 Z" fill="rgba(245,158,11,0.18)" stroke="none" />
      <line x1="90" y1="90" x2="140" y2="50" stroke="#F59E0B" strokeWidth="2" />
      {/* Threat dots */}
      <circle cx="115" cy="65" r="4" fill="#DC2626" stroke="#DC2626" />
      <circle cx="70" cy="120" r="3" fill="#B4730A" stroke="#B4730A" />
      <circle cx="55" cy="70" r="3" fill="currentColor" />
      {/* Center */}
      <circle cx="90" cy="90" r="3" fill="#F59E0B" stroke="#F59E0B" />
    </svg>
  )
}

function BatchDiagram() {
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Stack of docs on left */}
      <g>
        <rect x="20" y="45" width="40" height="55" rx="2" />
        <rect x="25" y="40" width="40" height="55" rx="2" />
        <rect x="30" y="35" width="40" height="55" rx="2" fill="rgba(20,18,16,0.04)" />
        <line x1="35" y1="50" x2="60" y2="50" />
        <line x1="35" y1="58" x2="55" y2="58" />
        <line x1="35" y1="66" x2="58" y2="66" />
        <line x1="35" y1="74" x2="50" y2="74" />
      </g>
      {/* Arrow */}
      <line x1="80" y1="62" x2="115" y2="62" strokeWidth="2" stroke="#F59E0B" />
      <path d="M108 56 L115 62 L108 68" strokeWidth="2" stroke="#F59E0B" />
      {/* Single consolidated doc on right */}
      <rect x="120" y="35" width="42" height="80" rx="2" fill="rgba(245,158,11,0.1)" />
      <line x1="126" y1="50" x2="156" y2="50" />
      <line x1="126" y1="58" x2="156" y2="58" />
      <line x1="126" y1="66" x2="152" y2="66" />
      {/* Stamp */}
      <circle cx="141" cy="92" r="14" stroke="#DC2626" strokeWidth="1.5" />
      <text x="141" y="96" textAnchor="middle" fontSize="8" fill="#DC2626" fontFamily="serif" fontStyle="italic">1 TX</text>
      {/* Gas ↓ label */}
      <g transform="translate(90, 130)">
        <path d="M0 0 L0 15 M-4 11 L0 15 L4 11" stroke="#F59E0B" strokeWidth="2" />
      </g>
    </svg>
  )
}
