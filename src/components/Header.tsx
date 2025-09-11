'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-xl font-semibold text-gray-900">Allowance Guard</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/docs" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Documentation
            </Link>
            <Link 
              href="/faq" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              FAQ
            </Link>
            <Link 
              href="/preferences" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Preferences
            </Link>
            <Link 
              href="/contact" 
              className="bg-cobalt text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/docs" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link 
                href="/faq" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/preferences" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preferences
              </Link>
              <Link 
                href="/contact" 
                className="bg-cobalt text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 inline-block w-fit"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
