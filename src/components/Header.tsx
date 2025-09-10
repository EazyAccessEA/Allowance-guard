'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 relative">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-gray-900 font-semibold text-lg">Allowance Guard</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/docs" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Docs
            </Link>
            <Link 
              href="/faq" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              FAQ
            </Link>
            <Link 
              href="/preferences" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Preferences
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/docs" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <Link 
                href="/faq" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/preferences" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preferences
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
