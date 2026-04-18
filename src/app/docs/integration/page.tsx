'use client'

/**
 * Integration guide — quiet-bold Ledger layout.
 *
 * Full rewrite. Delete icon-prefixed H2/H3 headings, amber-tinted
 * release-status banner, alternating bg-paper-sub section strips, four
 * colour-coded best-practices cards. Keep the live AllowanceGuardWidget
 * demo (interactive UI earns its frame) and the code snippet blocks
 * (they teach).
 *
 * Council:
 *  Kael: No rounded-* card frames. No emerald-*, yellow-*, blue-*,
 *   purple-*, orange-* colour-coded icons. Paper-only canvas.
 *  #7 Maren: One bg (bg-paper). Scale contrast carries the page.
 *  #21 Technical: Every release status, code example, and caveat
 *   preserved exactly as documented.
 *  #22 Conversion: Each section ends with one inline amber-deep link
 *   to the next logical page (api-reference, widget builder, github).
 *  Noor: amber-deep links AA on paper; no bg-amber-500 fills used for
 *   text surfaces.
 */

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Link from 'next/link'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import AllowanceGuardWidget from '@/components/AllowanceGuardWidget'

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

const reactHooksCode = `import React from 'react'
import { useAllowances, useNetworks } from 'allowance-guard-hooks'

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
    const allowances = await sdk.getAllowances(walletAddress, {
      riskOnly: true,
      pageSize: 50
    })

    const criticalAllowances = allowances.data.filter(a => a.riskLevel >= 3)

    console.log(\`Found \${criticalAllowances.length} high-risk allowances\`)

    const csvData = await sdk.exportAllowances(walletAddress, 'csv')

    return {
      totalAllowances: allowances.data.length,
      criticalAllowances: criticalAllowances.length,
      csvData
    }
  } catch (error) {
    console.error('Error checking wallet security:', error)
    throw error
  }
}

checkWalletSecurity('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
  .then(result => console.log('Security check completed:', result))
  .catch(error => console.error('Security check failed:', error))`

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
        className="absolute top-3 right-3 p-2 bg-paper-sub hover:bg-paper-deep text-ink transition-colors"
        aria-label={copiedCode === id ? 'Copied' : 'Copy code'}
      >
        {copiedCode === id ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      </button>
      <pre className="bg-ink text-paper p-6 font-mono overflow-x-auto text-sm leading-[1.6]">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Section className="py-16 sm:py-24 lg:py-28">
        <Container>
          <div className="max-w-4xl mx-auto space-y-20">

            {/* Hero — three lines */}
            <header className="space-y-5">
              <div className="inline-flex items-baseline gap-3">
                <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
                  Docs &middot; Integration
                </span>
                <span className="h-px w-12 bg-ink-rule" aria-hidden="true" />
              </div>
              <h1 className="font-display-tight text-ink tracking-tight leading-[1.0] text-5xl sm:text-6xl lg:text-7xl">
                Integration.
              </h1>
              <p className="font-plex text-lg sm:text-xl text-ink-muted leading-[1.55] max-w-2xl">
                Drop AllowanceGuard into your dApp, wallet, or backend. Embed the widget, call the REST API, or build against React hooks &mdash; pick the path that fits your stack and ship in an afternoon.
              </p>
            </header>

            {/* Status today */}
            <section className="space-y-6">
              <h2 id="status-today" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
                Status today.
              </h2>
              <dl className="border-t border-b border-ink-rule divide-y divide-ink-rule">
                <div className="flex flex-col sm:flex-row sm:gap-8 py-4">
                  <dt className="font-plex font-semibold text-ink text-base sm:w-48 shrink-0">REST API v1</dt>
                  <dd className="font-plex text-base text-ink-muted leading-[1.65] flex-1 m-0">
                    <span className="text-ink font-semibold">Live.</span> Public, documented, rate-limited per tier.{' '}
                    <Link href="/docs/api-reference" className="text-amber-deep hover:underline underline-offset-2">API reference</Link>.
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8 py-4">
                  <dt className="font-plex font-semibold text-ink text-base sm:w-48 shrink-0">Browser extension</dt>
                  <dd className="font-plex text-base text-ink-muted leading-[1.65] flex-1 m-0">
                    <span className="text-ink font-semibold">Live.</span> Approved on the Chrome Web Store and Firefox Add-ons.
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8 py-4">
                  <dt className="font-plex font-semibold text-ink text-base sm:w-48 shrink-0">Node.js SDK</dt>
                  <dd className="font-plex text-base text-ink-muted leading-[1.65] flex-1 m-0">
                    <span className="text-amber-deep font-semibold">Source available.</span> Code in{' '}
                    <Link href="https://github.com/EazyAccessEA/Allowance-guard/tree/main/packages/client" className="text-amber-deep hover:underline underline-offset-2" target="_blank" rel="noopener noreferrer"><code className="font-mono text-[0.85em]">packages/client</code></Link>{' '}
                    on GitHub as <code className="font-mono text-[0.85em]">@allowance-guard/client</code>. npm publish in progress.
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-8 py-4">
                  <dt className="font-plex font-semibold text-ink text-base sm:w-48 shrink-0">React hooks</dt>
                  <dd className="font-plex text-base text-ink-muted leading-[1.65] flex-1 m-0">
                    <span className="text-amber-deep font-semibold">Source available.</span> Code in{' '}
                    <Link href="https://github.com/EazyAccessEA/Allowance-guard/tree/main/packages/react" className="text-amber-deep hover:underline underline-offset-2" target="_blank" rel="noopener noreferrer"><code className="font-mono text-[0.85em]">packages/react</code></Link>{' '}
                    on GitHub as <code className="font-mono text-[0.85em]">@allowance-guard/react</code>. npm publish in progress.
                  </dd>
                </div>
              </dl>
            </section>

            {/* Three paths */}
            <section className="space-y-10">
              <div className="space-y-4">
                <h2 id="three-paths" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
                  Three paths in.
                </h2>
                <p className="font-plex text-base text-ink-muted leading-[1.65]">
                  Widgets render UI. Hooks give you data. The SDK automates from your server. Pick one.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-x-10 gap-y-8">
                <div>
                  <h3 className="font-plex font-semibold text-ink text-base mb-2">Embeddable widget</h3>
                  <p className="font-plex text-base text-ink-muted leading-[1.6] mb-3">
                    Drop-in component. Zero configuration, real-time approval screening, works on every dApp, no account required.
                  </p>
                  <Link href="/docs/widget" className="font-plex text-sm text-amber-deep hover:underline underline-offset-2">Widget builder &rarr;</Link>
                </div>
                <div>
                  <h3 className="font-plex font-semibold text-ink text-base mb-2">React hooks</h3>
                  <p className="font-plex text-base text-ink-muted leading-[1.6] mb-3">
                    TypeScript-first hooks for reading allowances and risk scores. Automatic caching, error handling, and real-time updates.
                  </p>
                  <Link href="https://github.com/EazyAccessEA/Allowance-guard/tree/main/packages/react" target="_blank" rel="noopener noreferrer" className="font-plex text-sm text-amber-deep hover:underline underline-offset-2">
                    Source on GitHub &rarr;
                  </Link>
                </div>
                <div>
                  <h3 className="font-plex font-semibold text-ink text-base mb-2">Node.js SDK</h3>
                  <p className="font-plex text-base text-ink-muted leading-[1.6] mb-3">
                    Server-side scanning, monitoring, and automated revocation. Complete v1 coverage, retries, rate-limit handling, AGPL-3.0 (commercial licence available).
                  </p>
                  <Link href="https://github.com/EazyAccessEA/Allowance-guard/tree/main/packages/client" target="_blank" rel="noopener noreferrer" className="font-plex text-sm text-amber-deep hover:underline underline-offset-2">
                    Source on GitHub &rarr;
                  </Link>
                </div>
              </div>
            </section>

            {/* Live widget demo */}
            <section className="space-y-6">
              <h2 id="live-demo" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
                Live demo.
              </h2>
              <p className="font-plex text-base text-ink-muted leading-[1.65]">
                Rendered below against Vitalik&rsquo;s public wallet, Ethereum mainnet. Left: all allowances. Right: risky only, compact.
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-plex font-semibold text-ink text-sm">All allowances</h3>
                  <AllowanceGuardWidget
                    walletAddress="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                    chainId={1}
                    showRiskOnly={false}
                    maxItems={5}
                    theme="light"
                    compact={false}
                  />
                </div>
                <div className="space-y-3">
                  <h3 className="font-plex font-semibold text-ink text-sm">High risk only</h3>
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
            </section>

            {/* Code examples */}
            <section className="space-y-10">
              <div className="space-y-4">
                <h2 id="code-examples" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
                  Copy-paste snippets.
                </h2>
                <p className="font-plex text-base text-ink-muted leading-[1.65]">
                  Four ready-to-run examples. Replace the wallet address and API key with your own.
                </p>
              </div>

              <div className="space-y-5">
                <h3 className="font-display-tight text-ink tracking-tight text-2xl">React widget.</h3>
                <p className="font-plex text-base text-ink-muted leading-[1.65]">
                  Install <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">allowance-guard-widget</code> and render it like any other component.
                </p>
                <CodeBlock code={reactWidgetCode} language="jsx" id="react-widget" />
              </div>

              <div className="space-y-5">
                <h3 className="font-display-tight text-ink tracking-tight text-2xl">Plain HTML.</h3>
                <p className="font-plex text-base text-ink-muted leading-[1.65]">
                  One script tag, one init call. Works in any HTML page without a build step.
                </p>
                <CodeBlock code={htmlWidgetCode} language="html" id="html-widget" />
              </div>

              <div className="space-y-5">
                <h3 className="font-display-tight text-ink tracking-tight text-2xl">React hooks.</h3>
                <p className="font-plex text-base text-ink-muted leading-[1.65]">
                  Data layer for teams that want to render the approvals themselves. Typed responses, automatic pagination.
                </p>
                <CodeBlock code={reactHooksCode} language="jsx" id="react-hooks" />
              </div>

              <div className="space-y-5">
                <h3 className="font-display-tight text-ink tracking-tight text-2xl">Node.js SDK.</h3>
                <p className="font-plex text-base text-ink-muted leading-[1.65]">
                  Server-side wallet security analysis. Scan in bulk, filter by risk, export CSV.
                </p>
                <CodeBlock code={nodeSDKCode} language="javascript" id="node-sdk" />
              </div>
            </section>

            {/* Installation */}
            <section className="space-y-10">
              <div className="space-y-4">
                <h2 id="installation" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
                  Installation.
                </h2>
                <p className="font-plex text-base text-ink-muted leading-[1.65]">
                  The REST API is live today. The browser extension and SDK are in pre-release &mdash; instructions reflect their current status.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="font-display-tight text-ink tracking-tight text-2xl">REST API v1. <span className="font-plex text-xs tracking-[0.15em] uppercase text-ink-whisper align-middle ml-2">Live</span></h3>
                <p className="font-plex text-base text-ink-muted leading-[1.65]">
                  Authenticate with a bearer token. Hit the v1 endpoints from any language. No install step.
                </p>
                <pre className="bg-ink text-paper p-5 font-mono text-sm overflow-x-auto">curl -H &quot;Authorization: Bearer ag_...&quot; \{'\n'}  https://www.allowanceguard.com/api/v1/chains</pre>
                <p className="font-plex text-sm text-ink-muted">
                  <Link href="/docs/api-reference" className="text-amber-deep hover:underline underline-offset-2">Read the API reference &rarr;</Link>
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-display-tight text-ink tracking-tight text-2xl">Browser extension. <span className="font-plex text-xs tracking-[0.15em] uppercase text-ink align-middle ml-2">Live</span></h3>
                <p className="font-plex text-base text-ink-muted leading-[1.65]">
                  Approved on the Chrome Web Store and Firefox Add-ons. Install with a single click &mdash; no developer setup required.
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="font-display-tight text-ink tracking-tight text-2xl">Node.js SDK. <span className="font-plex text-xs tracking-[0.15em] uppercase text-amber-deep align-middle ml-2">Source on GitHub</span></h3>
                <p className="font-plex text-base text-ink-muted leading-[1.65]">
                  Source lives in{' '}
                  <Link href="https://github.com/EazyAccessEA/Allowance-guard/tree/main/packages/client" target="_blank" rel="noopener noreferrer" className="text-amber-deep hover:underline underline-offset-2"><code className="font-mono text-[0.9em]">packages/client</code></Link>{' '}
                  as <code className="font-mono text-[0.9em]">@allowance-guard/client</code>. npm publish in progress.
                </p>
                <pre className="bg-ink text-paper p-5 font-mono text-sm overflow-x-auto">git clone https://github.com/{'\n'}  EazyAccessEA/Allowance-guard.git{'\n'}cd Allowance-guard/packages/client &amp;&amp; pnpm i</pre>
              </div>

              <div className="space-y-4 pt-6 border-t border-ink-rule">
                <h3 className="font-display-tight text-ink tracking-tight text-2xl">React hooks. <span className="font-plex text-xs tracking-[0.15em] uppercase text-amber-deep align-middle ml-2">Source on GitHub</span></h3>
                <p className="font-plex text-base text-ink-muted leading-[1.65]">
                  Source lives in{' '}
                  <Link href="https://github.com/EazyAccessEA/Allowance-guard/tree/main/packages/react" target="_blank" rel="noopener noreferrer" className="text-amber-deep hover:underline underline-offset-2"><code className="font-mono text-[0.9em]">packages/react</code></Link>{' '}
                  as <code className="font-mono text-[0.9em]">@allowance-guard/react</code>. npm publish in progress.
                </p>
              </div>
            </section>

            {/* Best practices */}
            <section className="space-y-6">
              <h2 id="best-practices" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
                Before you ship.
              </h2>
              <p className="font-plex text-base text-ink-muted leading-[1.65]">
                Four buckets of housekeeping that save you support tickets later.
              </p>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                <div>
                  <h3 className="font-plex font-semibold text-ink text-base mb-3">Security</h3>
                  <ul className="space-y-1.5 font-plex text-base text-ink-muted leading-[1.6]">
                    <li>· Validate wallet addresses client-side</li>
                    <li>· Use HTTPS for every API request</li>
                    <li>· Handle errors explicitly; do not swallow them</li>
                    <li>· Never expose <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">ag_live_*</code> keys in browser code</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-plex font-semibold text-ink text-base mb-3">Performance</h3>
                  <ul className="space-y-1.5 font-plex text-base text-ink-muted leading-[1.6]">
                    <li>· Paginate large result sets; don&rsquo;t request 100 at once</li>
                    <li>· Cache responses client-side where feasible</li>
                    <li>· Debounce user-input-driven queries</li>
                    <li>· Pick a sensible default page size</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-plex font-semibold text-ink text-base mb-3">User experience</h3>
                  <ul className="space-y-1.5 font-plex text-base text-ink-muted leading-[1.6]">
                    <li>· Show loading states while scans run</li>
                    <li>· Give clear error messages, not generic codes</li>
                    <li>· Use consistent theming across the widget and your UI</li>
                    <li>· Test on mobile viewports</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-plex font-semibold text-ink text-base mb-3">Integration</h3>
                  <ul className="space-y-1.5 font-plex text-base text-ink-muted leading-[1.6]">
                    <li>· Test with multiple wallet addresses and chains</li>
                    <li>· Handle network switching gracefully</li>
                    <li>· Use the provided TypeScript types</li>
                    <li>· Pin to a specific version; follow semver</li>
                  </ul>
                </div>
              </div>
            </section>

          </div>
        </Container>
      </Section>
    </div>
  )
}
