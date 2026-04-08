'use client'
import { useState, useEffect } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2, H3 } from '@/components/ui/Heading'
import {
  CheckCircle,
  Clock,
  Calendar,
  ExternalLink,
  Network,
  Info
} from 'lucide-react'
import type { NetworksApiResponse, NetworkSummary, ChangelogEntry } from '@/lib/schemas/networks'

export default function NetworksPage() {
  const [data, setData] = useState<NetworksApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNetworksData() {
      try {
        const response = await fetch('/api/networks/roadmap')
        const result = await response.json()

        if (result.success) {
          setData(result.data)
        } else {
          setError(result.error || 'Failed to fetch networks data')
        }
      } catch (err) {
        setError('Network error occurred')
        console.error('Failed to fetch networks data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNetworksData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-paper-deep">
        <Container>
          <Section className="py-16">
            <div className="animate-pulse">
              <div className="h-12 bg-paper-sub rounded w-1/3 mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-paper-sub rounded w-1/2"></div>
                <div className="h-4 bg-paper-sub rounded w-3/4"></div>
                <div className="h-4 bg-paper-sub rounded w-1/4"></div>
              </div>
            </div>
          </Section>
        </Container>
      </div>
    )
  }

  function retryFetch() {
    setLoading(true)
    setError(null)
    fetch('/api/networks/roadmap')
      .then(r => r.json())
      .then(result => {
        if (result.success) setData(result.data)
        else setError(result.error || 'Failed to fetch networks data')
      })
      .catch(() => setError('Network error occurred'))
      .finally(() => setLoading(false))
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-paper-deep">
        <Container>
          <Section className="py-16">
            <div className="text-center">
              <H1 className="text-red-600 dark:text-red-400 mb-4">Error Loading Networks</H1>
              <p className="text-ink-muted mb-6">{error || 'Failed to load networks data'}</p>
              <button
                onClick={retryFetch}
                className="px-6 py-3 bg-primary-600 text-ink rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </Section>
        </Container>
      </div>
    )
  }

  const NetworkCard = ({ network }: { network: NetworkSummary }) => (
    <div className="bg-paper-deep rounded-lg border border-ink-rule p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            network.status === 'live'
              ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
          }`}>
            {network.status === 'live' ? <CheckCircle size={20} /> : <Clock size={20} />}
          </div>
          <div>
            <H3 className="text-lg font-semibold text-ink">{network.name}</H3>
            <p className="text-sm text-ink-whisper">Chain ID: {network.chainId}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          network.status === 'live'
            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
        }`}>
          {network.status === 'live' ? 'Live' : 'Planned'}
        </span>
      </div>

      {network.description && (
        <p className="text-ink-muted mb-4">{network.description}</p>
      )}

      {network.features && network.features.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {network.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-paper-deep dark:bg-paper-sub text-ink-soft text-xs rounded-md"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-ink-whisper">
        {network.status === 'live' && network.since && (
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>Live since {network.since}</span>
          </div>
        )}
        {network.status === 'planned' && network.targetMonth && (
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>Target: {network.targetMonth}</span>
          </div>
        )}
        <ExternalLink size={14} className="text-ink-whisper" />
      </div>
    </div>
  )

  const ChangelogEntry = ({ entry }: { entry: ChangelogEntry }) => (
    <div className="border-l-4 border-blue-500 pl-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-ink-whisper" />
          <span className="font-medium text-ink">{entry.date}</span>
          {entry.version && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded">
              v{entry.version}
            </span>
          )}
        </div>
      </div>
      <p className="text-ink-muted mb-2">{entry.notes}</p>
      {entry.added && entry.added.length > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-ink-whisper">Added chains:</span>
          <div className="flex space-x-1">
            {entry.added.map((chainId, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded"
              >
                {chainId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-paper-deep">
      <Container>
        <Section className="py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <H1 className="text-4xl font-bold text-ink mb-4">
              Supported Networks
            </H1>
            <p className="text-xl text-ink-muted max-w-3xl mx-auto">
              AllowanceGuard supports multiple blockchain networks with comprehensive
              token approval monitoring and risk assessment capabilities.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-paper-deep rounded-lg border border-ink-rule p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full mx-auto mb-4">
                <CheckCircle size={24} />
              </div>
              <H3 className="text-2xl font-bold text-ink mb-2">
                {data.supported.length}
              </H3>
              <p className="text-ink-muted">Live Networks</p>
            </div>

            <div className="bg-paper-deep rounded-lg border border-ink-rule p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full mx-auto mb-4">
                <Clock size={24} />
              </div>
              <H3 className="text-2xl font-bold text-ink mb-2">
                {data.planned.length}
              </H3>
              <p className="text-ink-muted">Planned Networks</p>
            </div>

            <div className="bg-paper-deep rounded-lg border border-ink-rule p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full mx-auto mb-4">
                <Network size={24} />
              </div>
              <H3 className="text-2xl font-bold text-ink mb-2">
                {data.supported.length + data.planned.length}
              </H3>
              <p className="text-ink-muted">Total Networks</p>
            </div>
          </div>

          {/* Live Networks */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              <H2 className="text-2xl font-bold text-ink">Live Networks</H2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.supported.map((network) => (
                <NetworkCard key={network.chainId} network={network} />
              ))}
            </div>
          </div>

          {/* Planned Networks */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
              <H2 className="text-2xl font-bold text-ink">Planned Networks</H2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.planned.map((network) => (
                <NetworkCard key={network.chainId} network={network} />
              ))}
            </div>
          </div>

          {/* Changelog */}
          <div className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
              <H2 className="text-2xl font-bold text-ink">Recent Updates</H2>
            </div>
            <div className="bg-paper-deep rounded-lg border border-ink-rule p-6">
              <div className="space-y-6">
                {data.changelog.slice(0, 5).map((entry, index) => (
                  <ChangelogEntry key={index} entry={entry} />
                ))}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-start space-x-3">
              <Info className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
              <div>
                <H3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  Data Freshness
                </H3>
                <p className="text-blue-800 dark:text-blue-300 mb-2">
                  Last updated: {data.metadata.lastUpdated}
                </p>
                <p className="text-blue-800 dark:text-blue-300 mb-2">
                  Next review: {data.metadata.nextReview}
                </p>
                <p className="text-blue-800 dark:text-blue-300">
                  Version: {data.metadata.version}
                </p>
              </div>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  )
}
