'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { APIClient } from '@/lib/api-client'

export interface AllowanceRow {
  chain_id: number
  token_address: string
  spender_address: string
  standard: string
  allowance_type: string
  amount: string
  is_unlimited: boolean
  last_seen_block: string
  risk_score: number
  risk_flags: string[]
}

export function useDashboard() {
  const { address: connectedAddress, isConnected } = useAccount()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [rows, setRows] = useState<AllowanceRow[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [total, setTotal] = useState(0)
  const [pending, setPending] = useState(false)
  const [jobId, setJobId] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<Error | null>(null)

  const handleError = (err: Error, context: string) => {
    console.error(`Error in ${context}:`, err)
    // Show scan/fetch failures inline — don't crash the whole page.
    // The page-level ErrorFallback is reserved for truly fatal exceptions
    // (e.g. the page component itself throws during render).
    setMessage(`Error: ${err.message}`)
  }

  const resetError = () => {
    setError(null)
    setMessage('')
  }

  const fetchAllowances = useCallback(
    async (addr: string, p = page, ps = pageSize) => {
      try {
        const json = await APIClient.getAllowances(addr, p, ps)
        setRows(json.allowances || [])
        setTotal(json.total || 0)
        setError(null)
      } catch (err) {
        handleError(err as Error, 'fetchAllowances')
      }
    },
    [page, pageSize]
  )

  // Hydration guard
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Auto-select connected wallet
  useEffect(() => {
    if (isConnected && connectedAddress && !selectedWallet) {
      setSelectedWallet(connectedAddress)
    }
  }, [isConnected, connectedAddress, selectedWallet])

  // Auto-fetch allowances when wallet selected
  useEffect(() => {
    if (selectedWallet && isHydrated) {
      fetchAllowances(selectedWallet)
    }
  }, [selectedWallet, isHydrated, fetchAllowances])

  // Poll background job — refreshes allowances when slow chains complete.
  // Council #33 P1 fix: previously jobId was set but never read, so
  // background chain results were invisible until manual refresh.
  useEffect(() => {
    if (!jobId || !selectedWallet) return

    let cancelled = false
    let attempts = 0
    const MAX_ATTEMPTS = 60 // 5 minutes at 5s intervals

    const poll = async () => {
      if (cancelled) return
      attempts++

      try {
        const status = await APIClient.getJobStatus(jobId)

        if (status.status === 'completed') {
          if (!cancelled) {
            setMessage('All chains scanned.')
            setJobId(null)
            await fetchAllowances(selectedWallet)
          }
          return
        }

        if (status.status === 'failed') {
          if (!cancelled) {
            setMessage('Background scan finished with some errors. Refresh to see partial results.')
            setJobId(null)
          }
          return
        }

        if (attempts >= MAX_ATTEMPTS) {
          if (!cancelled) {
            setMessage('Background scan taking longer than expected. Refresh manually if needed.')
            setJobId(null)
          }
          return
        }

        // Still pending/running — poll again
        setTimeout(poll, 5000)
      } catch (err) {
        console.error('Job poll failed:', err)
        if (attempts < MAX_ATTEMPTS) {
          setTimeout(poll, 5000)
        } else if (!cancelled) {
          setJobId(null)
        }
      }
    }

    // First poll after 5s (give the job time to start)
    const initialTimer = setTimeout(poll, 5000)

    return () => {
      cancelled = true
      clearTimeout(initialTimer)
    }
  }, [jobId, selectedWallet, fetchAllowances])

  // Auto-scroll to dashboard on homepage
  useEffect(() => {
    if (isConnected && selectedWallet && isHydrated) {
      const scrollToDashboard = () => {
        const el = document.getElementById('security-dashboard')
        if (!el) return false
        el.classList.add('animate-pulse')
        const rect = el.getBoundingClientRect()
        window.scrollTo({
          top: rect.top + window.pageYOffset - 80,
          behavior: 'smooth',
        })
        setTimeout(() => el.classList.remove('animate-pulse'), 1000)
        return true
      }

      const tryScroll = (attempt = 1) => {
        if (scrollToDashboard() || attempt >= 5) return
        setTimeout(() => tryScroll(attempt + 1), attempt * 500)
      }

      setTimeout(() => tryScroll(), 100)
    }
  }, [isConnected, selectedWallet, isHydrated])

  async function startScan(overrideAddr?: string) {
    const target = overrideAddr || selectedWallet || connectedAddress
    if (!target) {
      setMessage('Select or connect a wallet first')
      return
    }
    // If we got an override address (paste-an-address flow), make it the
    // active wallet so the dashboard renders below.
    if (overrideAddr && overrideAddr !== selectedWallet) {
      setSelectedWallet(overrideAddr)
    }
    if (pending) return

    setPending(true)
    setMessage('Scanning top chains…')
    setError(null)

    try {
      // Phase 1: scan top 6 chains inline (~18s), returns with results
      const scanResult = await APIClient.startScan(target)

      if (scanResult.ok && scanResult.scanned != null) {
        // Fast scan completed — results are in the DB
        const bg = scanResult.backgroundChains || 0
        setMessage(
          bg > 0
            ? `Found approvals on ${scanResult.scanned} chains. ${bg} more scanning in background.`
            : `Scan complete — ${scanResult.scanned} chains checked.`
        )
        // Track background job for polling (Council #33 P1 fix)
        if (scanResult.backgroundJobId) {
          setJobId(scanResult.backgroundJobId)
        }
      } else if (scanResult.ok && !scanResult.scanned) {
        // Duplicate or already-in-progress scan
        setMessage(scanResult.message || 'Scan already in progress')
      } else {
        throw new Error(scanResult.error || 'Failed to start scan')
      }

      // Fetch results — fast-path results are already in the DB
      try {
        await fetchAllowances(target, 1, pageSize)
      } catch (postScanError) {
        console.error('Post-scan fetch failed:', postScanError)
      }
    } catch (err) {
      handleError(err as Error, 'startScan')
    } finally {
      setPending(false)
    }
  }

  const handlePage = async (newPage: number) => {
    setPage(newPage)
    if (selectedWallet) await fetchAllowances(selectedWallet, newPage, pageSize)
  }

  const handlePageSize = async (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
    if (selectedWallet) await fetchAllowances(selectedWallet, 1, newPageSize)
  }

  const handleRefresh = async () => {
    if (selectedWallet) await fetchAllowances(selectedWallet, page, pageSize)
  }

  return {
    // Wallet state
    connectedAddress,
    isConnected,
    selectedWallet,
    setSelectedWallet,
    isHydrated,
    // Data
    rows,
    total,
    page,
    pageSize,
    // Scan state
    pending,
    message,
    error,
    // Actions
    startScan,
    handlePage,
    handlePageSize,
    handleRefresh,
    resetError,
  }
}
