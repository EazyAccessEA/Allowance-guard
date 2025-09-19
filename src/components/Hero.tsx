'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
// H1 component not used - using native h1 for better responsive control
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import VideoBackground from '@/components/VideoBackground'
import RotatingTypewriter from '@/components/RotatingTypewriter'
import ConnectButton from '@/components/ConnectButton'
import TestConnect from '@/components/TestConnect'

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
    <Section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Video Background */}
      <VideoBackground videoSrc="/V3AG.mp4" />
      
      {/* Gradient overlay for better text readability */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
        }}
      />
      
      <Container className="relative text-left max-w-4xl z-10">
        <h1 className="mobbin-display-1 text-text-primary mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <span className="block sm:inline">The power to</span>{' '}
          <span className="block sm:inline text-primary-600 min-h-[1.2em] flex items-start">
            <RotatingTypewriter 
              staticPrefix=""
              messages={[
                "see every hidden connection clearly.",
                "instantly revoke any risky approval.",
                "find and cut off silent threats.",
                "control who has access to your funds."
              ]}
              typingSpeed={80}
              deletingSpeed={60}
              pauseTime={2500}
              className="inline-block"
            />
          </span>
        </h1>
        <p className="mobbin-body-large text-text-secondary leading-relaxed mb-6 sm:mb-8 md:mb-10">
          A free and open source dashboard to review, revoke, and monitor wallet permissions across chains.
        </p>

        {/* CTA Section - Mobile Optimized */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          {!isConnected ? (
            <div className="flex flex-col gap-4">
              <ConnectButton 
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
                <p className="text-sm text-stone">
                  {scanMessage}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Trust Indicators - Mobile Optimized */}
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