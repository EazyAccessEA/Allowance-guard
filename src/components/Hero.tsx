'use client'

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import ClientConnectButton from '@/components/ClientConnectButton'
import TestConnect from '@/components/TestConnect'
import AnimatedBackground from '@/components/AnimatedBackground'

const MultiLineTypewriter = dynamic(
  () => import('@/components/MultiLineTypewriter').then(m => ({ default: m.MultiLineTypewriter })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[5.5em] sm:min-h-[5em] md:min-h-[3.5em] max-h-[6em] sm:max-h-[5.5em] md:max-h-[4em] flex flex-col justify-center">
        <span className="block">
          <span className="text-text-primary dark:text-secondary-100">The power to </span>
          <span className="text-primary-700 dark:text-primary-400">see every hidden connection clearly</span>
        </span>
      </div>
    )
  }
)

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
    <Section className="relative py-12 sm:py-24 lg:py-32 min-h-[70svh] overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <AnimatedBackground variant="hero" />

      {/* Light overlay for readability */}
      <div
        className="absolute inset-0 z-10 dark:hidden"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 100%)'
        }}
      />
      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-10 hidden dark:block"
        style={{
          background: 'linear-gradient(to right, rgba(10,14,26,0.95) 0%, rgba(10,14,26,0.8) 100%)'
        }}
      />

      {/* Content */}
      <Container className="relative max-w-4xl z-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:mobbin-display-1 text-text-primary dark:text-secondary-100 mb-2 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 leading-tight">
          <div className="min-h-[5.5em] sm:min-h-[5em] md:min-h-[3.5em] max-h-[6em] sm:max-h-[5.5em] md:max-h-[4em] flex flex-col justify-center">
            <MultiLineTypewriter
              messages={[
                "see every hidden connection clearly",
                "instantly revoke any risky approval",
                "find and cut off silent threats",
                "control who has access to funds"
              ]}
              typingSpeed={100}
              deletingSpeed={50}
              pauseTime={4000}
              onRender={(firstLine, secondLine) => (
                <>
                  <span className="block">
                    <span className="text-text-primary dark:text-secondary-100">The power to </span>
                    <span className="text-primary-700 dark:text-primary-400">{firstLine}</span>
                  </span>
                  <span className="block text-primary-700 dark:text-primary-400">
                    {secondLine}
                    <span className="ml-0.5 inline-block h-6 w-0.5 bg-primary-700 dark:bg-primary-400 animate-pulse" />
                  </span>
                </>
              )}
            />
          </div>
        </h1>
        <p className="mobbin-body-large text-text-secondary dark:text-secondary-400 leading-relaxed mb-6 sm:mb-8 md:mb-10">
          Review, revoke, and monitor wallet permissions across 15 chains. Free and open source.
        </p>

        {/* CTA Section */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 min-h-[80px] sm:min-h-[60px]">
          {!isConnected ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <ClientConnectButton
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              />
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
                <p className="text-sm text-text-tertiary dark:text-secondary-500">
                  {scanMessage}
                </p>
              )}
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Wallet Connected! Taking you to your Security Dashboard...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Social Proof Stats */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-text-primary dark:text-secondary-100">50K+</div>
            <div className="text-xs text-text-secondary dark:text-secondary-400">Wallets scanned</div>
          </div>
          <div className="w-px h-8 bg-border-primary dark:bg-secondary-700 hidden sm:block" />
          <div>
            <div className="text-xl sm:text-2xl font-bold text-text-primary dark:text-secondary-100">2M+</div>
            <div className="text-xs text-text-secondary dark:text-secondary-400">Approvals revoked</div>
          </div>
          <div className="w-px h-8 bg-border-primary dark:bg-secondary-700 hidden sm:block" />
          <div>
            <div className="text-xl sm:text-2xl font-bold text-text-primary dark:text-secondary-100">15</div>
            <div className="text-xs text-text-secondary dark:text-secondary-400">Chains supported</div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 mobbin-body-small text-text-secondary dark:text-secondary-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-semantic-success-500 rounded-full flex-shrink-0" />
            <span>No private keys required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-semantic-success-500 rounded-full flex-shrink-0" />
            <span>Read-only access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-semantic-success-500 rounded-full flex-shrink-0" />
            <span>Free core &middot; Open source</span>
          </div>
        </div>
      </Container>
    </Section>
  )
}
