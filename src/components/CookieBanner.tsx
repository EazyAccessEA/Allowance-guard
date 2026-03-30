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
    const cookieConsent = localStorage.getItem('allowance-guard-cookie-consent')
    if (!cookieConsent) {
      setIsVisible(true)
    } else {
      const savedPreferences = JSON.parse(cookieConsent)
      setPreferences(savedPreferences)
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
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mobbin-card bg-background-primary border border-border-primary rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Shield className="w-6 h-6 text-primary-700" />
                  </div>
                  <div>
                    <h3 className="mobbin-heading-3 text-text-primary">
                      Cookie Preferences
                    </h3>
                    <p className="mobbin-body-small text-text-secondary">
                      Web3 Security & Privacy
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              {!showSettings ? (
                /* Main Banner Content */
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-background-secondary rounded-xl border border-border-primary">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="mobbin-body text-text-primary mb-2">
                        <strong>Essential for DeFi Security:</strong> We use minimal cookies to protect your wallet and provide secure token approval management.
                      </p>
                      <p className="mobbin-body-small text-text-secondary">
                        Essential cookies are required for wallet connection and security features. Analytics and preference cookies help us improve the service.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-background-secondary rounded-xl border border-border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="mobbin-body-small font-medium text-text-primary">Essential</span>
                      </div>
                      <p className="mobbin-caption text-text-secondary">
                        Wallet connection, security tokens, session management
                      </p>
                    </div>
                    <div className="p-4 bg-background-secondary rounded-xl border border-border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="w-4 h-4 text-blue-500" />
                        <span className="mobbin-body-small font-medium text-text-primary">Preferences</span>
                      </div>
                      <p className="mobbin-caption text-text-secondary">
                        UI settings, alert preferences, wallet addresses
                      </p>
                    </div>
                    <div className="p-4 bg-background-secondary rounded-xl border border-border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-purple-500" />
                        <span className="mobbin-body-small font-medium text-text-primary">Analytics</span>
                      </div>
                      <p className="mobbin-caption text-text-secondary">
                        Anonymous usage data, performance monitoring
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAcceptAll}
                      className="flex-1 px-6 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors mobbin-body font-medium"
                    >
                      Accept All Cookies
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="flex-1 px-6 py-3 border border-border-primary text-text-primary rounded-lg hover:bg-background-secondary transition-colors mobbin-body font-medium"
                    >
                      Essential Only
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-6 py-3 border border-border-primary text-text-primary rounded-lg hover:bg-background-secondary transition-colors mobbin-body font-medium"
                    >
                      Customize
                    </button>
                  </div>

                  <p className="mobbin-caption text-text-secondary text-center">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-primary-700 hover:text-primary-800 underline">
                      Terms of Use
                    </a>
                    ,{' '}
                    <a href="/privacy" className="text-primary-700 hover:text-primary-800 underline">
                      Privacy Policy
                    </a>
                    , and{' '}
                    <a href="/cookies" className="text-primary-700 hover:text-primary-800 underline">
                      Cookie Policy
                    </a>
                  </p>
                </div>
              ) : (
                /* Settings Panel */
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-primary-700" />
                    <h4 className="mobbin-heading-4 text-text-primary">Customize Cookie Preferences</h4>
                  </div>

                  <div className="space-y-4">
                    {/* Essential Cookies */}
                    <div className="p-4 bg-background-secondary rounded-xl border border-border-primary">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-green-500" />
                          <div>
                            <h5 className="mobbin-body font-medium text-text-primary">Essential Cookies</h5>
                            <p className="mobbin-caption text-text-secondary">
                              Required for wallet connection and security features
                            </p>
                            <p className="mobbin-caption text-text-secondary mt-1">
                              <strong>Retention:</strong> Session-based (deleted when browser closes)
                            </p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full mobbin-caption font-medium">
                          Always Active
                        </div>
                      </div>
                    </div>

                    {/* Preference Cookies */}
                    <div className="p-4 bg-background-secondary rounded-xl border border-border-primary">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Settings className="w-5 h-5 text-blue-500" />
                          <div>
                            <h5 className="mobbin-body font-medium text-text-primary">Preference Cookies</h5>
                            <p className="mobbin-caption text-text-secondary">
                              Remember your UI settings and alert preferences
                            </p>
                            <p className="mobbin-caption text-text-secondary mt-1">
                              <strong>Retention:</strong> Up to 1 year
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePreference('preferences')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.preferences ? 'bg-primary-700' : 'bg-gray-300'
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
                    <div className="p-4 bg-background-secondary rounded-xl border border-border-primary">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-purple-500" />
                          <div>
                            <h5 className="mobbin-body font-medium text-text-primary">Analytics Cookies</h5>
                            <p className="mobbin-caption text-text-secondary">
                              Anonymous usage data to improve our service
                            </p>
                            <p className="mobbin-caption text-text-secondary mt-1">
                              <strong>Retention:</strong> Up to 2 years
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePreference('analytics')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.analytics ? 'bg-primary-700' : 'bg-gray-300'
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
                      className="flex-1 px-6 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors mobbin-body font-medium"
                    >
                      Save Preferences
                    </button>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="px-6 py-3 border border-border-primary text-text-primary rounded-lg hover:bg-background-secondary transition-colors mobbin-body font-medium"
                    >
                      Back
                    </button>
                  </div>

                  {/* User Rights */}
                  <div className="p-4 bg-background-secondary rounded-xl border border-border-primary">
                    <h5 className="mobbin-body font-medium text-text-primary mb-2">Your Rights</h5>
                    <ul className="space-y-1 mobbin-caption text-text-secondary">
                      <li>• Accept or reject non-essential cookies</li>
                      <li>• Delete existing cookies from your browser</li>
                      <li>• Be informed about what cookies we use</li>
                      <li>• Withdraw consent at any time</li>
                      <li>• Request data deletion or portability</li>
                    </ul>
                  </div>

                  {/* Policy Links */}
                  <div className="pt-4 border-t border-border-primary">
                    <p className="mobbin-caption text-text-secondary text-center mb-3">
                      Learn more about our policies:
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <a 
                        href="/terms" 
                        className="text-primary-700 hover:text-primary-800 underline mobbin-caption"
                      >
                        Terms of Use
                      </a>
                      <a 
                        href="/privacy" 
                        className="text-primary-700 hover:text-primary-800 underline mobbin-caption"
                      >
                        Privacy Policy
                      </a>
                      <a 
                        href="/cookies" 
                        className="text-primary-700 hover:text-primary-800 underline mobbin-caption"
                      >
                        Cookie Policy
                      </a>
                    </div>
                    <p className="mobbin-caption text-text-secondary text-center mt-3">
                      Questions? Contact us at{' '}
                      <a href="mailto:legal.support@allowanceguard.com" className="text-primary-700 hover:text-primary-800 underline">
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
