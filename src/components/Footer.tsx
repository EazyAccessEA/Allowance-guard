'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Twitter } from 'lucide-react'
import DonationButton from './DonationButton'

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
    <footer className="bg-warm-gray border-t border-gray-200">
      {/* Fireart-Style Newsletter Section */}
      <div className="bg-platinum border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center">
            <h3 className="fireart-heading-3 mb-4">
              Stay updated with Allowance Guard
            </h3>
            <p className="fireart-body-large text-charcoal mb-8">
              Get the latest security tips and product updates.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fireart-input flex-1"
                required
              />
              <button
                type="submit"
                className="fireart-button"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            
            {subscribed && (
              <div className="fireart-body text-emerald mt-4">
                Successfully subscribed!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fireart-Style Main Footer Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Product */}
          <div>
            <h4 className="fireart-heading-3 mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="/docs" className="fireart-body text-charcoal hover:text-obsidian transition-colors">Documentation</a></li>
              <li><a href="/faq" className="fireart-body text-charcoal hover:text-obsidian transition-colors">FAQ</a></li>
              <li><a href="/security" className="fireart-body text-charcoal hover:text-obsidian transition-colors">Security</a></li>
              <li><a href="/features" className="fireart-body text-charcoal hover:text-obsidian transition-colors">Features</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="fireart-heading-3 mb-6">Support</h4>
            <ul className="space-y-4">
              <li><a href="/preferences" className="fireart-body text-charcoal hover:text-obsidian transition-colors">Preferences</a></li>
              <li><a href="/unsubscribe" className="fireart-body text-charcoal hover:text-obsidian transition-colors">Unsubscribe</a></li>
              <li><a href="/contact" className="fireart-body text-charcoal hover:text-obsidian transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="fireart-heading-3 mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="/terms" className="fireart-body text-charcoal hover:text-obsidian transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="fireart-body text-charcoal hover:text-obsidian transition-colors">Privacy Policy</a></li>
              <li><a href="/cookies" className="fireart-body text-charcoal hover:text-obsidian transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="fireart-heading-3 mb-6">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://twitter.com/allowanceguard"
                  className="fireart-body text-charcoal hover:text-obsidian transition-colors flex items-center gap-2"
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
                  className="fireart-body text-charcoal hover:text-obsidian transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
            
            {/* Donation Button */}
            <div className="mt-6">
              <DonationButton />
            </div>
          </div>
        </div>

        {/* Fireart-Style Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 relative">
                <Image
                  src="/AG_Logo2.png"
                  alt="Allowance Guard"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="fireart-caption">
                © 2025 Allowance Guard. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
