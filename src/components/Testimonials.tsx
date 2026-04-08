'use client'

/**
 * Testimonials — Ledger aesthetic
 *
 * Paper section with a magazine-style featured pull-quote in Fraunces
 * italic at display scale, a giant decorative open-quote mark, and a
 * grid of supporting quotes in paper-cards. Warm, not cold.
 */

import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

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
    <section className="paper grain relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      <Container>
        <div className="mb-20 lg:mb-24">
          <SectionHeader
            roman="V"
            eyebrow="Signal, not noise"
            title={
              <>
                Used by people
                <br />
                <span className="text-ink-muted">who verify everything.</span>
              </>
            }
            lede="Traders, developers, and DAOs running AllowanceGuard on their own wallets."
          />
        </div>

        <CascadingScrollAnimation direction="up" distance={40} delay={0}>
          <FeaturedQuote {...featured} />
        </CascadingScrollAnimation>

        {/* Supporting grid */}
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
    <div className="paper-card-raised relative overflow-hidden p-10 lg:p-16">
      {/* Giant decorative open-quote — Fraunces italic, soft ink */}
      <div
        aria-hidden="true"
        className="absolute -top-10 -left-2 font-fraunces italic text-[20rem] leading-none pointer-events-none select-none font-bold"
        style={{ color: 'rgba(20,18,16,0.07)' }}
      >
        &ldquo;
      </div>

      <div className="relative grid lg:grid-cols-12 gap-10 items-center">
        <blockquote className="lg:col-span-9 font-fraunces-display italic text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-normal text-ink leading-[1.2]">
          {quote}
        </blockquote>

        <div className="lg:col-span-3 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-ink-rule lg:pl-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-mono text-sm font-bold tracking-tight border border-ink-rule shrink-0"
            style={{
              background: `linear-gradient(135deg, hsla(${hue},50%,85%,0.9), hsla(${hue},45%,75%,0.8))`,
              color: '#141210',
            }}
          >
            {initials}
          </div>
          <div>
            <div className="font-plex text-base font-semibold text-ink">{name}</div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-deep">
              {role}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompactQuote({ name, role, initials, hue, quote }: (typeof TESTIMONIALS)[number]) {
  return (
    <div className="paper-card h-full p-7 lg:p-8 flex flex-col">
      <blockquote className="font-plex text-sm lg:text-base text-ink-soft leading-[1.6] mb-6 flex-1">
        {quote}
      </blockquote>
      <div className="flex items-center gap-3 pt-5 border-t border-ink-rule">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold border border-ink-rule"
          style={{
            background: `linear-gradient(135deg, hsla(${hue},50%,85%,0.9), hsla(${hue},45%,75%,0.8))`,
            color: '#141210',
          }}
        >
          {initials}
        </div>
        <div>
          <div className="font-plex text-sm font-semibold text-ink leading-tight">{name}</div>
          <div className="font-mono text-[9px] font-bold uppercase tracking-wider text-ink-whisper">
            {role}
          </div>
        </div>
      </div>
    </div>
  )
}
