'use client'

import { useState, useEffect } from 'react'
import { X, Heart, ExternalLink, Copy, Check } from 'lucide-react'
import { useAccount } from 'wagmi'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState('5')
  const [ethAmount, setEthAmount] = useState('0.001')
  const [copied, setCopied] = useState(false)
  const { isConnected } = useAccount()

  // Allowance Guard donation address
  const donationAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'

  // Calculate ETH amount based on USD input (simplified - you'd want real price feed)
  useEffect(() => {
    const usdAmount = parseFloat(amount) || 0
    const ethEquivalent = (usdAmount / 3000).toFixed(6) // Rough ETH price
    setEthAmount(ethEquivalent)
  }, [amount])

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(donationAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const handleSendDonation = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }
    
    // Redirect to your existing crypto donation flow
    try {
      const response = await fetch('/api/coinbase/create-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          currency: 'USD',
          email: '' // Optional email
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create crypto charge')
      }

      const { hosted_url } = await response.json()
      if (hosted_url) {
        window.location.href = hosted_url
      }
    } catch (error) {
      console.error('Donation error:', error)
      alert('Failed to process donation. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 rounded-2xl p-6 mx-4 max-w-md w-full border border-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600/10 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Donate to Allowance Guard
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none rounded p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Donation Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Donation Amount
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <span className="text-slate-400 font-medium">USD</span>
          </div>
          
          {/* ETH Equivalent */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-slate-400">
              ≈ {ethAmount} ETH
            </span>
            {isConnected && (
              <button
                onClick={handleSendDonation}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors focus:ring-4 focus:ring-primary-600/20"
              >
                Send
              </button>
            )}
          </div>
        </div>

        {/* Alternative Donation Method */}
        <div className="border-t border-slate-700 pt-6">
          <p className="text-sm text-slate-400 mb-4">
            Or send any token to our donations address:
          </p>
          
          <div className="bg-slate-800 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <code className="text-xs text-slate-300 font-mono break-all">
                {donationAddress}
              </code>
              <button
                onClick={handleCopyAddress}
                className="ml-3 p-2 text-slate-300 hover:text-white transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none rounded"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ExternalLink className="w-3 h-3" />
            <a 
              href={`https://etherscan.io/address/${donationAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              View on Etherscan
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center mb-3">
            Your support helps us maintain and improve Allowance Guard
          </p>
          <div className="text-center">
            <a 
              href="/contribute"
              className="text-xs text-primary-accent hover:text-primary-accent/80 transition-colors"
            >
              More donation options →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}