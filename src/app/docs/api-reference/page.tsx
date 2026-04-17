'use client'

/**
 * API reference — quiet-bold Ledger layout.
 *
 * Single-column prose with display headings, flat tables with divide-y
 * hairlines, and ApiEndpoint / CodeExample components preserved as
 * teaching surfaces. No icon-prefixed section headings, no amber-tinted
 * callout boxes, no button-style CTAs — those were chrome.
 *
 * Council:
 * Kael: No rounded-* card frames. No bg-amber-500 fills. No dark: tokens.
 * #7 Maren: H1 at display scale carries the page; H2s state the thing.
 * #21 Technical: Endpoint coverage intact — Health, Chains, Scan, Scan
 * status, Allowances, Risk score, Risk check, Simulate. All preserved.
 * #22 Conversion: Closing CTA is a quiet sentence with two inline links,
 * not a framed button row.
 * Noor: amber-deep on paper is AA; table uses text-ink / text-ink-muted.
 */

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { ApiEndpoint } from '@/components/docs/ApiEndpoint'
import { CodeExample } from '@/components/docs/CodeExample'
import { ApiPlayground } from '@/components/docs/ApiPlayground'
import Link from 'next/link'

const rateLimits = [
 { plan: 'Free', daily: '100', burst: '10', price: '$0' },
 { plan: 'Developer', daily: '10,000', burst: '60', price: '$39/mo' },
 { plan: 'Growth', daily: '100,000', burst: '300', price: '$149/mo' },
 { plan: 'Enterprise', daily: 'Unlimited', burst: 'Unlimited', price: 'Custom' },
]

const errorCodes: Array<[string, string, string]> = [
 ['400', 'BAD_REQUEST', 'Invalid request parameters or body'],
 ['401', 'MISSING_AUTH', 'No Authorization header provided'],
 ['401', 'INVALID_API_KEY', 'API key is invalid, expired, or revoked'],
 ['403', 'FORBIDDEN', 'Insufficient plan permissions'],
 ['404', 'NOT_FOUND', 'Resource does not exist'],
 ['429', 'RATE_LIMIT_EXCEEDED', 'Daily rate limit exceeded'],
 ['429', 'BURST_RATE_LIMIT_EXCEEDED', 'Per-minute burst limit exceeded'],
 ['500', 'INTERNAL_ERROR', 'Unexpected server error'],
]

