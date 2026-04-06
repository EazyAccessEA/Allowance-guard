'use client'

import { Button } from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import ClientConnectButton from '@/components/ClientConnectButton'
import TestConnect from '@/components/TestConnect'
import AnimatedBackground from '@/components/AnimatedBackground'
import { Shield, Search, Zap } from 'lucide-react'

interface HeroProps {
  isConnected: boolean
  onScan: () => void
  isScanning: boolean
  scanMessage: string
  onWalletSelect: (address: string) => void
}

export default function Hero({
  isConnected,
  onScan,
  isScanning,
  scanMessage,
  onWalletSelect
}: HeroProps) {
  return (
    <section
      className="relative min-h-[85svh] flex items-center overflow-hidden bg-surface-base"
      aria-label="Hero"
    >
      {/* Animated mesh background — crimson + volt */}
      <AnimatedBackground variant="hero" />

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(229,62,62,0.06) 0%, transparent 70%), linear-gradient(to bottom, rgba(11,17,32,0.6) 0%, rgba(11,17,32,0.95) 100%)',
        }}
      />

      {/* Content */}
      <Container className="relative z-20 max-w-5xl py-20 sm:py-28 lg:py-36">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <Shield className="w-4 h-4 text-crimson-400" aria-hidden="true" />
          <span className="text-sm font-medium tracking-wide text-slate-400 uppercase">
            Web3 Wallet Security
          </span>
        </div>

        {/* Headline — Space Grotesk, aggressive scale contrast */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white mb-6 sm:mb-8">
          Know what you&rsquo;ve{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson-400 to-crimson-500">
            approved.
          </span>
        </h1>

        {/* Subheadline — Inter body, strong but restrained */}
        <p className="max-w-2xl text-lg sm:text-xl text-slate-300 leading-relaxed mb-8 sm:mb-10">
          Scan, assess, and revoke token approvals across 10 chains.
          Core tool: free and open source. Always.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-10 sm:mb-12 min-h-[80px] sm:min-h-[60px]">
          {!isConnected ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <ClientConnectButton
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              />
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-volt-400 border border-volt-500/30 hover:border-volt-500/50 hover:bg-volt-500/10 hover:text-volt-300"
                onClick={() => {
                  const el = document.getElementById('main')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                Scan an Address
              </Button>
              <TestConnect onConnect={onWalletSelect} />
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
              <div className="p-3 bg-volt-900/20 border border-volt-700/40 rounded-lg">
                <p className="text-sm text-volt-300 font-medium">
                  Wallet Connected! Taking you to your Security Dashboard...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Signature crimson line — separating content from social proof */}
        <div
          className="h-px mb-8"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(90deg, #E53E3E 0%, rgba(229,62,62,0.3) 60%, transparent 100%)',
            boxShadow: '0 0 8px rgba(229, 62, 62, 0.2)',
          }}
        />

        {/* Stats bar — social proof */}
        <div className="flex flex-wrap items-center gap-8 sm:gap-12">
          <StatItem value="50K+" label="Wallets scanned" />
          <StatDivider />
          <StatItem value="2M+" label="Approvals revoked" />
          <StatDivider />
          <StatItem value="10" label="Chains supported" />
        </div>

        {/* Trust indicators — volt accent for "safe" signals */}
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 mt-8 text-sm text-slate-400">
          <TrustDot label="No private keys required" />
          <TrustDot label="Read-only access" />
          <TrustDot label="Free core · Open source" />
        </div>
      </Container>
    </section>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-slate-400 mt-0.5">{label}</div>
    </div>
  )
}

function StatDivider() {
  return (
    <div
      className="w-px h-10 hidden sm:block"
      aria-hidden="true"
      style={{
        background: 'linear-gradient(180deg, transparent, rgba(229,62,62,0.4), transparent)',
      }}
    />
  )
}

function TrustDot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Zap className="w-3 h-3 text-volt-400 flex-shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
