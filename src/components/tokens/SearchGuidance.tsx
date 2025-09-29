'use client'
import { Info, Lightbulb, Search, Filter } from 'lucide-react'

export default function SearchGuidance() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-primary mb-3">Search Tips & Examples</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-primary-accent" />
                What to Search For
              </h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• <strong>Token names:</strong> &ldquo;USD Coin&rdquo;, &ldquo;Tether&rdquo;, &ldquo;Uniswap&rdquo;</li>
                <li>• <strong>Symbols:</strong> &ldquo;USDC&rdquo;, &ldquo;USDT&rdquo;, &ldquo;UNI&rdquo;, &ldquo;WETH&rdquo;</li>
                <li>• <strong>Contract addresses:</strong> &ldquo;0xa0b86a33e6c3c5c5c5c5c5c5c5c5c5c5c5c5c5c5&rdquo;</li>
                <li>• <strong>Partial matches:</strong> &ldquo;stable&rdquo; (finds stablecoins)</li>
                <li>• <strong>Smart search:</strong> Works even with typos or partial names</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-accent" />
                Filter Options
              </h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• <strong>Verified only:</strong> Show only verified, legitimate tokens</li>
                <li>• <strong>Smart matching:</strong> Find tokens even with typos</li>
                <li>• <strong>Categories:</strong> Filter by DeFi, stablecoins, NFTs, etc.</li>
                <li>• <strong>Blockchain:</strong> Search specific networks</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Pro Tip</h4>
                <p className="text-sm text-amber-700">
                  Start with verified tokens only for safety. Our smart search works even if you&apos;re not sure of the exact spelling. 
                  Always check the verification status and official website before granting approvals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
