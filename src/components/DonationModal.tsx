'use client'

import { useState } from 'react'
import { X, Heart, DollarSign, CreditCard, Coins } from 'lucide-react'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100]

type PaymentMethod = 'stripe' | 'coinbase'

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState<number>(25)
  const [customAmount, setCustomAmount] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleContribute = async () => {
    setIsLoading(true)
    setError('')

    try {
      const contributionAmount = customAmount ? parseFloat(customAmount) : amount
      
      if (contributionAmount < 1 || contributionAmount > 10000) {
        setError('Please enter an amount between $1 and $10,000')
        return
      }

      if (paymentMethod === 'stripe') {
        // Stripe payment flow
        const amountInCents = Math.round(contributionAmount * 100)

        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountInCents
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session')
        }

        // Redirect to Stripe Checkout
        const stripe = await import('@stripe/stripe-js')
        const { loadStripe } = stripe
        const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        
        const stripeInstance = await stripePromise
        if (stripeInstance) {
          const { error } = await stripeInstance.redirectToCheckout({
            sessionId: data.id
          })
          
          if (error) {
            throw new Error(error.message)
          }
        }
      } else {
        // Coinbase Commerce payment flow
        const response = await fetch('/api/donate/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: contributionAmount,
            email: email || undefined,
            name: name || undefined,
            message: message || undefined
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create contribution')
        }

        // Redirect to Coinbase Commerce checkout
        window.location.href = data.checkoutUrl
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-line rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-large">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Heart className="w-8 h-8 text-crimson fill-current" />
            <h2 className="text-2xl font-semibold text-ink">Support Allowance Guard</h2>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-stone hover:text-ink hover:bg-mist transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <p className="text-base text-stone leading-relaxed">
            Allowance Guard is <strong>100% free and open source</strong>. Your contributions help us:
          </p>
          
          <ul className="text-base text-stone space-y-3 leading-relaxed">
            <li>• Keep the service completely free for everyone</li>
            <li>• Add support for more blockchain networks</li>
            <li>• Improve security features and monitoring</li>
            <li>• Maintain servers and infrastructure</li>
            <li>• Support the open source community</li>
          </ul>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Open Source:</strong> All code is available on GitHub. No premium features, no paywalls, no subscriptions.
            </p>
          </div>

          {/* Amount Selection */}
          <div>
            <label className="block text-base font-medium text-ink mb-4">
              Select Amount
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAmount(preset)
                    setCustomAmount('')
                  }}
                  className={`p-3 text-base font-medium rounded-lg border transition-colors ${
                    amount === preset && !customAmount
                      ? 'border-crimson bg-red-50 text-crimson'
                      : 'border-line hover:border-cobalt text-stone hover:text-ink'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone" />
              <input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  if (e.target.value) setAmount(0)
                }}
                className="w-full px-3 py-3 pl-10 text-base border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-colors duration-200"
                min="1"
                max="10000"
                step="0.01"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-base font-medium text-ink mb-4">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 text-base font-medium rounded-lg border transition-colors ${
                  paymentMethod === 'stripe'
                    ? 'border-electric bg-electric/10 text-electric'
                    : 'border-line hover:border-electric text-stone hover:text-ink'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Credit/Debit Card</span>
                </div>
                <p className="text-xs text-stone mt-1">Via Stripe</p>
              </button>
              
              <button
                onClick={() => setPaymentMethod('coinbase')}
                className={`p-4 text-base font-medium rounded-lg border transition-colors ${
                  paymentMethod === 'coinbase'
                    ? 'border-electric bg-electric/10 text-electric'
                    : 'border-line hover:border-electric text-stone hover:text-ink'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Coins className="w-4 h-4" />
                  <span>Cryptocurrency</span>
                </div>
                <p className="text-xs text-stone mt-1">Via Coinbase</p>
              </button>
            </div>
          </div>

          {/* Optional Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-base font-medium text-ink mb-2">
                Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-3 text-base border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-ink mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-3 text-base border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-colors duration-200"
              />
              <p className="text-sm text-stone mt-2">
                We&apos;ll send you a thank you email and receipt
              </p>
            </div>

            <div>
              <label className="block text-base font-medium text-ink mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave us a message..."
                rows={3}
                maxLength={500}
                className="w-full px-3 py-3 text-base border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-colors duration-200 resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-base text-crimson">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-base font-medium text-ink border border-line rounded-lg hover:bg-mist transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cobalt/30"
            >
              Cancel
            </button>
            <button
              onClick={handleContribute}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
            >
                    {isLoading ? 'Processing...' : `Contribute $${customAmount || amount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
