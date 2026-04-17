'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CheckCircle, AlertCircle, Mail, Bell, Shield, Settings } from 'lucide-react'

export default function PreferencesPage() {
  const [email, setEmail] = useState('')
  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    riskOnly: true,
    dailyDigest: true,
    weeklySummary: false,
    slackAlerts: false,
    webhookUrl: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Load existing preferences if user is logged in
    const savedEmail = localStorage.getItem('ag.userEmail')
    const savedPrefs = localStorage.getItem('ag.preferences')

    if (savedEmail) setEmail(savedEmail)
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs))
      } catch (e) {
        console.error('Error loading preferences:', e)
      }
    }
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      // Save to localStorage for demo
      localStorage.setItem('ag.userEmail', email)
      localStorage.setItem('ag.preferences', JSON.stringify(preferences))

      // In a real app, you'd call your API here
      // await fetch('/api/preferences', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, preferences })
      // })

      setStatus('success')
      setMessage('Your preferences have been saved successfully!')

      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 3000)
    } catch {
      setStatus('error')
      setMessage('Failed to save preferences. Please try again.')
    }
  }

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-paper-deep">
      {/* Header */}
      <header className="bg-paper-deep border-b border-ink-rule">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex items-center justify-center">
            <div className="relative w-12 h-12 mr-3">
              <Image src="/images/branding/ag-logo-ink.png" alt="" fill className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-ink">Allowance Guard</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-4">Notification Preferences</h1>
          <p className="text-ink-muted">
            Manage how and when you receive security alerts and updates from Allowance Guard.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Email Settings */}
          <div className="bg-paper-deep border border-ink-rule rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Mail className="w-5 h-5 text-ink-blue mr-2" />
              <h2 className="text-xl font-semibold text-ink">Email Settings</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink-soft mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 min-h-[44px] border border-ink-rule rounded-lg bg-paper-sub text-ink focus:ring-2 focus:ring-amber-deep focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                />
                <p className="text-sm text-ink-whisper mt-1">
                  We&apos;ll use this to send you security alerts and updates.
                </p>
              </div>
            </div>
          </div>

          {/* Alert Preferences */}
          <div className="bg-paper-deep border border-ink-rule rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-semantic-success-700 mr-2" />
              <h2 className="text-xl font-semibold text-ink">Alert Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between min-h-[44px]">
                <div>
                  <h3 className="text-sm font-medium text-ink">Email Alerts</h3>
                  <p className="text-sm text-ink-whisper">Receive security alerts via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer min-w-[44px] min-h-[44px] justify-center">
                  <input
                    type="checkbox"
                    checked={preferences.emailAlerts}
                    onChange={(e) => handlePreferenceChange('emailAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-paper-sub peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-deep/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[2px] after:bg-white after:border-ink-rule after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-deep"></div>
                </label>
              </div>

              <div className="flex items-center justify-between min-h-[44px]">
                <div>
                  <h3 className="text-sm font-medium text-ink">Risk-Only Alerts</h3>
                  <p className="text-sm text-ink-whisper">Only receive alerts for high-risk approvals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer min-w-[44px] min-h-[44px] justify-center">
                  <input
                    type="checkbox"
                    checked={preferences.riskOnly}
                    onChange={(e) => handlePreferenceChange('riskOnly', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-paper-sub peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-deep/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[2px] after:bg-white after:border-ink-rule after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-deep"></div>
                </label>
              </div>

              <div className="flex items-center justify-between min-h-[44px]">
                <div>
                  <h3 className="text-sm font-medium text-ink">Daily Digest</h3>
                  <p className="text-sm text-ink-whisper">Receive a daily summary of your wallet status</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer min-w-[44px] min-h-[44px] justify-center">
                  <input
                    type="checkbox"
                    checked={preferences.dailyDigest}
                    onChange={(e) => handlePreferenceChange('dailyDigest', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-paper-sub peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-deep/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[2px] after:bg-white after:border-ink-rule after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-deep"></div>
                </label>
              </div>

              <div className="flex items-center justify-between min-h-[44px]">
                <div>
                  <h3 className="text-sm font-medium text-ink">Weekly Summary</h3>
                  <p className="text-sm text-ink-whisper">Receive a weekly overview of your security status</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer min-w-[44px] min-h-[44px] justify-center">
                  <input
                    type="checkbox"
                    checked={preferences.weeklySummary}
                    onChange={(e) => handlePreferenceChange('weeklySummary', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-paper-sub peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-deep/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[2px] after:bg-white after:border-ink-rule after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-deep"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Slack Integration */}
          <div className="bg-paper-deep border border-ink-rule rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Settings className="w-5 h-5 text-amber-deep mr-2" />
              <h2 className="text-xl font-semibold text-ink">Slack Integration</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between min-h-[44px]">
                <div>
                  <h3 className="text-sm font-medium text-ink">Slack Alerts</h3>
                  <p className="text-sm text-ink-whisper">Receive alerts in your Slack workspace</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer min-w-[44px] min-h-[44px] justify-center">
                  <input
                    type="checkbox"
                    checked={preferences.slackAlerts}
                    onChange={(e) => handlePreferenceChange('slackAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-paper-sub peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-deep/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[2px] after:bg-white after:border-ink-rule after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-deep"></div>
                </label>
              </div>

              {preferences.slackAlerts && (
                <div>
                  <label htmlFor="webhook" className="block text-sm font-medium text-ink-soft mb-2">
                    Slack Webhook URL
                  </label>
                  <input
                    type="url"
                    id="webhook"
                    value={preferences.webhookUrl}
                    onChange={(e) => handlePreferenceChange('webhookUrl', e.target.value)}
                    className="w-full px-4 py-3 min-h-[44px] border border-ink-rule rounded-lg bg-paper-sub text-ink focus:ring-2 focus:ring-amber-deep focus:border-transparent"
                    placeholder="https://hooks.slack.com/services/..."
                  />
                  <p className="text-sm text-ink-whisper mt-1">
                    <a href="/docs" className="text-amber-deep hover:underline">
                      Learn how to set up Slack webhooks
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center ${
              status === 'success'
                ? 'bg-paper-sub border border-semantic-success-600/40 text-semantic-success-700'
                : 'bg-paper-sub border border-crimson-paper/40 text-crimson-paper'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 min-h-[44px] bg-amber-deep hover:bg-amber-deep/90 disabled:opacity-50 text-paper font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-deep focus:ring-offset-2 focus:ring-offset-paper flex items-center disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <svg className="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-12 bg-paper-sub border border-ink-rule rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-ink-muted mr-2" />
            <h3 className="text-lg font-semibold text-ink">Need Help?</h3>
          </div>
          <p className="text-ink-muted mb-4">
            If you have questions about your notification preferences or need assistance, we&apos;re here to help.
          </p>
          <div className="space-y-2">
            <a href="/contact" className="text-amber-deep hover:underline text-sm">
              Contact Support
            </a>
            <span className="text-ink-whisper mx-2">•</span>
            <a href="/faq" className="text-amber-deep hover:underline text-sm">
              FAQ
            </a>
            <span className="text-ink-whisper mx-2">•</span>
            <a href="/docs" className="text-amber-deep hover:underline text-sm">
              Documentation
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-paper-sub border-t border-ink-rule mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="text-center">
            <p className="text-ink-muted text-sm">
              © {new Date().getFullYear()} Allowance Guard. All rights reserved.
            </p>
            <div className="mt-4 space-x-6">
              <a href="/terms" className="text-amber-deep hover:underline text-sm">Terms of Service</a>
              <a href="/privacy" className="text-amber-deep hover:underline text-sm">Privacy Policy</a>
              <a href="/cookies" className="text-amber-deep hover:underline text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
