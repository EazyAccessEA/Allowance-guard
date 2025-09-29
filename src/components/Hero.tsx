'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import ClientConnectButton from '@/components/ClientConnectButton'
import TestConnect from '@/components/TestConnect'

// Dynamic imports with priority loading
const VideoBackground = dynamic(() => import('@/components/VideoBackground'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="absolute inset-0 bg-[url('/AllowanceGuard_BG.png')] bg-cover bg-center bg-no-repeat" />
    </div>
  )
})
const MultiLineTypewriter = dynamic(
  () => import('@/components/MultiLineTypewriter').then(m => ({ default: m.MultiLineTypewriter })),
  { 
    ssr: false, 
    loading: () => (
      <div className="min-h-[5.5em] sm:min-h-[5em] md:min-h-[3.5em] max-h-[6em] sm:max-h-[5.5em] md:max-h-[4em] flex flex-col justify-center">
        <span className="block">
          <span className="text-text-primary">The power to </span>
          <span className="text-primary-700">see every hidden connection clearly</span>
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
    <Section className="relative py-12 sm:py-24 lg:py-32 min-h-[70svh]">
      {/* Video Background - Desktop only */}
      <div className="hidden md:block absolute inset-0 z-0">
        <VideoBackground
          videoSrc="/V3AG.mp4"
          className="absolute inset-0 w-full h-full object-cover object-center"
          priority
          lazy={false}
         /* posterSrc="/AllowanceGuard_BG.png"*/
          decorative
        />
      </div>

      {/* Mobile gradient background */}
      <div className="md:hidden absolute inset-0 z-10 bg-gradient-to-br from-primary-50 to-primary-100" />

      {/* Semi-transparent overlay */}
      <div
        className="absolute inset-0 z-20"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
        }}
      />
      {/* Content */}
      <Container className="relative max-w-4xl z-30">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:mobbin-display-1 text-text-primary mb-2 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 leading-tight">
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
                  <span className="text-text-primary">The power to </span>
                  <span className="text-primary-700">{firstLine}</span>
                </span>
                <span className="block text-primary-700">
                  {secondLine}
                  <span className="ml-0.5 inline-block h-6 w-0.5 bg-primary-700 animate-pulse" />
                </span>
              </>
              )}
            />
          </div>
        </h1>
        <p className="mobbin-body-large text-text-secondary leading-relaxed mb-6 sm:mb-8 md:mb-10">
          A free and open source dashboard to review, revoke, and monitor wallet permissions across chains.
        </p>

        {/* CTA Section - Mobile Optimized */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8 min-h-[120px] sm:min-h-[100px]">
          {!isConnected ? (
            <div className="flex flex-col gap-4">
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
                className="w-full sm:w-auto"
              >
                {isScanning ? 'Scanning...' : 'Scan Your Wallet'}
              </Button>
              {scanMessage && (
                <p className="text-sm text-text-tertiary">
                  {scanMessage}
                </p>
              )}
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                  🎉 Wallet Connected! Taking you to your Security Dashboard...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Trust Indicators - Mobile Optimized }
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mobbin-body-small text-text-secondary">
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
            <span>100% free</span>
          </div>
        </div>

        {/* Learn More Link */}
        <div className="mt-6 sm:mt-8">
          <Link 
            href="/docs" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mobbin-button transition-colors duration-150"
          >
            Learn how it works
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </Container>
    </Section>
  )
}