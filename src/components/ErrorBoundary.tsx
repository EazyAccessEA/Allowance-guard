'use client'

import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Fallback UI when no custom fallback is provided */
  fallbackTitle?: string
  fallbackDescription?: string
  /** Custom fallback component */
  fallback?: ReactNode
  /** Called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-semantic-error-200 dark:border-semantic-error-800">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-10 w-10 text-semantic-error-500 mx-auto mb-4" />
            <h3 className="font-semibold text-ink mb-2">
              {this.props.fallbackTitle || 'Something went wrong'}
            </h3>
            <p className="text-sm text-ink-muted mb-4 max-w-md mx-auto">
              {this.props.fallbackDescription ||
                'An unexpected error occurred. Please try again or refresh the page.'}
            </p>
            {this.state.error && (
              <p className="text-xs font-mono text-ink-muted dark:text-ink-whisper mb-4 max-w-md mx-auto break-all">
                {this.state.error.message}
              </p>
            )}
            <Button
              onClick={this.handleReset}
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

/**
 * Specialized error boundary for wallet connection issues.
 */
export function WalletErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackTitle="Wallet Connection Error"
      fallbackDescription="Failed to connect to your wallet. Please check your browser extension and try again."
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Specialized error boundary for Stripe checkout.
 */
export function CheckoutErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackTitle="Checkout Error"
      fallbackDescription="Something went wrong with the checkout process. Your card has not been charged."
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Specialized error boundary for RPC call failures.
 */
export function RpcErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallbackTitle="Network Error"
      fallbackDescription="Failed to communicate with the blockchain. This is usually temporary — please try again."
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Inline error state for failed API calls (not a boundary — used within components).
 */
export function InlineError({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertTriangle className="h-8 w-8 text-semantic-error-400 mb-3" />
      <p className="text-sm text-ink-muted mb-3">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm" className="inline-flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  )
}

export default ErrorBoundary
