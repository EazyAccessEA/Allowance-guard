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
import { Shield, Search, CheckCircle } from 'lucide-react'

interface HeroProps {
  isConnected: boolean
  onScan: () => void
  isScanning: boolean
  scanMessage: string
  onWalletSelect: (address: string) => void
}

/** Shared fade-up variant for staggered children */
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
  onWalletSelect
}: HeroProps) {
  const prefersReduced = useReducedMotion()

  return (
    <section
      className="relative min-h-[85svh] flex items-center overflow-hidden bg-surface-base"
      aria-label="Hero"
    >
      {/* Vanta.js NET — deep navy with faint slate lines */}
      <VantaHeroBackground />

      {/* Gradient overlay — pushes background behind text */}
      <div
        className="absolute inset-0 z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.5) 60%, rgba(15,23,42,0.3) 100%)',
        }}
      />

      {/* Content */}
      <Container className="relative z-20 max-w-5xl py-20 sm:py-28 lg:py-36">
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-2 mb-6 sm:mb-8"
          variants={fadeUp}
          initial={prefersReduced ? 'visible' : 'hidden'}
          animate="visible"
          custom={0}
        >
          <Shield className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <span className="text-sm font-medium tracking-wide text-slate-400 uppercase">
            Token Approval Security
          </span>
        </motion.div>

        {/* Headline — "approved." in Danger Red */}
        <SplitText
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white mb-6 sm:mb-8"
          delay={0.2}
          stagger={0.08}
          renderWord={(word) =>
            word === 'approved.' ? (
              <span className="text-crimson-500">
                {word}
              </span>
            ) : (
              word
            )
          }
        >
          {"Know what you\u2019ve approved."}
        </SplitText>

        {/* Subheadline — 25% larger, medium weight, good contrast on navy */}
        <BlurText
          className="max-w-2xl text-xl sm:text-2xl font-medium text-slate-300 mb-8 sm:mb-10 leading-relaxed"
          delay={0.8}
        >
          See every token approval. Assess the risk. Revoke what you don&#39;t need.
          10 chains. Open source core. Always free.
        </BlurText>

        {/* CTAs consolidated + Trust indicators directly below */}
        <motion.div
          className="flex flex-col gap-4 mb-12 sm:mb-16 min-h-[80px] sm:min-h-[60px]"
          variants={fadeUp}
          initial={prefersReduced ? 'visible' : 'hidden'}
          animate="visible"
          custom={1.1}
        >
          {!isConnected ? (
            <div className="flex flex-col gap-5">
              {/* Primary + Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Gradient amber button — primary CTA */}
                <ClientConnectButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                />
                {/* Ghost secondary — muted */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
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

              {/* Trust indicators — directly under CTAs, green checks */}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5">
                <TrustCheck label="Your keys never leave your wallet" />
                <TrustCheck label="Read-only blockchain access" />
                <TrustCheck label="Open source core · Free to use" />
              </div>
            </div>
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
                <p className="text-sm text-slate-400">
                  {scanMessage}
                </p>
              )}
              <div className="p-3 bg-amber-900/20 border border-amber-700/40 rounded-lg">
                <p className="text-sm text-amber-300 font-medium">
                  Wallet connected. Loading your security dashboard...
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Signature amber line */}
        <motion.div
          className="h-px mb-8"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(90deg, #F59E0B 0%, rgba(245,158,11,0.3) 60%, transparent 100%)',
            boxShadow: '0 0 8px rgba(245, 158, 11, 0.15)',
          }}
          initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0, transformOrigin: 'left' }}
          animate={{ scaleX: 1, transformOrigin: 'left' }}
          transition={{ duration: 0.6, delay: 1.3, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Stats — full-width 3-column grid */}
        <motion.div
          className="grid grid-cols-3 gap-4 sm:gap-8 w-full"
          variants={fadeUp}
          initial={prefersReduced ? 'visible' : 'hidden'}
          animate="visible"
          custom={1.4}
        >
          <StatItem value={50000} suffix="+" label="Wallets scanned" delay={1.4} />
          <StatItem value={2000000} suffix="+" label="Approvals revoked" delay={1.5} />
          <StatItem value={10} label="Chains covered" delay={1.6} />
        </motion.div>
      </Container>
    </section>
  )
}

function StatItem({
  value,
  suffix = '',
  label,
  delay,
}: {
  value: number
  suffix?: string
  label: string
  delay: number
}) {
  return (
    <div className="text-center sm:text-left">
      <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
        <CountUp value={value} suffix={suffix} delay={delay} />
      </div>
      <div className="text-xs sm:text-sm text-slate-400 mt-0.5">{label}</div>
    </div>
  )
}

/** Green check icons — signals safety & trust */
function TrustCheck({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-300">
      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
