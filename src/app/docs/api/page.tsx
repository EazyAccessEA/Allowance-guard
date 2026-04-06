'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'

const font = { fontFamily: 'Space Grotesk, system-ui, sans-serif' }

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="bg-[#0A0E1A] border border-slate-700/50 rounded-lg p-6 mb-8">
      <pre className="text-sm text-slate-100 overflow-x-auto">{children}</pre>
    </div>
  )
}

function MethodBadge({ method }: { method: 'GET' | 'POST' | 'PUT' | 'DELETE' }) {
  const styles = {
    GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    POST: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
    PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    DELETE: 'bg-red-500/15 text-red-400 border-red-500/25',
  }
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded border ${styles[method]} mr-2`}>
      {method}
    </span>
  )
}

export default function APIPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100">

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#0F172A] to-[#0A0E1A]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-6" style={font}>
            Allowance Guard API v1 Reference
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            A RESTful API for retrieving token allowance and risk data for any Ethereum address. All endpoints are public and read-only. Data is indexed from the blockchain and updated continuously.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <Section className="py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-100 mb-8" style={font}>Quick Start</h2>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Base URL</h3>
            <CodeBlock>{`https://www.allowanceguard.com/api`}</CodeBlock>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Authentication</h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Currently, the API is public and does not require an API key. For high-volume or production use cases, please contact us to request a key for rate limiting purposes.
            </p>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Rate Limits</h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Public requests are limited to 5 requests per minute per IP address. For higher limits, use an API key.
            </p>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Headers</h3>
            <CodeBlock>{`Accept: application/json
Content-Type: application/json`}</CodeBlock>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Code Example</h3>
            <CodeBlock>{`curl -X GET "https://www.allowanceguard.com/api/allowances?wallet=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&page=1&pageSize=25" \\
  -H "Accept: application/json"`}</CodeBlock>
          </div>
        </Container>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

      {/* Endpoints */}
      <Section className="py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-100 mb-8" style={font}>Endpoints</h2>

            {/* GET /allowances */}
            <h3 className="text-2xl font-semibold text-slate-100 mb-4" style={font}>
              <MethodBadge method="GET" />/allowances
            </h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Retrieves a paginated list of token allowances for a given address.
            </p>

            <h4 className="text-xl font-semibold text-slate-100 mb-4" style={font}>Parameters</h4>
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6 mb-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-2 font-semibold text-slate-100">Parameter</th>
                    <th className="text-left py-2 font-semibold text-slate-100">Type</th>
                    <th className="text-left py-2 font-semibold text-slate-100">Required</th>
                    <th className="text-left py-2 font-semibold text-slate-100">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 font-mono text-amber-400">wallet</td>
                    <td className="py-2 text-slate-400">string</td>
                    <td className="py-2 text-slate-400">Yes</td>
                    <td className="py-2 text-slate-400">Ethereum address (0x format)</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 font-mono text-amber-400">page</td>
                    <td className="py-2 text-slate-400">number</td>
                    <td className="py-2 text-slate-400">No</td>
                    <td className="py-2 text-slate-400">Page number (default: 1)</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 font-mono text-amber-400">pageSize</td>
                    <td className="py-2 text-slate-400">number</td>
                    <td className="py-2 text-slate-400">No</td>
                    <td className="py-2 text-slate-400">Results per page (default: 25, max: 100)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-amber-400">riskOnly</td>
                    <td className="py-2 text-slate-400">boolean</td>
                    <td className="py-2 text-slate-400">No</td>
                    <td className="py-2 text-slate-400">Filter to risky allowances only (default: false)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-xl font-semibold text-slate-100 mb-4" style={font}>Response Body</h4>
            <CodeBlock>{`{
  "allowances": [
    {
      "chain_id": 1,
      "token_address": "0xa0b86a33e6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6",
      "spender_address": "0xb1c97d44e7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d",
      "standard": "ERC20",
      "allowance_type": "per-token",
      "amount": "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      "is_unlimited": true,
      "last_seen_block": "18500000",
      "risk_score": 50,
      "risk_flags": ["UNLIMITED"],
      "token_name": "USD Coin",
      "token_symbol": "USDC",
      "token_decimals": 6,
      "spender_label": "Uniswap V3 Router",
      "spender_trust": "verified"
    }
  ],
  "page": 1,
  "pageSize": 25,
  "total": 42
}`}</CodeBlock>

            <h4 className="text-xl font-semibold text-slate-100 mb-4" style={font}>Example Request</h4>
            <CodeBlock>{`curl -X GET "https://www.allowanceguard.com/api/allowances?wallet=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&page=1&pageSize=25&riskOnly=true" \\
  -H "Accept: application/json"`}</CodeBlock>

            {/* GET /receipts */}
            <h3 className="text-2xl font-semibold text-slate-100 mb-4 mt-12" style={font}>
              <MethodBadge method="GET" />/receipts
            </h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Retrieves revocation receipts for a given wallet address.
            </p>

            <h4 className="text-xl font-semibold text-slate-100 mb-4" style={font}>Parameters</h4>
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6 mb-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-2 font-semibold text-slate-100">Parameter</th>
                    <th className="text-left py-2 font-semibold text-slate-100">Type</th>
                    <th className="text-left py-2 font-semibold text-slate-100">Required</th>
                    <th className="text-left py-2 font-semibold text-slate-100">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 font-mono text-amber-400">wallet</td>
                    <td className="py-2 text-slate-400">string</td>
                    <td className="py-2 text-slate-400">Yes</td>
                    <td className="py-2 text-slate-400">Ethereum address (0x format)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-amber-400">limit</td>
                    <td className="py-2 text-slate-400">number</td>
                    <td className="py-2 text-slate-400">No</td>
                    <td className="py-2 text-slate-400">Number of receipts to return (default: 50, max: 100)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-xl font-semibold text-slate-100 mb-4" style={font}>Response Body</h4>
            <CodeBlock>{`{
  "receipts": [
    {
      "id": 123,
      "chain_id": 1,
      "token_address": "0xa0b86a33e6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6",
      "spender_address": "0xb1c97d44e7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d",
      "standard": "ERC20",
      "allowance_type": "per-token",
      "pre_amount": "1000000000000000000",
      "post_amount": "0",
      "tx_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "status": "verified",
      "error": null,
      "created_at": "2024-01-15T10:30:00Z",
      "verified_at": "2024-01-15T10:31:00Z"
    }
  ]
}`}</CodeBlock>

            {/* POST /scan */}
            <h3 className="text-2xl font-semibold text-slate-100 mb-4 mt-12" style={font}>
              <MethodBadge method="POST" />/scan
            </h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Triggers a blockchain scan for a wallet address across specified chains.
            </p>

            <h4 className="text-xl font-semibold text-slate-100 mb-4" style={font}>Request Body</h4>
            <CodeBlock>{`{
  "walletAddress": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "chains": ["eth", "arb", "base"]
}`}</CodeBlock>

            <h4 className="text-xl font-semibold text-slate-100 mb-4" style={font}>Response Body</h4>
            <CodeBlock>{`{
  "ok": true,
  "jobId": 456,
  "message": "Scan queued for 0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
}`}</CodeBlock>

            {/* GET /jobs/{id} */}
            <h3 className="text-2xl font-semibold text-slate-100 mb-4 mt-12" style={font}>
              <MethodBadge method="GET" />/jobs/&#123;id&#125;
            </h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Retrieves the status of a scan job.
            </p>

            <h4 className="text-xl font-semibold text-slate-100 mb-4" style={font}>Response Body</h4>
            <CodeBlock>{`{
  "id": 456,
  "type": "scan",
  "status": "succeeded",
  "attempts": 1,
  "created_at": "2024-01-15T10:30:00Z",
  "started_at": "2024-01-15T10:30:05Z",
  "finished_at": "2024-01-15T10:32:00Z",
  "error": null
}`}</CodeBlock>
          </div>
        </Container>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

      {/* Data Types */}
      <Section className="py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-100 mb-8" style={font}>Data Types</h2>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Risk Level Enum</h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              Risk assessment is based on the risk_score field and risk_flags array.
            </p>

            <div className="space-y-4 mb-8">
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-2" style={font}>High Risk (score &ge; 50)</h4>
                <p className="text-slate-400">
                  Unlimited allowances that pose immediate security risk. These allow complete drainage of token balances.
                </p>
              </div>
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-2" style={font}>Medium Risk (score &ge; 10)</h4>
                <p className="text-slate-400">
                  Stale allowances that have not been used for extended periods (90+ days). May indicate forgotten permissions.
                </p>
              </div>
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
                <h4 className="text-lg font-semibold text-slate-100 mb-2" style={font}>Low Risk (score &lt; 10)</h4>
                <p className="text-slate-400">
                  Recent, limited allowances that are likely safe and actively used.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Chain ID Enum</h3>
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6 mb-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-2 font-semibold text-slate-100">Chain ID</th>
                    <th className="text-left py-2 font-semibold text-slate-100">Network</th>
                    <th className="text-left py-2 font-semibold text-slate-100">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 font-mono text-amber-400">1</td>
                    <td className="py-2 text-slate-400">Ethereum Mainnet</td>
                    <td className="py-2 text-slate-400">Supported</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 font-mono text-amber-400">42161</td>
                    <td className="py-2 text-slate-400">Arbitrum One</td>
                    <td className="py-2 text-slate-400">Supported</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-amber-400">8453</td>
                    <td className="py-2 text-slate-400">Base</td>
                    <td className="py-2 text-slate-400">Supported</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Risk Flags</h3>
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
                <h4 className="text-lg font-semibold text-amber-400 mb-2" style={font}>UNLIMITED</h4>
                <p className="text-slate-400">
                  The allowance amount equals the maximum uint256 value, giving unlimited access to the token.
                </p>
              </div>
              <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6">
                <h4 className="text-lg font-semibold text-amber-400 mb-2" style={font}>STALE</h4>
                <p className="text-slate-400">
                  The allowance was last seen more than 90 days ago (650,000 blocks on Ethereum, 900,000 blocks on Arbitrum/Base).
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

      {/* Advanced Topics */}
      <Section className="py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-100 mb-8" style={font}>Advanced</h2>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Data Freshness</h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Our indexer runs continuously. The last_seen_block field provides the block number when the allowance was last observed. For most addresses, data is no older than 5 minutes.
            </p>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Error Codes</h3>
            <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6 mb-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-2 font-semibold text-slate-100">Code</th>
                    <th className="text-left py-2 font-semibold text-slate-100">Description</th>
                    <th className="text-left py-2 font-semibold text-slate-100">Cause</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 font-mono text-amber-400">400</td>
                    <td className="py-2 text-slate-400">Bad Request</td>
                    <td className="py-2 text-slate-400">Invalid address format</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 font-mono text-amber-400">404</td>
                    <td className="py-2 text-slate-400">Not Found</td>
                    <td className="py-2 text-slate-400">Address has no allowances</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="py-2 font-mono text-amber-400">429</td>
                    <td className="py-2 text-slate-400">Too Many Requests</td>
                    <td className="py-2 text-slate-400">Rate limit exceeded</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-amber-400">500</td>
                    <td className="py-2 text-slate-400">Internal Server Error</td>
                    <td className="py-2 text-slate-400">Server-side error</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Using the Risk Data</h3>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              The risk_flags array provides specific reasons for the risk score. Use these flags to build informative UI for your users. For example, display &quot;Unlimited allowance&quot; for UNLIMITED flag or &quot;Stale allowance (90+ days)&quot; for STALE flag.
            </p>
          </div>
        </Container>
      </Section>

      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

      {/* Example Implementation */}
      <Section className="py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-100 mb-8" style={font}>Example Implementation</h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              A step-by-step guide to building a simple integration.
            </p>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Step 1: Fetch Allowances</h3>
            <CodeBlock>{`async function fetchAllowances(walletAddress) {
  const response = await fetch(
    \`https://www.allowanceguard.com/api/allowances?wallet=\${walletAddress}&page=1&pageSize=100\`
  );
  const data = await response.json();
  return data.allowances;
}`}</CodeBlock>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Step 2: Display Data</h3>
            <CodeBlock>{`function renderAllowances(allowances) {
  return allowances.map(allowance => {
    const riskLevel = allowance.risk_score >= 50 ? 'high' :
                     allowance.risk_score >= 10 ? 'medium' : 'low';

    return (
      <div key={\`\${allowance.token_address}-\${allowance.spender_address}\`}>
        <h3>{allowance.token_symbol} → {allowance.spender_label}</h3>
        <p>Amount: {allowance.is_unlimited ? 'Unlimited' : allowance.amount}</p>
        <p className={\`risk-\${riskLevel}\`}>
          Risk: {riskLevel} ({allowance.risk_flags.join(', ')})
        </p>
      </div>
    );
  });
}`}</CodeBlock>

            <h3 className="text-2xl font-semibold text-slate-100 mb-6" style={font}>Step 3: Facilitate Action</h3>
            <CodeBlock>{`async function revokeAllowance(tokenAddress, spenderAddress, signer) {
  const tokenContract = new ethers.Contract(tokenAddress, [
    'function approve(address spender, uint256 amount) returns (bool)'
  ], signer);

  const tx = await tokenContract.approve(spenderAddress, 0);
  await tx.wait();

  return tx.hash;
}`}</CodeBlock>
          </div>
        </Container>
      </Section>

    </div>
  )
}
