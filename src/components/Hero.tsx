'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background-light via-white to-background-light">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-accent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-semantic-info rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="mb-8">
            <Badge variant="secondary" className="text-sm font-medium">
              🔒 Non-Custodial • Open Source • Free Forever
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6 tracking-tight">
            Take Control of Your
            <span className="block text-primary-accent">Token Approvals</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-text-secondary leading-relaxed mb-12 max-w-3xl mx-auto">
            Discover, analyze, and revoke hidden token allowances across all chains. 
            Secure your wallet in under 60 seconds.
          </p>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">$3.2B+</div>
              <div className="text-sm text-text-secondary">Lost to approval exploits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">73%</div>
              <div className="text-sm text-text-secondary">Of DeFi attacks use approvals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">60s</div>
              <div className="text-sm text-text-secondary">To secure your wallet</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {!isConnected ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ConnectButton 
                  variant="primary" 
                  size="lg"
                  className="w-full sm:w-auto"
                />
                <TestConnect onConnect={onWalletSelect} />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
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
                  <p className="text-sm text-text-secondary">
                    {scanMessage}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-text-muted">
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
        </div>

        {/* Feature Preview Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="text-center hover:shadow-medium transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Instant Analysis</h3>
              <p className="text-text-secondary text-sm">
                Get comprehensive risk assessment in seconds with advanced threat intelligence.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-medium transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-semantic-danger/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-semantic-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">One-Click Revoke</h3>
              <p className="text-text-secondary text-sm">
                Revoke risky approvals instantly with gas-optimized batch transactions.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-medium transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-semantic-info/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-semantic-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Multi-Chain Support</h3>
              <p className="text-text-secondary text-sm">
                Monitor and secure approvals across Ethereum, Arbitrum, Base, and more.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
