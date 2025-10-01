'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, ExternalLink, Heart, QrCode, Wallet } from 'lucide-react'
import { useAccount } from 'wagmi'
import { DONATION_ENS, getDonationAddress, getDonationEIP681Link, EXTERNAL_DONATION_LINKS } from '@/config/donations'
import { useDonateNative, DONATION_PRESETS, formatDonationAmount } from '@/lib/web3/donate'
import { useDonationAnalytics } from '@/lib/analytics/donations'
import Container from '@/components/ui/Container'

export default function DonatePage() {
  const { isConnected } = useAccount()
  const [amount, setAmount] = useState('0.001')
  const [copied, setCopied] = useState(false)
  const { donateNative, isPending } = useDonateNative()
  const { trackEvent } = useDonationAnalytics()
  
  const donationAddress = getDonationAddress()
  const eip681Link = getDonationEIP681Link(amount)

  // Generate QR code for donation address
  useEffect(() => {
    if (donationAddress) {
      // Simple QR code generation (you might want to use a proper QR library)
      const qrData = `ethereum:${donationAddress}?value=${parseFloat(amount) * 1e18}`
      // QR code data generated but not used in current implementation
      console.log('QR Code data:', qrData)
    }
  }, [donationAddress, amount])

  const handleCopyAddress = async () => {
    if (!donationAddress) return
    
    try {
      await navigator.clipboard.writeText(donationAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      trackEvent({ event: 'copy_address' })
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const handleCopyEIP681 = async () => {
    if (!eip681Link) return
    
    try {
      await navigator.clipboard.writeText(eip681Link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      trackEvent({ event: 'copy_eip681' })
    } catch (err) {
      console.error('Failed to copy EIP-681 link:', err)
    }
  }

  const handleDonate = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    trackEvent({ event: 'submit_started', amount, method: 'native' })

    const result = await donateNative(amount)
    if (result.success) {
      trackEvent({ event: 'submit_success', amount, method: 'native', success: true })
      alert(`Donation sent! Transaction: ${result.hash}`)
    } else {
      trackEvent({ event: 'submit_failed', amount, method: 'native', success: false, error: result.error || 'Unknown error' })
      alert(`Donation failed: ${result.error}`)
    }
  }

  const handlePresetClick = (preset: keyof typeof DONATION_PRESETS) => {
    setAmount(DONATION_PRESETS[preset])
  }

  if (!donationAddress) {
    return (
      <Container className="py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Donation System Not Configured
          </h1>
          <p className="text-gray-600 mb-6">
            The donation system is not yet configured. Please contact support or check back later.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
            <p>To configure donations, set the following environment variables:</p>
            <code className="block mt-2 font-mono text-xs">
              NEXT_PUBLIC_DONATION_ADDRESS=0xYourDonationAddress
            </code>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Support Allowance Guard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us maintain and improve Allowance Guard. Your support keeps the platform free and open source.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary-600" />
              Send Donation
            </h2>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Donation Amount (ETH)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.001"
                  step="0.001"
                  min="0"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <span className="text-gray-500 font-medium">ETH</span>
              </div>
              
              {/* Preset Buttons */}
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(DONATION_PRESETS).map(([key]) => (
                  <button
                    key={key}
                    onClick={() => handlePresetClick(key as keyof typeof DONATION_PRESETS)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {key === 'small' && 'Small'}
                    {key === 'medium' && 'Medium'}
                    {key === 'large' && 'Large'}
                    {key === 'generous' && 'Generous'}
                  </button>
                ))}
              </div>
            </div>

            {/* Donate Button */}
            <button
              onClick={handleDonate}
              disabled={!isConnected || isPending || !amount}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  {isConnected ? 'Send Donation' : 'Connect Wallet First'}
                </>
              )}
            </button>

            {!isConnected && (
              <p className="mt-3 text-sm text-gray-500 text-center">
                Connect your wallet to send donations
              </p>
            )}
          </div>

          {/* Address & QR Code */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <QrCode className="w-6 h-6 text-primary-600" />
              Donation Address
            </h2>

            {/* ENS Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ENS Name
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono">
                  {DONATION_ENS}
                </code>
                <a
                  href={`https://app.ens.domains/name/${DONATION_ENS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ethereum Address
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono break-all">
                  {donationAddress}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* EIP-681 Link */}
            {eip681Link && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EIP-681 Link
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm font-mono break-all">
                    {eip681Link}
                  </code>
                  <button
                    onClick={handleCopyEIP681}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* QR Code Placeholder */}
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                <QrCode className="w-12 h-12 text-gray-400" />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                QR code for {formatDonationAmount(amount)} ETH
              </p>
            </div>
          </div>
        </div>

        {/* External Donation Links */}
        {(EXTERNAL_DONATION_LINKS.giveth || EXTERNAL_DONATION_LINKS.gitcoin) && (
          <div className="mt-12 bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Alternative Donation Methods
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {EXTERNAL_DONATION_LINKS.giveth && (
                <a
                  href={EXTERNAL_DONATION_LINKS.giveth}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent({ event: 'external_link_click', method: 'giveth' })}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Donate via Giveth
                </a>
              )}
              {EXTERNAL_DONATION_LINKS.gitcoin && (
                <a
                  href={EXTERNAL_DONATION_LINKS.gitcoin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent({ event: 'external_link_click', method: 'gitcoin' })}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Support via Gitcoin
                </a>
              )}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Tips support development and are non-refundable. Thank you for your support! 💚
          </p>
        </div>
      </div>
    </Container>
  )
}
