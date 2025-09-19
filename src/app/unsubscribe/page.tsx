'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CheckCircle, AlertCircle, Mail, Bell, Shield, X } from 'lucide-react'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [unsubscribeType, setUnsubscribeType] = useState<'all' | 'alerts' | 'digest' | 'marketing'>('all')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check for email in URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [])

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      // In a real app, you'd call your API here
      // await fetch('/api/unsubscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, type: unsubscribeType })
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setStatus('success')
      setMessage(`Successfully unsubscribed from ${getUnsubscribeTypeText()}.`)
      
      // Clear form after success
      setTimeout(() => {
        setEmail('')
        setUnsubscribeType('all')
        setStatus('idle')
        setMessage('')
      }, 5000)
    } catch {
      setStatus('error')
      setMessage('Failed to unsubscribe. Please try again or contact support.')
    }
  }

  const getUnsubscribeTypeText = () => {
    switch (unsubscribeType) {
      case 'all': return 'all notifications'
      case 'alerts': return 'security alerts'
      case 'digest': return 'daily digest emails'
      case 'marketing': return 'marketing emails'
      default: return 'notifications'
    }
  }

  const unsubscribeOptions = [
    {
      id: 'all',
      title: 'All Notifications',
      description: 'Stop receiving all emails from Allowance Guard',
      icon: X,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'alerts',
      title: 'Security Alerts Only',
      description: 'Keep daily digest but stop receiving immediate security alerts',
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'digest',
      title: 'Daily Digest Only',
      description: 'Keep security alerts but stop receiving daily summary emails',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'marketing',
      title: 'Marketing Emails Only',
      description: 'Keep security notifications but stop receiving product updates',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex items-center justify-center">
            <div className="relative w-12 h-12 mr-3">
              <Image
                src="/AG_Logo2.png"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Allowance Guard</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Unsubscribe</h1>
          <p className="text-gray-600">
            We&apos;re sorry to see you go. Choose what you&apos;d like to unsubscribe from below.
          </p>
        </div>

        <form onSubmit={handleUnsubscribe} className="space-y-8">
          {/* Email Input */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Mail className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Email Address</h2>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Enter the email address you want to unsubscribe
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                This must be the exact email address you used to subscribe.
              </p>
            </div>
          </div>

          {/* Unsubscribe Options */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What would you like to unsubscribe from?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unsubscribeOptions.map((option) => {
                const Icon = option.icon
                return (
                  <label
                    key={option.id}
                    className={`relative cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      unsubscribeType === option.id
                        ? `${option.borderColor} ${option.bgColor}`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="unsubscribeType"
                      value={option.id}
                      checked={unsubscribeType === option.id}
                      onChange={(e) => setUnsubscribeType(e.target.value as 'all' | 'alerts' | 'digest' | 'marketing')}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <Icon className={`w-5 h-5 mt-0.5 mr-3 ${option.color}`} />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          {option.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    {unsubscribeType === option.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </label>
                )
              })}
            </div>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center ${
              status === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {message}
            </div>
          )}

          {/* Unsubscribe Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-cobalt hover:bg-cobalt/90 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center"
            >
              {status === 'loading' ? (
                <>
                  <svg className="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Unsubscribe
                </>
              )}
            </button>
          </div>
        </form>

        {/* Alternative Options */}
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Options</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Change Your Preferences Instead</h4>
              <p className="text-sm text-gray-600 mb-3">
                Don&apos;t want to unsubscribe completely? You can adjust your notification preferences to receive only what you want.
              </p>
              <a 
                href="/preferences" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Manage Preferences
              </a>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-3">
                If you&apos;re having trouble unsubscribing or have questions, our support team is here to help.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-2">Important Security Notice</h4>
              <p className="text-sm text-yellow-700">
                If you unsubscribe from security alerts, you may not be notified of potentially dangerous token approvals. 
                We recommend keeping at least daily digest emails enabled for your wallet security.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Allowance Guard. All rights reserved.
            </p>
            <div className="mt-4 space-x-6">
              <a href="/terms" className="text-blue-600 hover:text-blue-800 text-sm">Terms of Service</a>
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 text-sm">Privacy Policy</a>
              <a href="/cookies" className="text-blue-600 hover:text-blue-800 text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}