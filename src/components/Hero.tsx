'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { H1 } from '@/components/ui/Heading'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import VideoBackground from '@/components/VideoBackground'
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
    <Section className="relative py-24 sm:py-32 overflow-hidden">
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
        <H1 className="mb-6">Take Control of Your Token Approvals</H1>
        <p className="text-lg text-stone leading-relaxed mb-8">
          Discover, analyze, and revoke hidden token allowances across all chains. 
          Secure your wallet in under 60 seconds with our free, non-custodial security tool.
        </p>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
          {!isConnected ? (
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <ConnectButton 
                variant="primary" 
                size="lg"
                className="w-full sm:w-auto"
              />
              <TestConnect onConnect={onWalletSelect} />
            </div>
          ) : (
            <div className="flex flex-col items-start gap-4">
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

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-start gap-6 text-sm text-stone">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-semantic-success rounded-full" />
            <span>No private keys required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-semantic-success rounded-full" />
            <span>Read-only access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-semantic-success rounded-full" />
            <span>100% free</span>
          </div>
        </div>

        {/* Learn More Link */}
        <div className="mt-8">
          <Link 
            href="/docs" 
            className="inline-flex items-center text-primary-accent hover:text-primary-accent/80 font-medium transition-colors duration-150"
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