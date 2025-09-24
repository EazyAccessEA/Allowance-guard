'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2, H3 } from '@/components/ui/Heading'
import { useState } from 'react'
import { Copy, Check, Code, Download, Eye, Settings } from 'lucide-react'
import AllowanceGuardWidget from '@/components/AllowanceGuardWidget'

export default function WidgetPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>('light')
  const [compactMode, setCompactMode] = useState(false)
  const [showRiskOnly, setShowRiskOnly] = useState(false)
  const [maxItems, setMaxItems] = useState(5)

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

  const generateWidgetCode = () => {
    return `<AllowanceGuardWidget
  walletAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  chainId={1}
  showRiskOnly={${showRiskOnly}}
  maxItems={${maxItems}}
  theme="${selectedTheme}"
  compact={${compactMode}}
  onAllowanceClick={(allowance) => {
    console.log('Allowance clicked:', allowance)
  }}
/>`
  }

  const generateHTMLCode = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <title>My DeFi App</title>
  <script src="https://unpkg.com/allowance-guard-widget@latest/dist/widget.js"></script>
</head>
<body>
  <div id="allowance-guard-widget"></div>
  
  <script>
    AllowanceGuardWidget.init({
      container: '#allowance-guard-widget',
      walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      chainId: 1,
      showRiskOnly: ${showRiskOnly},
      maxItems: ${maxItems},
      theme: '${selectedTheme}',
      compact: ${compactMode},
      onAllowanceClick: (allowance) => {
        console.log('Allowance clicked:', allowance)
      }
    })
  </script>
</body>
</html>`
  }

  return (
    <div className="min-h-screen bg-white text-ink">
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-100" />
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">AllowanceGuard Widget</H1>
          <p className="text-lg text-stone leading-relaxed mb-8">
            Drop-in widget for any website. Protect your users from risky token approvals 
            with our embeddable security component.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Live Preview */}
      <Section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Widget Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <H2>Live Preview</H2>
                  <div className="flex items-center space-x-2">
                    <Eye size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-500">Real-time preview</span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <AllowanceGuardWidget
                    walletAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                    chainId={1}
                    showRiskOnly={showRiskOnly}
                    maxItems={maxItems}
                    theme={selectedTheme}
                    compact={compactMode}
                    onAllowanceClick={(allowance) => {
                      console.log('Allowance clicked:', allowance)
                    }}
                  />
                </div>
              </div>

              {/* Configuration Panel */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <H2>Configuration</H2>
                  <div className="flex items-center space-x-2">
                    <Settings size={20} className="text-gray-500" />
                    <span className="text-sm text-gray-500">Customize widget</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <div className="flex space-x-2">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setSelectedTheme(theme as any)}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedTheme === theme
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Options
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={showRiskOnly}
                          onChange={(e) => setShowRiskOnly(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Show only risky allowances</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={compactMode}
                          onChange={(e) => setCompactMode(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Compact mode</span>
                      </label>
                    </div>
                  </div>

                  {/* Max Items */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Items: {maxItems}
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="20"
                      value={maxItems}
                      onChange={(e) => setMaxItems(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Demo wallet (Vitalik&apos;s address)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Code Generation */}
      <Section className="py-16 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8 text-center">Generated Code</H2>
            
            <div className="space-y-8">
              
              {/* React Code */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <H3>React Component</H3>
                  <button
                    onClick={() => copyToClipboard(generateWidgetCode(), 'react-code')}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    <Copy size={14} />
                    <span>Copy</span>
                  </button>
                </div>
                <CodeBlock code={generateWidgetCode()} language="jsx" id="react-code" />
              </div>

              {/* HTML Code */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <H3>HTML/JavaScript</H3>
                  <button
                    onClick={() => copyToClipboard(generateHTMLCode(), 'html-code')}
                    className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    <Copy size={14} />
                    <span>Copy</span>
                  </button>
                </div>
                <CodeBlock code={generateHTMLCode()} language="html" id="html-code" />
              </div>

            </div>
          </div>
        </Container>
      </Section>

      {/* Installation Instructions */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8 text-center">Installation & Setup</H2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* React Installation */}
              <div className="bg-white border border-line rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Code className="mr-3 text-blue-600" size={24} />
                  <H3>React Installation</H3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">1. Install the package:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">npm install allowance-guard-widget</pre>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">2. Import and use:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">import AllowanceGuardWidget from &apos;allowance-guard-widget&apos;</pre>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">3. Add to your component:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">{generateWidgetCode()}</pre>
                  </div>
                </div>
              </div>

              {/* HTML Installation */}
              <div className="bg-white border border-line rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Download className="mr-3 text-green-600" size={24} />
                  <H3>HTML Installation</H3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">1. Include the script:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">&lt;script src=&quot;https://unpkg.com/allowance-guard-widget@latest/dist/widget.js&quot;&gt;&lt;/script&gt;</pre>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">2. Add container div:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm">&lt;div id=&quot;allowance-guard-widget&quot;&gt;&lt;/div&gt;</pre>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">3. Initialize the widget:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">AllowanceGuardWidget.init(&#123;...&#125;)</pre>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </Section>

      {/* Widget Properties */}
      <Section className="py-16 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8 text-center">Widget Properties</H2>
            
            <div className="bg-white border border-line rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Default
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      walletAddress
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      string
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      The wallet address to display allowances for
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      chainId
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      number
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      1
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      The blockchain chain ID to filter by
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      showRiskOnly
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      boolean
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      false
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Show only high-risk allowances
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      maxItems
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      number
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      10
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Maximum number of allowances to display
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      theme
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      string
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      &apos;light&apos;
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Widget theme: &apos;light&apos;, &apos;dark&apos;, or &apos;auto&apos;
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      compact
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      boolean
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      false
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Use compact display mode
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      onAllowanceClick
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      function
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      -
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Callback when an allowance is clicked
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
