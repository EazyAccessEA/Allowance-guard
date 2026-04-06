'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { useState } from 'react'
import { Copy, Check, Code, Download, Eye, Settings } from 'lucide-react'
import AllowanceGuardWidget from '@/components/AllowanceGuardWidget'

export default function WidgetPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>('light')
  const [compactMode, setCompactMode] = useState(false)
  const [showRiskOnly, setShowRiskOnly] = useState(false)
  const [maxItems, setMaxItems] = useState(5)
  const [activeTab, setActiveTab] = useState<'react' | 'html'>('react')

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative">
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-4 right-4 p-2 bg-slate-700/60 hover:bg-amber-500/20 border border-slate-600/50 rounded-md transition-colors text-slate-300 hover:text-amber-400"
      >
        {copiedCode === id ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="bg-[#0A0E1A] border border-slate-700/50 text-slate-200 p-6 rounded-lg overflow-x-auto text-sm">
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
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100">
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-slate-900 to-[#0A0E1A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.08),_transparent_60%)]" />
        <Container className="relative max-w-4xl z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            AllowanceGuard Widget
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-8">
            Drop-in widget for any website. Protect your users from risky token approvals
            with our embeddable security component.
          </p>
        </Container>
      </Section>

      <div className="border-t border-slate-700/50" />

      {/* Live Preview + Configuration */}
      <Section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Widget Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Live Preview
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Eye size={20} className="text-amber-400" />
                    <span className="text-sm text-slate-400">Real-time preview</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
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
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Configuration
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Settings size={20} className="text-amber-400" />
                    <span className="text-sm text-slate-400">Customize widget</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6 space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Theme
                    </label>
                    <div className="flex space-x-2">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setSelectedTheme(theme as 'light' | 'dark' | 'auto')}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedTheme === theme
                              ? 'bg-amber-500 text-slate-900'
                              : 'bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:bg-slate-700/60 hover:text-slate-100'
                          }`}
                        >
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Options */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Display Options
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={showRiskOnly}
                            onChange={(e) => setShowRiskOnly(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-700 rounded-full peer-checked:bg-amber-500 transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-slate-300 rounded-full peer-checked:translate-x-4 peer-checked:bg-white transition-transform" />
                        </div>
                        <span className="ml-3 text-sm text-slate-300 group-hover:text-slate-100">Show only risky allowances</span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={compactMode}
                            onChange={(e) => setCompactMode(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-700 rounded-full peer-checked:bg-amber-500 transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-slate-300 rounded-full peer-checked:translate-x-4 peer-checked:bg-white transition-transform" />
                        </div>
                        <span className="ml-3 text-sm text-slate-300 group-hover:text-slate-100">Compact mode</span>
                      </label>
                    </div>
                  </div>

                  {/* Max Items */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Max Items: <span className="text-amber-400">{maxItems}</span>
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="20"
                      value={maxItems}
                      onChange={(e) => setMaxItems(parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                      readOnly
                      className="w-full px-3 py-2 bg-[#0A0E1A] border border-slate-700/50 rounded-lg text-slate-200 text-sm font-mono focus:border-amber-500/50 focus:outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">
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
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Generated Code
            </h2>

            {/* Tabs */}
            <div className="flex border-b border-slate-700/50 mb-6">
              <button
                onClick={() => setActiveTab('react')}
                className={`px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'react'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                React Component
              </button>
              <button
                onClick={() => setActiveTab('html')}
                className={`px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'html'
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                HTML / JavaScript
              </button>
            </div>

            {/* Tab Content */}
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
              {activeTab === 'react' ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      React Component
                    </h3>
                    <button
                      onClick={() => copyToClipboard(generateWidgetCode(), 'react-code')}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-sm hover:bg-amber-500/20 transition-colors"
                    >
                      <Copy size={14} />
                      <span>Copy</span>
                    </button>
                  </div>
                  <CodeBlock code={generateWidgetCode()} language="jsx" id="react-code" />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      HTML / JavaScript
                    </h3>
                    <button
                      onClick={() => copyToClipboard(generateHTMLCode(), 'html-code')}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-sm hover:bg-amber-500/20 transition-colors"
                    >
                      <Copy size={14} />
                      <span>Copy</span>
                    </button>
                  </div>
                  <CodeBlock code={generateHTMLCode()} language="html" id="html-code" />
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Installation Instructions */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Installation &amp; Setup
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* React Installation */}
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
                <div className="flex items-center mb-4">
                  <Code className="mr-3 text-amber-400" size={24} />
                  <h3 className="text-lg font-semibold text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    React Installation
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-2">1. Install the package:</p>
                    <pre className="bg-[#0A0E1A] border border-slate-700/50 p-3 rounded-lg text-sm text-slate-200">npm install allowance-guard-widget</pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-2">2. Import and use:</p>
                    <pre className="bg-[#0A0E1A] border border-slate-700/50 p-3 rounded-lg text-sm text-slate-200">import AllowanceGuardWidget from &apos;allowance-guard-widget&apos;</pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-2">3. Add to your component:</p>
                    <pre className="bg-[#0A0E1A] border border-slate-700/50 p-3 rounded-lg text-sm text-slate-200 overflow-x-auto">{generateWidgetCode()}</pre>
                  </div>
                </div>
              </div>

              {/* HTML Installation */}
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
                <div className="flex items-center mb-4">
                  <Download className="mr-3 text-amber-400" size={24} />
                  <h3 className="text-lg font-semibold text-slate-100" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    HTML Installation
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-2">1. Include the script:</p>
                    <pre className="bg-[#0A0E1A] border border-slate-700/50 p-3 rounded-lg text-sm text-slate-200">&lt;script src=&quot;https://unpkg.com/allowance-guard-widget@latest/dist/widget.js&quot;&gt;&lt;/script&gt;</pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-2">2. Add container div:</p>
                    <pre className="bg-[#0A0E1A] border border-slate-700/50 p-3 rounded-lg text-sm text-slate-200">&lt;div id=&quot;allowance-guard-widget&quot;&gt;&lt;/div&gt;</pre>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-2">3. Initialize the widget:</p>
                    <pre className="bg-[#0A0E1A] border border-slate-700/50 p-3 rounded-lg text-sm text-slate-200 overflow-x-auto">AllowanceGuardWidget.init(&#123;...&#125;)</pre>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </Section>

      {/* Widget Properties */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Widget Properties
            </h2>

            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/80">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">
                        Default
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-400 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {[
                      { prop: 'walletAddress', type: 'string', def: '-', desc: 'The wallet address to display allowances for' },
                      { prop: 'chainId', type: 'number', def: '1', desc: 'The blockchain chain ID to filter by' },
                      { prop: 'showRiskOnly', type: 'boolean', def: 'false', desc: 'Show only high-risk allowances' },
                      { prop: 'maxItems', type: 'number', def: '10', desc: 'Maximum number of allowances to display' },
                      { prop: 'theme', type: 'string', def: "'light'", desc: "Widget theme: 'light', 'dark', or 'auto'" },
                      { prop: 'compact', type: 'boolean', def: 'false', desc: 'Use compact display mode' },
                      { prop: 'onAllowanceClick', type: 'function', def: '-', desc: 'Callback when an allowance is clicked' },
                    ].map((row) => (
                      <tr key={row.prop} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-amber-300">
                          {row.prop}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {row.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {row.def}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {row.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
