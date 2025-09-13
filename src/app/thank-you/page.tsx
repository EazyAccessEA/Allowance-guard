'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useMemo } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'
import { CheckCircle, Heart, ArrowLeft } from 'lucide-react'

export default function ThankYouPage() {
  const { isConnected } = useAccount()
  const params = useSearchParams()
  const sessionId = useMemo(() => params.get('session_id'), [params])

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Thank You for Your Support</H1>
          <p className="text-lg text-stone max-w-reading">
            Your donation helps us keep Allowance Guard secure, sustainable, and free for everyone. Together, we&apos;re building a safer Web3 ecosystem.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Thank You Content */}
      <Section className="py-32">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald to-teal rounded-full mb-8">
              <CheckCircle className="w-10 h-10 text-white fill-current" />
            </div>

            {/* Main Message */}
            <h2 className="text-3xl font-semibold text-ink mb-6">
              Donation Successful
            </h2>
            <p className="text-lg text-stone leading-relaxed mb-8">
              Your contribution directly funds development, security audits, and infrastructure costs. We&apos;re grateful for your support in making Web3 security accessible to everyone.
            </p>

            {/* Session ID Display */}
            {sessionId && (
              <div className="bg-mist/30 border border-line rounded-lg p-6 mb-8">
                <h3 className="text-base font-medium text-ink mb-2">Confirmation Reference</h3>
                <p className="text-sm text-stone font-mono break-all">
                  {sessionId}
                </p>
                <p className="text-xs text-stone mt-2">
                  Keep this reference for your records. A receipt will be sent to your email by Stripe.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-cobalt to-electric hover:from-cobalt-hover hover:to-electric rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cobalt/30"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-ink border border-line hover:bg-mist rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cobalt/30"
              >
                <Heart className="w-4 h-4" />
                <span>Make Another Donation</span>
              </Link>
            </div>

            {/* Impact Section */}
            <div className="bg-gradient-to-r from-mist/30 to-warm-gray/30 border border-line rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-ink mb-6">How Your Donation Makes a Difference</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <h4 className="font-semibold text-ink">Development</h4>
                  <p className="text-sm text-stone">
                    New features, security improvements, and user experience enhancements.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-ink">Infrastructure</h4>
                  <p className="text-sm text-stone">
                    Reliable servers, databases, and ensuring 99.9% uptime.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-ink">Security Audits</h4>
                  <p className="text-sm text-stone">
                    Regular security assessments and penetration testing.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-ink">Community</h4>
                  <p className="text-sm text-stone">
                    Open source development and educational resources.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-stone">
                Questions about your donation? Contact us at{' '}
                <a 
                  href="mailto:support@allowanceguard.com" 
                  className="text-electric hover:text-cobalt transition-colors duration-200"
                >
                  support@allowanceguard.com
                </a>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}