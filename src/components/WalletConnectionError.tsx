'use client'

import { useState } from 'react'
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface WalletConnectionErrorProps {
  error?: Error
  onRetry?: () => void
}

export default function WalletConnectionError({ error, onRetry }: WalletConnectionErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      // Wait a moment before retrying
      await new Promise(resolve => setTimeout(resolve, 1000))
      onRetry?.()
    } finally {
      setIsRetrying(false)
    }
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleClearCache = () => {
    // Clear browser cache and reload
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
    window.location.reload()
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
        <h3 className="text-lg font-semibold text-yellow-800">Connection Issue</h3>
      </div>
      
      <div className="mb-4">
        <p className="text-yellow-700 mb-2">
          We&apos;re having trouble connecting to your wallet. This might be due to:
        </p>
        <ul className="text-sm text-yellow-600 list-disc list-inside space-y-1">
          <li>MetaMask extension not installed</li>
          <li>Browser cache issues</li>
          <li>SSL certificate problems</li>
          <li>Network connectivity issues</li>
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-100 rounded text-sm text-yellow-800">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      <div className="space-y-2">
        <Button 
          onClick={handleRetry}
          disabled={isRetrying}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Page
        </Button>
        
        <Button 
          onClick={handleClearCache}
          variant="outline"
          className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Clear Cache & Reload
        </Button>
      </div>

      <div className="mt-4 text-xs text-yellow-600">
        <p>If the problem persists, try:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Installing MetaMask extension</li>
          <li>Using incognito/private browsing mode</li>
          <li>Checking your internet connection</li>
          <li>Disabling browser extensions temporarily</li>
        </ul>
      </div>
    </div>
  )
}
