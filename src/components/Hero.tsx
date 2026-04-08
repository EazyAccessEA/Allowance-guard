'use client'

/**
 * Hero — Ledger aesthetic
 *
 * Warm paper background with a stock-certificate compass mark watermark
 * and a subtle grain overlay. Fraunces italic display headline in ink,
 * crimson "approved." protected moment preserved, amber signature hairline
 * preserved. Live Protection panel inverts to paper-card-raised.
 *
 * Design Council: Maren (visual), Noor (contrast AAA: ink on paper 15:1),
 * Thane (removed Vanta WebGL — net bundle decrease), Sable (UX: editorial
 * hierarchy; eyebrow → headline → lede → CTA flow preserved).
 */

import { Button } from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import ClientConnectButton from '@/components/ClientConnectButton'
import TestConnect from '@/components/TestConnect'
import SplitText from '@/components/ui/SplitText'
import BlurText from '@/components/ui/BlurText'
import CountUp from '@/components/ui/CountUp'
import { motion, useReducedMotion } from 'framer-motion'
import { Shield, Search, CheckCircle2, Activity } from 'lucide-react'

interface HeroProps {
  isConnected: boolean
  onScan: () => void
  isScanning: boolean
  scanMessage: string
  onWalletSelect: (address: string) => void
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
}

