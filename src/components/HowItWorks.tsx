'use client'

import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import { ScanShieldIcon, AnalyzeIcon, RevokeIcon } from '@/components/icons/HeroIcons'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

/**
 * Asymmetric 2-col: featured Step 01 (big) on left, Steps 02+03 stacked right.
 * Breaks the old uniform 3-up grid — density contrast per Kael / Sable.
 */

const STEPS = [
  {
    number: '01',
    title: 'Connect & Scan',
    description:
      'Link your wallet or paste any address. We read public blockchain data — your keys never leave your device.',
    Icon: ScanShieldIcon,
  },
  {
    number: '02',
    title: 'See the Risk',
    description:
      'Every approval gets a risk score. Unlimited amounts, unverified contracts, and known threats — flagged instantly.',
    Icon: AnalyzeIcon,
  },
  {
    number: '03',
    title: 'Revoke & Secure',
    description:
      'One click to revoke. Batch multiple approvals to save gas. Every transaction signs in your own wallet.',
    Icon: RevokeIcon,
  },
]

export default function HowItWorks() {
  const [featured, ...rest] = STEPS

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-surface-base overflow-hidden">
      {/* Atmospheric amber glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.05) 0%, transparent 70%)',
        }}
      />

      <Container>
        <div className="mb-20 lg:mb-24">
          <SectionHeader
            index="01"
            eyebrow="How it works"
            title={
              <>
                Three steps.
                <br />
                <span className="text-slate-500">Under a minute.</span>
              </>
            }
            lede="From connection to revocation without leaving your wallet. No account, no custody."
          />
        </div>

        {/* Asymmetric 12-col grid */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Featured — Step 01 */}
          <CascadingScrollAnimation direction="up" distance={40} delay={0} className="lg:col-span-7">
            <FeaturedStep {...featured} />
          </CascadingScrollAnimation>

          {/* Stacked — Steps 02, 03 */}
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

function FeaturedStep({ number, title, description, Icon }: (typeof STEPS)[number]) {
  return (
    <div className="glass-card relative h-full p-10 lg:p-14 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at 20% 0%, rgba(245,158,11,0.12) 0%, transparent 55%)',
        }}
      />
      <div className="relative">
        <div className="flex items-baseline gap-3 mb-10">
          <span className="font-display text-6xl lg:text-7xl font-bold text-amber-400/90 leading-none tracking-tight">
            {number}
          </span>
          <span className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase text-slate-500">
            Step
          </span>
        </div>

        <div className="mb-10">
          <Icon size={96} />
        </div>

        <h3 className="font-display text-3xl lg:text-4xl font-bold text-white mb-5 tracking-tight leading-tight">
          {title}
        </h3>
        <p className="text-base lg:text-lg text-slate-300 leading-relaxed max-w-md">
          {description}
        </p>
      </div>
    </div>
  )
}

function CompactStep({ number, title, description, Icon }: (typeof STEPS)[number]) {
  return (
    <div className="glass-card relative p-7 lg:p-8 flex gap-5 h-full">
      <div className="shrink-0">
        <Icon size={56} />
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-display text-2xl font-bold text-amber-400/80 leading-none tracking-tight">
            {number}
          </span>
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-slate-500">
            Step
          </span>
        </div>
        <h3 className="font-display text-xl lg:text-2xl font-bold text-white mb-2 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
