'use client'

import Container from '@/components/ui/Container'
import { ScanShieldIcon, AnalyzeIcon, RevokeIcon } from '@/components/icons/HeroIcons'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

const STEPS = [
  {
    number: 1,
    title: 'Connect & Scan',
    description:
      'Link your wallet or paste any address. We read public blockchain data — your keys never leave your device.',
    Icon: ScanShieldIcon,
  },
  {
    number: 2,
    title: 'See the Risk',
    description:
      'Every approval gets a risk score. Unlimited amounts, unverified contracts, and known threats are flagged instantly.',
    Icon: AnalyzeIcon,
  },
  {
    number: 3,
    title: 'Revoke & Secure',
    description:
      'One click to revoke. Batch multiple approvals to save gas. Every transaction signs in your own wallet.',
    Icon: RevokeIcon,
  },
]

export default function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-white dark:bg-[#0A0E1A] overflow-hidden">
      {/* Gradient transition from hero */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(to bottom, rgba(11,17,32,0.6) 0%, transparent 100%)',
        }}
      />

      {/* Atmospheric radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 70%)',
        }}
      />

      <Container>
        <CascadingScrollAnimation direction="up" distance={40} delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1] mb-6">
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                How Allowance Guard
              </span>
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                {' '}Works
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              From connection to revocation in under a minute. Three steps, full control.
            </p>
          </div>
        </CascadingScrollAnimation>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step, i) => (
            <CascadingScrollAnimation key={step.number} direction="up" distance={50} delay={i * 150}>
              <StepCard {...step} />
            </CascadingScrollAnimation>
          ))}
        </div>
      </Container>
    </section>
  )
}

function StepCard({
  number,
  title,
  description,
  Icon,
}: (typeof STEPS)[number]) {
  return (
    <div className="group relative rounded-2xl p-8 lg:p-10 bg-white/[0.03] dark:bg-white/[0.03] ring-1 ring-white/[0.08] backdrop-blur-sm transition-all duration-300 hover:ring-white/[0.15] hover:bg-white/[0.06]">
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Step number — small, confident */}
      <div className="text-xs font-mono text-amber-400/60 tracking-widest uppercase mb-6">
        Step {String(number).padStart(2, '0')}
      </div>

      {/* Icon with blend-mode glow */}
      <div className="relative mb-8">
        <Icon size={80} />
        <div
          className="absolute inset-0 blur-2xl pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
            mixBlendMode: 'plus-lighter',
          }}
        />
      </div>

      <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-base text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}
