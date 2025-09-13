'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useMemo, useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'
import { CheckCircle, Heart, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'

type PaymentStatus = 'idle' | 'verifying' | 'verified' | 'failed'

export default function ThankYouPage() {
  const { isConnected } = useAccount()
  const params = useSearchParams()
  const sessionId = useMemo(() => params.get('session_id'), [params])
  
  const [status, setStatus] = useState<PaymentStatus>('idle')
  const [amount, setAmount] = useState<number | null>(null)
  const [currency, setCurrency] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) return
      setStatus('verifying')
      setError(null)
      try {
        const res = await fetch('/api/verify-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })
        const data = await res.json()
        if (!res.ok || !data.ok) throw new Error(data?.error || 'Verification failed')

        if (data.payment_status === 'paid') {
          setStatus('verified')
          setAmount(data.amount_total ?? null)
          setCurrency(data.currency ?? null)
        } else {
          setStatus('failed')
          setError(`Payment status: ${data.payment_status}`)
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Verification error'
        setStatus('failed')
        setError(errorMessage)
      }
    }
    verify()
  }, [sessionId])

  const amountDisplay =
    amount != null && currency
      ? new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: (currency || 'usd').toUpperCase(),
        }).format((amount || 0) / 100)
      : null

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
            Your contribution helps us keep Allowance Guard secure, sustainable, and free for everyone. Together, we&apos;re building a safer Web3 ecosystem.
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
              {status === 'verifying' ? (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              ) : status === 'failed' ? (
                <AlertCircle className="w-10 h-10 text-white fill-current" />
              ) : (
                <CheckCircle className="w-10 h-10 text-white fill-current" />
              )}
            </div>

            {/* Main Message */}
            <h2 className="text-3xl font-semibold text-ink mb-6">
              {status === 'verifying' ? 'Verifying Your Contribution...' : 
               status === 'failed' ? 'Contribution Verification Failed' : 
               'Contribution Successful'}
            </h2>
            <p className="text-lg text-stone leading-relaxed mb-8">
              {status === 'verifying' ? 'Please wait while we verify your payment...' :
               status === 'failed' ? 'We encountered an issue verifying your contribution. Please contact support if you believe this is an error.' :
               'Your contribution directly funds development, security audits, and infrastructure costs. We&apos;re grateful for your support in making Web3 security accessible to everyone.'}
            </p>

            {/* Payment Status */}
            {status === 'verified' && amountDisplay && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
                <p className="text-lg font-semibold text-emerald-800">
                  Payment Confirmed: {amountDisplay}
                </p>
                <p className="text-sm text-emerald-700 mt-1">
                  Your contribution has been successfully processed
                </p>
              </div>
            )}

            {status === 'failed' && error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <p className="text-lg font-semibold text-red-800">
                  Verification Failed
                </p>
                <p className="text-sm text-red-700 mt-1">
                  {error}
                </p>
              </div>
            )}

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
                className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-cobalt hover:bg-cobalt/90 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cobalt/30"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              
              {status === 'verified' && (
                <Link
                  href="/contribute"
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium text-ink border border-line hover:bg-mist rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cobalt/30"
                >
                  <Heart className="w-4 h-4" />
                  <span>Make Another Contribution</span>
                </Link>
              )}
            </div>

            {/* Impact Section */}
            <div className="bg-gradient-to-r from-mist/30 to-warm-gray/30 border border-line rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-ink mb-6">How Your Contribution Makes a Difference</h3>
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
                Questions about your contribution? Contact us at{' '}
                <a 
                  href="mailto:legal.support@allowanceguard.com" 
                  className="text-electric hover:text-cobalt transition-colors duration-200"
                >
                  legal.support@allowanceguard.com
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