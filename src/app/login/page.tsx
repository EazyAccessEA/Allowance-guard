'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, Mail, CheckCircle } from 'lucide-react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

function LoginForm() {
  const params = useSearchParams()
  const redirect = params.get('redirect') ?? '/account'
  const urlError = params.get('error')

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, redirect }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
      } else {
        setSent(true)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="py-10 px-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-ink">Sign in to AllowanceGuard</h1>
          <p className="text-sm text-ink-muted">
            Enter your email and we&apos;ll send you a magic link.
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-3 py-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <p className="text-sm font-medium text-ink">Check your email</p>
            <p className="text-xs text-ink-muted">
              We sent a sign-in link to <strong>{email}</strong>. It expires in 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-base border border-ink-rule bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-700"
              />
            </label>

            {(error || urlError) && (
              <p className="text-xs text-red-600" role="alert">
                {error ?? (urlError === 'invalid_or_expired'
                  ? 'That sign-in link is invalid or has expired.'
                  : 'Something went wrong. Please try again.')}
              </p>
            )}

            <Button type="submit" variant="primary" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" /> Send magic link
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <main>
      <Section size="sm" background="muted">
        <Container size="sm">
          <Suspense fallback={<div className="text-center py-10">Loading…</div>}>
            <LoginForm />
          </Suspense>
        </Container>
      </Section>
    </main>
  )
}
