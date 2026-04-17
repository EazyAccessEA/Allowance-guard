'use client'

/**
 * Widget builder — quiet-bold Ledger layout.
 *
 * The interactive configuration UI (theme buttons, checkboxes, range,
 * wallet input) earns its frame — this is a live tool. Everything else
 * is prose: the hero, the pending-status note, the installation
 * preview, the props table.
 *
 * Council:
 * Kael: Interactive controls use paper-sub backgrounds with
 * border-ink-rule, no rounded-md, no bg-paper-sub state.
 * #7 Maren: Scale contrast. One canvas (bg-paper).
 * #21 Technical: Every prop documented in the table matches the
 * AllowanceGuardWidget component signature.
 * Noor: amber-deep for active state; form controls labelled properly.
 */

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Link from 'next/link'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import AllowanceGuardWidget from '@/components/AllowanceGuardWidget'
import { cn } from '@/lib/utils'

const DEMO_WALLET = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

interface Prop { name: string; type: string; defaultValue: string; description: string }

const props: Prop[] = [
 { name: 'walletAddress', type: 'string', defaultValue: '—', description: 'The wallet address to display allowances for' },
 { name: 'chainId', type: 'number', defaultValue: '1', description: 'The chain ID to filter by' },
 { name: 'showRiskOnly', type: 'boolean', defaultValue: 'false', description: 'Show only high-risk allowances' },
 { name: 'maxItems', type: 'number', defaultValue: '10', description: 'Maximum number of allowances to display' },
 { name: 'theme', type: 'string', defaultValue:"'light'", description:"Widget theme: 'light', 'dark', or 'auto'" },
 { name: 'compact', type: 'boolean', defaultValue: 'false', description: 'Use compact display mode' },
 { name: 'onAllowanceClick', type: 'function', defaultValue: '—', description: 'Callback fired when an allowance is clicked' },
]

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

 const reactCode = `<AllowanceGuardWidget
 walletAddress="${DEMO_WALLET}"
 chainId={1}
 showRiskOnly={${showRiskOnly}}
 maxItems={${maxItems}}
 theme="${selectedTheme}"
 compact={${compactMode}}
 onAllowanceClick={(allowance) => {
 console.log('Allowance clicked:', allowance)
 }}
/>`

 const htmlCode = `<!DOCTYPE html>
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
 walletAddress: '${DEMO_WALLET}',
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

 return (
 <div className="min-h-screen bg-paper text-ink">
 <Section className="py-16 sm:py-24 lg:py-28">
 <Container>
 <div className="max-w-5xl mx-auto space-y-20">

 {/* Hero — three lines */}
 <header className="space-y-5 max-w-4xl">
 <div className="inline-flex items-baseline gap-3">
 <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
 Docs &middot; Widget
 </span>
 <span className="h-px w-12 bg-ink-rule" aria-hidden="true" />
 </div>
 <h1 className="font-display-tight text-ink tracking-tight leading-[1.0] text-5xl sm:text-6xl lg:text-7xl">
 Widget builder.
 </h1>
 <p className="font-plex text-lg sm:text-xl text-ink-muted leading-[1.55] max-w-2xl">
 A drop-in security component you can paste into any website. Configure it below, copy the snippet, and your users get an approval scanner without leaving your page.
 </p>
 <p className="font-plex text-sm text-ink-muted leading-[1.6] pt-3 border-t border-ink-rule max-w-2xl">
 <strong className="text-ink font-semibold">Pending store approval.</strong> The extension is submitted to the Chrome Web Store and Firefox Add-ons and awaiting reviewer approval. The configuration playground below works today; install snippets go live the moment the extension lands in each store.
 </p>
 </header>

 {/* Live preview + configuration */}
 <section className="space-y-8">
 <h2 id="live-preview" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
 Configure and preview.
 </h2>
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

 {/* Preview column */}
 <div className="space-y-4">
 <div className="flex items-baseline justify-between">
 <h3 className="font-plex font-semibold text-ink text-base">Live preview</h3>
 <span className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Real-time</span>
 </div>
 <div className="border border-ink-rule p-4 bg-paper-sub">
 <AllowanceGuardWidget
 walletAddress={DEMO_WALLET}
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

 {/* Configuration column */}
 <div className="space-y-6">
 <div className="flex items-baseline justify-between">
 <h3 className="font-plex font-semibold text-ink text-base">Configuration</h3>
 <span className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Customise</span>
 </div>

 {/* Theme */}
 <div>
 <label className="block font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper mb-2">
 Theme
 </label>
 <div className="flex gap-2">
 {(['light', 'dark', 'auto'] as const).map((theme) => (
 <button
 key={theme}
 onClick={() => setSelectedTheme(theme)}
 className={cn(
 'px-4 py-2 text-sm font-plex font-medium transition-colors border',
 selectedTheme === theme
 ? 'bg-ink text-paper border-ink'
 : 'bg-paper-sub text-ink-muted border-ink-rule hover:border-amber-deep hover:text-ink',
 )}
 >
 {theme.charAt(0).toUpperCase() + theme.slice(1)}
 </button>
 ))}
 </div>
 </div>

 {/* Display options */}
 <div>
 <span className="block font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper mb-2">
 Display options
 </span>
 <div className="space-y-2">
 <label className="flex items-center gap-2 font-plex text-sm text-ink">
 <input
 type="checkbox"
 checked={showRiskOnly}
 onChange={(e) => setShowRiskOnly(e.target.checked)}
 className="accent-amber-deep"
 />
 Show only risky allowances
 </label>
 <label className="flex items-center gap-2 font-plex text-sm text-ink">
 <input
 type="checkbox"
 checked={compactMode}
 onChange={(e) => setCompactMode(e.target.checked)}
 className="accent-amber-deep"
 />
 Compact mode
 </label>
 </div>
 </div>

 {/* Max items */}
 <div>
 <label htmlFor="max-items" className="flex items-baseline justify-between font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper mb-2">
 <span>Max items</span>
 <span className="text-amber-deep tabular-nums">{maxItems}</span>
 </label>
 <input
 id="max-items"
 type="range"
 min="3"
 max="20"
 value={maxItems}
 onChange={(e) => setMaxItems(parseInt(e.target.value))}
 className="w-full accent-amber-deep"
 />
 </div>

 {/* Wallet address (demo) */}
 <div>
 <label htmlFor="demo-wallet" className="block font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper mb-2">
 Wallet address
 </label>
 <input
 id="demo-wallet"
 type="text"
 value={DEMO_WALLET}
 readOnly
 className="w-full px-3 py-2 bg-paper-sub border border-ink-rule font-mono text-sm text-ink"
 />
 <p className="font-plex text-xs text-ink-whisper mt-1">Demo wallet &mdash; Vitalik&rsquo;s public address.</p>
 </div>
 </div>
 </div>
 </section>

 {/* Generated code */}
 <section className="space-y-8">
 <h2 id="generated-code" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
 Generated code.
 </h2>

 <div className="space-y-5">
 <h3 className="font-display-tight text-ink tracking-tight text-2xl">React component.</h3>
 <CodeBlock code={reactCode} language="jsx" id="react-code" />
 </div>

 <div className="space-y-5">
 <h3 className="font-display-tight text-ink tracking-tight text-2xl">Plain HTML.</h3>
 <CodeBlock code={htmlCode} language="html" id="html-code" />
 </div>
 </section>

 {/* Installation preview */}
 <section className="space-y-6">
 <h2 id="installation" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
 Installation.
 </h2>
 <p className="font-plex text-base text-ink-muted leading-[1.65]">
 The configuration above runs against the live API today. The install snippets below are previews of the published flow &mdash; they become copy-paste-ready the moment the extension lands in each store.
 </p>

 <div className="space-y-4">
 <h3 className="font-plex font-semibold text-ink text-base">What you can do right now</h3>
 <ul className="space-y-2 font-plex text-base text-ink-muted leading-[1.6]">
 <li className="flex items-baseline gap-3">
 <span className="font-mono text-xs text-ink-whisper font-semibold shrink-0" aria-hidden="true">—</span>
 <span className="flex-1">Use the REST API v1 to scan wallets. See the{' '}
 <Link href="/docs/api-reference" className="text-amber-deep hover:underline underline-offset-2">API reference</Link>.
 </span>
 </li>
 <li className="flex items-baseline gap-3">
 <span className="font-mono text-xs text-ink-whisper font-semibold shrink-0" aria-hidden="true">—</span>
 <span className="flex-1">Clone the Node.js SDK from{' '}
 <Link href="https://github.com/EazyAccessEA/Allowance-guard/tree/main/sdk" target="_blank" rel="noopener noreferrer" className="text-amber-deep hover:underline underline-offset-2"><code className="font-mono text-[0.9em]">/sdk</code></Link>.
 </span>
 </li>
 <li className="flex items-baseline gap-3">
 <span className="font-mono text-xs text-ink-whisper font-semibold shrink-0" aria-hidden="true">—</span>
 <span className="flex-1">Watch the{' '}
 <Link href="https://github.com/EazyAccessEA/Allowance-guard" target="_blank" rel="noopener noreferrer" className="text-amber-deep hover:underline underline-offset-2">GitHub repository</Link>{' '}
 to be notified when the extension publishes.
 </span>
 </li>
 </ul>
 </div>

 <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8 pt-4">
 <div className="space-y-3">
 <div className="flex items-baseline gap-3">
 <h3 className="font-plex font-semibold text-ink text-base">React (preview)</h3>
 <span className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-amber-deep">Pending</span>
 </div>
 <div>
 <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper mb-1">1. Install (when published)</p>
 <pre className="bg-ink text-paper p-3 font-mono text-xs overflow-x-auto">npm install allowance-guard-widget</pre>
 </div>
 <div>
 <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper mb-1">2. Use</p>
 <pre className="bg-ink text-paper p-3 font-mono text-xs overflow-x-auto">{reactCode}</pre>
 </div>
 </div>

 <div className="space-y-3">
 <div className="flex items-baseline gap-3">
 <h3 className="font-plex font-semibold text-ink text-base">HTML (preview)</h3>
 <span className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-amber-deep">Pending</span>
 </div>
 <div>
 <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper mb-1">1. Include the script</p>
 <pre className="bg-ink text-paper p-3 font-mono text-xs overflow-x-auto">&lt;script src=&quot;https://cdn.allowanceguard.com/widget.js&quot;&gt;&lt;/script&gt;</pre>
 </div>
 <div>
 <p className="font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper mb-1">2. Mount and initialise</p>
 <pre className="bg-ink text-paper p-3 font-mono text-xs overflow-x-auto">&lt;div id=&quot;allowance-guard&quot;&gt;&lt;/div&gt;{'\n'}AllowanceGuard.init(&#123;...&#125;)</pre>
 </div>
 </div>
 </div>
 </section>

 {/* Widget properties */}
 <section className="space-y-6">
 <h2 id="widget-properties" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
 Widget properties.
 </h2>
 <p className="font-plex text-base text-ink-muted leading-[1.65]">
 Seven props. Only <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">walletAddress</code> is required; defaults work for the rest.
 </p>
 <table className="w-full text-sm border-t border-b border-ink-rule">
 <thead>
 <tr className="border-b border-ink-rule">
 <th className="px-4 py-3 text-left font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Property</th>
 <th className="px-4 py-3 text-left font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Type</th>
 <th className="px-4 py-3 text-left font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Default</th>
 <th className="px-4 py-3 text-left font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Description</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-ink-rule">
 {props.map((p) => (
 <tr key={p.name}>
 <td className="px-4 py-3 font-mono text-sm text-amber-deep whitespace-nowrap">{p.name}</td>
 <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{p.type}</td>
 <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{p.defaultValue}</td>
 <td className="px-4 py-3 font-plex text-sm text-ink-muted leading-[1.5]">{p.description}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </section>

 </div>
 </Container>
 </Section>
 </div>
 )
}
