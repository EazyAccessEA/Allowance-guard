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
      'I was shocked to find 15 unlimited approvals I had forgotten about. AllowanceGuard helped me clean up my wallet and sleep better at night. The risk assessment is incredibly detailed.',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'NFT Collector',
    initials: 'MR',
    hue: 160,
    quote:
      'As someone who interacts with dozens of dApps, I need to stay on top of my approvals. AllowanceGuard makes it simple and fast. The batch revocation feature saved me hours.',
  },
  {
    name: 'Alex Thompson',
    role: 'DAO Member',
    initials: 'AT',
    hue: 220,
    quote:
      'The transparency of open-source code gives me confidence. I can see exactly what AllowanceGuard is doing with my data. No hidden fees, no data collection — just pure security.',
  },
  {
    name: 'Elena Volkov',
    role: 'Smart Contract Developer',
    initials: 'EV',
    hue: 280,
    quote:
      'Multi-chain support is crucial for my work. Being able to check allowances across Ethereum, Arbitrum, and Base in one interface is a game-changer. The API integration is seamless.',
  },
  {
    name: 'David Kim',
    role: 'Crypto Investor',
    initials: 'DK',
    hue: 40,
    quote:
      'The real-time monitoring alerts saved me from a potential exploit. I got notified about a suspicious contract before I could interact with it. Essential for any serious investor.',
  },
  {
    name: 'Lisa Wang',
    role: 'Web3 Educator',
    initials: 'LW',
    hue: 120,
    quote:
      "I recommend AllowanceGuard to all my students. The educational content and clear explanations help them understand Web3 security. It's not just a tool, it's a learning platform.",
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
          background: 'radial-gradient(ellipse, rgba(229,62,62,0.03) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      <Container>
        <CascadingScrollAnimation direction="up" distance={40} delay={0}>
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                Trusted by Security-Conscious Users
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              Real stories from users who have protected their digital assets.
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
    <div className="group relative rounded-2xl p-7 lg:p-8 bg-white/[0.02] ring-1 ring-white/[0.06] transition-all duration-300 hover:ring-white/[0.12] hover:bg-white/[0.04]">
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
          <div className="text-xs text-slate-500">{role}</div>
        </div>
      </div>

      <blockquote className="text-sm text-slate-400 leading-relaxed">
        {quote}
      </blockquote>
    </div>
  )
}