export default function ApiReferencePage() {
 return (
 <div className="min-h-screen bg-paper text-ink">
 <Section className="py-16 sm:py-24 lg:py-28">
 <Container>
 <div className="max-w-4xl mx-auto space-y-20">

 {/* Hero — three lines */}
 <header className="space-y-5">
 <div className="inline-flex items-baseline gap-3">
 <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
 Docs &middot; API reference
 </span>
 <span className="h-px w-12 bg-ink-rule" aria-hidden="true" />
 </div>
 <h1 className="font-display-tight text-ink tracking-tight leading-[1.0] text-5xl sm:text-6xl lg:text-7xl">
 API reference.
 </h1>
 <p className="font-plex text-lg sm:text-xl text-ink-muted leading-[1.55] max-w-2xl">
 AllowanceGuard REST API v1. Scan wallets, query allowances, score risk, and simulate revocations &mdash; programmatically across all 27 supported EVM chains. Base URL{' '}
 <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">https://www.allowanceguard.com/api/v1</code>. JSON responses, Bearer-token authentication.
 </p>
 </header>

 {/* Authentication */}
 <section className="space-y-6">
 <h2 id="authentication" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
 Authentication.
 </h2>
 <p className="font-plex text-base text-ink-muted leading-[1.65]">
 Every endpoint except <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">/health</code> requires an API key, sent as a Bearer token in the <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">Authorization</code> header.
 </p>
 <CodeExample
 tabs={[
 {
 language: 'bash',
 label: 'cURL',
 code: `curl -H"Authorization: Bearer ag_live_your_key_here" \\
 https://www.allowanceguard.com/api/v1/chains`,
 },
 {
 language: 'javascript',
 label: 'JavaScript',
 code: `const res = await fetch('https://www.allowanceguard.com/api/v1/chains', {
 headers: {
 'Authorization': 'Bearer ag_live_your_key_here',
 },
});
const { data } = await res.json();`,
 },
 {
 language: 'python',
 label: 'Python',
 code: `import requests

res = requests.get(
 'https://www.allowanceguard.com/api/v1/chains',
 headers={'Authorization': 'Bearer ag_live_your_key_here'}
)
data = res.json()['data']`,
 },
 ]}
 />
 <p className="font-plex text-sm text-ink-muted leading-[1.6] pt-2 border-t border-ink-rule">
 <strong className="text-ink font-semibold">Keep your API key secret.</strong> Never expose an <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">ag_live_*</code> key in client-side code. Use an <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">ag_pub_*</code> read-only key for browser contexts, or proxy through your server.
 </p>
 </section>

 {/* Rate limits */}
 <section className="space-y-6">
 <h2 id="rate-limits" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
 Rate limits.
 </h2>
 <p className="font-plex text-base text-ink-muted leading-[1.65]">
 Applied per API key, based on plan. Every response carries rate-limit headers so you can back off cleanly.
 </p>
 <table className="w-full text-sm border-t border-b border-ink-rule">
 <thead>
 <tr className="border-b border-ink-rule">
 <th className="px-4 py-3 text-left font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Plan</th>
 <th className="px-4 py-3 text-left font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Daily limit</th>
 <th className="px-4 py-3 text-left font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Burst / min</th>
 <th className="px-4 py-3 text-left font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Price</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-ink-rule">
 {rateLimits.map((r) => (
 <tr key={r.plan}>
 <td className="px-4 py-3 font-plex font-semibold text-ink">{r.plan}</td>
 <td className="px-4 py-3 font-mono text-ink-muted">{r.daily}</td>
 <td className="px-4 py-3 font-mono text-ink-muted">{r.burst}</td>
 <td className="px-4 py-3 font-plex text-ink-muted">{r.price}</td>
 </tr>
 ))}
 </tbody>
 </table>
 <p className="font-plex text-sm text-ink-muted leading-[1.6]">
 Response headers: <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">X-RateLimit-Limit</code>, <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">X-RateLimit-Remaining</code>, <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">X-RateLimit-Reset</code>.
 </p>
 </section>

 {/* Response format */}
 <section className="space-y-6">
 <h2 id="response-format" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
 Response format.
 </h2>
 <p className="font-plex text-base text-ink-muted leading-[1.65]">
 Every endpoint returns a consistent JSON envelope with{' '}
 <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">data</code>,{' '}
 <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">error</code>, and{' '}
 <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">meta</code> fields. Exactly one of <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">data</code> or <code className="bg-paper-sub px-1.5 py-0.5 text-[0.85em] text-amber-deep font-mono">error</code> is non-null on every response.
 </p>
 <CodeExample
 tabs={[
 {
 language: 'json',
 label: 'Success',
 code: `{"data": { ... },"error": null,"meta": {"requestId":"550e8400-e29b-41d4-a716-446655440000","timestamp":"2026-03-30T12:00:00.000Z","rateLimit": {"limit": 10000,"remaining": 9999,"window":"rolling-24h"
 }
 }
}`,
 },
 {
 language: 'json',
 label: 'Error',
 code: `{"data": null,"error": {"message":"Validation failed","code":"BAD_REQUEST","details": {"wallet": ["Invalid wallet address format"] }
 },"meta": {"requestId":"550e8400-e29b-41d4-a716-446655440000","timestamp":"2026-03-30T12:00:00.000Z"
 }
}`,
 },
 ]}
 />
 </section>

 {/* Endpoints */}
 <section className="space-y-10">
 <div className="space-y-4">
 <h2 id="endpoints" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
 Endpoints.
 </h2>
 <p className="font-plex text-base text-ink-muted leading-[1.65]">
 Eight endpoints, grouped by purpose. The interactive panels let you test against your own key.
 </p>
 </div>

 <div className="space-y-6">
 <h3 id="health-info" className="font-display-tight text-ink tracking-tight text-2xl">
 Health &amp; info.
 </h3>
 <ApiEndpoint
 method="GET"
 path="/api/v1/health"
 description="Check API and service health. No authentication required."
 auth={false}
 responseExample={`{"status":"healthy","version":"v1","services": {"api":"ok","database":"ok","cache":"ok" },"timestamp":"2026-03-30T12:00:00.000Z"
}`}
 />
 <ApiEndpoint
 method="GET"
 path="/api/v1/chains"
 description="List every supported chain with chainId, name, symbol, and explorer URL."
 responseExample={`{"data": {"chains": [
 {"chainId": 1,"name":"Ethereum","symbol":"ETH","explorer":"https://etherscan.io" },
 {"chainId": 42161,"name":"Arbitrum","symbol":"ETH","explorer":"https://arbiscan.io" },
 {"chainId": 8453,"name":"Base","symbol":"ETH","explorer":"https://basescan.org" }
 ],"count": 27
 },"error": null,"meta": { ... }
}`}
 />
 </div>

 <div className="space-y-6">
 <h3 id="wallet-scanning" className="font-display-tight text-ink tracking-tight text-2xl">
 Wallet scanning.
 </h3>
 <ApiEndpoint
 method="POST"
 path="/api/v1/scan"
 description="Submit a wallet for scanning. Returns a scan ID for polling."
 bodyParams={[
 { name: 'wallet', type: 'string', required: true, description: 'Wallet address (0x...)' },
 { name: 'chains', type: 'number[]', required: false, description: 'Chain IDs to scan. Defaults to all enabled chains.' },
 ]}
 responseExample={`{"data": {"scanId": 12345,"wallet":"0x1234...abcd","chains": [1, 42161, 8453],"status":"pending","statusUrl":"/api/v1/scan/12345"
 },"error": null,"meta": { ... }
}`}
 />
 <ApiEndpoint
 method="GET"
 path="/api/v1/scan/:id"
 description="Check a scan job's status. 404s for scans owned by a different key."
 params={[
 { name: 'id', type: 'number', required: true, description: 'Scan job ID returned from POST /api/v1/scan' },
 ]}
 responseExample={`{"data": {"scanId": 12345,"status":"succeeded","wallet":"0x1234...abcd","chains": [1, 42161, 8453],"attempts": 1,"error": null,"createdAt":"2026-03-30T12:00:00.000Z","startedAt":"2026-03-30T12:00:01.000Z","completedAt":"2026-03-30T12:00:05.000Z"
 },"error": null,"meta": { ... }
}`}
 />
 </div>

 <div className="space-y-6">
 <h3 id="allowances" className="font-display-tight text-ink tracking-tight text-2xl">
 Allowances.
 </h3>
 <ApiEndpoint
 method="GET"
 path="/api/v1/allowances"
 description="Token allowances for a wallet, optionally filtered by chain and risk level."
 params={[
 { name: 'wallet', type: 'string', required: true, description: 'Wallet address (0x...)' },
 { name: 'chainId', type: 'number', required: false, description: 'Filter by chain ID' },
 { name: 'riskOnly', type: 'boolean', required: false, description: 'Only return risky / unlimited allowances' },
 { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
 { name: 'pageSize', type: 'number', required: false, description: 'Results per page (default: 25, max: 100)' },
 ]}
 responseExample={`{"data": {"allowances": [
 {"chain_id": 1,"token_address":"0xdac17f...","spender_address":"0x68b3465...","token_symbol":"USDT","spender_label":"Uniswap V3 Router","is_unlimited": true,"risk_score": 5,"risk_flags": []
 }
 ],"pagination": {"page": 1,"pageSize": 25,"total": 12,"totalPages": 1 }
 },"error": null,"meta": { ... }
}`}
 >
 <ApiPlayground
 method="GET"
 path="/api/v1/allowances"
 defaultParams={{ wallet: '', chainId: '', riskOnly: '', page: '1', pageSize: '25' }}
 />
 </ApiEndpoint>
 </div>

 <div className="space-y-6">
 <h3 id="risk-assessment" className="font-display-tight text-ink tracking-tight text-2xl">
 Risk assessment.
 </h3>
 <ApiEndpoint
 method="GET"
 path="/api/v1/risk-score"
 description="Aggregated wallet risk score (0–100) with breakdown and top risky allowances."
 params={[
 { name: 'wallet', type: 'string', required: true, description: 'Wallet address (0x...)' },
 { name: 'chainId', type: 'number', required: false, description: 'Filter by chain ID' },
 ]}
 responseExample={`{"data": {"wallet":"0x1234...abcd","riskScore": 45,"riskLevel":"high","breakdown": {"totalAllowances": 15,"unlimitedAllowances": 3,"highRisk": 1,"mediumRisk": 2,"lowRisk": 4,"chainsWithAllowances": 3
 },"topRisks": [ ... ]
 },"error": null,"meta": { ... }
}`}
 >
 <ApiPlayground method="GET" path="/api/v1/risk-score" defaultParams={{ wallet: '' }} />
 </ApiEndpoint>
 <ApiEndpoint
 method="POST"
 path="/api/v1/risk-check"
 description="Pre-signing risk assessment. Evaluate a proposed approval before the user signs. For wallet providers and dApp frontends."
 bodyParams={[
 { name: 'token', type: 'string', required: true, description: 'Token contract address (0x...)' },
 { name: 'spender', type: 'string', required: true, description: 'Spender contract address (0x...)' },
 { name: 'chainId', type: 'number', required: true, description: 'Chain ID' },
 { name: 'amount', type: 'string', required: false, description: 'Approval amount (raw) or"unlimited"' },
 ]}
 responseExample={`{"data": {"token": {"address":"0xdac17f...","symbol":"USDT" },"spender": {"address":"0x68b346...","label":"Uniswap V3 Router","trusted": true },"approval": {"amount":"unlimited","isUnlimited": true },"risk": {"score": 25,"level":"medium","flags": [
 {"code":"UNLIMITED_APPROVAL","severity":"high","message":"..." }
 ]
 },"recommendation":"MODERATE — Spender appears mostly safe. Prefer limited approvals."
 },"error": null,"meta": { ... }
}`}
 >
 <ApiPlayground
 method="POST"
 path="/api/v1/risk-check"
 defaultBody={`{"token":"0xdAC17F958D2ee523a2206206994597C13D831ec7","spender":"0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45","chainId": 1,"amount":"unlimited"
}`}
 />
 </ApiEndpoint>
 </div>

 <div className="space-y-6">
 <h3 id="simulation" className="font-display-tight text-ink tracking-tight text-2xl">
 Simulation.
 </h3>
 <ApiEndpoint
 method="POST"
 path="/api/v1/simulate"
 description="Time-machine simulation. Returns how a wallet's risk score would change if specific allowances were revoked. No state change."
 bodyParams={[
 { name: 'wallet', type: 'string', required: true, description: 'Wallet address (0x...)' },
 { name: 'chainId', type: 'number', required: false, description: 'Filter by chain ID' },
 { name: 'revokeAll', type: 'boolean', required: false, description: 'Simulate revoking all allowances' },
 { name: 'revokeSpenders', type: 'string[]', required: false, description: 'List of spender addresses to simulate revoking' },
 ]}
 responseExample={`{"data": {"wallet":"0x1234...abcd","simulation": {"before": {"riskScore": 45,"totalAllowances": 15,"unlimitedAllowances": 3 },"after": {"riskScore": 10,"totalAllowances": 8,"unlimitedAllowances": 0 },"improvement": {"scoreReduction": 35,"allowancesRevoked": 7,"percentImprovement": 78
 }
 }
 },"error": null,"meta": { ... }
}`}
 >
 <ApiPlayground
 method="POST"
 path="/api/v1/simulate"
 defaultBody={`{"wallet":"0x1234567890abcdef1234567890abcdef12345678","revokeAll": true
}`}
 />
 </ApiEndpoint>
 </div>
 </section>

 {/* Quick start */}
 <section className="space-y-6">
 <h2 id="quick-start" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
 Quick start.
 </h2>
 <p className="font-plex text-base text-ink-muted leading-[1.65]">
 Scan a wallet and retrieve its risk profile in three API calls.
 </p>
 <CodeExample
 tabs={[
 {
 language: 'javascript',
 label: 'JavaScript',
 code: `const API_KEY = 'ag_live_your_key_here';
const BASE = 'https://www.allowanceguard.com/api/v1';
const headers = { 'Authorization': \`Bearer \${API_KEY}\` };

// 1. Trigger a scan
const scan = await fetch(\`\${BASE}/scan\`, {
 method: 'POST',
 headers: { ...headers, 'Content-Type': 'application/json' },
 body: JSON.stringify({ wallet: '0x1234...abcd' }),
}).then(r => r.json());

const scanId = scan.data.scanId;

// 2. Poll until complete
let status = 'pending';
while (status === 'pending' || status === 'running') {
 await new Promise(r => setTimeout(r, 2000));
 const job = await fetch(\`\${BASE}/scan/\${scanId}\`, { headers }).then(r => r.json());
 status = job.data.status;
}

// 3. Get the risk score
const risk = await fetch(
 \`\${BASE}/risk-score?wallet=0x1234...abcd\`,
 { headers }
).then(r => r.json());

console.log(\`Risk: \${risk.data.riskScore}/100 (\${risk.data.riskLevel})\`);`,
 },
 {
 language: 'python',
 label: 'Python',
 code: `import requests, time

API_KEY = 'ag_live_your_key_here'
BASE = 'https://www.allowanceguard.com/api/v1'
headers = {'Authorization': f'Bearer {API_KEY}'}

# 1. Trigger a scan
scan = requests.post(f'{BASE}/scan',
 headers={**headers, 'Content-Type': 'application/json'},
 json={'wallet': '0x1234...abcd'}
).json()

scan_id = scan['data']['scanId']

# 2. Poll until complete
status = 'pending'
while status in ('pending', 'running'):
 time.sleep(2)
 job = requests.get(f'{BASE}/scan/{scan_id}', headers=headers).json()
 status = job['data']['status']

# 3. Get the risk score
risk = requests.get(
 f'{BASE}/risk-score',
 headers=headers,
 params={'wallet': '0x1234...abcd'}
).json()

print(f"Risk: {risk['data']['riskScore']}/100 ({risk['data']['riskLevel']})")`,
 },
 {
 language: 'bash',
 label: 'cURL',
 code: `# 1. Trigger a scan
curl -X POST https://www.allowanceguard.com/api/v1/scan \\
 -H"Authorization: Bearer ag_live_your_key_here" \\
 -H"Content-Type: application/json" \\
 -d '{"wallet":"0x1234...abcd"}'

# 2. Check scan status
curl https://www.allowanceguard.com/api/v1/scan/12345 \\
 -H"Authorization: Bearer ag_live_your_key_here"

# 3. Get risk score
curl"https://www.allowanceguard.com/api/v1/risk-score?wallet=0x1234...abcd" \\
 -H"Authorization: Bearer ag_live_your_key_here"`,
 },
 ]}
 />
 </section>

 {/* Error codes */}
 <section className="space-y-6">
 <h2 id="error-codes" className="font-display-tight text-ink tracking-tight text-3xl sm:text-4xl">
 Error codes.
 </h2>
 <table className="w-full text-sm border-t border-b border-ink-rule">
 <thead>
 <tr className="border-b border-ink-rule">
 <th className="px-4 py-3 text-left font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">HTTP</th>
 <th className="px-4 py-3 text-left font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Code</th>
 <th className="px-4 py-3 text-left font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-ink-whisper">Description</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-ink-rule">
 {errorCodes.map(([http, code, desc]) => (
 <tr key={code}>
 <td className="px-4 py-3 font-mono text-xs text-ink-muted">{http}</td>
 <td className="px-4 py-3 font-mono text-xs text-amber-deep">{code}</td>
 <td className="px-4 py-3 font-plex text-sm text-ink-muted">{desc}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </section>

 {/* Closing line — no CTA buttons, just two inline links */}
 <section className="pt-8 border-t border-ink-rule">
 <p className="font-plex text-base text-ink-muted leading-[1.65]">
 Ready to integrate? Grab a key from{' '}
 <Link href="/account/keys" className="text-amber-deep hover:underline underline-offset-2 font-medium">the account dashboard</Link>, or{' '}
 <Link href="/pricing" className="text-amber-deep hover:underline underline-offset-2 font-medium">review the plans</Link>{' '}
 first.
 </p>
 </section>

 </div>
 </Container>
 </Section>
 </div>
 )
}
