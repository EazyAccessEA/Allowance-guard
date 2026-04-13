'use client'

/**
 * Homepage — Coming Soon / Waitlist Capture
 *
 * Product not yet live. This page replaces the full scanner homepage
 * with a waitlist capture using the Ledger aesthetic and the actual
 * component system (SectionHeader, CascadingScrollAnimation, Highlight,
 * paper-card, paper-button, font-display-tight).
 *
 * Council:
 *  Maren: font-display-tight headlines, Highlight signature move, atmospheric oxblood band
 *  Kael: uses SectionHeader, paper-card, paper-button — no ad-hoc patterns
 *  Idris: CascadingScrollAnimation on every section
 *  #13 UX writer: plain mono numerals, no roman numerals (v3 veto)
 *  Noor: AAA contrast preserved, semantic form, aria-live
 *  Thane: no heavy JS — SubscribeForm is the only client island
 */

import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import Highlight from '@/components/ui/Highlight'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'
import SubscribeForm from '@/app/coming-soon/SubscribeForm'

const UPCOMING = [
  {
    number: '01',
    eyebrow: 'Mobile',
    title: 'A native app for approvals on the go.',
    description:
      'Monitor approvals, receive push alerts, and revoke from your phone. Your wallet security travels with you.',
  },
  {
    number: '02',
    eyebrow: 'SDK',
    title: 'Embed security in your own dApp.',
    description:
      'A few lines of code to scan approvals, score risk, and trigger revocation — directly inside your product.',
  },
  {
    number: '03',
    eyebrow: 'Chains',
    title: 'Expanding beyond 27 networks.',
    description:
      'Solana, Sui, and more on the roadmap. Every chain gets the same depth of coverage.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* ── Hero ── */}
      <section className="paper grain relative min-h-[70svh] flex items-center overflow-hidden">
        {/* Warm gradient wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 15% 25%, rgba(245,158,11,0.14) 0%, transparent 55%),' +
              'radial-gradient(ellipse 60% 45% at 85% 80%, rgba(220,38,38,0.07) 0%, transparent 60%),' +
              'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(250,244,230,0.6) 0%, transparent 80%)',
          }}
        />

        {/* Compass SVG watermark — the signature editorial motif */}
        <div
          aria-hidden="true"
          className="absolute -right-40 -bottom-40 sm:right-[-10%] sm:bottom-[-12%] lg:right-[-2%] lg:bottom-[-15%] w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] pointer-events-none select-none opacity-[0.14]"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <g fill="none" stroke="#141210" strokeWidth="0.75">
              <circle cx="200" cy="200" r="195" />
              <circle cx="200" cy="200" r="180" />
              <circle cx="200" cy="200" r="160" strokeDasharray="2 3" />
              <circle cx="200" cy="200" r="140" />
              <circle cx="200" cy="200" r="115" strokeDasharray="1 4" />
              <circle cx="200" cy="200" r="90" />
              <circle cx="200" cy="200" r="60" />
            </g>
            <g stroke="#141210" strokeWidth="0.9">
              {Array.from({ length: 72 }).map((_, i) => {
                const angle = (i * 360) / 72
                const rad = (angle * Math.PI) / 180
                const isMajor = i % 6 === 0
                const inner = isMajor ? 172 : 177
                const outer = 184
                return (
                  <line
                    key={i}
                    x1={200 + Math.cos(rad) * inner}
                    y1={200 + Math.sin(rad) * inner}
                    x2={200 + Math.cos(rad) * outer}
                    y2={200 + Math.sin(rad) * outer}
                    strokeWidth={isMajor ? 1.5 : 0.6}
                  />
                )
              })}
            </g>
            <g stroke="#141210" strokeWidth="0.8">
              <line x1="200" y1="20" x2="200" y2="380" />
              <line x1="20" y1="200" x2="380" y2="200" />
            </g>
            <g fill="none" stroke="#141210" strokeWidth="1">
              <path d="M 200 110 L 215 200 L 200 290 L 185 200 Z" fill="rgba(20,18,16,0.06)" />
              <path d="M 110 200 L 200 185 L 290 200 L 200 215 Z" fill="rgba(20,18,16,0.06)" />
              <path d="M 137 137 L 210 195 L 263 263 L 190 205 Z" fill="rgba(245,158,11,0.12)" />
              <path d="M 263 137 L 205 190 L 137 263 L 195 210 Z" fill="rgba(245,158,11,0.12)" />
            </g>
            <circle cx="200" cy="200" r="6" fill="#F59E0B" />
            <circle cx="200" cy="200" r="14" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
            <g fill="#141210" fontFamily="serif" fontSize="10" fontStyle="italic" textAnchor="middle">
              <text x="200" y="50">N</text>
              <text x="355" y="205">E</text>
              <text x="200" y="360">S</text>
              <text x="45" y="205">W</text>
            </g>
          </svg>
        </div>

        <Container className="relative z-10 py-20 sm:py-24 lg:py-28">
          <div className="max-w-4xl">
            <CascadingScrollAnimation direction="up" distance={40} delay={0}>
              <div className="inline-flex items-baseline gap-3 mb-8">
                <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
                  Coming Soon
                </span>
                <span className="h-px w-12 bg-ink-rule" aria-hidden="true" />
                <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
                  Open Source
                </span>
              </div>
            </CascadingScrollAnimation>

            <CascadingScrollAnimation direction="up" distance={40} delay={150}>
              <h1 className="font-display-tight text-ink leading-[0.95] mb-7 text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                Wallet security,{' '}
                <Highlight>reimagined.</Highlight>
              </h1>
            </CascadingScrollAnimation>

            <CascadingScrollAnimation direction="up" distance={40} delay={300}>
              <p className="font-plex text-lg sm:text-xl text-ink-soft mb-10 max-w-2xl leading-[1.55]">
                We&apos;re building the next generation of token approval security.
                Join the waitlist — be the first to know when we launch.
              </p>
            </CascadingScrollAnimation>

            {/* Signature amber hairline */}
            <CascadingScrollAnimation direction="up" distance={20} delay={450}>
              <div
                className="h-px max-w-md"
                aria-hidden="true"
                style={{
                  background:
                    'linear-gradient(90deg, #F59E0B 0%, rgba(245,158,11,0.35) 60%, transparent 100%)',
                  boxShadow: '0 0 6px rgba(245, 158, 11, 0.2)',
                }}
              />
            </CascadingScrollAnimation>
          </div>
        </Container>
      </section>

      {/* ── What's coming ── */}
      <section className="paper-sub grain relative py-24 sm:py-32 lg:py-40 overflow-hidden">
        <Container>
          <div className="mb-20 lg:mb-24">
            <SectionHeader
              number="01"
              eyebrow="On the horizon"
              title={
                <>
                  Three things{' '}
                  <span className="text-ink-muted">
                    <Highlight>worth waiting for.</Highlight>
                  </span>
                </>
              }
              lede="Every feature earns its place. Here's what's next."
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {UPCOMING.map((item, i) => (
              <CascadingScrollAnimation
                key={item.number}
                direction="up"
                distance={40}
                delay={i * 120}
              >
                <div className="paper-card p-8 sm:p-10 h-full flex flex-col">
                  <div className="flex items-baseline gap-4 mb-5">
                    <span
                      className="font-mono text-[11px] font-bold tracking-[0.22em] text-ink/80"
                      aria-hidden="true"
                    >
                      {item.number}
                    </span>
                    <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
                      {item.eyebrow}
                    </span>
                  </div>
                  <h3 className="font-display-tight text-ink leading-[1.05] text-2xl sm:text-3xl mb-4">
                    {item.title}
                  </h3>
                  <p className="font-plex text-ink-muted text-[15px] leading-relaxed mt-auto">
                    {item.description}
                  </p>
                </div>
              </CascadingScrollAnimation>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Email capture ── */}
      <section className="paper grain relative py-24 sm:py-32 overflow-hidden">
        <Container>
          <CascadingScrollAnimation direction="up" distance={40} delay={0}>
            <div className="max-w-md mx-auto">
              <SubscribeForm />
            </div>
          </CascadingScrollAnimation>
        </Container>
      </section>

      {/* ── Oxblood closing band — the single dark inverse moment ── */}
      <section className="relative py-32 sm:py-40 bg-oxblood overflow-hidden">
        {/* Atmospheric crimson glow */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50%, rgba(220,38,38,0.18) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Amber undertone */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(245,158,11,0.10) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Top amber hairline */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.5) 50%, transparent 90%)',
            boxShadow: '0 0 12px rgba(245,158,11,0.25)',
          }}
        />

        <Container>
          <CascadingScrollAnimation direction="up" distance={50} delay={0}>
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 mb-12">
                <span className="h-px w-8 bg-amber-500" aria-hidden="true" />
                <span className="font-mono text-[10px] font-bold tracking-[0.28em] uppercase text-amber-500">
                  The mission
                </span>
                <span className="h-px w-8 bg-amber-500" aria-hidden="true" />
              </div>

              <h2 className="font-display-black leading-[0.9] mb-10 text-5xl sm:text-6xl lg:text-7xl xl:text-[8rem]">
                <span className="text-cream">Open source.</span>
                <br />
                <span className="text-amber-500">
                  Built to last.
                </span>
              </h2>

              <p className="font-plex text-lg sm:text-xl text-cream/75 leading-[1.55] max-w-2xl mx-auto">
                Independently operated. No shortcuts. No compromise.
                Wallet security that earns your trust.
              </p>

              <p className="mt-8 font-mono text-xs text-cream/50 tracking-wider uppercase">
                Non-custodial &nbsp;·&nbsp; Read-only access &nbsp;·&nbsp; Open source core
              </p>
            </div>
          </CascadingScrollAnimation>
        </Container>

        {/* Bottom amber hairline */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.5) 50%, transparent 90%)',
            boxShadow: '0 0 12px rgba(245,158,11,0.25)',
          }}
        />
      </section>
    </div>
  )
}
