'use client'

import { useState, useEffect } from 'react'
import { Shield, Settings, X, Check, AlertTriangle } from 'lucide-react'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  preferences: boolean
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, can't be disabled
    analytics: false,
    preferences: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    try {
      const cookieConsent = localStorage.getItem('allowance-guard-cookie-consent')
      if (!cookieConsent) {
        setIsVisible(true)
      } else {
        const savedPreferences = JSON.parse(cookieConsent)
        setPreferences(savedPreferences)
      }
    } catch {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      preferences: true
    }
    setPreferences(allAccepted)
    localStorage.setItem('allowance-guard-cookie-consent', JSON.stringify(allAccepted))
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      preferences: false
    }
    setPreferences(onlyEssential)
    localStorage.setItem('allowance-guard-cookie-consent', JSON.stringify(onlyEssential))
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('allowance-guard-cookie-consent', JSON.stringify(preferences))
    setIsVisible(false)
    setShowSettings(false)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return // Can't disable essential cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (!isVisible) return null

  return (
    <>
      {/* Cookie Banner — non-blocking bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-secondary-900 border border-secondary-700 rounded-2xl shadow-2xl">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-900/30 rounded-lg">
                    <Shield className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Cookie Preferences
                    </h3>
                    <p className="text-sm text-slate-400">
                      Web3 Security & Privacy
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 hover:bg-secondary-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {!showSettings ? (
                /* Main Banner Content */
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-secondary-800 rounded-xl border border-secondary-700">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-white mb-2">
                        <strong>Essential for DeFi Security:</strong> We use minimal cookies to protect your wallet and provide secure token approval management.
                      </p>
                      <p className="text-sm text-slate-400">
                        Essential cookies are required for wallet connection and security features. Analytics and preference cookies help us improve the service.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-secondary-800 rounded-xl border border-secondary-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-white">Essential</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Wallet connection, security tokens, session management
                      </p>
                    </div>
                    <div className="p-4 bg-secondary-800 rounded-xl border border-secondary-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="w-4 h-4 text-sky-400" />
                        <span className="text-sm font-medium text-white">Preferences</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        UI settings, alert preferences, wallet addresses
                      </p>
                    </div>
                    <div className="p-4 bg-secondary-800 rounded-xl border border-secondary-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-white">Analytics</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Anonymous usage data, performance monitoring
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
                    >
                      Accept All Cookies
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 px-6 py-3 border border-secondary-700 text-white rounded-lg hover:bg-secondary-800 transition-colors font-medium"
                    >
                      Essential Only
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-6 py-3 border border-secondary-700 text-white rounded-lg hover:bg-secondary-800 transition-colors font-medium"
                    >
                      Customize
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 text-center">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-amber-400 hover:text-amber-300 underline">
                      Terms of Use
                    </a>
                    ,{' '}
                    <a href="/privacy" className="text-amber-400 hover:text-amber-300 underline">
                      Privacy Policy
                    </a>
                    , and{' '}
                    <a href="/cookies" className="text-amber-400 hover:text-amber-300 underline">
                      Cookie Policy
                    </a>
                  </p>
                </div>
              ) : (
                /* Settings Panel */
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-amber-400" />
                    <h4 className="text-lg font-semibold text-white">Customize Cookie Preferences</h4>
                  </div>

                  <div className="space-y-4">
                    {/* Essential Cookies */}
                    <div className="p-4 bg-secondary-800 rounded-xl border border-secondary-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-emerald-400" />
                          <div>
                            <h5 className="text-sm font-medium text-white">Essential Cookies</h5>
                            <p className="text-xs text-slate-400">
                              Required for wallet connection and security features
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              <strong>Retention:</strong> Session-based (deleted when browser closes)
                            </p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-emerald-900/40 text-emerald-300 rounded-full text-xs font-medium">
                          Always Active
                        </div>
                      </div>
                    </div>

                    {/* Preference Cookies */}
                    <div className="p-4 bg-secondary-800 rounded-xl border border-secondary-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Settings className="w-5 h-5 text-sky-400" />
                          <div>
                            <h5 className="text-sm font-medium text-white">Preference Cookies</h5>
                            <p className="text-xs text-slate-400">
                              Remember your UI settings and alert preferences
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              <strong>Retention:</strong> Up to 1 year
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePreference('preferences')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.preferences ? 'bg-amber-500' : 'bg-secondary-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              preferences.preferences ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="p-4 bg-secondary-800 rounded-xl border border-secondary-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-purple-400" />
                          <div>
                            <h5 className="text-sm font-medium text-white">Analytics Cookies</h5>
                            <p className="text-xs text-slate-400">
                              Anonymous usage data to improve our service
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              <strong>Retention:</strong> Up to 2 years
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePreference('analytics')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.analytics ? 'bg-amber-500' : 'bg-secondary-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Settings Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSavePreferences}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
                    >
                      Save Preferences
                    </button>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="px-6 py-3 border border-secondary-700 text-white rounded-lg hover:bg-secondary-800 transition-colors font-medium"
                    >
                      Back
                    </button>
                  </div>

                  {/* User Rights */}
                  <div className="p-4 bg-secondary-800 rounded-xl border border-secondary-700">
                    <h5 className="text-sm font-medium text-white mb-2">Your Rights</h5>
                    <ul className="space-y-1 text-xs text-slate-400">
                      <li>• Accept or reject non-essential cookies</li>
                      <li>• Delete existing cookies from your browser</li>
                      <li>• Be informed about what cookies we use</li>
                      <li>• Withdraw consent at any time</li>
                      <li>• Request data deletion or portability</li>
                    </ul>
                  </div>

                  {/* Policy Links */}
                  <div className="pt-4 border-t border-secondary-700">
                    <p className="text-xs text-slate-400 text-center mb-3">
                      Learn more about our policies:
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <a
                        href="/terms"
                        className="text-amber-400 hover:text-amber-300 underline text-xs"
                      >
                        Terms of Use
                      </a>
                      <a
                        href="/privacy"
                        className="text-amber-400 hover:text-amber-300 underline text-xs"
                      >
                        Privacy Policy
                      </a>
                      <a
                        href="/cookies"
                        className="text-amber-400 hover:text-amber-300 underline text-xs"
                      >
                        Cookie Policy
                      </a>
                    </div>
                    <p className="text-xs text-slate-400 text-center mt-3">
                      Questions? Contact us at{' '}
                      <a href="mailto:legal.support@allowanceguard.com" className="text-amber-400 hover:text-amber-300 underline">
                        legal.support@allowanceguard.com
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
