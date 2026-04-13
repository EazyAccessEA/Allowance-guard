'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2, H3 } from '@/components/ui/Heading'
import { useState } from 'react'
import { Copy, Check, Code, Package, Globe, Zap, Shield } from 'lucide-react'
import AllowanceGuardWidget from '@/components/AllowanceGuardWidget'

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
        className="absolute top-4 right-4 p-2 bg-paper-sub hover:bg-paper-sub text-ink rounded-md transition-colors"
      >
        {copiedCode === id ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="bg-ink text-paper p-6 font-mono overflow-x-auto text-sm">
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
    <div className="min-h-screen bg-paper-deep text-ink">
      {/* Hero Section */}
      <Section className="relative py-20 sm:py-28 overflow-hidden bg-paper-deep">
        <div
          className="absolute inset-0 z-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(245,158,11,0.06) 0%, transparent 70%)',
          }}
        />
        <Container className="relative text-left max-w-4xl z-10">
          <span className="inline-block mb-4 text-xs uppercase tracking-[0.2em] font-semibold text-amber-deep">
            Docs &middot; Integration
          </span>
          <H1 className="mb-6 text-ink">Integration Guide</H1>
          <p className="text-lg text-ink-soft max-w-reading">
            Drop AllowanceGuard into your dApp, wallet, or service. Embed the widget, call the REST API, or build against React hooks &mdash; pick the integration that fits your stack and ship in an afternoon.
          </p>
        </Container>
      </Section>

      <div className="border-t border-ink-rule" />

      {/* Integration Options */}
      <Section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <H2 className="mb-6 text-center text-ink">Choose Your Integration Method</H2>

            {/* Release status banner */}
            <div className="mb-12 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
              <h3 className="text-sm font-semibold text-amber-deep uppercase tracking-[0.12em] mb-3">
                Release status
              </h3>
              <ul className="space-y-2 text-sm text-ink-soft">
                <li>
                  <strong className="text-ink">REST API v1</strong> &mdash; <span className="text-emerald-800">Live.</span> Public, documented, rate-limited per tier. See <a href="/docs/api-reference" className="text-amber-deep hover:underline">API Reference</a>.
                </li>
                <li>
                  <strong className="text-ink">Browser extension</strong> &mdash; <span className="text-amber-deep">Submitted.</span> Awaiting Chrome Web Store and Firefox Add-ons review.
                </li>
                <li>
                  <strong className="text-ink">Node.js SDK</strong> &mdash; <span className="text-amber-deep">Source available.</span> Code lives in <code className="text-xs text-amber-deep bg-paper-sub px-1.5 py-0.5 rounded">/sdk</code> on GitHub. npm publish pending.
                </li>
                <li>
                  <strong className="text-ink">React hooks</strong> &mdash; <span className="text-ink-muted">On the roadmap.</span> Not yet started.
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-paper-sub border border-ink-rule  p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Globe className="mr-3 text-amber-deep" size={24} />
                    <H3>Embeddable Widget</H3>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-deep bg-paper-sub border border-amber-400/30 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                </div>
                <p className="text-ink-soft mb-4">
                  Drop-in browser extension. Submitted to Chrome Web Store and Firefox Add-ons; awaiting reviewer approval.
                </p>
                <ul className="text-sm text-ink-soft space-y-2">
                  <li>&middot; Zero configuration</li>
                  <li>&middot; Real-time approval screening</li>
                  <li>&middot; Works on every dApp</li>
                  <li>&middot; No account required</li>
                </ul>
              </div>

              <div className="bg-paper-sub border border-ink-rule  p-6 hover:shadow-lg transition-shadow opacity-75">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Zap className="mr-3 text-ink-whisper" size={24} />
                    <H3>React Hooks</H3>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted bg-paper-sub border border-ink-rule px-2 py-0.5 rounded-full">
                    Roadmap
                  </span>
                </div>
                <p className="text-ink-soft mb-4">
                  Custom React hooks for seamless integration into React applications.
                </p>
                <ul className="text-sm text-ink-soft space-y-2">
                  <li>• TypeScript support</li>
                  <li>• Automatic caching</li>
                  <li>• Error handling</li>
                  <li>• Real-time updates</li>
                </ul>
              </div>

              <div className="bg-paper-sub border border-ink-rule  p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Package className="mr-3 text-amber-deep" size={24} />
                    <H3>Node.js SDK</H3>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-deep bg-paper-sub border border-amber-400/30 px-2 py-0.5 rounded-full">
                    GitHub
                  </span>
                </div>
                <p className="text-ink-soft mb-4">
                  Backend SDK for server-side scanning, monitoring, and automated revocation. Source available now in <a href="https://github.com/EazyAccessEA/Allowance-guard/tree/main/sdk" className="text-amber-deep hover:underline" target="_blank" rel="noopener noreferrer"><code className="text-xs">/sdk</code></a>; npm publish pending.
                </p>
                <ul className="text-sm text-ink-soft space-y-2">
                  <li>&middot; Complete v1 API coverage</li>
                  <li>&middot; Built-in retry &amp; rate-limit handling</li>
                  <li>&middot; Batch operations</li>
                  <li>&middot; GPL-3.0 licensed</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Live Widget Demo */}
      <Section className="py-16 bg-paper-sub">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8 text-center">Live Widget Demo</H2>
            <p className="text-center text-ink-soft mb-8">
              See the AllowanceGuard widget in action with real data.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <H3 className="mb-4">All Allowances</H3>
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
                <H3 className="mb-4">High Risk Only</H3>
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
        </Container>
      </Section>

      {/* Code Examples */}
      <Section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <H2 className="mb-12 text-center">Code Examples</H2>
            
            <div className="space-y-12">
              
              {/* React Widget */}
              <div>
                <div className="flex items-center mb-6">
                  <Globe className="mr-3 text-blue-600" size={24} />
                  <H3>React Widget Integration</H3>
                </div>
                <p className="text-ink-soft mb-6">
                  Install the widget package and embed it in your React application.
                </p>
                <CodeBlock code={reactWidgetCode} language="jsx" id="react-widget" />
              </div>

              {/* HTML Widget */}
              <div>
                <div className="flex items-center mb-6">
                  <Code className="mr-3 text-green-800" size={24} />
                  <H3>HTML/JavaScript Integration</H3>
                </div>
                <p className="text-ink-soft mb-6">
                  Include the widget script and initialize it in any HTML page.
                </p>
                <CodeBlock code={htmlWidgetCode} language="html" id="html-widget" />
              </div>

              {/* React Hooks */}
              <div>
                <div className="flex items-center mb-6">
                  <Zap className="mr-3 text-yellow-600" size={24} />
                  <H3>React Hooks Integration</H3>
                </div>
                <p className="text-ink-soft mb-6">
                  Use our custom hooks for more control over data fetching and state management.
                </p>
                <CodeBlock code={reactHooksCode} language="jsx" id="react-hooks" />
              </div>

              {/* Node.js SDK */}
              <div>
                <div className="flex items-center mb-6">
                  <Package className="mr-3 text-purple-600" size={24} />
                  <H3>Node.js SDK Integration</H3>
                </div>
                <p className="text-ink-soft mb-6">
                  Use the SDK in your backend services for comprehensive wallet security analysis.
                </p>
                <CodeBlock code={nodeSDKCode} language="javascript" id="node-sdk" />
              </div>

            </div>
          </div>
        </Container>
      </Section>

      {/* Installation Instructions */}
      <Section className="py-16 bg-paper-sub">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-3 text-center text-ink">Installation</H2>
            <p className="text-center text-sm text-ink-muted mb-10">
              The REST API is live today. The browser extension and SDK are in pre-release &mdash; install instructions reflect their current status.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-paper-sub p-6  border border-ink-rule">
                <div className="flex items-center justify-between mb-4">
                  <H3>REST API v1</H3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-paper-sub border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
                <p className="text-sm text-ink-soft mb-3">
                  Authenticate with a bearer token, hit the v1 endpoints from any language. No install step.
                </p>
                <pre className="bg-paper-deep/60 border border-ink-rule text-ink p-3 rounded text-xs overflow-x-auto">curl -H &quot;Authorization: Bearer ag_...&quot; \{'\n'}  https://www.allowanceguard.com/api/v1/chains</pre>
                <a href="/docs/api-reference" className="inline-block mt-3 text-xs font-medium text-amber-deep hover:underline">
                  Read the API reference &rarr;
                </a>
              </div>

              <div className="bg-paper-sub p-6  border border-ink-rule">
                <div className="flex items-center justify-between mb-4">
                  <H3>Browser Extension</H3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-deep bg-paper-sub border border-amber-400/30 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                </div>
                <p className="text-sm text-ink-soft mb-3">
                  Submitted to the Chrome Web Store and Firefox Add-ons. Once approved, install with a single click &mdash; no developer setup required.
                </p>
                <div className="rounded-md bg-paper-deep/60 border border-ink-rule text-ink-muted text-xs p-3">
                  Awaiting reviewer approval. We&rsquo;ll announce on GitHub and X when it&rsquo;s live.
                </div>
              </div>

              <div className="bg-paper-sub p-6  border border-ink-rule">
                <div className="flex items-center justify-between mb-4">
                  <H3>Node.js SDK</H3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-deep bg-paper-sub border border-amber-400/30 px-2 py-0.5 rounded-full">
                    GitHub
                  </span>
                </div>
                <p className="text-sm text-ink-soft mb-3">
                  Source available now in <a href="https://github.com/EazyAccessEA/Allowance-guard/tree/main/sdk" className="text-amber-deep hover:underline" target="_blank" rel="noopener noreferrer"><code className="text-xs">/sdk</code></a> on GitHub. npm publish pending.
                </p>
                <pre className="bg-paper-deep/60 border border-ink-rule text-ink p-3 rounded text-xs overflow-x-auto">git clone https://github.com/{'\n'}  EazyAccessEA/Allowance-guard.git{'\n'}cd Allowance-guard/sdk &amp;&amp; npm i</pre>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-10 text-center text-xs text-ink-whisper">
              Looking for React hooks? They&rsquo;re on the roadmap &mdash; track progress in <a href="https://github.com/EazyAccessEA/Allowance-guard/issues" className="text-amber-deep hover:underline" target="_blank" rel="noopener noreferrer">GitHub Issues</a>.
            </div>
          </div>
        </Container>
      </Section>

      {/* Best Practices */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8 text-center">Best Practices</H2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-paper-sub p-6  border border-ink-rule">
                <div className="flex items-center mb-4">
                  <Shield className="mr-3 text-green-800" size={20} />
                  <H3>Security</H3>
                </div>
                <ul className="text-sm text-ink-soft space-y-2">
                  <li>• Always validate wallet addresses client-side</li>
                  <li>• Use HTTPS for all API requests</li>
                  <li>• Implement proper error handling</li>
                  <li>• Don&apos;t expose API keys in client-side code</li>
                </ul>
              </div>

              <div className="bg-paper-sub p-6  border border-ink-rule">
                <div className="flex items-center mb-4">
                  <Zap className="mr-3 text-blue-600" size={20} />
                  <H3>Performance</H3>
                </div>
                <ul className="text-sm text-ink-soft space-y-2">
                  <li>• Use pagination for large datasets</li>
                  <li>• Implement client-side caching</li>
                  <li>• Debounce user input for search</li>
                  <li>• Use appropriate page sizes</li>
                </ul>
              </div>

              <div className="bg-paper-sub p-6  border border-ink-rule">
                <div className="flex items-center mb-4">
                  <Globe className="mr-3 text-purple-600" size={20} />
                  <H3>User Experience</H3>
                </div>
                <ul className="text-sm text-ink-soft space-y-2">
                  <li>• Show loading states during API calls</li>
                  <li>• Provide clear error messages</li>
                  <li>• Use consistent theming</li>
                  <li>• Make widgets mobile-responsive</li>
                </ul>
              </div>

              <div className="bg-paper-sub p-6  border border-ink-rule">
                <div className="flex items-center mb-4">
                  <Package className="mr-3 text-orange-600" size={20} />
                  <H3>Integration</H3>
                </div>
                <ul className="text-sm text-ink-soft space-y-2">
                  <li>• Test with multiple wallet addresses</li>
                  <li>• Handle network switching gracefully</li>
                  <li>• Implement proper TypeScript types</li>
                  <li>• Follow semantic versioning</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}