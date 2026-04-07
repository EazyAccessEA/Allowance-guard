'use client'

import Container from '@/components/ui/Container'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'DeFi Trader',
    initials: 'SC',
    hue: 0,
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
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-[#0A0E1A] overflow-hidden">
      {/* Gradient transition */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(to bottom, #060A14 0%, transparent 100%)',
        }}
      />

      {/* Atmospheric glow — centre */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.03) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      <Container>
        <CascadingScrollAnimation direction="up" distance={40} delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.1] mb-6">
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                Used by People
              </span>
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                {' '}Who Verify Everything
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              Traders, developers, and DAOs running AllowanceGuard on their own wallets.
            </p>
          </div>
        </CascadingScrollAnimation>

        {/* Masonry-style grid — mixed density */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <CascadingScrollAnimation key={t.name} direction="up" distance={30} delay={i * 80}>
              <TestimonialCard {...t} />
            </CascadingScrollAnimation>
          ))}
        </div>
      </Container>
    </section>
  )
}

function TestimonialCard({
  name,
  role,
  initials,
  hue,
  quote,
}: (typeof TESTIMONIALS)[number]) {
  return (
    <div className="glass-card group p-7 lg:p-8">
      {/* Gradient quote mark — large, decorative */}
      <div
        className="absolute top-5 right-6 text-6xl font-serif leading-none pointer-events-none select-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(135deg, hsla(${hue}, 70%, 60%, 0.15), transparent)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        &ldquo;
      </div>

      {/* Avatar — generated from initials with unique hue */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold tracking-tight ring-2 ring-white/10"
          style={{
            background: `linear-gradient(135deg, hsla(${hue}, 50%, 30%, 0.8), hsla(${hue}, 60%, 20%, 0.9))`,
            color: `hsla(${hue}, 70%, 75%, 1)`,
          }}
        >
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{name}</div>
          <div className="text-xs text-slate-400">{role}</div>
        </div>
      </div>

      <blockquote className="text-sm text-slate-400 leading-relaxed">
        {quote}
      </blockquote>
    </div>
  )
}
