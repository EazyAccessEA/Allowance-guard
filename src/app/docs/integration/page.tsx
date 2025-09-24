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
        className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
      >
        {copiedCode === id ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm">
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
    <div className="min-h-screen bg-white text-ink">
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-100" />
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Integration Guide</H1>
          <p className="text-lg text-stone leading-relaxed mb-8">
            Integrate AllowanceGuard into your dApp, wallet, or service with our comprehensive toolkit. 
            Choose from React hooks, embeddable widgets, or Node.js SDK.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Integration Options */}
      <Section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <H2 className="mb-12 text-center">Choose Your Integration Method</H2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white border border-line rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Globe className="mr-3 text-blue-600" size={24} />
                  <H3>Embeddable Widget</H3>
                </div>
                <p className="text-stone mb-4">
                  Drop-in widget for any website. Works with React, Vue, Angular, or vanilla HTML.
                </p>
                <ul className="text-sm text-stone space-y-2">
                  <li>• Zero configuration</li>
                  <li>• Customizable themes</li>
                  <li>• Real-time updates</li>
                  <li>• Mobile responsive</li>
                </ul>
              </div>

              <div className="bg-white border border-line rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Zap className="mr-3 text-yellow-600" size={24} />
                  <H3>React Hooks</H3>
                </div>
                <p className="text-stone mb-4">
                  Custom React hooks for seamless integration into React applications.
                </p>
                <ul className="text-sm text-stone space-y-2">
                  <li>• TypeScript support</li>
                  <li>• Automatic caching</li>
                  <li>• Error handling</li>
                  <li>• Real-time updates</li>
                </ul>
              </div>

              <div className="bg-white border border-line rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Package className="mr-3 text-green-600" size={24} />
                  <H3>Node.js SDK</H3>
                </div>
                <p className="text-stone mb-4">
                  Full-featured SDK for backend services and server-side applications.
                </p>
                <ul className="text-sm text-stone space-y-2">
                  <li>• Complete API coverage</li>
                  <li>• Built-in retry logic</li>
                  <li>• Data export features</li>
                  <li>• Batch operations</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Live Widget Demo */}
      <Section className="py-16 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8 text-center">Live Widget Demo</H2>
            <p className="text-center text-stone mb-8">
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
                <p className="text-stone mb-6">
                  Install the widget package and embed it in your React application.
                </p>
                <CodeBlock code={reactWidgetCode} language="jsx" id="react-widget" />
              </div>

              {/* HTML Widget */}
              <div>
                <div className="flex items-center mb-6">
                  <Code className="mr-3 text-green-600" size={24} />
                  <H3>HTML/JavaScript Integration</H3>
                </div>
                <p className="text-stone mb-6">
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
                <p className="text-stone mb-6">
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
                <p className="text-stone mb-6">
                  Use the SDK in your backend services for comprehensive wallet security analysis.
                </p>
                <CodeBlock code={nodeSDKCode} language="javascript" id="node-sdk" />
              </div>

            </div>
          </div>
        </Container>
      </Section>

      {/* Installation Instructions */}
      <Section className="py-16 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8 text-center">Installation & Setup</H2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-line">
                <H3 className="mb-4">React Widget</H3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-ink mb-2">Installation:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">npm install allowance-guard-widget</pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink mb-2">Import:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">import AllowanceGuardWidget from 'allowance-guard-widget'</pre>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-line">
                <H3 className="mb-4">React Hooks</H3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-ink mb-2">Installation:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">npm install allowance-guard-hooks</pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink mb-2">Import:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">import { useAllowances } from 'allowance-guard-hooks'</pre>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-line">
                <H3 className="mb-4">Node.js SDK</H3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-ink mb-2">Installation:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">npm install allowance-guard-sdk</pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink mb-2">Import:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">const AllowanceGuardSDK = require('allowance-guard-sdk')</pre>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-line">
                <H3 className="mb-4">HTML Widget</H3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-ink mb-2">CDN Script:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">&lt;script src="https://unpkg.com/allowance-guard-widget@latest/dist/widget.js"&gt;&lt;/script&gt;</pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink mb-2">Initialize:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">AllowanceGuardWidget.init(&#123;...&#125;)</pre>
                  </div>
                </div>
              </div>
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
              <div className="bg-white p-6 rounded-lg border border-line">
                <div className="flex items-center mb-4">
                  <Shield className="mr-3 text-green-600" size={20} />
                  <H3>Security</H3>
                </div>
                <ul className="text-sm text-stone space-y-2">
                  <li>• Always validate wallet addresses client-side</li>
                  <li>• Use HTTPS for all API requests</li>
                  <li>• Implement proper error handling</li>
                  <li>• Don't expose API keys in client-side code</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-line">
                <div className="flex items-center mb-4">
                  <Zap className="mr-3 text-blue-600" size={20} />
                  <H3>Performance</H3>
                </div>
                <ul className="text-sm text-stone space-y-2">
                  <li>• Use pagination for large datasets</li>
                  <li>• Implement client-side caching</li>
                  <li>• Debounce user input for search</li>
                  <li>• Use appropriate page sizes</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-line">
                <div className="flex items-center mb-4">
                  <Globe className="mr-3 text-purple-600" size={20} />
                  <H3>User Experience</H3>
                </div>
                <ul className="text-sm text-stone space-y-2">
                  <li>• Show loading states during API calls</li>
                  <li>• Provide clear error messages</li>
                  <li>• Use consistent theming</li>
                  <li>• Make widgets mobile-responsive</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-line">
                <div className="flex items-center mb-4">
                  <Package className="mr-3 text-orange-600" size={20} />
                  <H3>Integration</H3>
                </div>
                <ul className="text-sm text-stone space-y-2">
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