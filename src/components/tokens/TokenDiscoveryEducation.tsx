'use client'
import { Shield, Search, AlertTriangle, CheckCircle, Eye, Lock, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function TokenDiscoveryEducation() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Before You Click &apos;Approve&apos;: Why Token Discovery is Non-Negotiable for Your Crypto Security
          </h1>
          <p className="text-lg text-text-secondary max-w-4xl mx-auto">
            In the fast-paced world of DeFi, Web3 gaming, and NFTs, clicking &quot;approve&quot; on a token interaction can feel like a routine step. But behind that simple click lies a critical security decision—one that could grant a smart contract unlimited, permanent access to your crypto assets. Malicious actors thrive on this complacency. This is where proactive token discovery isn&apos;t just a helpful feature—it&apos;s your first and most crucial line of defense.
          </p>
        </div>

        {/* Hidden Dangers Section */}
        <div className="bg-white rounded-xl p-8 border border-red-100 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">The Hidden Dangers: Understanding Token Approval Risks</h2>
              <p className="text-red-700 mb-6">
                Granting a token approval is like giving a valet the keys to your car. But what if the valet is a thief? Approving a malicious contract can lead to a total loss of funds. Here are the primary threats you face:
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🚨</span>
                <h3 className="text-lg font-semibold text-red-800">The Phantom Menace: Wallet-Draining Scam Tokens</h3>
              </div>
              <p className="text-sm text-red-700">
                These are contracts engineered with one purpose: to steal your funds. Once you grant approval, they can execute a function to transfer your tokens—like USDC, WETH, or your favorite altcoins—directly out of your wallet without any further action from you.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">❓</span>
                <h3 className="text-lg font-semibold text-red-800">The Unseen Vulnerability: Unverified Contracts</h3>
              </div>
              <p className="text-sm text-red-700">
                An unverified contract on a block explorer means its source code is hidden. You have no way of knowing what hidden functions exist. Approving these is a leap of faith into the dark, exposing you to potential backdoors and hidden exploits.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎭</span>
                <h3 className="text-lg font-semibold text-red-800">The Deceptive Twin: Sophisticated Fake Tokens</h3>
              </div>
              <p className="text-sm text-red-700">
                Scammers create tokens that perfectly mimic the name, symbol, and logo of legitimate, popular projects. You might think you&apos;re interacting with a trusted DeFi protocol, but you&apos;re actually approving a counterfeit designed to compromise your security.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⛓️</span>
                <h3 className="text-lg font-semibold text-red-800">The Open Vault: Unlimited, Non-Expiring Approvals</h3>
              </div>
              <p className="text-sm text-red-700">
                Many dApps request unlimited (max_uint256) approvals for convenience. While often safe with reputable protocols, this permission never expires. If that protocol is ever exploited—even years later—your approved funds are at immediate risk. It&apos;s like leaving a signed, blank check on the table forever.
              </p>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className="bg-white rounded-xl p-8 border border-green-100 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">Your Shield in the Digital Wild: The Allowance Guard Solution</h2>
              <p className="text-green-700 mb-6">
                Knowledge is your best defense. We provide the tools to research and vet any token before you grant it access to your assets. Our platform is built to give you peace of mind and full control.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Establish Trust: Verify Token Authenticity</h3>
              </div>
              <p className="text-sm text-green-700">
                Go beyond the name and symbol. We help you confirm the genuine contract address, check for verified source code, and ensure you&apos;re interacting with the legitimate token, not a clever imitation.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">See the Full Picture: Check Security Status</h3>
              </div>
              <p className="text-sm text-green-700">
                Our system aggregates crucial security data. Instantly see if a contract is verified, view its risk score based on known vulnerabilities, and understand the potential security implications before you connect your wallet.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Gain Clarity: Understand Token Categories</h3>
              </div>
              <p className="text-sm text-green-700">
                Is this a stablecoin, a governance token for a major DAO, or a newly launched meme coin? Understanding a token&apos;s purpose and ecosystem provides critical context, helping you gauge its legitimacy and associated risks.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">Act with Confidence: Make Informed Decisions</h3>
              </div>
              <p className="text-sm text-green-700">
                By combining all this information into a clear, easy-to-understand dashboard, we empower you to move from uncertainty to confident action. Connect, approve, and transact with the assurance that you&apos;ve done your due diligence.
              </p>
            </div>
          </div>
        </div>

        {/* 3-Step Process */}
        <div className="bg-white rounded-xl p-8 border border-blue-100">
          <div className="flex items-start gap-4 mb-6">
            <Search className="w-8 h-8 text-blue-500 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Your 3-Step Path to Secure Token Approvals</h2>
              <p className="text-blue-700 mb-6">
                We&apos;ve made comprehensive security analysis incredibly simple.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <h3 className="text-lg font-semibold text-blue-800">Search for Any Token</h3>
              </div>
              <p className="text-sm text-blue-700">
                Use our powerful, smart search engine to instantly find any token by its name, symbol, or contract address. Our database spans multiple blockchains, including Ethereum, BNB Chain, Polygon, Arbitrum, and more, ensuring wide coverage.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <h3 className="text-lg font-semibold text-blue-800">Review In-Depth Token Details</h3>
              </div>
              <p className="text-sm text-blue-700">
                Dive into a rich, detailed report for your selected token. You&apos;ll get instant access to its verification status, security information, risk factors, token categories, and verified links to official websites, social media, and block explorers.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <h3 className="text-lg font-semibold text-blue-800">Make Safe, Informed Decisions</h3>
              </div>
              <p className="text-sm text-blue-700">
                Armed with this comprehensive, unbiased data, you are now in full control. Use this information to confidently decide whether to grant a token approval, reject it, or revoke an existing one. Protect your assets by making every approval a conscious, informed choice.
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-primary-accent/5 to-blue-50 rounded-lg border border-primary-accent/20">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-6 h-6 text-primary-accent" />
              <h4 className="text-lg font-semibold text-primary-accent">Ready to Secure Your Approvals?</h4>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Don&apos;t let another approval be a blind leap of faith. Use our <Link href="/" className="text-primary-accent hover:underline font-medium">main dashboard</Link> to monitor your existing approvals and take control of your crypto security today.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}