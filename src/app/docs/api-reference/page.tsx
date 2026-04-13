'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { ApiEndpoint } from '@/components/docs/ApiEndpoint'
import { CodeExample } from '@/components/docs/CodeExample'
import { ApiPlayground } from '@/components/docs/ApiPlayground'
import { Key, Shield, Zap, Globe, AlertTriangle, Activity } from 'lucide-react'

const rateLimits = [
  { plan: 'Free', daily: '100', burst: '10', price: '$0' },
  { plan: 'Developer', daily: '10,000', burst: '60', price: '$39/mo' },
  { plan: 'Growth', daily: '100,000', burst: '300', price: '$149/mo' },
  { plan: 'Enterprise', daily: 'Unlimited', burst: 'Unlimited', price: 'Custom' },
]

export default function ApiReferencePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <span className="inline-block mb-4 text-xs uppercase tracking-[0.2em] font-semibold text-amber-deep">
                Docs &middot; API Reference
              </span>
              <H1 className="text-ink">API Reference</H1>
              <p className="text-ink-soft mt-4 text-lg max-w-2xl">
                AllowanceGuard REST API v1. Scan wallets, query allowances, score risk, and simulate revocations &mdash; programmatically across all 27 supported chains.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="px-3 py-1 bg-paper-sub border border-amber-400/30 text-amber-deep text-sm  font-mono">
                  Base URL: /api/v1
                </span>
                <span className="px-3 py-1 bg-paper-sub border border-ink-rule text-ink-soft text-sm ">
                  JSON responses
                </span>
                <span className="px-3 py-1 bg-paper-sub border border-ink-rule text-ink-soft text-sm ">
                  Bearer token auth
                </span>
              </div>
            </div>

          {/* Authentication */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-ink mb-4 flex items-center gap-2">
              <Key className="w-6 h-6 text-amber-deep dark:text-amber-deep" />
              Authentication
            </h2>
            <p className="text-ink-soft mb-4">
              All API endpoints (except <code className="text-sm bg-paper-sub border border-ink-rule px-1 rounded">/health</code>)
              require an API key sent via the <code className="text-sm bg-paper-sub border border-ink-rule px-1 rounded">Authorization</code> header.
            </p>
            <CodeExample
              tabs={[
                {
                  language: 'bash',
                  label: 'cURL',
                  code: `curl -H "Authorization: Bearer ag_live_your_key_here" \\
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
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 ">
              <p className="text-sm text-amber-deep dark:text-amber-deep">
                <strong>Keep your API key secret.</strong> Do not expose it in client-side
                code. All calls should be made from your server.
              </p>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-ink mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-deep dark:text-amber-deep" />
              Rate Limits
            </h2>
            <p className="text-ink-soft mb-4">
              Rate limits are applied per API key based on your plan. Every response includes
              rate limit headers.
            </p>
            <div className="border border-ink-rule  overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-paper-sub border border-ink-rule text-left">
                    <th className="px-4 py-3 font-medium text-ink-soft">Plan</th>
                    <th className="px-4 py-3 font-medium text-ink-soft">Daily Limit</th>
                    <th className="px-4 py-3 font-medium text-ink-soft">Burst (per min)</th>
                    <th className="px-4 py-3 font-medium text-ink-soft">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {rateLimits.map((r) => (
                    <tr key={r.plan} className="border-t border-ink-rule">
                      <td className="px-4 py-3 text-ink font-medium">{r.plan}</td>
                      <td className="px-4 py-3 font-mono text-ink-soft">{r.daily}</td>
                      <td className="px-4 py-3 font-mono text-ink-soft">{r.burst}</td>
                      <td className="px-4 py-3 text-ink-soft">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink-soft mt-3">
              Headers: <code className="bg-paper-sub border border-ink-rule px-1 rounded">X-RateLimit-Limit</code>,{' '}
              <code className="bg-paper-sub border border-ink-rule px-1 rounded">X-RateLimit-Remaining</code>
            </p>
          </div>

          {/* Response Format */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-ink mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-amber-deep dark:text-amber-deep" />
              Response Format
            </h2>
            <p className="text-ink-soft mb-4">
              All endpoints return a consistent JSON envelope with{' '}
              <code className="text-sm bg-paper-sub border border-ink-rule px-1 rounded">data</code>,{' '}
              <code className="text-sm bg-paper-sub border border-ink-rule px-1 rounded">error</code>, and{' '}
              <code className="text-sm bg-paper-sub border border-ink-rule px-1 rounded">meta</code> fields.
            </p>
            <CodeExample
              tabs={[
                {
                  language: 'json',
                  label: 'Success',
                  code: `{
  "data": { ... },
  "error": null,
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-03-30T12:00:00.000Z",
    "rateLimit": {
      "limit": 10000,
      "remaining": 9999,
      "resetsAt": "2026-03-31T12:00:00.000Z"
    }
  }
}`,
                },
                {
                  language: 'json',
                  label: 'Error',
                  code: `{
  "data": null,
  "error": {
    "message": "Validation failed",
    "code": "BAD_REQUEST",
    "details": { "wallet": ["Invalid wallet address format"] }
  },
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-03-30T12:00:00.000Z"
  }
}`,
                },
              ]}
            />
          </div>

          {/* ——————— Endpoints ——————— */}

          {/* Health */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-ink mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-amber-deep dark:text-amber-deep" />
              Endpoints
            </h2>

            <h3 className="text-lg font-bold text-ink mb-3">Health & Info</h3>

            <ApiEndpoint
              method="GET"
              path="/api/v1/health"
              description="Check API and service health status. No authentication required."
              auth={false}
              responseExample={`{
  "status": "healthy",
  "version": "v1",
  "services": { "api": "ok", "database": "ok", "cache": "ok" },
  "timestamp": "2026-03-30T12:00:00.000Z"
}`}
            />

            <ApiEndpoint
              method="GET"
              path="/api/v1/chains"
              description="List all supported blockchain networks with their chain IDs, symbols, and explorer URLs."
              responseExample={`{
  "data": {
    "chains": [
      { "chainId": 1, "name": "Ethereum", "symbol": "ETH", "explorer": "https://etherscan.io" },
      { "chainId": 42161, "name": "Arbitrum", "symbol": "ETH", "explorer": "https://arbiscan.io" },
      { "chainId": 8453, "name": "Base", "symbol": "ETH", "explorer": "https://basescan.org" }
    ],
    "count": 7
  },
  "error": null,
  "meta": { ... }
}`}
            />
          </div>

          {/* Scanning */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-ink mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-deep dark:text-amber-deep" />
              Wallet Scanning
            </h3>

            <ApiEndpoint
              method="POST"
              path="/api/v1/scan"
              description="Submit a wallet address for scanning. Returns a scan ID to poll for results."
              bodyParams={[
                { name: 'wallet', type: 'string', required: true, description: 'Wallet address (0x...)' },
                { name: 'chains', type: 'number[]', required: false, description: 'Chain IDs to scan. Defaults to all enabled chains.' },
              ]}
              responseExample={`{
  "data": {
    "scanId": 12345,
    "wallet": "0x1234...abcd",
    "chains": [1, 42161, 8453],
    "status": "pending",
    "statusUrl": "/api/v1/scan/12345"
  },
  "error": null,
  "meta": { ... }
}`}
            />

            <ApiEndpoint
              method="GET"
              path="/api/v1/scan/:id"
              description="Check the status of a previously submitted scan job."
              params={[
                { name: 'id', type: 'number', required: true, description: 'Scan job ID returned from POST /api/v1/scan' },
              ]}
              responseExample={`{
  "data": {
    "scanId": 12345,
    "status": "succeeded",
    "wallet": "0x1234...abcd",
    "chains": [1, 42161, 8453],
    "attempts": 1,
    "error": null,
    "createdAt": "2026-03-30T12:00:00.000Z",
    "startedAt": "2026-03-30T12:00:01.000Z",
    "completedAt": "2026-03-30T12:00:05.000Z"
  },
  "error": null,
  "meta": { ... }
}`}
            />
          </div>

          {/* Allowances */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-ink mb-3">Allowances</h3>

            <ApiEndpoint
              method="GET"
              path="/api/v1/allowances"
              description="Retrieve token allowances for a wallet, with optional filtering by chain and risk level."
              params={[
                { name: 'wallet', type: 'string', required: true, description: 'Wallet address (0x...)' },
                { name: 'chainId', type: 'number', required: false, description: 'Filter by chain ID' },
                { name: 'riskOnly', type: 'boolean', required: false, description: 'Only return risky/unlimited allowances' },
                { name: 'page', type: 'number', required: false, description: 'Page number (default: 1)' },
                { name: 'pageSize', type: 'number', required: false, description: 'Results per page (default: 25, max: 100)' },
              ]}
              responseExample={`{
  "data": {
    "allowances": [
      {
        "chain_id": 1,
        "token_address": "0xdac17f...",
        "spender_address": "0x68b3465...",
        "token_symbol": "USDT",
        "spender_label": "Uniswap V3 Router",
        "is_unlimited": true,
        "risk_score": 5,
        "risk_flags": []
      }
    ],
    "pagination": { "page": 1, "pageSize": 25, "total": 12, "totalPages": 1 }
  },
  "error": null,
  "meta": { ... }
}`}
            >
              <ApiPlayground
                method="GET"
                path="/api/v1/allowances"
                defaultParams={{ wallet: '', chainId: '', riskOnly: '', page: '1', pageSize: '25' }}
              />
            </ApiEndpoint>
          </div>

          {/* Risk */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-ink mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-deep dark:text-amber-deep" />
              Risk Assessment
            </h3>

            <ApiEndpoint
              method="GET"
              path="/api/v1/risk-score"
              description="Get an aggregated risk score (0-100) for a wallet with risk breakdown and top risky allowances."
              params={[
                { name: 'wallet', type: 'string', required: true, description: 'Wallet address (0x...)' },
                { name: 'chainId', type: 'number', required: false, description: 'Filter by chain ID' },
              ]}
              responseExample={`{
  "data": {
    "wallet": "0x1234...abcd",
    "riskScore": 45,
    "riskLevel": "high",
    "breakdown": {
      "totalAllowances": 15,
      "unlimitedAllowances": 3,
      "highRisk": 1,
      "mediumRisk": 2,
      "lowRisk": 4,
      "chainsWithAllowances": 3
    },
    "topRisks": [ ... ]
  },
  "error": null,
  "meta": { ... }
}`}
            >
              <ApiPlayground
                method="GET"
                path="/api/v1/risk-score"
                defaultParams={{ wallet: '' }}
              />
            </ApiEndpoint>

            <ApiEndpoint
              method="POST"
              path="/api/v1/risk-check"
              description="Pre-signing risk assessment. Evaluate the risk of a token approval BEFORE the user signs. Ideal for wallet providers and dApp frontends."
              bodyParams={[
                { name: 'token', type: 'string', required: true, description: 'Token contract address (0x...)' },
                { name: 'spender', type: 'string', required: true, description: 'Spender contract address (0x...)' },
                { name: 'chainId', type: 'number', required: true, description: 'Chain ID' },
                { name: 'amount', type: 'string', required: false, description: 'Approval amount (raw) or "unlimited"' },
              ]}
              responseExample={`{
  "data": {
    "token": { "address": "0xdac17f...", "symbol": "USDT" },
    "spender": { "address": "0x68b346...", "label": "Uniswap V3 Router", "trusted": true },
    "approval": { "amount": "unlimited", "isUnlimited": true },
    "risk": {
      "score": 25,
      "level": "medium",
      "flags": [
        { "code": "UNLIMITED_APPROVAL", "severity": "high", "message": "..." }
      ]
    },
    "recommendation": "MODERATE — Spender appears mostly safe. Prefer limited approvals."
  },
  "error": null,
  "meta": { ... }
}`}
            >
              <ApiPlayground
                method="POST"
                path="/api/v1/risk-check"
                defaultBody={`{
  "token": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  "spender": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
  "chainId": 1,
  "amount": "unlimited"
}`}
              />
            </ApiEndpoint>
          </div>

          {/* Simulation */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-ink mb-3">Simulation</h3>

            <ApiEndpoint
              method="POST"
              path="/api/v1/simulate"
              description="Time Machine simulation. See how your wallet's risk score would change if specific allowances were revoked."
              bodyParams={[
                { name: 'wallet', type: 'string', required: true, description: 'Wallet address (0x...)' },
                { name: 'chainId', type: 'number', required: false, description: 'Filter by chain ID' },
                { name: 'revokeAll', type: 'boolean', required: false, description: 'Simulate revoking all allowances' },
                { name: 'revokeSpenders', type: 'string[]', required: false, description: 'List of spender addresses to simulate revoking' },
              ]}
              responseExample={`{
  "data": {
    "wallet": "0x1234...abcd",
    "simulation": {
      "before": { "riskScore": 45, "totalAllowances": 15, "unlimitedAllowances": 3 },
      "after": { "riskScore": 10, "totalAllowances": 8, "unlimitedAllowances": 0 },
      "improvement": {
        "scoreReduction": 35,
        "allowancesRevoked": 7,
        "percentImprovement": 78
      }
    }
  },
  "error": null,
  "meta": { ... }
}`}
            >
              <ApiPlayground
                method="POST"
                path="/api/v1/simulate"
                defaultBody={`{
  "wallet": "0x1234567890abcdef1234567890abcdef12345678",
  "revokeAll": true
}`}
              />
            </ApiEndpoint>
          </div>

          {/* Quick Start */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-ink mb-4">Quick Start</h2>
            <p className="text-ink-soft mb-4">
              Scan a wallet and retrieve its risk profile in three API calls:
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

print(f"Risk: {risk['data']['riskScore']}/100 ({risk['data']['riskLevel']}")`,
                },
                {
                  language: 'bash',
                  label: 'cURL',
                  code: `# 1. Trigger a scan
curl -X POST https://www.allowanceguard.com/api/v1/scan \\
  -H "Authorization: Bearer ag_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"wallet": "0x1234...abcd"}'

# 2. Check scan status
curl https://www.allowanceguard.com/api/v1/scan/12345 \\
  -H "Authorization: Bearer ag_live_your_key_here"

# 3. Get risk score
curl "https://www.allowanceguard.com/api/v1/risk-score?wallet=0x1234...abcd" \\
  -H "Authorization: Bearer ag_live_your_key_here"`,
                },
              ]}
            />
          </div>

          {/* Error Codes */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-ink mb-4">Error Codes</h2>
            <div className="border border-ink-rule  overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-paper-sub border border-ink-rule text-left">
                    <th className="px-4 py-3 font-medium text-ink-soft">HTTP</th>
                    <th className="px-4 py-3 font-medium text-ink-soft">Code</th>
                    <th className="px-4 py-3 font-medium text-ink-soft">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['400', 'BAD_REQUEST', 'Invalid request parameters or body'],
                    ['401', 'MISSING_AUTH', 'No Authorization header provided'],
                    ['401', 'INVALID_API_KEY', 'API key is invalid, expired, or revoked'],
                    ['403', 'FORBIDDEN', 'Insufficient plan permissions'],
                    ['404', 'NOT_FOUND', 'Resource does not exist'],
                    ['429', 'RATE_LIMIT_EXCEEDED', 'Daily rate limit exceeded'],
                    ['429', 'BURST_RATE_LIMIT_EXCEEDED', 'Per-minute burst limit exceeded'],
                    ['500', 'INTERNAL_ERROR', 'Unexpected server error'],
                  ].map(([http, code, desc]) => (
                    <tr key={code} className="border-t border-ink-rule">
                      <td className="px-4 py-2 font-mono text-xs text-ink-soft">{http}</td>
                      <td className="px-4 py-2 font-mono text-xs text-ink">{code}</td>
                      <td className="px-4 py-2 text-xs text-ink-soft">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-8 bg-paper-sub border border-ink-rule border-2 border-ink-rule ">
            <h3 className="text-xl font-bold text-ink mb-2">Ready to integrate?</h3>
            <p className="text-ink-soft mb-4">
              Get your API key from the Account dashboard and start building.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/account/keys"
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-ink rounded font-medium transition-colors"
              >
                Get API Key
              </a>
              <a
                href="/pricing"
                className="px-6 py-2 bg-paper border border-ink-rule text-ink rounded font-medium hover:bg-paper-sub dark:hover:bg-paper-sub transition-colors"
              >
                View Plans
              </a>
            </div>
          </div>
        </div>
        </Container>
      </Section>
    </div>
  )
}