export default function Hero({
  isConnected,
  onScan,
  isScanning,
  scanMessage,
  onWalletSelect,
}: HeroProps) {
  const prefersReduced = useReducedMotion()

  return (
    <section
      className="paper grain deckle-bottom relative min-h-[90svh] flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Warm gradient wash — amber → cream, replaces the old Vanta NET layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 20% 25%, rgba(245,158,11,0.12) 0%, transparent 55%),' +
            'radial-gradient(ellipse 60% 45% at 85% 80%, rgba(220,38,38,0.06) 0%, transparent 60%),' +
            'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(250,244,230,0.6) 0%, transparent 80%)',
        }}
      />

      {/* Editorial watermark — inline SVG compass/stock-certificate mark */}
      <CompassWatermark />

      <Container className="relative z-10 py-20 sm:py-28 lg:py-36">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ============ LEFT COLUMN (7) ============ */}
          <div className="lg:col-span-7">
            {/* Eyebrow — paper pill */}
            <motion.div
              variants={fadeUp}
              initial={prefersReduced ? 'visible' : 'hidden'}
              animate="visible"
              custom={0}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper-sub border border-ink-rule">
                <Shield className="w-3.5 h-3.5 text-amber-deep" aria-hidden="true" />
                <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-soft">
                  Token Approval Security · Est. 2024
                </span>
              </span>
            </motion.div>

            {/* Headline — Fraunces italic, ink on paper, crimson "approved." */}
            <SplitText
              className="font-fraunces-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-normal italic leading-[0.95] tracking-tight mb-7 sm:mb-8 text-ink"
              delay={0.2}
              stagger={0.08}
              renderWord={(word) =>
                word === 'approved.' ? (
                  <span className="text-crimson-paper not-italic font-semibold">
                    {word}
                  </span>
                ) : (
                  word
                )
              }
            >
              {"Know what you\u2019ve approved."}
            </SplitText>

            {/* Subheadline — Plex body, ink-soft */}
            <BlurText
              className="font-plex max-w-2xl text-lg sm:text-xl text-ink-soft mb-9 leading-[1.55]"
              delay={0.8}
            >
              Every dApp you use asks for permission. Most users sign once and forget. Attackers don&rsquo;t. AllowanceGuard finds every approval, scores its risk, and lets you revoke it &mdash; across 15 chains, without surrendering custody.
            </BlurText>

            {/* CTAs */}
            <motion.div
              className="flex flex-col gap-5"
              variants={fadeUp}
              initial={prefersReduced ? 'visible' : 'hidden'}
              animate="visible"
              custom={1.1}
            >
              {!isConnected ? (
                <>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <ClientConnectButton
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                    />
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto bg-transparent border-ink text-ink hover:bg-ink hover:text-paper"
                      onClick={() => {
                        const el = document.getElementById('main')
                        el?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                      Look Up an Address
                    </Button>
                    <TestConnect onConnect={onWalletSelect} />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6">
                    <TrustCheck label="Your keys never leave your wallet" />
                    <TrustCheck label="Read-only blockchain access" />
                    <TrustCheck label="Open source core" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={onScan}
                    disabled={isScanning}
                    loading={isScanning}
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto min-h-[44px]"
                  >
                    {isScanning ? 'Scanning...' : 'Scan Your Wallet — Free'}
                  </Button>
                  {scanMessage && (
                    <p className="font-mono text-sm text-ink-muted">{scanMessage}</p>
                  )}
                  <div className="paper-card px-4 py-3">
                    <p className="text-sm text-amber-deep font-semibold">
                      Wallet connected. Loading your security dashboard…
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Signature amber hairline — preserved */}
            <motion.div
              className="h-px mt-12 origin-left"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(90deg, #F59E0B 0%, rgba(245,158,11,0.35) 60%, transparent 100%)',
                boxShadow: '0 0 6px rgba(245, 158, 11, 0.2)',
              }}
              initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>

          {/* ============ RIGHT COLUMN (5) — Live Protection Panel ============ */}
          <motion.aside
            className="lg:col-span-5"
            variants={fadeUp}
            initial={prefersReduced ? 'visible' : 'hidden'}
            animate="visible"
            custom={1.4}
            aria-label="Live protection statistics"
          >
            <div className="paper-card-raised p-7 sm:p-9">
              {/* Header — ledger-style */}
              <div className="flex items-center justify-between mb-7 pb-5 border-b border-ink-rule">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-amber-500 opacity-60 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-amber-deep" />
                  </span>
                  <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink">
                    Live Protection
                  </span>
                </div>
                <div className="flex items-center gap-2 text-ink-muted">
                  <Activity className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="font-mono text-[9px] tracking-widest uppercase">§ 00</span>
                </div>
              </div>

              {/* Stat rows — ledger dotted-leader style */}
              <div className="space-y-4">
                <StatRow value={15} label="EVM chains covered" delay={1.4} />
                <StatRow
                  value={2}
                  prefix="$"
                  suffix="B+"
                  label="Stolen via approvals since 2022"
                  delay={1.5}
                />
                <StatRow
                  value={100}
                  suffix="%"
                  label="Open source &amp; non-custodial"
                  delay={1.6}
                />
              </div>

              {/* Footer */}
              <div className="mt-7 pt-5 border-t border-ink-rule">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-ink-muted">
                    Status
                  </span>
                  <span className="font-mono text-[10px] tracking-wider uppercase text-amber-deep font-bold">
                    All chains live
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['ETH', 'ARB', 'BASE', 'POLY', 'OP', 'AVAX', 'BNB', 'FTM', 'zkSync', 'zkEVM'].map((c) => (
                    <span
                      key={c}
                      className="font-mono text-[9px] font-semibold text-ink-muted px-1.5 py-0.5 rounded border border-ink-rule bg-paper"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </Container>
    </section>
  )
}

/**
 * CompassWatermark — decorative SVG imagery.
 * Stock-certificate / maritime-chart compass mark. Positioned large and
 * faint behind the hero content, inked in ink-muted at low opacity with
 * amber inner accent. Zero HTTP request, scales cleanly, on-brand.
 */
function CompassWatermark() {
  const prefersReduced = useReducedMotion()
  return (
    <div
      aria-hidden="true"
      className="absolute -right-40 -bottom-40 sm:right-[-12%] sm:bottom-[-14%] lg:right-[30%] lg:bottom-[-20%] w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] pointer-events-none select-none"
    >
      <motion.svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        initial={prefersReduced ? { opacity: 0.18, rotate: 0 } : { opacity: 0, rotate: -8 }}
        animate={{ opacity: 0.18, rotate: 0 }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      >
        {/* Outer concentric rings — ink-weight */}
        <g fill="none" stroke="#141210" strokeWidth="0.75">
          <circle cx="200" cy="200" r="195" />
          <circle cx="200" cy="200" r="180" />
          <circle cx="200" cy="200" r="160" strokeDasharray="2 3" />
          <circle cx="200" cy="200" r="140" />
          <circle cx="200" cy="200" r="115" strokeDasharray="1 4" />
          <circle cx="200" cy="200" r="90" />
          <circle cx="200" cy="200" r="60" />
        </g>

        {/* Tick marks around outer ring — 36 ticks */}
        <g stroke="#141210" strokeWidth="0.9">
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = (i * 360) / 72
            const rad = (angle * Math.PI) / 180
            const isMajor = i % 6 === 0
            const inner = isMajor ? 172 : 177
            const outer = 184
            const x1 = 200 + Math.cos(rad) * inner
            const y1 = 200 + Math.sin(rad) * inner
            const x2 = 200 + Math.cos(rad) * outer
            const y2 = 200 + Math.sin(rad) * outer
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={isMajor ? 1.5 : 0.6}
              />
            )
          })}
        </g>

        {/* Crosshair */}
        <g stroke="#141210" strokeWidth="0.8">
          <line x1="200" y1="20" x2="200" y2="380" />
          <line x1="20" y1="200" x2="380" y2="200" />
        </g>

        {/* Inner star compass — 8 points */}
        <g fill="none" stroke="#141210" strokeWidth="1">
          <path d="M 200 110 L 215 200 L 200 290 L 185 200 Z" fill="rgba(20,18,16,0.06)" />
          <path d="M 110 200 L 200 185 L 290 200 L 200 215 Z" fill="rgba(20,18,16,0.06)" />
          <path d="M 137 137 L 210 195 L 263 263 L 190 205 Z" fill="rgba(245,158,11,0.12)" />
          <path d="M 263 137 L 205 190 L 137 263 L 195 210 Z" fill="rgba(245,158,11,0.12)" />
        </g>

        {/* Center amber mark — the only amber moment in the watermark */}
        <circle cx="200" cy="200" r="6" fill="#F59E0B" />
        <circle cx="200" cy="200" r="14" fill="none" stroke="#F59E0B" strokeWidth="1.5" />

        {/* Roman numeral cardinal marks */}
        <g fill="#141210" fontFamily="serif" fontSize="10" fontStyle="italic" textAnchor="middle">
          <text x="200" y="50">N</text>
          <text x="355" y="205">E</text>
          <text x="200" y="360">S</text>
          <text x="45" y="205">W</text>
        </g>
      </motion.svg>
    </div>
  )
}

function StatRow({
  value,
  prefix = '',
  suffix = '',
  label,
  delay,
}: {
  value: number
  prefix?: string
  suffix?: string
  label: string
  delay: number
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span
        className="font-plex text-sm text-ink-soft"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      <span className="font-fraunces-display text-3xl text-ink font-semibold tabular-nums">
        {prefix}
        <CountUp value={value} suffix={suffix} delay={delay} />
      </span>
    </div>
  )
}

function TrustCheck({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-amber-deep flex-shrink-0" aria-hidden="true" />
      <span className="font-plex text-sm text-ink-soft">{label}</span>
    </div>
  )
}
