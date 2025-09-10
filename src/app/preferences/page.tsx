'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Preferences {
  email: string
  is_active: boolean
  daily_digest: boolean
  risk_alerts: boolean
  created_at: string
  updated_at: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function PreferencesPage() {
  const [email, setEmail] = useState('')
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      loadPreferences(emailParam)
    }
  }, [searchParams])

  const loadPreferences = async (emailAddress: string) => {
    setStatus('loading')
    try {
      const response = await fetch(`/api/preferences?email=${encodeURIComponent(emailAddress)}`)
      const data = await response.json()

      if (response.ok) {
        setPreferences(data)
        setStatus('success')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to load preferences')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const updatePreferences = async (updates: Partial<Preferences>) => {
    if (!preferences) return

    setStatus('loading')
    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: preferences.email,
          ...updates
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPreferences(data)
        setStatus('success')
        setMessage('Preferences updated successfully')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to update preferences')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  const handleToggle = (field: keyof Preferences) => {
    if (!preferences) return
    updatePreferences({ [field]: !preferences[field] })
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Email Preferences</h1>
          <p className="text-gray-400">Manage your Allowance Guard notification settings</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          {status === 'error' && (
            <div className="mb-6 bg-red-900 border border-red-700 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">Error</h3>
                  <div className="mt-2 text-sm text-red-200">
                    <p>{message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === 'success' && message && (
            <div className="mb-6 bg-green-900 border border-green-700 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-200">Success</h3>
                  <div className="mt-2 text-sm text-green-200">
                    <p>{message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!preferences && status !== 'loading' ? (
            <div className="text-center">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Enter your email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <button
                onClick={() => loadPreferences(email)}
                disabled={!email}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Load Preferences
              </button>
            </div>
          ) : preferences ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-2">Email Settings</h2>
                <p className="text-sm text-gray-400 mb-4">{preferences.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Email Alerts</h3>
                    <p className="text-sm text-gray-400">Receive security alerts via email</p>
                  </div>
                  <button
                    onClick={() => handleToggle('is_active')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      preferences.is_active ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.is_active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Daily Digest</h3>
                    <p className="text-sm text-gray-400">Daily summary of your token approvals</p>
                  </div>
                  <button
                    onClick={() => handleToggle('daily_digest')}
                    disabled={!preferences.is_active}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      preferences.daily_digest ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.daily_digest ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">Risk Alerts</h3>
                    <p className="text-sm text-gray-400">Immediate alerts for high-risk approvals</p>
                  </div>
                  <button
                    onClick={() => handleToggle('risk_alerts')}
                    disabled={!preferences.is_active}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      preferences.risk_alerts ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.risk_alerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  Member since: {new Date(preferences.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(preferences.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading preferences...</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@allowanceguard.com" className="text-blue-400 hover:text-blue-300">
              support@allowanceguard.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
