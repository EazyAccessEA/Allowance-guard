'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'
import { DollarSign, Heart, CreditCard, Coins } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function ContributePage() {
  const { isConnected } = useAccount()
  const [amount, setAmount] = useState<string>('25.00')
  const [loadingCard, setLoadingCard] = useState(false)
  const [loadingCrypto, setLoadingCrypto] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        body: JSON.stringify({ amount: minor }),
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
        body: JSON.stringify({ amount: minor, currency: 'USD' }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed to create crypto charge')
      }

      const { hosted_url } = await res.json()
      if (!hosted_url) throw new Error('No hosted URL returned from Coinbase')
      
      // Redirect the browser to Coinbase Hosted Checkout
      window.location.href = hosted_url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setLoadingCrypto(false)
    }
  }

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
          <H1 className="mb-6">Support Allowance Guard</H1>
          <p className="text-lg text-stone max-w-reading">
            Help us maintain and improve the security infrastructure that protects the Web3 ecosystem. Your contribution directly funds development, security audits, and infrastructure costs.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Donation Form */}
      <Section className="py-32">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-line rounded-2xl p-8 shadow-large">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-crimson to-pink-500 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-white fill-current" />
                </div>
                <h2 className="text-2xl font-semibold text-ink mb-2">Make a Contribution</h2>
                <p className="text-base text-stone">
                  Enter an amount and choose your payment method
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-ink mb-3" htmlFor="amount">
                    Contribution Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone" />
                    <input
                      id="amount"
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="25.00"
                      className="w-full px-3 py-4 pl-10 text-lg border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-electric/30 focus:border-electric transition-colors duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleStripeContribute}
                    disabled={loadingCard || loadingCrypto}
                    className="flex items-center justify-center gap-3 px-6 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="flex items-center justify-center gap-3 px-6 py-4 text-lg font-medium text-ink bg-white border border-line hover:bg-mist rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Pay with ETH, USDC, BTC and more"
                  >
                    {loadingCrypto ? (
                      <>
                        <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
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

                <div className="text-center">
                  <p className="text-sm text-stone">
                    Minimum contribution is $1.00. Maximum is $10,000.
                  </p>
                  <p className="text-xs text-stone mt-2">
                    Your payment is processed securely by Stripe or Coinbase Commerce. We never store your payment information.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold text-ink mb-4">How Your Contribution Helps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <div className="bg-mist/30 rounded-lg p-6">
                  <h4 className="font-semibold text-ink mb-2">Development</h4>
                  <p className="text-sm text-stone">
                    Funding new features, security improvements, and user experience enhancements.
                  </p>
                </div>
                <div className="bg-mist/30 rounded-lg p-6">
                  <h4 className="font-semibold text-ink mb-2">Infrastructure</h4>
                  <p className="text-sm text-stone">
                    Maintaining servers, databases, and ensuring reliable service uptime.
                  </p>
                </div>
                <div className="bg-mist/30 rounded-lg p-6">
                  <h4 className="font-semibold text-ink mb-2">Security Audits</h4>
                  <p className="text-sm text-stone">
                    Regular security assessments and penetration testing to keep the platform secure.
                  </p>
                </div>
                <div className="bg-mist/30 rounded-lg p-6">
                  <h4 className="font-semibold text-ink mb-2">Community</h4>
                  <p className="text-sm text-stone">
                    Supporting open source development and building educational resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}
