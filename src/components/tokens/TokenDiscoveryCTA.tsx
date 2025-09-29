'use client'
import { Shield, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function TokenDiscoveryCTA() {
  return (
    <div className="bg-gradient-to-r from-primary-accent/5 to-blue-50 rounded-2xl p-8 mt-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 bg-primary-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-primary-accent" />
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Ready to Secure Your Token Approvals?
        </h2>
        
        <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
          Now that you&apos;ve discovered tokens, it&apos;s time to check your existing approvals and revoke any unnecessary ones. 
          Keep your wallet secure with our comprehensive approval management tools.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-primary-accent/20">
            <div className="w-12 h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-bold text-primary-accent">1</span>
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Connect Your Wallet</h3>
            <p className="text-sm text-text-secondary">
              Securely connect your wallet to view your current token approvals
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-primary-accent/20">
            <div className="w-12 h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-bold text-primary-accent">2</span>
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Review Approvals</h3>
            <p className="text-sm text-text-secondary">
              See all your token approvals with detailed information and risk assessment
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-primary-accent/20">
            <div className="w-12 h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-bold text-primary-accent">3</span>
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Revoke Safely</h3>
            <p className="text-sm text-text-secondary">
              Revoke unnecessary or suspicious approvals with one click
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-accent text-white rounded-lg font-medium hover:bg-primary-accent/90 transition-colors"
          >
            <Shield className="w-5 h-5" />
            Check My Approvals
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link 
            href="/docs" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-accent border border-primary-accent rounded-lg font-medium hover:bg-primary-accent/5 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Learn More
          </Link>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">100% Free & Open Source</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            No private keys required • Read-only access • No subscriptions
          </p>
        </div>
      </div>
    </div>
  )
}
