'use client'

import { useState, useEffect } from 'react'
import { Heart, Coffee, X } from 'lucide-react'
import { useDonateNative, DONATION_PRESETS, formatDonationAmount } from '@/lib/web3/donate'
import { ENABLE_TIP_FLOW, getDonationAddress } from '@/config/donations'
import { useDonationAnalytics } from '@/lib/analytics/donations'

interface DonateTipStepProps {
  onTipAdded?: (amount: string) => void
  onTipRemoved?: () => void
  className?: string
}

export default function DonateTipStep({ 
  onTipAdded, 
  onTipRemoved, 
  className = '' 
}: DonateTipStepProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [amount, setAmount] = useState<string>(DONATION_PRESETS.small)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const { donateNative, isPending } = useDonateNative()
  const { trackEvent } = useDonationAnalytics()
  
  const donationAddress = getDonationAddress()

  // Load saved preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('allowance-guard-tip-enabled')
    const savedAmount = localStorage.getItem('allowance-guard-tip-amount')
    
    if (saved === 'true' && savedAmount) {
      setIsEnabled(true)
      setAmount(savedAmount)
      onTipAdded?.(savedAmount)
    }
  }, [onTipAdded])

  // Save preference to localStorage
  const savePreference = (enabled: boolean, tipAmount?: string) => {
    localStorage.setItem('allowance-guard-tip-enabled', enabled.toString())
    if (tipAmount) {
      localStorage.setItem('allowance-guard-tip-amount', tipAmount)
    }
  }

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled)
    savePreference(enabled, enabled ? amount : undefined)
    
    if (enabled) {
      trackEvent({ event: 'tip_enabled', amount })
      onTipAdded?.(amount)
    } else {
      trackEvent({ event: 'tip_disabled' })
      onTipRemoved?.()
    }
  }

  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount)
    setIsCustom(false)
    setCustomAmount('')
    savePreference(isEnabled, newAmount)
    
    if (isEnabled) {
      onTipAdded?.(newAmount)
    }
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setAmount(value)
    setIsCustom(true)
    savePreference(isEnabled, value)
    
    if (isEnabled) {
      onTipAdded?.(value)
    }
  }

  const handlePresetClick = (preset: keyof typeof DONATION_PRESETS) => {
    const presetAmount = DONATION_PRESETS[preset]
    handleAmountChange(presetAmount)
  }

  // Don't render if feature is disabled or no donation address
  if (!ENABLE_TIP_FLOW || !donationAddress) {
    return null
  }

  return (
    <div className={`bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary-600" />
          <span className="font-medium text-primary-900">Add a tip</span>
        </div>
        <button
          onClick={() => handleToggle(!isEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isEnabled ? 'bg-primary-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isEnabled && (
        <div className="space-y-3">
          <p className="text-sm text-primary-700">
            Support Allowance Guard development with a small tip
          </p>
          
          {/* Preset Amounts */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(DONATION_PRESETS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handlePresetClick(key as keyof typeof DONATION_PRESETS)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  amount === value && !isCustom
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-primary-700 hover:bg-primary-50'
                }`}
              >
                {key === 'small' && 'Small'}
                {key === 'medium' && 'Medium'}
                {key === 'large' && 'Large'}
                {key === 'generous' && 'Generous'}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={isCustom ? customAmount : ''}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              placeholder="Custom amount"
              step="0.001"
              min="0"
              className="flex-1 px-3 py-2 text-sm border border-primary-200 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <span className="text-sm text-primary-600 font-medium">ETH</span>
          </div>

          {/* Amount Display */}
          {amount && (
            <div className="text-sm text-primary-600">
              Tip amount: <span className="font-medium">{formatDonationAmount(amount)} ETH</span>
            </div>
          )}

          {/* Info */}
          <div className="flex items-start gap-2 text-xs text-primary-600">
            <Coffee className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>
              Tips are sent as native ETH and support ongoing development. Non-refundable.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Hook to get the current tip preference
 */
export function useTipPreference() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [amount, setAmount] = useState<string>(DONATION_PRESETS.small)

  useEffect(() => {
    const saved = localStorage.getItem('allowance-guard-tip-enabled')
    const savedAmount = localStorage.getItem('allowance-guard-tip-amount')
    
    if (saved === 'true' && savedAmount) {
      setIsEnabled(true)
      setAmount(savedAmount)
    }
  }, [])

  return { isEnabled, amount }
}
