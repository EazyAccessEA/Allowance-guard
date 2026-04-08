'use client'

import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import { LockShieldIcon, DashboardIcon, BrainShieldIcon, BatchGasIcon } from '@/components/icons/HeroIcons'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

/**
 * Editorial alternating rows — icon left / copy right, then flipped.
 * Breaks the old 2x2 uniform grid. Per law #2 (strip then amplify).
 */

const FEATURES = [
  {
    title: 'Non-custodial by default.',
    description:
      'Your keys stay in your wallet. We read public data, you sign every transaction. No permissions to move funds — ever.',
    Icon: LockShieldIcon,
    accent: 'amber' as const,
    eyebrow: 'Custody',
  },
  {
    title: 'A dashboard built for decisions.',
    description:
      'Every approval, risk score, and action in one view. No jargon. No hunting. See your security posture and act on it.',
    Icon: DashboardIcon,
    accent: 'sky' as const,
    eyebrow: 'Clarity',
  },
  {
    title: 'Real-time risk scoring.',
    description:
      'Every approval is scored against live threat data — flagging unlimited amounts, unverified code, and known exploit contracts the moment they appear.',
    Icon: BrainShieldIcon,
    accent: 'amber' as const,
    eyebrow: 'Intelligence',
  },
  {
    title: 'Batch revoke. Less gas.',
    description:
      'Revoke dozens of approvals in a single transaction. Optimised contracts keep gas costs low so security stays affordable.',
    Icon: BatchGasIcon,
    accent: 'sky' as const,
    eyebrow: 'Efficiency',
  },
]

export default function FeaturesPreview() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-[#060A14] overflow-hidden">
      {/* Atmospheric glows */}
      <div
        className="absolute top-1/4 -left-40 w-[600px] h-[600px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      <Container>
        <div className="mb-24 lg:mb-32">
          <SectionHeader
            index="03"
            eyebrow="What you get"
            title={
              <>
                Built for security.
                <br />
                <span className="text-slate-500">Built for clarity.</span>
              </>
            }
            lede="Every feature earns its place. If it doesn't make your wallet safer, it doesn't ship."
          />
        </div>

        {/* Editorial alternating rows */}
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

function FeatureRow({
  title,
  description,
  Icon,
  accent,
  eyebrow,
  flip,
}: (typeof FEATURES)[number] & { flip: boolean }) {
  const glowColor = accent === 'amber' ? 'rgba(245,158,11,0.18)' : 'rgba(56,189,248,0.14)'
  const accentText = accent === 'amber' ? 'text-amber-400' : 'text-sky-400'

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      {/* Icon column */}
      <div className={['lg:col-span-5', flip ? 'lg:order-2' : ''].join(' ')}>
        <div className="relative w-full aspect-square max-w-sm mx-auto">
          <div className="glass-card absolute inset-0 flex items-center justify-center">
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background: `radial-gradient(ellipse at 50% 50%, ${glowColor} 0%, transparent 65%)`,
              }}
            />
            <div className="relative">
              <Icon size={160} />
              <div
                className="absolute inset-0 blur-3xl pointer-events-none"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                  mixBlendMode: 'plus-lighter',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Copy column */}
      <div className={['lg:col-span-7', flip ? 'lg:order-1' : ''].join(' ')}>
        <div className={['text-[11px] font-mono font-bold tracking-[0.22em] uppercase mb-4', accentText].join(' ')}>
          {eyebrow}
        </div>
        <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.02] mb-6 max-w-xl">
          {title}
        </h3>
        <p className="text-base lg:text-lg text-slate-400 leading-relaxed max-w-xl">
          {description}
        </p>
      </div>
    </div>
  )
}
