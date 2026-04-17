'use client'

/**
 * InsuranceIntegration — unified Ledger canon (ADR 0007).
 */

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
    <div className="paper-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-paper-sub border border-ink-rule flex items-center justify-center">
              <Shield className="h-5 w-5 text-amber-deep" />
            </div>
            <div>
              <h3 className="font-display-tight text-lg text-ink">{provider.name}</h3>
              {showDiscount && (
                <span className="inline-block font-plex text-xs font-medium text-semantic-success-700 bg-paper-sub border border-semantic-success-600/30 px-2 py-0.5">
                  {discountPct}% premium discount eligible
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="font-plex text-sm text-ink-muted mb-4">
          {provider.description}
        </p>

        <ul className="grid grid-cols-2 gap-2 mb-4">
          {provider.features.map((feature) => (
            <li key={feature} className="flex items-center gap-1.5 font-plex text-xs text-ink-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-deep flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {isSentinel ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-oxblood text-cream font-plex text-sm font-semibold hover:bg-oxblood/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 focus-visible:ring-offset-paper transition-colors"
            >
              <Shield className="h-4 w-4" />
              Insure This Wallet
            </button>
            <a
              href={provider.coverUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-2.5 border border-ink-rule font-plex text-sm text-ink-muted hover:text-ink hover:bg-paper-sub transition-colors"
              aria-label={`Open ${provider.name} in a new tab`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-paper-sub border border-ink-rule font-plex text-sm text-ink-muted">
            <Lock className="h-4 w-4" />
            <span>Sentinel tier required</span>
            <a
              href="/pricing"
              className="ml-auto text-amber-deep font-medium flex items-center gap-1 hover:underline transition-colors"
            >
              Upgrade <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      {/* Pre-filled application form */}
      {expanded && isSentinel && (
        <div className="border-t border-ink-rule p-5 bg-paper-sub">
          <h4 className="font-display-tight text-base text-ink mb-3">
            Pre-filled Application
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block font-plex text-xs text-ink-muted mb-1">Wallet Address</label>
              <input
                type="text"
                readOnly
                value={walletAddress}
                className="w-full px-3 py-2 font-mono text-sm bg-paper border border-ink-rule text-ink focus:outline-none focus:ring-2 focus:ring-amber-deep focus:border-amber-deep"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-plex text-xs text-ink-muted mb-1">AllowanceGuard Risk Score</label>
                <input
                  type="text"
                  readOnly
                  value={`${riskScore}/100`}
                  className="w-full px-3 py-2 font-plex text-sm bg-paper border border-ink-rule text-ink"
                />
              </div>
              <div>
                <label className="block font-plex text-xs text-ink-muted mb-1">Discount Eligible</label>
                <input
                  type="text"
                  readOnly
                  value={showDiscount ? `Yes (${discountPct}%)` : 'No'}
                  className="w-full px-3 py-2 font-plex text-sm bg-paper border border-ink-rule text-ink"
                />
              </div>
            </div>
            <a
              href={`${provider.coverUrl}?wallet=${walletAddress}&source=allowanceguard&risk=${riskScore}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-oxblood text-cream font-plex text-sm font-semibold hover:bg-oxblood/90 transition-colors"
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
        <h2 className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
          DeFi Insurance
        </h2>
        {riskScore <= 30 && (
          <span className="font-plex text-xs font-medium text-semantic-success-700 bg-paper-sub border border-semantic-success-600/30 px-3 py-1">
            Low risk — eligible for premium discounts
          </span>
        )}
      </div>
      <p className="font-plex text-sm text-ink-muted">
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
