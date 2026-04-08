'use client'

/**
 * CTABand — the single dark inverse moment on the page.
 *
 * Oxblood (#3A0C0C) full-bleed panel inset into the paper flow.
 * Paper sections above and below create a light → dark → light rhythm.
 * "Take back / control." in Fraunces italic at display-[10rem], with the
 * existing crimson "control." accent preserved.
 */

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
    <section className="relative py-32 sm:py-40 lg:py-56 bg-oxblood overflow-hidden">
      {/* Atmospheric crimson glow centre */}
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
                Now your turn
              </span>
              <span className="h-px w-8 bg-amber-500" aria-hidden="true" />
            </div>

            <h2 className="font-fraunces-display italic font-normal tracking-tight leading-[0.9] mb-10 text-6xl sm:text-7xl lg:text-8xl xl:text-[10rem]">
              <span className="text-cream">Take back</span>
              <br />
              <span className="text-crimson-paper not-italic font-semibold">
                control.
              </span>
            </h2>

            <p className="font-plex text-lg sm:text-xl lg:text-2xl text-cream/75 leading-[1.55] mb-12 max-w-2xl mx-auto">
              Scan your wallet in under a minute. No account. No custody. No compromise.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isConnected ? (
                <ClientConnectButton
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-h-[56px] px-12 text-base font-semibold"
                />
              ) : (
                <Button
                  onClick={onScan}
                  disabled={isScanning}
                  loading={isScanning}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-h-[56px] px-12 text-base font-semibold"
                >
                  {isScanning ? 'Scanning…' : 'Scan Your Wallet'}
                </Button>
              )}
            </div>

            <p className="mt-8 font-mono text-xs text-cream/50 tracking-wider uppercase">
              No email &nbsp;·&nbsp; Read-only access &nbsp;·&nbsp; Open source core
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
  )
}
