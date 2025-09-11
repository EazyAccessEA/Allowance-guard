'use client'

import { useState } from 'react'
import { X, Heart, DollarSign } from 'lucide-react'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100]

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState<number>(25)
  const [customAmount, setCustomAmount] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleDonate = async () => {
    setIsLoading(true)
    setError('')

    try {
      const donationAmount = customAmount ? parseFloat(customAmount) : amount
      
      if (donationAmount < 1 || donationAmount > 10000) {
        setError('Please enter an amount between $1 and $10,000')
        return
      }

      const response = await fetch('/api/donate/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donationAmount,
          email: email || undefined,
          name: name || undefined,
          message: message || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create donation')
      }

      // Redirect to Coinbase Commerce checkout
      window.location.href = data.checkoutUrl

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="fireart-card bg-platinum max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Heart className="w-8 h-8 text-crimson fill-current" />
            <h2 className="fireart-heading-3">Support Allowance Guard</h2>
          </div>
          <button
            onClick={onClose}
            className="fireart-button-ghost text-charcoal hover:text-obsidian"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <p className="fireart-body text-charcoal">
            Help us maintain and improve Allowance Guard. Your support enables us to:
          </p>
          
          <ul className="fireart-body text-charcoal space-y-3">
            <li>• Keep the service free for all users</li>
            <li>• Add support for more blockchain networks</li>
            <li>• Improve security features and monitoring</li>
            <li>• Provide better user experience</li>
          </ul>

          {/* Amount Selection */}
          <div>
            <label className="block fireart-body font-medium text-obsidian mb-4">
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
                  className={`p-3 fireart-body font-medium rounded-lg border transition-colors ${
                    amount === preset && !customAmount
                      ? 'border-crimson bg-red-50 text-crimson'
                      : 'border-gray-200 hover:border-cobalt text-charcoal'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-charcoal" />
              <input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  if (e.target.value) setAmount(0)
                }}
                className="fireart-input pl-10"
                min="1"
                max="10000"
                step="0.01"
              />
            </div>
          </div>

          {/* Optional Information */}
          <div className="space-y-4">
            <div>
              <label className="block fireart-body font-medium text-obsidian mb-2">
                Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="fireart-input"
              />
            </div>

            <div>
              <label className="block fireart-body font-medium text-obsidian mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="fireart-input"
              />
              <p className="fireart-caption mt-2">
                We&apos;ll send you a thank you email and receipt
              </p>
            </div>

            <div>
              <label className="block fireart-body font-medium text-obsidian mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave us a message..."
                rows={3}
                maxLength={500}
                className="fireart-input resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="fireart-card bg-red-50 border-red-200">
              <p className="fireart-body text-crimson">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="fireart-button-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleDonate}
              disabled={isLoading}
              className="fireart-button flex-1 bg-gradient-to-r from-crimson to-pink-500 hover:from-crimson-hover hover:to-pink-600"
            >
              {isLoading ? 'Processing...' : `Donate $${customAmount || amount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
