import { useState, useEffect, useCallback } from 'react'

export interface AllowanceData {
  id: string
  tokenAddress: string
  tokenName: string
  tokenSymbol: string
  spenderAddress: string
  spenderName: string
  allowance: string
  allowanceFormatted: string
  riskLevel: number
  riskScore: number
  issues: string[]
  lastUpdated: string
  chainId: number
}

export interface RiskAssessment {
  riskLevel: number
  riskScore: number
  issues: string[]
  tokenName: string
  spenderName: string
  recommendation: string
  confidence: number
}

export interface NetworksData {
  supported: Array<{
    chainId: number
    name: string
    status: 'live'
    since: string
    description?: string
    features: string[]
  }>
  planned: Array<{
    chainId: number
    name: string
    targetMonth: string
    description?: string
    features: string[]
  }>
  changelog: Array<{
    date: string
    added: number[]
    notes: string
    version?: string
  }>
  metadata: {
    lastUpdated: string
    nextReview: string
    version: string
  }
}

export interface AllowanceGuardOptions {
  apiBaseUrl?: string
  apiKey?: string
  defaultPageSize?: number
  retryAttempts?: number
  retryDelay?: number
}

export interface UseAllowancesOptions {
  walletAddress: string
  page?: number
  pageSize?: number
  riskOnly?: boolean
  chainId?: number
  enabled?: boolean
}

export interface UseRiskAssessmentOptions {
  walletAddress: string
  tokenAddress: string
  spenderAddress: string
  chainId?: number
  enabled?: boolean
}

const DEFAULT_OPTIONS: AllowanceGuardOptions = {
  apiBaseUrl: 'https://www.allowanceguard.com/api',
  defaultPageSize: 25,
  retryAttempts: 3,
  retryDelay: 1000
}

/**
 * Custom hook for fetching token allowances
 */
export function useAllowances(options: UseAllowancesOptions) {
  const [data, setData] = useState<AllowanceData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const fetchAllowances = useCallback(async () => {
    if (!options.walletAddress || !options.enabled) {
      setData([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        wallet: options.walletAddress,
        page: String(options.page || 1),
        pageSize: String(options.pageSize || DEFAULT_OPTIONS.defaultPageSize!)
      })

      if (options.riskOnly) {
        params.append('riskOnly', 'true')
      }

      if (options.chainId) {
        params.append('chainId', String(options.chainId))
      }

      const response = await fetch(`${DEFAULT_OPTIONS.apiBaseUrl}/allowances?${params}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result.data || [])
      setHasMore(result.hasMore || false)
      setTotalCount(result.totalCount || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [options.walletAddress, options.page, options.pageSize, options.riskOnly, options.chainId, options.enabled])

  useEffect(() => {
    fetchAllowances()
  }, [fetchAllowances])

  return {
    data,
    loading,
    error,
    hasMore,
    totalCount,
    refetch: fetchAllowances
  }
}

/**
 * Custom hook for risk assessment
 */
export function useRiskAssessment(options: UseRiskAssessmentOptions) {
  const [data, setData] = useState<RiskAssessment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assessRisk = useCallback(async () => {
    if (!options.walletAddress || !options.tokenAddress || !options.spenderAddress || !options.enabled) {
      setData(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${DEFAULT_OPTIONS.apiBaseUrl}/risk/assess`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: options.walletAddress,
          tokenAddress: options.tokenAddress,
          spenderAddress: options.spenderAddress,
          chainId: options.chainId || 1
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [options.walletAddress, options.tokenAddress, options.spenderAddress, options.chainId, options.enabled])

  useEffect(() => {
    assessRisk()
  }, [assessRisk])

  return {
    data,
    loading,
    error,
    refetch: assessRisk
  }
}

/**
 * Custom hook for fetching supported networks
 */
export function useNetworks() {
  const [data, setData] = useState<NetworksData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNetworks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${DEFAULT_OPTIONS.apiBaseUrl}/networks/roadmap`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNetworks()
  }, [fetchNetworks])

  return {
    data,
    loading,
    error,
    refetch: fetchNetworks
  }
}

/**
 * Utility hook for checking if a chain is supported
 */
export function useChainSupport(chainId: number) {
  const { data: networks } = useNetworks()
  
  const isSupported = networks?.supported.some(network => network.chainId === chainId) || false
  const isPlanned = networks?.planned.some(network => network.chainId === chainId) || false
  const networkInfo = networks?.supported.find(network => network.chainId === chainId) || 
                     networks?.planned.find(network => network.chainId === chainId)

  return {
    isSupported,
    isPlanned,
    networkInfo,
    status: isSupported ? 'supported' : isPlanned ? 'planned' : 'unsupported'
  }
}

/**
 * Utility hook for risk level formatting
 */
export function useRiskLevel(riskLevel: number) {
  const getRiskInfo = useCallback((level: number) => {
    switch (level) {
      case 1:
        return {
          label: 'Low Risk',
          color: 'green',
          description: 'Safe approval with minimal risk'
        }
      case 2:
        return {
          label: 'Medium Risk',
          color: 'yellow',
          description: 'Moderate risk, review carefully'
        }
      case 3:
        return {
          label: 'High Risk',
          color: 'orange',
          description: 'High risk, consider revoking'
        }
      case 4:
        return {
          label: 'Critical Risk',
          color: 'red',
          description: 'Critical risk, immediate action recommended'
        }
      default:
        return {
          label: 'Unknown Risk',
          color: 'gray',
          description: 'Risk level could not be determined'
        }
    }
  }, [])

  return getRiskInfo(riskLevel)
}

/**
 * Utility hook for formatting allowance amounts
 */
export function useAllowanceFormatter() {
  const formatAllowance = useCallback((allowance: string, decimals: number = 18) => {
    try {
      const num = parseFloat(allowance)
      if (isNaN(num)) return '0'
      
      if (num === 0) return '0'
      if (num === Number.MAX_SAFE_INTEGER || allowance === '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff') {
        return 'Unlimited'
      }
      
      // Format large numbers
      if (num >= 1e18) {
        return (num / 1e18).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' tokens'
      }
      
      return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
    } catch {
      return allowance
    }
  }, [])

  return { formatAllowance }
}
