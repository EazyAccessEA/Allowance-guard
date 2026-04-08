'use client'

import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

/**
 * Featured pull-quote layout: one oversized quote + a supporting grid.
 * Breaks the old 3-up uniform grid. Editorial hierarchy per Sable + Maren.
 */

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'DeFi Trader',
    initials: 'SC',
    hue: 18,
    quote:
      'Found 15 unlimited approvals I had completely forgotten about. Revoked them all in one session. The risk breakdown per approval is what sold me — I can see exactly why something is flagged.',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'NFT Collector',
    initials: 'MR',
    hue: 160,
    quote:
      'I interact with 30+ dApps across Ethereum and Base. Batch revoke cleared out 40 stale approvals in one transaction. Gas cost was less than a single manual revoke would have been.',
  },
  {
    name: 'Alex Thompson',
    role: 'DAO Treasury Manager',
    initials: 'AT',
    hue: 220,
    quote:
      'Open source was non-negotiable for our DAO. We audited the code ourselves before onboarding. The team dashboard lets our multisig signers review approvals before governance votes.',
  },
  {
    name: 'Elena Volkov',
    role: 'Smart Contract Developer',
    initials: 'EV',
    hue: 280,
    quote:
      'I use the API to check allowances across Ethereum, Arbitrum, and Base in our internal tooling. Clean endpoints, predictable responses. Integrated it in an afternoon.',
  },
  {
    name: 'David Kim',
    role: 'Portfolio Manager',
    initials: 'DK',
    hue: 40,
    quote:
      'Monitoring caught an approval to a contract that got exploited two days later. The alert came in before the exploit hit Twitter. That alone justified the Pro subscription.',
  },
  {
    name: 'Lisa Wang',
    role: 'Web3 Security Educator',
    initials: 'LW',
    hue: 120,
    quote:
      'I walk students through AllowanceGuard in every workshop. The risk scores give them a concrete way to understand approval danger — not abstract theory, but their own wallet data.',
  },
]

export default function Testimonials() {
  const [featured, ...rest] = TESTIMONIALS

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-[#0A0E1A] overflow-hidden">
      {/* Atmospheric glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <Container>
        <div className="mb-20 lg:mb-24">
          <SectionHeader
            index="05"
            eyebrow="Signal, not noise"
            title={
              <>
                Used by people
                <br />
                <span className="text-slate-500">who verify everything.</span>
              </>
            }
            lede="Traders, developers, and DAOs running AllowanceGuard on their own wallets."
          />
        </div>

        {/* Featured pull-quote */}
        <CascadingScrollAnimation direction="up" distance={40} delay={0}>
          <FeaturedQuote {...featured} />
        </CascadingScrollAnimation>

        {/* Supporting — 2-up then 3-up density shift */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((t, i) => (
            <CascadingScrollAnimation key={t.name} direction="up" distance={30} delay={i * 80}>
              <CompactQuote {...t} />
            </CascadingScrollAnimation>
          ))}
        </div>
      </Container>
    </section>
  )
}

function FeaturedQuote({ name, role, initials, hue, quote }: (typeof TESTIMONIALS)[number]) {
  return (
    <div className="glass-card relative overflow-hidden p-10 lg:p-16">
      <div
        className="absolute -top-12 -left-4 font-serif text-[20rem] leading-none pointer-events-none select-none opacity-[0.08]"
        aria-hidden="true"
        style={{ color: `hsl(${hue}, 70%, 65%)` }}
      >
        &ldquo;
      </div>

      <div className="relative grid lg:grid-cols-12 gap-10 items-center">
        <blockquote className="lg:col-span-9 font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white tracking-tight leading-[1.15]">
          {quote}
        </blockquote>

        <div className="lg:col-span-3 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold tracking-tight ring-2 ring-white/15 shrink-0"
            style={{
              background: `linear-gradient(135deg, hsla(${hue},55%,32%,0.9), hsla(${hue},65%,20%,0.95))`,
              color: `hsla(${hue},75%,78%,1)`,
            }}
          >
            {initials}
          </div>
          <div>
            <div className="text-base font-semibold text-white">{name}</div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400/80">{role}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompactQuote({ name, role, initials, hue, quote }: (typeof TESTIMONIALS)[number]) {
  return (
    <div className="glass-card h-full p-7 lg:p-8">
      <blockquote className="text-sm lg:text-base text-slate-300 leading-relaxed mb-6">
        {quote}
      </blockquote>
      <div className="flex items-center gap-3 pt-5 border-t border-white/10">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-white/10"
          style={{
            background: `linear-gradient(135deg, hsla(${hue},55%,32%,0.9), hsla(${hue},65%,20%,0.95))`,
            color: `hsla(${hue},75%,78%,1)`,
          }}
        >
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-white leading-tight">{name}</div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">{role}</div>
        </div>
      </div>
    </div>
  )
}
