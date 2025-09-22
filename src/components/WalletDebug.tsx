'use client'

import { useAccount, useConnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { useState, useEffect } from 'react'

export default function WalletDebug() {
  const { isConnected, address, connector } = useAccount()
  const { open, close } = useAppKit()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setDebugInfo({
      isConnected,
      address,
      connector: connector?.name,
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
  }, [isConnected, address, connector])

  const handleOpen = async () => {
    try {
      console.log('Opening AppKit...')
      setIsOpen(true)
      await open()
    } catch (error) {
      console.error('Error opening AppKit:', error)
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    close()
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">Wallet Debug</h3>
      
      <div className="space-y-2 text-xs">
        <div><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</div>
        <div><strong>Address:</strong> {address || 'None'}</div>
        <div><strong>Connector:</strong> {connector?.name || 'None'}</div>
        <div><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ? 'Set' : 'Missing'}</div>
        <div><strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</div>
        <div><strong>Modal Open:</strong> {isOpen ? 'Yes' : 'No'}</div>
      </div>

      <div className="mt-3 space-y-2">
        <button
          onClick={handleOpen}
          className="w-full px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Open Wallet Modal
        </button>
        
        <button
          onClick={handleClose}
          className="w-full px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
        >
          Close Modal
        </button>
      </div>

      <details className="mt-2">
        <summary className="text-xs cursor-pointer">Full Debug Info</summary>
        <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto max-h-32">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </details>
    </div>
  )
}
