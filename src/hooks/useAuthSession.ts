'use client'

/**
 * useAuthSession — polls /api/auth/session so the UI can branch on
 * whether the visitor has a server session cookie. Distinct from
 * wagmi's useAccount (which only reports wallet connection); a user
 * can be wallet-connected without a server session (pre-SIWE) or
 * session-authenticated without a wallet (OTP email-only sign-in).
 *
 * The endpoint returns the minimum the UI needs — no session token,
 * no user id — so calling this from any client surface is safe.
 */

import { useCallback, useEffect, useState } from 'react'

export interface AuthSessionState {
  isAuthenticated: boolean
  email: string | null
  loading: boolean
  refetch: () => Promise<void>
}

interface SessionResponse {
  authenticated: boolean
  email?: string | null
}

export function useAuthSession(): AuthSessionState {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', { cache: 'no-store' })
      if (!res.ok) {
        setIsAuthenticated(false)
        setEmail(null)
        return
      }
      const data = (await res.json()) as SessionResponse
      setIsAuthenticated(Boolean(data.authenticated))
      setEmail(data.email ?? null)
    } catch {
      setIsAuthenticated(false)
      setEmail(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
  }, [refetch])

  return { isAuthenticated, email, loading, refetch }
}
