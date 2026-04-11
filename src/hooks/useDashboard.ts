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
  const [, setJobId] = useState<number | null>(null)
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
    setMessage('Queuing…')
    setError(null)

    try {
      // The scan route processes the job INLINE and returns when done.
      // No polling needed — the response itself contains the result.
      setMessage('Scanning — this takes 30–90 seconds…')
      const scanResult = await APIClient.startScan(target)

      if (scanResult.ok && scanResult.scanned != null) {
        // Inline scan completed — results are already in the DB
        setMessage(`Scan complete — ${scanResult.scanned} chains scanned`)
        if (scanResult.jobId) setJobId(scanResult.jobId)
      } else if (scanResult.ok && !scanResult.jobId) {
        // Duplicate scan — fetch whatever is already available
        setMessage(scanResult.message || 'Scan already in progress')
      } else if (scanResult.jobId) {
        // Fallback: if server returned jobId without scanned count,
        // it may be using the old async flow. Set message and continue.
        setJobId(scanResult.jobId)
        setMessage(scanResult.message || 'Scan queued')
      } else {
        throw new Error(scanResult.error || 'Failed to start scan')
      }

      // Fetch the results
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
