'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
 children: ReactNode
 fallback?: ReactNode
 onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
 hasError: boolean
 error: Error | null
 errorInfo: ErrorInfo | null
}

export class EnhancedErrorBoundary extends Component<Props, State> {
 constructor(props: Props) {
 super(props)
 this.state = { hasError: false, error: null, errorInfo: null }
 }

 static getDerivedStateFromError(error: Error): State {
 return { hasError: true, error, errorInfo: null }
 }

 componentDidCatch(error: Error, errorInfo: ErrorInfo) {
 this.setState({ errorInfo })
 
 // Log error to console in development
 if (process.env.NODE_ENV === 'development') {
 console.error('ErrorBoundary caught an error:', error, errorInfo)
 }
 
 // Call custom error handler if provided
 if (this.props.onError) {
 this.props.onError(error, errorInfo)
 }
 
 // Log to external service in production
 if (process.env.NODE_ENV === 'production') {
 // You can integrate with Rollbar, Sentry, etc. here
 console.error('Production error:', error.message)
 }
 }

 handleRetry = () => {
 this.setState({ hasError: false, error: null, errorInfo: null })
 }

 render() {
 if (this.state.hasError) {
 // Custom fallback UI
 if (this.props.fallback) {
 return this.props.fallback
 }

 // Default error UI
 return (
 <div className="min-h-screen bg-paper flex items-center justify-center">
 <div className="max-w-md mx-auto text-center p-6">
 <div className="mb-6">
 <div className="w-16 h-16 bg-paper-sub rounded-full flex items-center justify-center mx-auto mb-4">
 <svg className="w-8 h-8 text-crimson-paper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
 </svg>
 </div>
 <h2 className="mobbin-heading-2 text-ink mb-2">Something went wrong</h2>
 <p className="text-ink-muted mb-6">
 We&apos;re working to fix this issue. Please try refreshing the page or contact support if the problem persists.
 </p>
 </div>
 
 <div className="space-y-3">
 <button
 onClick={this.handleRetry}
 className="w-full bg-amber-deep text-ink px-6 py-3 rounded-lg hover:bg-amber-deep transition-colors font-medium"
 >
 Try Again
 </button>
 
 <button
 onClick={() => window.location.reload()}
 className="w-full bg-paper-sub text-ink px-6 py-3 rounded-lg hover:bg-paper-deep transition-colors font-medium"
 >
 Refresh Page
 </button>
 </div>
 
 {process.env.NODE_ENV === 'development' && this.state.error && (
 <details className="mt-6 text-left">
 <summary className="cursor-pointer text-sm text-ink-muted hover:text-ink">
 Error Details (Development)
 </summary>
 <div className="mt-2 p-4 bg-paper-sub rounded-lg text-xs font-mono text-ink overflow-auto">
 <div className="mb-2">
 <strong>Error:</strong> {this.state.error.message}
 </div>
 {this.state.errorInfo && (
 <div className="mb-2">
 <strong>Component Stack:</strong>
 <pre className="whitespace-pre-wrap mt-1">
 {this.state.errorInfo.componentStack}
 </pre>
 </div>
 )}
 <div>
 <strong>Stack Trace:</strong>
 <pre className="whitespace-pre-wrap mt-1">
 {this.state.error.stack}
 </pre>
 </div>
 </div>
 </details>
 )}
 </div>
 </div>
 )
 }

 return this.props.children
 }
}

export default EnhancedErrorBoundary
