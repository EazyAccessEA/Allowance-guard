'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'

export default function APIPage() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Allowance Guard API v1 Reference</H1>
          <p className="text-lg text-stone leading-relaxed mb-8">
            A RESTful API for retrieving token allowance and risk data for any Ethereum address. All endpoints are public and read-only. Data is indexed from the blockchain and updated continuously.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Quick Start */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Quick Start</H2>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Base URL</h3>
            <div className="bg-white border border-line rounded-lg p-6 mb-8">
              <pre className="text-sm text-ink overflow-x-auto">
{`https://www.allowanceguard.com/api`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold text-ink mb-6">Authentication</h3>
            <p className="text-lg text-stone leading-relaxed mb-8">
              Currently, the API is public and does not require an API key. For high-volume or production use cases, please contact us to request a key for rate limiting purposes.
            </p>

            <h3 className="text-2xl font-semibold text-ink mb-6">Rate Limits</h3>
            <p className="text-lg text-stone leading-relaxed mb-8">
              Public requests are limited to 5 requests per minute per IP address. For higher limits, use an API key.
            </p>

            <h3 className="text-2xl font-semibold text-ink mb-6">Headers</h3>
            <div className="bg-white border border-line rounded-lg p-6 mb-8">
              <pre className="text-sm text-ink overflow-x-auto">
{`Accept: application/json
Content-Type: application/json`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold text-ink mb-6">Code Example</h3>
            <div className="bg-white border border-line rounded-lg p-6 mb-8">
              <pre className="text-sm text-ink overflow-x-auto">
{`curl -X GET "https://www.allowanceguard.com/api/allowances?wallet=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&page=1&pageSize=25" \\
  -H "Accept: application/json"`}
              </pre>
            </div>
          </div>
        </Container>
      </Section>

      {/* Endpoints */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Endpoints</H2>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">GET /allowances</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              Retrieves a paginated list of token allowances for a given address.
            </p>
            
            <h4 className="text-xl font-semibold text-ink mb-4">Parameters</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-2 font-semibold text-ink">Parameter</th>
                    <th className="text-left py-2 font-semibold text-ink">Type</th>
                    <th className="text-left py-2 font-semibold text-ink">Required</th>
                    <th className="text-left py-2 font-semibold text-ink">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line/50">
                    <td className="py-2 font-mono text-ink">wallet</td>
                    <td className="py-2 text-stone">string</td>
                    <td className="py-2 text-stone">Yes</td>
                    <td className="py-2 text-stone">Ethereum address (0x format)</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 font-mono text-ink">page</td>
                    <td className="py-2 text-stone">number</td>
                    <td className="py-2 text-stone">No</td>
                    <td className="py-2 text-stone">Page number (default: 1)</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 font-mono text-ink">pageSize</td>
                    <td className="py-2 text-stone">number</td>
                    <td className="py-2 text-stone">No</td>
                    <td className="py-2 text-stone">Results per page (default: 25, max: 100)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-ink">riskOnly</td>
                    <td className="py-2 text-stone">boolean</td>
                    <td className="py-2 text-stone">No</td>
                    <td className="py-2 text-stone">Filter to risky allowances only (default: false)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-xl font-semibold text-ink mb-4">Response Body</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`{
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
}`}
              </pre>
            </div>

            <h4 className="text-xl font-semibold text-ink mb-4">Example Request</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`curl -X GET "https://www.allowanceguard.com/api/allowances?wallet=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&page=1&pageSize=25&riskOnly=true" \\
  -H "Accept: application/json"`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold text-ink mb-6 mt-12">GET /receipts</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              Retrieves revocation receipts for a given wallet address.
            </p>
            
            <h4 className="text-xl font-semibold text-ink mb-4">Parameters</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-2 font-semibold text-ink">Parameter</th>
                    <th className="text-left py-2 font-semibold text-ink">Type</th>
                    <th className="text-left py-2 font-semibold text-ink">Required</th>
                    <th className="text-left py-2 font-semibold text-ink">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line/50">
                    <td className="py-2 font-mono text-ink">wallet</td>
                    <td className="py-2 text-stone">string</td>
                    <td className="py-2 text-stone">Yes</td>
                    <td className="py-2 text-stone">Ethereum address (0x format)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-ink">limit</td>
                    <td className="py-2 text-stone">number</td>
                    <td className="py-2 text-stone">No</td>
                    <td className="py-2 text-stone">Number of receipts to return (default: 50, max: 100)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-xl font-semibold text-ink mb-4">Response Body</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`{
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
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold text-ink mb-6 mt-12">POST /scan</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              Triggers a blockchain scan for a wallet address across specified chains.
            </p>
            
            <h4 className="text-xl font-semibold text-ink mb-4">Request Body</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`{
  "walletAddress": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "chains": ["eth", "arb", "base"]
}`}
              </pre>
            </div>

            <h4 className="text-xl font-semibold text-ink mb-4">Response Body</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`{
  "ok": true,
  "jobId": 456,
  "message": "Scan queued for 0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold text-ink mb-6 mt-12">GET /jobs/{id}</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              Retrieves the status of a scan job.
            </p>
            
            <h4 className="text-xl font-semibold text-ink mb-4">Response Body</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`{
  "id": 456,
  "type": "scan",
  "status": "succeeded",
  "attempts": 1,
  "created_at": "2024-01-15T10:30:00Z",
  "started_at": "2024-01-15T10:30:05Z",
  "finished_at": "2024-01-15T10:32:00Z",
  "error": null
}`}
              </pre>
            </div>
          </div>
        </Container>
      </Section>

      {/* Data Types */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Data Types</H2>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Risk Level Enum</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              Risk assessment is based on the risk_score field and risk_flags array.
            </p>
            
            <div className="space-y-4">
              <div className="bg-white border border-line rounded-lg p-6">
                <h4 className="text-lg font-semibold text-ink mb-2">High Risk (score ≥ 50)</h4>
                <p className="text-stone">
                  Unlimited allowances that pose immediate security risk. These allow complete drainage of token balances.
                </p>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-6">
                <h4 className="text-lg font-semibold text-ink mb-2">Medium Risk (score ≥ 10)</h4>
                <p className="text-stone">
                  Stale allowances that have not been used for extended periods (90+ days). May indicate forgotten permissions.
                </p>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-6">
                <h4 className="text-lg font-semibold text-ink mb-2">Low Risk (score &lt; 10)</h4>
                <p className="text-stone">
                  Recent, limited allowances that are likely safe and actively used.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-ink mb-6 mt-8">Chain ID Enum</h3>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-2 font-semibold text-ink">Chain ID</th>
                    <th className="text-left py-2 font-semibold text-ink">Network</th>
                    <th className="text-left py-2 font-semibold text-ink">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line/50">
                    <td className="py-2 font-mono text-ink">1</td>
                    <td className="py-2 text-stone">Ethereum Mainnet</td>
                    <td className="py-2 text-stone">Supported</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 font-mono text-ink">42161</td>
                    <td className="py-2 text-stone">Arbitrum One</td>
                    <td className="py-2 text-stone">Supported</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-ink">8453</td>
                    <td className="py-2 text-stone">Base</td>
                    <td className="py-2 text-stone">Supported</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-semibold text-ink mb-6">Risk Flags</h3>
            <div className="space-y-4">
              <div className="bg-white border border-line rounded-lg p-6">
                <h4 className="text-lg font-semibold text-ink mb-2">UNLIMITED</h4>
                <p className="text-stone">
                  The allowance amount equals the maximum uint256 value, giving unlimited access to the token.
                </p>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-6">
                <h4 className="text-lg font-semibold text-ink mb-2">STALE</h4>
                <p className="text-stone">
                  The allowance was last seen more than 90 days ago (650,000 blocks on Ethereum, 900,000 blocks on Arbitrum/Base).
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Advanced Topics */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Advanced</H2>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Data Freshness</h3>
            <p className="text-lg text-stone leading-relaxed mb-8">
              Our indexer runs continuously. The last_seen_block field provides the block number when the allowance was last observed. For most addresses, data is no older than 5 minutes.
            </p>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Error Codes</h3>
            <div className="bg-white border border-line rounded-lg p-6 mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-2 font-semibold text-ink">Code</th>
                    <th className="text-left py-2 font-semibold text-ink">Description</th>
                    <th className="text-left py-2 font-semibold text-ink">Cause</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line/50">
                    <td className="py-2 font-mono text-ink">400</td>
                    <td className="py-2 text-stone">Bad Request</td>
                    <td className="py-2 text-stone">Invalid address format</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 font-mono text-ink">404</td>
                    <td className="py-2 text-stone">Not Found</td>
                    <td className="py-2 text-stone">Address has no allowances</td>
                  </tr>
                  <tr className="border-b border-line/50">
                    <td className="py-2 font-mono text-ink">429</td>
                    <td className="py-2 text-stone">Too Many Requests</td>
                    <td className="py-2 text-stone">Rate limit exceeded</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-ink">500</td>
                    <td className="py-2 text-stone">Internal Server Error</td>
                    <td className="py-2 text-stone">Server-side error</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Using the Risk Data</h3>
            <p className="text-lg text-stone leading-relaxed mb-8">
              The risk_flags array provides specific reasons for the risk score. Use these flags to build informative UI for your users. For example, display &quot;Unlimited allowance&quot; for UNLIMITED flag or &quot;Stale allowance (90+ days)&quot; for STALE flag.
            </p>
          </div>
        </Container>
      </Section>

      {/* Example Implementation */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Example Implementation</H2>
            <p className="text-lg text-stone leading-relaxed mb-8">
              A step-by-step guide to building a simple integration.
            </p>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Step 1: Fetch Allowances</h3>
            <div className="bg-white border border-line rounded-lg p-6 mb-8">
              <pre className="text-sm text-ink overflow-x-auto">
{`async function fetchAllowances(walletAddress) {
  const response = await fetch(
    \`https://www.allowanceguard.com/api/allowances?wallet=\${walletAddress}&page=1&pageSize=100\`
  );
  const data = await response.json();
  return data.allowances;
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold text-ink mb-6">Step 2: Display Data</h3>
            <div className="bg-white border border-line rounded-lg p-6 mb-8">
              <pre className="text-sm text-ink overflow-x-auto">
{`function renderAllowances(allowances) {
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
}`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold text-ink mb-6">Step 3: Facilitate Action</h3>
            <div className="bg-white border border-line rounded-lg p-6 mb-8">
              <pre className="text-sm text-ink overflow-x-auto">
{`async function revokeAllowance(tokenAddress, spenderAddress, signer) {
  const tokenContract = new ethers.Contract(tokenAddress, [
    'function approve(address spender, uint256 amount) returns (bool)'
  ], signer);
  
  const tx = await tokenContract.approve(spenderAddress, 0);
  await tx.wait();
  
  return tx.hash;
}`}
              </pre>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}
