'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { LockShieldIcon, DashboardIcon, BrainShieldIcon, BatchGasIcon } from '@/components/icons/HeroIcons'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

const FEATURES = [
  {
    title: 'Non-Custodial Security',
    description:
      'Full control remains in your wallet. We never hold your keys, funds, or require any permissions to move them. Every transaction is executed directly from your wallet.',
    Icon: LockShieldIcon,
    accent: 'crimson' as const,
  },
  {
    title: 'Clarity-First Dashboard',
    description:
      'Designed to enterprise standards. See your entire security posture at a glance, with no jargon or confusion. Every piece of information is actionable and immediately understandable.',
    Icon: DashboardIcon,
    accent: 'volt' as const,
  },
  {
    title: 'Advanced Risk Intelligence',
    description:
      'Risk scores are powered by real-time threat data, identifying known malicious contracts and anomalous approvals. Our intelligence engine continuously updates to stay ahead of emerging threats.',
    Icon: BrainShieldIcon,
    accent: 'crimson' as const,
  },
  {
    title: 'Gas-Efficient Revocation',
    description:
      'Batch revoke multiple allowances in a single transaction to save on gas fees and time. Our smart contract optimization ensures you pay the minimum possible gas costs for maximum security.',
    Icon: BatchGasIcon,
    accent: 'volt' as const,
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
          background: 'radial-gradient(circle, rgba(229,62,62,0.06) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Atmospheric glow — right */}
      <div
        className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,200,0.04) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      <Container>
        <CascadingScrollAnimation direction="up" distance={40} delay={0}>
          <div className="max-w-3xl mb-20">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">
                Built for Security & Clarity
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              Every feature is designed with one goal: keeping your assets secure.
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
  const glowColor = accent === 'crimson' ? 'rgba(229,62,62,0.12)' : 'rgba(0,240,200,0.10)'

  return (
    <div className="group relative rounded-2xl p-8 lg:p-10 bg-white/[0.02] ring-1 ring-white/[0.06] transition-all duration-300 hover:ring-white/[0.12] hover:bg-white/[0.04]">
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
