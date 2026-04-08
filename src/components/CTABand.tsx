'use client'

import Container from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import ClientConnectButton from '@/components/ClientConnectButton'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * The LOUD moment outside the hero. Display-scale headline,
 * crimson "control." accent (the protected colour moment repeats once),
 * full-bleed dark panel with amber and crimson hairlines.
 */

interface CTABandProps {
  isConnected: boolean
  onScan: () => void
  isScanning: boolean
}

export default function CTABand({ isConnected, onScan, isScanning }: CTABandProps) {
  const prefersReduced = useReducedMotion()

  return (
    <section className="relative py-32 sm:py-40 lg:py-56 bg-[#060A14] overflow-hidden">
      {/* Crimson atmospheric glow — centre */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 60% 50%, rgba(229,62,62,0.14) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Amber undertone */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Signature amber hairline — top */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-48"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #F59E0B 50%, transparent 100%)',
          boxShadow: '0 0 12px rgba(245,158,11,0.3)',
        }}
        initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />

      <Container>
        <CascadingScrollAnimation direction="up" distance={50} delay={0}>
          <div className="max-w-5xl mx-auto text-center">
            <div className="text-[11px] font-mono font-bold tracking-[0.28em] uppercase text-amber-400 mb-8">
              04 &nbsp; · &nbsp; Start now
            </div>

            <h2 className="font-display font-bold tracking-tight leading-[0.9] mb-10 text-6xl sm:text-7xl lg:text-8xl xl:text-[10rem]">
              <span className="bg-gradient-to-br from-white via-white to-slate-500 bg-clip-text text-transparent">
                Take back
              </span>
              <br />
              <span className="text-crimson-500 [-webkit-text-fill-color:#EF4444]">
                control.
              </span>
            </h2>

            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed mb-12 max-w-2xl mx-auto">
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

            <p className="mt-8 text-sm text-slate-400 font-mono tracking-wide">
              No email &nbsp;·&nbsp; Read-only access &nbsp;·&nbsp; Open source core
            </p>
          </div>
        </CascadingScrollAnimation>
      </Container>

      {/* Signature crimson hairline — bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-px"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, transparent 15%, rgba(239,68,68,0.5) 50%, transparent 85%)',
          boxShadow: '0 0 10px rgba(239,68,68,0.2)',
        }}
      />
    </section>
  )
}
