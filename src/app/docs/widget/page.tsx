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
        className="absolute top-4 right-4 p-2 bg-paper-sub hover:bg-paper-sub text-ink rounded-md transition-colors"
      >
        {copiedCode === id ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="bg-ink text-paper p-6 font-mono overflow-x-auto text-sm">
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
            Docs &middot; Widget
          </span>
          <H1 className="mb-6 text-ink">AllowanceGuard Widget</H1>
          <p className="text-lg text-ink-soft max-w-reading">
            A drop-in security component you can paste into any website. Configure it below, copy the snippet, and your users get an approval scanner without leaving your page.
          </p>
        </Container>
      </Section>

      <div className="border-t border-ink-rule" />

      {/* Status banner */}
      <Section className="pt-10 pb-0">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-5">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-deep uppercase tracking-[0.12em] mb-1">
                    Pending store approval
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    The browser extension is built and submitted to the <strong className="text-ink">Chrome Web Store</strong> and <strong className="text-ink">Firefox Add-ons</strong>. Reviewer approval is pending. The configuration playground below works today; install snippets will go live the moment the extension lands in each store.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

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
                    <Eye size={20} className="text-ink-muted" />
                    <span className="text-sm text-ink-muted">Real-time preview</span>
                  </div>
                </div>
                
                <div className="border border-ink-rule  p-4 bg-paper-sub">
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
                    <Settings size={20} className="text-ink-muted" />
                    <span className="text-sm text-ink-muted">Customize widget</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">
                      Theme
                    </label>
                    <div className="flex space-x-2">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setSelectedTheme(theme as 'light' | 'dark' | 'auto')}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedTheme === theme
                              ? 'bg-blue-500 text-ink'
                              : 'bg-paper-deep/60 border border-ink-rule text-ink text-ink-soft hover:bg-paper-sub'
                          }`}
                        >
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Options */}
                  <div>
                    <label className="block text-sm font-medium text-ink-soft mb-2">
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
                    <label className="block text-sm font-medium text-ink-soft mb-2">
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
                    <label className="block text-sm font-medium text-ink-soft mb-2">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                      readOnly
                      className="w-full px-3 py-2 border border-ink-rule rounded-md bg-paper-sub text-sm font-mono"
                    />
                    <p className="text-xs text-ink-muted mt-1">
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
      <Section className="py-16 bg-paper-sub">
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
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-ink rounded text-sm hover:bg-blue-600 transition-colors"
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
                    className="flex items-center space-x-2 px-3 py-1 bg-green-500 text-ink rounded text-sm hover:bg-green-600 transition-colors"
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

      {/* Installation — placeholder while pending store approval */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-3 text-center text-ink">Installation</H2>
            <p className="text-center text-sm text-ink-muted mb-8">
              The configuration above is real and runs against the live API. The install snippets below are <strong className="text-amber-deep">previews</strong> of what the published install flow will look like once the extension lands in each store.
            </p>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-6 mb-8">
              <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
                <span className="inline-flex w-2 h-2 rounded-full bg-amber-400" />
                What you can do today
              </h3>
              <ul className="text-sm text-ink-soft space-y-2">
                <li>&middot; Use the <strong className="text-ink">REST API v1</strong> to scan wallets &mdash; see <a href="/docs/api-reference" className="text-amber-deep hover:underline">API Reference</a>.</li>
                <li>&middot; Clone the <strong className="text-ink">Node.js SDK</strong> from <a href="https://github.com/EazyAccessEA/Allowance-guard/tree/main/sdk" className="text-amber-deep hover:underline" target="_blank" rel="noopener noreferrer"><code className="text-xs">/sdk</code></a>.</li>
                <li>&middot; Subscribe to the <a href="https://github.com/EazyAccessEA/Allowance-guard" className="text-amber-deep hover:underline" target="_blank" rel="noopener noreferrer">GitHub repo</a> to be notified when the extension publishes.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70">
              <div className="bg-paper-sub border border-ink-rule  p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Code className="mr-3 text-amber-deep" size={20} />
                    <H3>React (preview)</H3>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-deep bg-paper-sub border border-amber-400/30 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-ink-muted mb-1">1. Install (when published):</p>
                    <pre className="bg-paper-deep/60 border border-ink-rule text-ink p-3 rounded text-xs">npm install allowance-guard-widget</pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-ink-muted mb-1">2. Use:</p>
                    <pre className="bg-paper-deep/60 border border-ink-rule text-ink p-3 rounded text-xs overflow-x-auto">{generateWidgetCode()}</pre>
                  </div>
                </div>
              </div>

              <div className="bg-paper-sub border border-ink-rule  p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Download className="mr-3 text-amber-deep" size={20} />
                    <H3>HTML (preview)</H3>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-deep bg-paper-sub border border-amber-400/30 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-ink-muted mb-1">1. Include the script:</p>
                    <pre className="bg-paper-deep/60 border border-ink-rule text-ink p-3 rounded text-xs overflow-x-auto">&lt;script src=&quot;https://cdn.allowanceguard.com/widget.js&quot;&gt;&lt;/script&gt;</pre>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-ink-muted mb-1">2. Mount and initialise:</p>
                    <pre className="bg-paper-deep/60 border border-ink-rule text-ink p-3 rounded text-xs">&lt;div id=&quot;allowance-guard&quot;&gt;&lt;/div&gt;{'\n'}AllowanceGuard.init(&#123;...&#125;)</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Widget Properties */}
      <Section className="py-16 bg-paper-sub">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8 text-center">Widget Properties</H2>
            
            <div className="bg-paper-sub border border-ink-rule  overflow-hidden">
              <table className="w-full">
                <thead className="bg-paper-sub">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                      Default
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-ink">
                      walletAddress
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      string
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      -
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">
                      The wallet address to display allowances for
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-ink">
                      chainId
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      number
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      1
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">
                      The blockchain chain ID to filter by
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-ink">
                      showRiskOnly
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      boolean
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      false
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">
                      Show only high-risk allowances
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-ink">
                      maxItems
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      number
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      10
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">
                      Maximum number of allowances to display
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-ink">
                      theme
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      string
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      &apos;light&apos;
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">
                      Widget theme: &apos;light&apos;, &apos;dark&apos;, or &apos;auto&apos;
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-ink">
                      compact
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      boolean
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      false
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">
                      Use compact display mode
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-ink">
                      onAllowanceClick
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      function
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-muted">
                      -
                    </td>
                    <td className="px-6 py-4 text-sm text-ink-muted">
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
