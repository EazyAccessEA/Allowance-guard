'use client'

import { useState } from 'react'
import { Copy, Check, Code, Package, Globe, Zap, Shield } from 'lucide-react'
import AllowanceGuardWidget from '@/components/AllowanceGuardWidget'

const heading = { fontFamily: 'Space Grotesk, system-ui, sans-serif' }

export default function IntegrationPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative">
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-amber-400 rounded-md transition-colors"
      >
        {copiedCode === id ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="bg-[#0A0E1A] border border-slate-700/50 text-slate-300 p-6 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )

  const reactWidgetCode = `import React from 'react'
import AllowanceGuardWidget from 'allowance-guard-widget'

function MyApp() {
  return (
    <div>
      <h1>My DeFi App</h1>

      {/* Embed AllowanceGuard Widget */}
      <AllowanceGuardWidget
        walletAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        chainId={1}
        showRiskOnly={true}
        maxItems={5}
        theme="light"
        onAllowanceClick={(allowance) => {
          console.log('Allowance clicked:', allowance)
        }}
      />
    </div>
  )
}

export default MyApp`

  const htmlWidgetCode = `<!DOCTYPE html>
<html>
<head>
  <title>My DeFi App</title>
  <script src="https://unpkg.com/allowance-guard-widget@latest/dist/widget.js"></script>
</head>
<body>
  <h1>My DeFi App</h1>

  <!-- AllowanceGuard Widget -->
  <div id="allowance-guard-widget"></div>

  <script>
    // Initialize the widget
    AllowanceGuardWidget.init({
      container: '#allowance-guard-widget',
      walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      chainId: 1,
      showRiskOnly: true,
      maxItems: 5,
      theme: 'light',
      onAllowanceClick: (allowance) => {
        console.log('Allowance clicked:', allowance)
      }
    })
  </script>
</body>
</html>`

  const reactHooksCode = `import React, { useState, useEffect } from 'react'
import { useAllowances, useRiskAssessment, useNetworks } from 'allowance-guard-hooks'

function MyWalletComponent({ walletAddress }) {
  const { data: allowances, loading, error } = useAllowances({
    walletAddress,
    riskOnly: true,
    pageSize: 10
  })

  const { data: networks } = useNetworks()

  if (loading) return <div>Loading allowances...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Wallet Security Status</h2>
      <p>Supported networks: {networks?.supported.length || 0}</p>

      <div className="allowances-list">
        {allowances.map((allowance, index) => (
          <div key={index} className="allowance-item">
            <h3>{allowance.tokenName}</h3>
            <p>Spender: {allowance.spenderName}</p>
            <p>Risk Level: {allowance.riskLevel}</p>
            <p>Amount: {allowance.allowanceFormatted}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyWalletComponent`

  const nodeSDKCode = `const AllowanceGuardSDK = require('allowance-guard-sdk')

// Initialize the SDK
const sdk = new AllowanceGuardSDK({
  apiKey: process.env.ALLOWANCE_GUARD_API_KEY, // Optional
  timeout: 30000
})

async function checkWalletSecurity(walletAddress) {
  try {
    // Get allowances
    const allowances = await sdk.getAllowances(walletAddress, {
      riskOnly: true,
      pageSize: 50
    })

    // Analyze risk
    const criticalAllowances = allowances.data.filter(a => a.riskLevel >= 3)

    console.log(\`Found \${criticalAllowances.length} high-risk allowances\`)

    // Export report
    const csvData = await sdk.exportAllowances(walletAddress, 'csv')

    return {
      totalAllowances: allowances.data.length,
      criticalAllowances: criticalAllowances.length,
      csvData: csvData
    }
  } catch (error) {
    console.error('Error checking wallet security:', error)
    throw error
  }
}

// Usage
checkWalletSecurity('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
  .then(result => {
    console.log('Security check completed:', result)
  })
  .catch(error => {
    console.error('Security check failed:', error)
  })`

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#0F172A] to-[#0A0E1A]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 sm:py-32 text-left">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            style={heading}
          >
            Integration Guide
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-8">
            Integrate AllowanceGuard into your dApp, wallet, or service with our comprehensive toolkit.
            Choose from React hooks, embeddable widgets, or Node.js SDK.
          </p>
        </div>
      </section>

      {/* Integration Options */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl font-bold text-white mb-12 text-center"
            style={heading}
          >
            Choose Your Integration Method
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center mb-4">
                <Globe className="mr-3 text-amber-400" size={24} />
                <h3 className="text-lg font-semibold text-white" style={heading}>Embeddable Widget</h3>
              </div>
              <p className="text-slate-400 mb-4">
                Drop-in widget for any website. Works with React, Vue, Angular, or vanilla HTML.
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>&#8226; Zero configuration</li>
                <li>&#8226; Customizable themes</li>
                <li>&#8226; Real-time updates</li>
                <li>&#8226; Mobile responsive</li>
              </ul>
            </div>

            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center mb-4">
                <Zap className="mr-3 text-amber-400" size={24} />
                <h3 className="text-lg font-semibold text-white" style={heading}>React Hooks</h3>
              </div>
              <p className="text-slate-400 mb-4">
                Custom React hooks for seamless integration into React applications.
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>&#8226; TypeScript support</li>
                <li>&#8226; Automatic caching</li>
                <li>&#8226; Error handling</li>
                <li>&#8226; Real-time updates</li>
              </ul>
            </div>

            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center mb-4">
                <Package className="mr-3 text-amber-400" size={24} />
                <h3 className="text-lg font-semibold text-white" style={heading}>Node.js SDK</h3>
              </div>
              <p className="text-slate-400 mb-4">
                Full-featured SDK for backend services and server-side applications.
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>&#8226; Complete API coverage</li>
                <li>&#8226; Built-in retry logic</li>
                <li>&#8226; Data export features</li>
                <li>&#8226; Batch operations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Live Widget Demo */}
      <section className="py-16 border-t border-b border-slate-700/50 bg-slate-800/20">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-3xl font-bold text-white mb-8 text-center"
            style={heading}
          >
            Live Widget Demo
          </h2>
          <p className="text-center text-slate-400 mb-8">
            See the AllowanceGuard widget in action with real data.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4" style={heading}>All Allowances</h3>
              <AllowanceGuardWidget
                walletAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                chainId={1}
                showRiskOnly={false}
                maxItems={5}
                theme="light"
                compact={false}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4" style={heading}>High Risk Only</h3>
              <AllowanceGuardWidget
                walletAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                chainId={1}
                showRiskOnly={true}
                maxItems={5}
                theme="light"
                compact={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl font-bold text-white mb-12 text-center"
            style={heading}
          >
            Code Examples
          </h2>

          <div className="space-y-12">
            {/* React Widget */}
            <div>
              <div className="flex items-center mb-6">
                <Globe className="mr-3 text-amber-400" size={24} />
                <h3 className="text-xl font-semibold text-white" style={heading}>React Widget Integration</h3>
              </div>
              <p className="text-slate-400 mb-6">
                Install the widget package and embed it in your React application.
              </p>
              <CodeBlock code={reactWidgetCode} language="jsx" id="react-widget" />
            </div>

            {/* HTML Widget */}
            <div>
              <div className="flex items-center mb-6">
                <Code className="mr-3 text-amber-400" size={24} />
                <h3 className="text-xl font-semibold text-white" style={heading}>HTML/JavaScript Integration</h3>
              </div>
              <p className="text-slate-400 mb-6">
                Include the widget script and initialize it in any HTML page.
              </p>
              <CodeBlock code={htmlWidgetCode} language="html" id="html-widget" />
            </div>

            {/* React Hooks */}
            <div>
              <div className="flex items-center mb-6">
                <Zap className="mr-3 text-amber-400" size={24} />
                <h3 className="text-xl font-semibold text-white" style={heading}>React Hooks Integration</h3>
              </div>
              <p className="text-slate-400 mb-6">
                Use our custom hooks for more control over data fetching and state management.
              </p>
              <CodeBlock code={reactHooksCode} language="jsx" id="react-hooks" />
            </div>

            {/* Node.js SDK */}
            <div>
              <div className="flex items-center mb-6">
                <Package className="mr-3 text-amber-400" size={24} />
                <h3 className="text-xl font-semibold text-white" style={heading}>Node.js SDK Integration</h3>
              </div>
              <p className="text-slate-400 mb-6">
                Use the SDK in your backend services for comprehensive wallet security analysis.
              </p>
              <CodeBlock code={nodeSDKCode} language="javascript" id="node-sdk" />
            </div>
          </div>
        </div>
      </section>

      {/* Installation Instructions */}
      <section className="py-16 border-t border-b border-slate-700/50 bg-slate-800/20">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-3xl font-bold text-white mb-8 text-center"
            style={heading}
          >
            Installation &amp; Setup
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4" style={heading}>React Widget</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-100 mb-2">Installation:</p>
                  <pre className="bg-[#0A0E1A] border border-slate-700/50 text-slate-300 p-3 rounded-lg text-sm">npm install allowance-guard-widget</pre>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100 mb-2">Import:</p>
                  <pre className="bg-[#0A0E1A] border border-slate-700/50 text-slate-300 p-3 rounded-lg text-sm">import AllowanceGuardWidget from &apos;allowance-guard-widget&apos;</pre>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4" style={heading}>React Hooks</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-100 mb-2">Installation:</p>
                  <pre className="bg-[#0A0E1A] border border-slate-700/50 text-slate-300 p-3 rounded-lg text-sm">npm install allowance-guard-hooks</pre>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100 mb-2">Import:</p>
                  <pre className="bg-[#0A0E1A] border border-slate-700/50 text-slate-300 p-3 rounded-lg text-sm">import &#123; useAllowances &#125; from &apos;allowance-guard-hooks&apos;</pre>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4" style={heading}>Node.js SDK</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-100 mb-2">Installation:</p>
                  <pre className="bg-[#0A0E1A] border border-slate-700/50 text-slate-300 p-3 rounded-lg text-sm">npm install allowance-guard-sdk</pre>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100 mb-2">Import:</p>
                  <pre className="bg-[#0A0E1A] border border-slate-700/50 text-slate-300 p-3 rounded-lg text-sm">const AllowanceGuardSDK = require(&apos;allowance-guard-sdk&apos;)</pre>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4" style={heading}>HTML Widget</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-100 mb-2">CDN Script:</p>
                  <pre className="bg-[#0A0E1A] border border-slate-700/50 text-slate-300 p-3 rounded-lg text-sm overflow-x-auto">&lt;script src=&quot;https://unpkg.com/allowance-guard-widget@latest/dist/widget.js&quot;&gt;&lt;/script&gt;</pre>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100 mb-2">Initialize:</p>
                  <pre className="bg-[#0A0E1A] border border-slate-700/50 text-slate-300 p-3 rounded-lg text-sm">AllowanceGuardWidget.init(&#123;...&#125;)</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-3xl font-bold text-white mb-8 text-center"
            style={heading}
          >
            Best Practices
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
              <div className="flex items-center mb-4">
                <Shield className="mr-3 text-amber-400" size={20} />
                <h3 className="text-lg font-semibold text-white" style={heading}>Security</h3>
              </div>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>&#8226; Always validate wallet addresses client-side</li>
                <li>&#8226; Use HTTPS for all API requests</li>
                <li>&#8226; Implement proper error handling</li>
                <li>&#8226; Don&apos;t expose API keys in client-side code</li>
              </ul>
            </div>

            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
              <div className="flex items-center mb-4">
                <Zap className="mr-3 text-amber-400" size={20} />
                <h3 className="text-lg font-semibold text-white" style={heading}>Performance</h3>
              </div>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>&#8226; Use pagination for large datasets</li>
                <li>&#8226; Implement client-side caching</li>
                <li>&#8226; Debounce user input for search</li>
                <li>&#8226; Use appropriate page sizes</li>
              </ul>
            </div>

            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
              <div className="flex items-center mb-4">
                <Globe className="mr-3 text-amber-400" size={20} />
                <h3 className="text-lg font-semibold text-white" style={heading}>User Experience</h3>
              </div>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>&#8226; Show loading states during API calls</li>
                <li>&#8226; Provide clear error messages</li>
                <li>&#8226; Use consistent theming</li>
                <li>&#8226; Make widgets mobile-responsive</li>
              </ul>
            </div>

            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
              <div className="flex items-center mb-4">
                <Package className="mr-3 text-amber-400" size={20} />
                <h3 className="text-lg font-semibold text-white" style={heading}>Integration</h3>
              </div>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>&#8226; Test with multiple wallet addresses</li>
                <li>&#8226; Handle network switching gracefully</li>
                <li>&#8226; Implement proper TypeScript types</li>
                <li>&#8226; Follow semantic versioning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
