'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import { DollarSign, Heart, CreditCard, Coins } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function ContributePage() {
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled') === 'true'
  const [amount, setAmount] = useState<string>('25.00')
  const [email, setEmail] = useState('')
  const [loadingCard, setLoadingCard] = useState(false)
  const [loadingCrypto, setLoadingCrypto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Convert amount to Stripe amount in cents (USD)
  const toMinorUnits = (val: string) => {
    // Strip currency symbols/spaces
    const cleaned = val.replace(/[^\d.]/g, '')
    const num = Number(cleaned)
    // Guard rails
    if (Number.isNaN(num)) return null
    // 2dp minor units (cents for USD)
    return Math.round(num * 100)
  }

  const handleStripeContribute = async () => {
    setError(null)

    const minor = toMinorUnits(amount)
    if (!minor || minor < 100) {
      setError('Please enter at least $1.00')
      return
    }

    if (minor > 1000000) { // $10,000 max
      setError('Maximum contribution is $10,000')
      return
    }

    try {
      setLoadingCard(true)
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: minor, email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to create checkout session')
      }

      const { id } = await res.json()

      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')

      const { error } = await stripe.redirectToCheckout({ sessionId: id })
      if (error) throw error
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setLoadingCard(false)
    }
  }

  const handleCryptoContribute = async () => {
    setError(null)

    const minor = toMinorUnits(amount)
    if (!minor || minor < 100) {
      setError('Please enter at least $1.00')
      return
    }

    if (minor > 1000000) { // $10,000 max
      setError('Maximum contribution is $10,000')
      return
    }

    try {
      setLoadingCrypto(true)
      const res = await fetch('/api/coinbase/create-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: minor, currency: 'USD', email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to create crypto charge')
      }

      const { hosted_url } = await res.json()
      if (!hosted_url) throw new Error('No hosted URL returned from Coinbase')
      
      // Show user feedback before redirect
      setMessage('Redirecting to secure payment page...')
      
      // Add a small delay to show the message
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect the browser to Coinbase Hosted Checkout
      window.location.href = hosted_url
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Something went wrong. Please try again.'
      setError(`${errorMessage} You can also try the card payment option below.`)
      setLoadingCrypto(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-primary dark:bg-secondary-900 text-text-primary dark:text-secondary-100">
      
      {/* Hero Section */}
      <Section className="relative pt-20 pb-24 sm:pt-24 sm:pb-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-10 dark:hidden"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        <div className="absolute inset-0 z-10 hidden dark:block bg-secondary-900/90" />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Support Allowance Guard</H1>
          <p className="text-lg text-text-tertiary dark:text-secondary-400 max-w-reading">
            Help us maintain and improve the security infrastructure that protects the Web3 ecosystem. Your contribution directly funds development, security audits, and infrastructure costs.
          </p>
        </Container>
      </Section>

      <div className="border-t border-border-primary dark:border-secondary-700" />

      {/* Cancelled Message */}
      {cancelled && (
        <Section className="py-8">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <p className="text-sm text-amber-800">
                  No worries — the core scanner is free forever. If you change your mind, see{' '}
                  <a 
                    href="/docs/contributing" 
                    className="underline hover:text-amber-900 transition-colors duration-200"
                  >
                    how to support
                  </a>.
                </p>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Donation Form */}
      <Section className="py-32">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="bg-background-primary dark:bg-secondary-800 border border-border-primary dark:border-secondary-700 rounded-2xl p-8 shadow-large">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-crimson to-pink-500 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-white fill-current" />
                </div>
                <h2 className="text-2xl font-semibold text-text-primary dark:text-secondary-100 mb-2">Make a Contribution</h2>
                <p className="text-base text-text-tertiary dark:text-secondary-400">
                  Enter an amount and choose your payment method
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-text-primary dark:text-secondary-100 mb-3" htmlFor="amount">
                    Contribution Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary dark:text-secondary-400" />
                    <input
                      id="amount"
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="25.00"
                      className="w-full px-3 py-4 pl-10 text-lg border border-border-primary dark:border-secondary-700 rounded-lg bg-background-primary dark:bg-secondary-900 text-text-primary dark:text-secondary-100 placeholder-text-tertiary dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-text-primary dark:text-secondary-100 mb-3" htmlFor="email">
                    Email (for receipt / reference)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-4 text-lg border border-border-primary dark:border-secondary-700 rounded-lg bg-background-primary dark:bg-secondary-900 text-text-primary dark:text-secondary-100 placeholder-text-tertiary dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700 transition-colors duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleStripeContribute}
                    disabled={loadingCard || loadingCrypto}
                    className="flex items-center justify-center gap-3 px-6 py-4 text-lg font-medium text-white bg-primary-700 dark:bg-primary-600 hover:bg-primary-800 dark:hover:bg-primary-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-700/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingCard ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Redirecting...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Card (Stripe)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCryptoContribute}
                    disabled={loadingCard || loadingCrypto}
                    className="flex items-center justify-center gap-3 px-6 py-4 text-lg font-medium text-text-primary dark:text-secondary-100 bg-background-primary dark:bg-secondary-900 border border-border-primary dark:border-secondary-700 hover:bg-background-tertiary dark:hover:bg-secondary-800 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-700/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Pay with ETH, USDC, BTC and more - Secured by Coinbase Commerce"
                  >
                    {loadingCrypto ? (
                      <>
                        <div className="w-5 h-5 border-2 border-text-primary dark:border-secondary-100 border-t-transparent rounded-full animate-spin" />
                        <span>Opening...</span>
                      </>
                    ) : (
                      <>
                        <Coins className="w-5 h-5" />
                        <span>Crypto (Coinbase)</span>
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-base text-crimson">{error}</p>
                  </div>
                )}

                {message && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-base text-cobalt">{message}</p>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-sm text-text-tertiary dark:text-secondary-400">
                    Minimum contribution is $1.00. Maximum is $10,000.
                  </p>
                  <p className="text-xs text-text-tertiary dark:text-secondary-400 mt-2">
                    Your payment is processed securely by Stripe or Coinbase Commerce. We never store your payment information.
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-tertiary dark:text-secondary-400">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>SSL Encrypted & PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-4">How Your Contribution Helps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div className="bg-background-tertiary dark:bg-secondary-800 rounded-lg p-6">
                  <h4 className="font-semibold text-text-primary dark:text-secondary-100 mb-2">Development</h4>
                  <p className="text-sm text-text-tertiary dark:text-secondary-400">
                    Funding new features, security improvements, and user experience enhancements.
                  </p>
                </div>
                <div className="bg-background-tertiary dark:bg-secondary-800 rounded-lg p-6">
                  <h4 className="font-semibold text-text-primary dark:text-secondary-100 mb-2">Infrastructure</h4>
                  <p className="text-sm text-text-tertiary dark:text-secondary-400">
                    Maintaining servers, databases, and ensuring reliable service uptime.
                  </p>
                </div>
                <div className="bg-background-tertiary dark:bg-secondary-800 rounded-lg p-6">
                  <h4 className="font-semibold text-text-primary dark:text-secondary-100 mb-2">Security Audits</h4>
                  <p className="text-sm text-text-tertiary dark:text-secondary-400">
                    Regular security assessments and penetration testing to keep the platform secure.
                  </p>
                </div>
                <div className="bg-background-tertiary dark:bg-secondary-800 rounded-lg p-6">
                  <h4 className="font-semibold text-text-primary dark:text-secondary-100 mb-2">Community</h4>
                  <p className="text-sm text-text-tertiary dark:text-secondary-400">
                    Supporting open source development and building educational resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
