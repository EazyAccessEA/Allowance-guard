'use client'

import Container from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import ClientConnectButton from '@/components/ClientConnectButton'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

interface CTABandProps {
  isConnected: boolean
  onScan: () => void
  isScanning: boolean
}

export default function CTABand({ isConnected, onScan, isScanning }: CTABandProps) {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 bg-[#060A14] overflow-hidden">
      {/* Gradient transition from features */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(to bottom, #060A14 0%, transparent 100%)',
        }}
      />

      {/* Crimson atmospheric glow — top centre */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 70% 50%, rgba(229,62,62,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Volt glow — bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,240,200,0.04) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      <Container>
        <CascadingScrollAnimation direction="up" distance={50} delay={0}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl tracking-tight leading-[1.05] mb-6">
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-500">
                Ready to Secure
              </span>
              <br />
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-crimson-400 to-crimson-500">
                Your Wallet?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-xl mx-auto">
              Complete your security audit in under a minute. No sign-up required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isConnected ? (
                <ClientConnectButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-h-[52px] px-10 text-base font-semibold"
                />
              ) : (
                <Button
                  onClick={onScan}
                  disabled={isScanning}
                  loading={isScanning}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-h-[52px] px-10 text-base font-semibold"
                >
                  {isScanning ? 'Scanning...' : 'Scan Your Wallet'}
                </Button>
              )}
            </div>

            {/* Trust line */}
            <p className="mt-6 text-sm text-slate-400">
              No email collection &middot; Read-only access &middot; Open source
            </p>
          </div>
        </CascadingScrollAnimation>
      </Container>

      {/* Signature crimson line — bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, rgba(229,62,62,0.3) 50%, transparent 90%)',
        }}
      />
    </section>
  )
}
