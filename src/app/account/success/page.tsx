'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import PlanBadge from '@/components/PlanBadge'
import { useUserPlan } from '@/hooks/useUserPlan'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Toast } from '@/components/ui/Alert'
import type { ConsumerPlan } from '@/lib/plans'
import { getPlanDisplayName } from '@/lib/plans'

function CheckoutSuccessInner() {
  const queryClient = useQueryClient()
  const { plan } = useUserPlan()
  const params = useSearchParams()
  const provider = params.get('provider') ?? 'stripe'
  const [pollCount, setPollCount] = useState(0)
  const [ready, setReady] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Poll for subscription update (webhooks can be delayed)
  useEffect(() => {
    if (plan !== 'free') {
      setReady(true)
      setShowToast(true)
      return
    }

    if (pollCount >= 15) {
      // Stop polling after ~30 seconds, show anyway
      setReady(true)
      return
    }

    const timer = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['user-plan'] })
      setPollCount((c) => c + 1)
    }, 2000)

    return () => clearTimeout(timer)
  }, [plan, pollCount, queryClient])

  // Auto-redirect to dashboard after showing success
  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => {
      window.location.href = '/account'
    }, 5000)
    return () => clearTimeout(timer)
  }, [ready])

  return (
    <Section size="sm" background="muted">
      <Toast
        isVisible={showToast}
        onDismiss={() => setShowToast(false)}
        variant="success"
        title={`Welcome to ${getPlanDisplayName(plan as ConsumerPlan)}!`}
        duration={5000}
        position="top-center"
      >
        Your features are now unlocked.
      </Toast>
      <Container size="sm">
        <Card className="text-center">
          <CardContent className="py-12 space-y-6">
            {!ready ? (
              <>
                <Loader2 className="h-12 w-12 text-primary-500 animate-spin mx-auto" />
                <h1 className="text-2xl font-bold text-ink">
                  Setting up your subscription...
                </h1>
                <p className="text-sm text-ink-muted">
                  {provider === 'coinbase'
                    ? 'Waiting for on-chain confirmation. This can take a few minutes for crypto payments.'
                    : "This usually takes just a moment. Please don't close this page."}
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="h-16 w-16 text-semantic-success-500 mx-auto" />
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-ink">
                    Welcome to AllowanceGuard{' '}
                    {plan !== 'free' && <PlanBadge plan={plan as ConsumerPlan} />}
                  </h1>
                  <p className="text-sm text-ink-muted">
                    {plan !== 'free'
                      ? 'Your subscription is active. All premium features are now unlocked.'
                      : 'Your payment is being processed. Features will unlock shortly.'}
                  </p>
                  {plan === 'free' && pollCount >= 15 && (
                    <p className="text-xs text-semantic-warning-600 mt-2">
                      If your plan isn&apos;t updating, please contact support or try refreshing.
                    </p>
                  )}
                </div>
                <div className="pt-4">
                  <Button
                    variant="primary"
                    onClick={() => (window.location.href = '/account')}
                  >
                    Go to Dashboard
                  </Button>
                </div>
                <p className="text-xs text-ink-muted">
                  Redirecting in 5 seconds...
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessInner />
    </Suspense>
  )
}
