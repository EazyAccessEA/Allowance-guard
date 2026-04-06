'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Shield, ExternalLink, ArrowRight, Lock } from 'lucide-react'

interface InsuranceProvider {
  id: string
  name: string
  description: string
  logo: string
  coverUrl: string
  features: string[]
  discountEligible: boolean
}

const INSURANCE_PROVIDERS: InsuranceProvider[] = [
  {
    id: 'nexus-mutual',
    name: 'Nexus Mutual',
    description: 'Decentralized insurance for smart contract exploits, oracle failures, and protocol hacks.',
    logo: '/integrations/nexus-mutual.svg',
    coverUrl: 'https://app.nexusmutual.io/cover/buy',
    features: [
      'Smart contract cover',
      'Protocol cover',
      'Custody cover',
      'Community-driven claims',
    ],
    discountEligible: true,
  },
  {
    id: 'insurace',
    name: 'InsurAce',
    description: 'Multi-chain DeFi insurance with portfolio-based cover and competitive premiums.',
    logo: '/integrations/insurace.svg',
    coverUrl: 'https://app.insurace.io/Insurance/Cart',
    features: [
      'Multi-chain coverage',
      'Portfolio insurance bundles',
      'Low premiums',
      'Cross-chain claims',
    ],
    discountEligible: true,
  },
]

interface InsuranceCardProps {
  provider: InsuranceProvider
  walletAddress: string
  riskScore: number
  isSentinel: boolean
}

function InsuranceCard({ provider, walletAddress, riskScore, isSentinel }: InsuranceCardProps) {
  const [expanded, setExpanded] = useState(false)

  const discountPct = riskScore <= 15 ? 15 : riskScore <= 30 ? 10 : riskScore <= 50 ? 5 : 0
  const showDiscount = provider.discountEligible && discountPct > 0

  return (
    <div className="bg-secondary-800/60 border border-secondary-700 rounded-xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary dark:text-secondary-100">{provider.name}</h3>
              {showDiscount && (
                <span className="inline-block text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                  {discountPct}% premium discount eligible
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-text-secondary dark:text-secondary-400 mb-4">
          {provider.description}
        </p>

        <ul className="grid grid-cols-2 gap-2 mb-4">
          {provider.features.map((feature) => (
            <li key={feature} className="flex items-center gap-1.5 text-xs text-text-secondary dark:text-secondary-400">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {isSentinel ? (
          <div className="flex gap-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 dark:bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Insure This Wallet
            </button>
            <a
              href={provider.coverUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-2.5 border border-secondary-700 dark:border-secondary-600 text-text-secondary dark:text-secondary-400 text-sm rounded-lg hover:bg-secondary-800 dark:hover:bg-secondary-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-50 dark:bg-secondary-700/50 text-text-tertiary dark:text-secondary-500 text-sm rounded-lg">
            <Lock className="h-4 w-4" />
            <span>Sentinel tier required</span>
            <a
              href="/pricing"
              className="ml-auto text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1 hover:underline"
            >
              Upgrade <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      {/* Pre-filled application form */}
      {expanded && isSentinel && (
        <div className="border-t border-secondary-700 p-5 bg-secondary-800/40">
          <h4 className="text-sm font-semibold text-text-primary dark:text-secondary-100 mb-3">
            Pre-filled Application
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-text-secondary dark:text-secondary-400 mb-1">Wallet Address</label>
              <input
                type="text"
                readOnly
                value={walletAddress}
                className="w-full px-3 py-2 text-sm font-mono bg-secondary-700 border border-secondary-700 dark:border-secondary-600 rounded-lg text-text-primary dark:text-secondary-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-secondary dark:text-secondary-400 mb-1">AllowanceGuard Risk Score</label>
                <input
                  type="text"
                  readOnly
                  value={`${riskScore}/100`}
                  className="w-full px-3 py-2 text-sm bg-secondary-700 border border-secondary-700 dark:border-secondary-600 rounded-lg text-text-primary dark:text-secondary-200"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary dark:text-secondary-400 mb-1">Discount Eligible</label>
                <input
                  type="text"
                  readOnly
                  value={showDiscount ? `Yes (${discountPct}%)` : 'No'}
                  className="w-full px-3 py-2 text-sm bg-secondary-700 border border-secondary-700 dark:border-secondary-600 rounded-lg text-text-primary dark:text-secondary-200"
                />
              </div>
            </div>
            <a
              href={`${provider.coverUrl}?wallet=${walletAddress}&source=allowanceguard&risk=${riskScore}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary-600 dark:bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
            >
              Continue to {provider.name}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

interface InsuranceIntegrationProps {
  riskScore?: number
  userTier?: 'free' | 'pro' | 'sentinel'
}

export default function InsuranceIntegration({ riskScore = 0, userTier = 'free' }: InsuranceIntegrationProps) {
  const { address } = useAccount()
  const isSentinel = userTier === 'sentinel'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary dark:text-secondary-100">
          DeFi Insurance
        </h2>
        {riskScore <= 30 && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
            Low risk — eligible for premium discounts
          </span>
        )}
      </div>
      <p className="text-sm text-text-secondary dark:text-secondary-400">
        Protect your wallet against smart contract exploits and protocol hacks with decentralized insurance.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INSURANCE_PROVIDERS.map((provider) => (
          <InsuranceCard
            key={provider.id}
            provider={provider}
            walletAddress={address || ''}
            riskScore={riskScore}
            isSentinel={isSentinel}
          />
        ))}
      </div>
    </div>
  )
}
