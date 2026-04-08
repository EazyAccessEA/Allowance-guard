'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import ApiKeyManager from '@/components/account/ApiKeyManager'
import PublicApiKeyCreator from '@/components/account/PublicApiKeyCreator'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  prefix: string
  keyType?: 'secret' | 'public'
  createdAt: string
  lastUsedAt?: string
}

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch('/api/keys')
      if (res.ok) {
        const json = await res.json()
        const all: ApiKey[] = json.keys ?? json ?? []
        // ApiKeyManager only manages secret keys; public keys are handled
        // by PublicApiKeyCreator below.
        setKeys(all.filter((k) => (k.keyType ?? 'secret') === 'secret'))
      }
    } catch {
      // Keep existing state on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchKeys()
  }, [fetchKeys])

  const handleCreateKey = useCallback(
    async (name: string) => {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {
        throw new Error('Failed to create API key')
      }
      await fetchKeys()
    },
    [fetchKeys]
  )

  const handleRevokeKey = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        throw new Error('Failed to revoke API key')
      }
      await fetchKeys()
    },
    [fetchKeys]
  )

  return (
    <Section size="sm" background="muted">
      <Container size="lg">
        <div className="space-y-8">
          {/* Back link */}
          <a
            href="/account"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </a>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-ink">API Keys</h1>
            <p className="text-sm text-ink-muted mt-1">
              Create and manage API keys for the AllowanceGuard API.
            </p>
          </div>

          {/* Key manager */}
          {loading ? (
            <div
              className={cn(
                'rounded-lg border border-ink-rule bg-paper p-12',
                'flex items-center justify-center'
              )}
            >
              <div className="flex items-center gap-3 text-sm text-ink-muted">
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading keys...
              </div>
            </div>
          ) : (
            <ApiKeyManager
              keys={keys}
              onCreateKey={handleCreateKey}
              onRevokeKey={handleRevokeKey}
            />
          )}

          {/* Public (browser-safe) keys — for @allowance-guard/react */}
          <PublicApiKeyCreator />
        </div>
      </Container>
    </Section>
  )
}
