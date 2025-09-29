'use client'
import { Shield, CheckCircle, DollarSign, Trash2, Monitor, Search, Filter, Lightbulb, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function SearchGuidance() {
  return (
    <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8">
      {/* Security Checklist Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 sm:p-6 md:p-8 border border-amber-200">
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-4 sm:mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800 mb-2 sm:mb-3">Your Proactive Security Checklist: Essential Habits for Safe Token Management</h2>
            <p className="text-sm sm:text-base text-amber-700 mb-4 sm:mb-6">
              True crypto security isn&apos;t about a single action; it&apos;s about building smart, consistent habits. By integrating these best practices into your routine, you can significantly reduce your risk exposure and protect your digital assets from emerging threats.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-amber-200">
            <div className="flex items-start gap-3 mb-3 sm:mb-4">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <h3 className="text-base sm:text-lg font-semibold text-amber-800">1. The &apos;Trust but Verify&apos; Mantra: Always Vet Contracts First</h3>
            </div>
            <p className="text-xs sm:text-sm text-amber-700">
              Before you even consider granting an approval, your first step should be to investigate the token contract itself. Think of it as checking the foundation of a house before you buy it. Use our tool to look up the contract address and ensure it aligns with the official project information.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 border border-amber-200">
            <div className="flex items-start gap-3 mb-3 sm:mb-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <h3 className="text-base sm:text-lg font-semibold text-amber-800">2. Look for the Green Flags: Prioritize Verified Tokens</h3>
            </div>
            <p className="text-xs sm:text-sm text-amber-700">
              A verified token contract, which has its source code publicly available on a block explorer, is a critical sign of transparency. Furthermore, always cross-reference with the project&apos;s official website and active social media channels (like Twitter and Discord).
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 border border-amber-200">
            <div className="flex items-start gap-3 mb-3 sm:mb-4">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <h3 className="text-base sm:text-lg font-semibold text-amber-800">3. Limit Your Exposure: Avoid Unlimited Approvals</h3>
            </div>
            <p className="text-xs sm:text-sm text-amber-700">
              When a dApp allows it, always choose to set a specific spending limit rather than granting an unlimited approval. This is the difference between giving a friend £20 for lunch versus giving them your entire bank card and PIN.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 border border-amber-200">
            <div className="flex items-start gap-3 mb-3 sm:mb-4">
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <h3 className="text-base sm:text-lg font-semibold text-amber-800">4. Practice Good Digital Hygiene: Regular Reviews</h3>
            </div>
            <p className="text-xs sm:text-sm text-amber-700">
              Don&apos;t let old, unused approvals linger. Every active approval represents a potential entry point for an exploit. Make it a monthly habit to visit your Allowance Guard dashboard and revoke any that you no longer need.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg p-6 border border-amber-200">
          <div className="flex items-center gap-3 mb-3">
            <Monitor className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-800">5. Maintain Situational Awareness: Use Your Dashboard as a Command Center</h3>
          </div>
          <p className="text-sm text-amber-700">
            Our <Link href="/" className="text-primary-accent hover:underline font-medium">main dashboard</Link> is more than just a list; it&apos;s your security command center. It gives you a single, unified view of every approval across your wallet. Use it to monitor your exposure in real-time, identify high-risk permissions, and take immediate action to secure your assets.
          </p>
        </div>
      </div>

      {/* Search Guide Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Search className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-800 mb-3">Mastering the Tool: A Guide to Effective Token Discovery</h2>
            <p className="text-blue-700 mb-6">
              Unlock the full potential of our platform with these powerful search tips and filters. Find exactly what you&apos;re looking for with speed and precision.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              How to Search: Finding Any Token with Precision
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Our intelligent search bar understands multiple query types to help you pinpoint any token:
            </p>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>By Full Name:</strong> Simply type the token&apos;s complete name, like USDC Coin, Tether, or Uniswap.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>By Symbol/Ticker:</strong> For faster results, use the common ticker, such as USDC, USDT, UNI, or WETH.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>By Contract Address:</strong> This is the most secure and accurate method. Paste the token&apos;s contract address to eliminate any chance of interacting with a counterfeit.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>By Partial Match:</strong> Not sure of the exact name? You can search for keywords. For example, typing &quot;stable&quot; will surface a list of major stablecoins.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              Refine Your Results: Using Filters to Cut Through the Noise
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Once you search, use our powerful filters to narrow down the results and focus on what matters most:
            </p>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Verified Only:</strong> Your safest default setting. This toggle instantly hides unverified, high-risk tokens from your search results.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Smart Search:</strong> Don&apos;t worry about typos. Our smart algorithm can find the token you&apos;re looking for even if you misspell the name.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Categories:</strong> Looking for a specific type of asset? Filter the list by popular categories like DeFi, Stablecoin, NFT, Gaming, and more.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Blockchain:</strong> Isolate your search to a specific network. Choose Ethereum, Polygon, BNB Chain, or any other supported blockchain for targeted results.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pro Tip Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Pro-Tip for Maximum Security</h2>
            <p className="text-green-700 mb-4">
              Always start your search with the &apos;Verified Only&apos; filter enabled. This is the single most effective step you can take to reduce your initial risk. While our smart search is excellent for discovery, your final decision to grant an approval should always be based on confirming the token&apos;s verification status and cross-referencing its official website and community channels.
            </p>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-800 font-medium">
                  Never trust a token based on its name or logo alone. Always verify through official channels and our comprehensive database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
