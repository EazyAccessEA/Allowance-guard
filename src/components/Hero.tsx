'use client'

import { Button } from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import ClientConnectButton from '@/components/ClientConnectButton'
import TestConnect from '@/components/TestConnect'
import VantaHeroBackground from '@/components/VantaHeroBackground'
import SplitText from '@/components/ui/SplitText'
import BlurText from '@/components/ui/BlurText'
import CountUp from '@/components/ui/CountUp'
import { motion, useReducedMotion } from 'framer-motion'
import { Shield, Search, CheckCircle, Activity } from 'lucide-react'

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
      className="relative min-h-[90svh] flex items-center overflow-hidden bg-surface-base"
      aria-label="Hero"
    >
      {/* Vanta NET — dimmed so the glass surfaces read cleanly */}
      <div className="absolute inset-0 opacity-50">
        <VantaHeroBackground />
      </div>

      {/* Reinforced overlay (Noor: keep AAA contrast through glass) */}
      <div
        className="absolute inset-0 z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 45%, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.65) 55%, rgba(10,14,26,0.5) 100%)',
        }}
      />

      <Container className="relative z-20 py-20 sm:py-28 lg:py-36">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ============ LEFT COLUMN (7) ============ */}
          <div className="lg:col-span-7">
            {/* Eyebrow — glass pill */}
            <motion.div
              variants={fadeUp}
              initial={prefersReduced ? 'visible' : 'hidden'}
              animate="visible"
              custom={0}
              className="mb-7"
            >
              <span className="glass-pill text-xs font-semibold tracking-[0.12em] uppercase text-slate-200">
                <Shield className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                Token Approval Security
              </span>
            </motion.div>

            {/* Headline — gradient white→amber, "approved." crimson */}
            <SplitText
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 sm:mb-8 bg-gradient-to-br from-white via-white to-amber-300 bg-clip-text text-transparent"
              delay={0.2}
              stagger={0.08}
              renderWord={(word) =>
                word === 'approved.' ? (
                  <span className="text-crimson-500 [-webkit-text-fill-color:#EF4444]">
                    {word}
                  </span>
                ) : (
                  word
                )
              }
            >
              {"Know what you\u2019ve approved."}

            </SplitText>

            {/* Subheadline */}
            <BlurText
              className="max-w-2xl text-xl sm:text-2xl font-medium text-slate-300 mb-8 sm:mb-10 leading-relaxed"
              delay={0.8}
            >
              Every dApp you use asks for permission. Most users sign once and forget. Attackers don&rsquo;t. AllowanceGuard finds every approval, scores its risk, and lets you revoke it &mdash; across 10 chains, without surrendering custody.
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
                      className="glass-button w-full sm:w-auto text-white border-0"
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
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5">
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
                    <p className="text-sm text-slate-400">{scanMessage}</p>
                  )}
                  <div className="glass-card px-4 py-3">
                    <p className="text-sm text-amber-300 font-medium">
                      Wallet connected. Loading your security dashboard…
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Signature amber line */}
            <motion.div
              className="h-px mt-10"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(90deg, #F59E0B 0%, rgba(245,158,11,0.3) 60%, transparent 100%)',
                boxShadow: '0 0 8px rgba(245, 158, 11, 0.15)',
              }}
              initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0, transformOrigin: 'left' }}
              animate={{ scaleX: 1, transformOrigin: 'left' }}
              transition={{ duration: 0.6, delay: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
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
            <div className="glass-card glass-drift p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex w-2.5 h-2.5">
                    <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-emerald-300">
                    Live Protection
                  </span>
                </div>
                <Activity className="w-4 h-4 text-amber-400" aria-hidden="true" />
              </div>

              {/* Stat rows — defensible facts only */}
              <div className="space-y-3">
                <StatRow
                  value={10}
                  label="EVM chains covered"
                  delay={1.4}
                />
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
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Status</span>
                  <span className="text-xs font-mono text-amber-300">All chains live</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['ETH', 'ARB', 'BASE', 'POLY', 'OP', 'AVAX', 'BNB', 'FTM', 'zkSync', 'zkEVM'].map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.02]"
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
    <div className="flex items-baseline justify-between rounded-xl px-4 py-3 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="font-display text-2xl font-bold text-white tracking-tight">
        {prefix}
        <CountUp value={value} suffix={suffix} delay={delay} />
      </span>
    </div>
  )
}

function TrustCheck({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
