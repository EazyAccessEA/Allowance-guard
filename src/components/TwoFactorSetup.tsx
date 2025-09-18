'use client'
import { useState } from 'react'
import { Shield, Smartphone, Copy, Check } from 'lucide-react'

interface TwoFactorSetupProps {
  onComplete: (backupCodes: string[]) => void
  onCancel: () => void
}

export default function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const [step, setStep] = useState<'setup' | 'verify' | 'complete'>('setup')
  const [secret, setSecret] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [copiedCode, setCopiedCode] = useState<number | null>(null)

  const startSetup = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSecret(data.secret)
        setQrCode(data.qrCode)
        setStep('verify')
      } else {
        setError(data.error || 'Failed to setup 2FA')
      }
    } catch {
      setError('Failed to setup 2FA. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyToken = async () => {
    if (!token || token.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setBackupCodes(data.backupCodes)
        setStep('complete')
      } else {
        setError(data.error || 'Invalid verification code')
      }
    } catch {
      setError('Failed to verify code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyBackupCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(index)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedCode(index)
      setTimeout(() => setCopiedCode(null), 2000)
    }
  }

  const downloadBackupCodes = () => {
    const content = `Allowance Guard - 2FA Backup Codes\n\n${backupCodes.map((code, i) => `${i + 1}. ${code}`).join('\n')}\n\nStore these codes in a safe place. Each code can only be used once.`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'allowance-guard-backup-codes.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (step === 'setup') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Enable Two-Factor Authentication</h2>
          <p className="text-gray-600">
            Add an extra layer of security to your account with 2FA
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">How it works:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Download an authenticator app (Google Authenticator, Authy, etc.)</li>
              <li>• Scan the QR code with your app</li>
              <li>• Enter the 6-digit code to verify</li>
              <li>• Save your backup codes securely</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={startSetup}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Setting up...' : 'Start Setup'}
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Scan QR Code</h2>
          <p className="text-gray-600">
            Use your authenticator app to scan this QR code
          </p>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            {qrCode && (
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Manual Entry (if needed):</h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white border border-gray-200 rounded px-3 py-2 text-sm font-mono">
                {secret}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(secret)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit code from your app:
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={verifyToken}
              disabled={loading || token.length !== 6}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify & Enable'}
            </button>
            <button
              onClick={() => setStep('setup')}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'complete') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">2FA Enabled Successfully!</h2>
          <p className="text-gray-600">
            Save these backup codes in a secure location
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">⚠️ Important:</h3>
            <p className="text-sm text-yellow-700">
              These backup codes can be used to access your account if you lose your authenticator device. 
              Each code can only be used once.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Backup Codes:</h3>
              <button
                onClick={downloadBackupCodes}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Download
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div key={index} className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2">
                  <span className="text-sm font-mono flex-1">{code}</span>
                  <button
                    onClick={() => copyBackupCode(code, index)}
                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {copiedCode === index ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onComplete(backupCodes)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Complete Setup
          </button>
        </div>
      </div>
    )
  }

  return null
}
