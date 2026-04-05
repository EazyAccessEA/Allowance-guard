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
    setError(err)
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

  async function startScan() {
    const target = selectedWallet || connectedAddress
    if (!target) {
      setMessage('Select or connect a wallet first')
      return
    }
    if (pending) return

    setPending(true)
    setMessage('Queuing…')
    setError(null)

    try {
      const scanResult = await APIClient.startScan(target, ['eth', 'arb', 'base'])
      if (!scanResult.jobId) {
        throw new Error('Failed to get job ID from scan response')
      }

      setJobId(scanResult.jobId)
      setMessage(`Scan queued (#${scanResult.jobId})`)

      if (process.env.NODE_ENV !== 'production') {
        fetch('/api/jobs/process', { method: 'POST' }).catch(() => {})
      }

      let attempts = 0
      const maxAttempts = 40

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 3000))
        attempts++

        try {
          const status = await APIClient.getJobStatus(scanResult.jobId)
          if (status.status === 'succeeded') {
            setMessage('Scan complete')
            break
          }
          if (status.status === 'failed') {
            throw new Error(`Scan failed: ${status.error || 'Unknown error'}`)
          }
          setMessage(`Scanning… (attempt ${status.attempts || attempts})`)
        } catch (pollError) {
          console.error('Polling error:', pollError)
          if (attempts >= maxAttempts) {
            throw new Error('Scan timed out - please try again')
          }
        }
      }

      try {
        await Promise.allSettled([
          APIClient.refreshRisk(target),
          APIClient.enrichData(target),
        ])
        await fetchAllowances(target, 1, pageSize)
      } catch (postScanError) {
        console.error('Post-scan tasks failed:', postScanError)
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
