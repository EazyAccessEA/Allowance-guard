'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AG</span>
            </div>
            <span className="text-white font-semibold text-lg">Allowance Guard</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/docs" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Docs
            </Link>
            <Link 
              href="/preferences" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Preferences
            </Link>
            <Link 
              href="/unsubscribe" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Unsubscribe
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
