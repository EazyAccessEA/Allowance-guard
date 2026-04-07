'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { LockShieldIcon, DashboardIcon, BrainShieldIcon, BatchGasIcon } from '@/components/icons/HeroIcons'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

const FEATURES = [
  {
    title: 'Non-Custodial by Default',
    description:
      'Your keys stay in your wallet. We read public data, you sign every transaction. No permissions to move funds, ever.',
    Icon: LockShieldIcon,
    accent: 'amber' as const,
  },
  {
    title: 'Dashboard Built for Decisions',
    description:
      'Every approval, risk score, and action in one view. No jargon. No hunting. See your security posture and act on it.',
    Icon: DashboardIcon,
    accent: 'sky' as const,
  },
  {
    title: 'Real-Time Risk Scoring',
    description:
      'Each approval is scored against live threat data — flagging unlimited amounts, unverified code, and known exploit contracts.',
    Icon: BrainShieldIcon,
    accent: 'amber' as const,
  },
  {
    title: 'Batch Revoke, Less Gas',
    description:
      'Revoke multiple approvals in one transaction. Optimised contracts keep gas costs low so security stays affordable.',
    Icon: BatchGasIcon,
    accent: 'sky' as const,
  },
]

export default function FeaturesPreview() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-[#060A14] overflow-hidden">
      {/* Gradient transition from previous section */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(to bottom, #0A0E1A 0%, transparent 100%)',
        }}
      />

      {/* Atmospheric glow — left */}
      <div
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Atmospheric glow — right */}
      <div
        className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      <Container>
        <CascadingScrollAnimation direction="up" distance={40} delay={0}>
          <div className="max-w-3xl mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1] mb-6">
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">
                Built for
              </span>
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                {' '}Security & Clarity
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              Every feature earns its place. If it doesn&#39;t make your wallet safer, it doesn&#39;t ship.
            </p>
          </div>
        </CascadingScrollAnimation>

        {/* 2x2 grid with density contrast — tighter than HowItWorks */}
        <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
          {FEATURES.map((feature, i) => (
            <CascadingScrollAnimation key={feature.title} direction="up" distance={40} delay={i * 100}>
              <FeatureCard {...feature} />
            </CascadingScrollAnimation>
          ))}
        </div>
      </Container>
    </section>
  )
}

function FeatureCard({
  title,
  description,
  Icon,
  accent,
}: (typeof FEATURES)[number]) {
  const glowColor = accent === 'amber' ? 'rgba(245,158,11,0.12)' : 'rgba(56,189,248,0.10)'

  return (
    <div className="glass-card group p-8 lg:p-10">
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse at 30% 0%, ${glowColor} 0%, transparent 60%)`,
        }}
      />

      {/* Icon with blend-mode emit glow */}
      <div className="relative mb-6 w-12 h-12">
        <Icon size={48} />
        <div
          className="absolute inset-0 blur-xl pointer-events-none"
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            mixBlendMode: 'plus-lighter',
          }}
        />
      </div>

      <h3 className="text-lg lg:text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-sm lg:text-base text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}
