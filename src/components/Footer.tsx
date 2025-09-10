'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    // Here you would typically call an API to subscribe the user
    console.log('Subscribing email:', email)
    setSubscribed(true)
    setEmail('')
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubscribed(false), 3000)
  }


  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
              Stay updated with Allowance Guard
            </h3>
            <p className="text-gray-600 mb-6">
              Get the latest security tips and product updates.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            
            {subscribed && (
              <div className="text-sm text-green-600 font-medium mt-4">
                Successfully subscribed!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Product */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="/docs" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</a></li>
              <li><a href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a></li>
              <li><a href="/security" className="text-gray-600 hover:text-gray-900 transition-colors">Security</a></li>
              <li><a href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="/preferences" className="text-gray-600 hover:text-gray-900 transition-colors">Preferences</a></li>
              <li><a href="/unsubscribe" className="text-gray-600 hover:text-gray-900 transition-colors">Unsubscribe</a></li>
              <li><a href="mailto:support@allowanceguard.com" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a></li>
              <li><a href="/cookies" className="text-gray-600 hover:text-gray-900 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://twitter.com/allowanceguard"
                  className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/EazyAccessEA/Allowance-guard"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image
                  src="/AG_Logo2.png"
                  alt="Allowance Guard"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-gray-600">
                © 2025 Allowance Guard. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
