'use client'

/**
 * Hero v4 — Scanner-first ("tool-first hero")
 *
 * The scanner IS the promise. Address input is the primary element in
 * the viewport — no scroll, no ambiguity. Fraunces sentence demotes to
 * a caption that explains what the input does. The subhead paragraph
 * from v3 was deleted: two explanatory sentences under an action add
 * ambiguity the tool shouldn't have to overcome. Compass watermark and
 * amber hairline signature move kept intact.
 *
 * Council:
 *  #22 Conversion: input-above-headline — highest-leverage pattern
 *  #7 Maren / Visual: Fraunces voice preserved as caption
 *  #13 UX writer: caption-under-action removes the read-then-act riddle
 *  #8 Noor / Accessibility (veto): sr-only label, aria-describedby,
 *    contrast tokens, prefers-reduced-motion — all preserved
 *  #17 Thane / Performance: one motion block removed, no bundle delta
 *  #5 Marketing + #3 Web3: threat-named, EVM-accurate
 *  #4 Security: /api/scan flow unchanged
 *  #11 Investor voice: no banned phrases
 */

import { Button } from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Highlight from '@/components/ui/Highlight'
import ClientConnectButton from '@/components/ClientConnectButton'
import AddressInput from '@/components/AddressInput'
import { motion, useReducedMotion } from 'framer-motion'

interface HeroProps {
  isConnected: boolean
  onScan: (addr?: string) => void
  isScanning: boolean
  scanMessage: string
  onWalletSelect: (address: string) => void
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
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

  const handleAddressSubmit = (addr: string) => {
    // Set as selected wallet AND trigger a fresh scan in one action.
    onWalletSelect(addr)
    onScan(addr)
  }

  return (
    <section
      className="paper grain deckle-bottom relative min-h-[92svh] flex items-center overflow-hidden"
      aria-label="Hero"
    >
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

      {/* Compass watermark */}
      <CompassWatermark />

      <Container className="relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl">
          {/* Eyebrow — tool label, first line in view */}
          <motion.div
            variants={fadeUp}
            initial={prefersReduced ? 'visible' : 'hidden'}
            animate="visible"
            custom={0}
            className="mb-6"
          >
            <div className="inline-flex items-baseline gap-3">
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
                Wallet Security Scanner
              </span>
              <span className="h-px w-12 bg-ink-rule" aria-hidden="true" />
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
                Free · Open Source
              </span>
            </div>
          </motion.div>

          {/* Address input — the primary element. No ambiguity.
              id="scan" so /pricing Free CTA can deep-link here.
              scroll-mt-20 clears the sticky nav on hash-scroll. */}
          <motion.div
            id="scan"
            variants={fadeUp}
            initial={prefersReduced ? 'visible' : 'hidden'}
            animate="visible"
            custom={0.15}
            className="max-w-2xl mb-8 scroll-mt-20"
          >
            {!isConnected ? (
              <AddressInput onSubmit={handleAddressSubmit} pending={isScanning} />
            ) : (
              <div className="paper-card-raised p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep mb-1">
                    Wallet connected
                  </div>
                  <p className="font-plex text-sm text-ink-soft">
                    {isScanning ? (scanMessage || 'Scanning your wallet…') : 'Ready to scan your wallet.'}
                  </p>
                </div>
                <Button
                  onClick={() => onScan()}
                  disabled={isScanning}
                  loading={isScanning}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isScanning ? 'Scanning…' : 'Scan now'}
                </Button>
              </div>
            )}
          </motion.div>

          {/* Caption — demoted Fraunces sentence. Voice preserved, hierarchy flipped. */}
          <motion.p
            className="font-fraunces italic text-ink-soft leading-[1.15] mb-8 max-w-3xl
              text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem]"
            variants={fadeUp}
            initial={prefersReduced ? 'visible' : 'hidden'}
            animate="visible"
            custom={0.3}
          >
            Every <Highlight delay={400}>dApp</Highlight> you&rsquo;ve used can still move your tokens.
          </motion.p>

          {/* Secondary action — connect wallet for the user who wants to scan their own */}
          {!isConnected && (
            <motion.div
              variants={fadeUp}
              initial={prefersReduced ? 'visible' : 'hidden'}
              animate="visible"
              custom={0.5}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <span className="font-plex text-sm text-ink-whisper">Or:</span>
              <ClientConnectButton variant="secondary" size="default" />
              <span className="font-plex text-xs text-ink-whisper">
                connect to scan your own wallet across all 27 chains
              </span>
            </motion.div>
          )}

          {/* Signature amber hairline */}
          <motion.div
            className="h-px max-w-md origin-left"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(90deg, #F59E0B 0%, rgba(245,158,11,0.35) 60%, transparent 100%)',
              boxShadow: '0 0 6px rgba(245, 158, 11, 0.2)',
            }}
            initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
      </Container>
    </section>
  )
}

/* ============================================================================
 * CompassWatermark — decorative SVG imagery (unchanged from v2)
 * ============================================================================ */
function CompassWatermark() {
  const prefersReduced = useReducedMotion()
  return (
    <div
      aria-hidden="true"
      className="absolute -right-40 -bottom-40 sm:right-[-10%] sm:bottom-[-12%] lg:right-[-2%] lg:bottom-[-15%] w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] pointer-events-none select-none"
    >
      <motion.svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        initial={prefersReduced ? { opacity: 0.16, rotate: 0 } : { opacity: 0, rotate: -8 }}
        animate={{ opacity: 0.16, rotate: 0 }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
      >
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
      </motion.svg>
    </div>
  )
}
