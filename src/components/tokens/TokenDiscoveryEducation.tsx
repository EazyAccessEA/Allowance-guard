'use client'
import { Shield, Search, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function TokenDiscoveryEducation() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-accent" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            Why Token Discovery Matters for Your Security
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Before granting token approvals, it&apos;s crucial to understand what tokens you&apos;re interacting with. 
            Our comprehensive database helps you make informed security decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Problem Statement */}
          <div className="bg-white rounded-xl p-6 border border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">The Problem</h3>
            </div>
            <div className="space-y-3 text-text-secondary">
              <p>Token approvals can be dangerous if granted to malicious contracts:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Scam tokens that drain your wallet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Unverified tokens with unknown security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Fake tokens that look like legitimate ones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Unlimited approvals that never expire</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Solution */}
          <div className="bg-white rounded-xl p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Our Solution</h3>
            </div>
            <div className="space-y-3 text-text-secondary">
              <p>Research tokens before granting approvals:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Verify token authenticity and legitimacy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Check verification status and security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Understand token categories and use cases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Make informed decisions before connecting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">How to Use This Tool</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-primary-accent">1</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Search for Tokens</h4>
              <p className="text-sm text-text-secondary">
                Use fuzzy search to find tokens by name, symbol, or contract address across multiple blockchains
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-primary-accent">2</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Review Token Details</h4>
              <p className="text-sm text-text-secondary">
                Check verification status, security information, categories, and official websites
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-primary-accent">3</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Make Informed Decisions</h4>
              <p className="text-sm text-text-secondary">
                Use this information to decide whether to grant token approvals safely
              </p>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Security Best Practices</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Always verify token contracts before granting approvals</li>
                <li>• Check if tokens are verified and have official websites</li>
                <li>• Be cautious with unlimited approvals - set spending limits when possible</li>
                <li>• Regularly review and revoke unnecessary token approvals</li>
                <li>• Use our <Link href="/" className="text-primary-accent hover:underline">main dashboard</Link> to monitor your existing approvals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
