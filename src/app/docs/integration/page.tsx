'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'

export default function IntegrationPage() {
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
          <H1 className="mb-6">Building a Safer Web3, Together</H1>
          <p className="text-lg text-stone leading-relaxed mb-8">
            Extend the power of Allowance Guard to your users directly within your application. This guide details our public API and smart contract interfaces for scanning token allowances, retrieving risk data, and facilitating secure revocations. All tools are permissionless and free to use.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Integration Architecture */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Integration Architecture</H2>
            <p className="text-lg text-stone leading-relaxed mb-8">
              There are two primary methods for integration: using our convenient API to quickly access processed data, or interacting directly with on-chain smart contracts for maximum decentralization. Most integrations will use a combination of both: the API for reading data and smart contracts for writing revocation transactions.
            </p>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Integration Flow</h3>
            <p className="text-lg text-stone leading-relaxed mb-8">
              The standard integration flow is: 1) Your UI prompts the user to check allowances. 2) Your backend calls our allowances API endpoint for the user&apos;s address. 3) Your frontend displays the returned list of allowances with their risk scores. 4) When a user chooses to revoke, your frontend calls the appropriate token contract&apos;s approve method via the user&apos;s wallet.
            </p>
          </div>
        </Container>
      </Section>

      {/* API Reference */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">API Reference</H2>
            <p className="text-lg text-stone leading-relaxed mb-8">
              Our API provides read-only access to allowance and risk data. All endpoints are public and do not require an API key.
            </p>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">GET /api/allowances</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              Retrieves all token allowances for a given wallet address.
            </p>
            
            <h4 className="text-xl font-semibold text-ink mb-4">Parameters</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`wallet (string, required): The Ethereum address to fetch allowances for
page (number, optional): Page number for pagination (default: 1)
pageSize (number, optional): Number of results per page (default: 25, max: 100)
riskOnly (boolean, optional): Filter to show only risky allowances (default: false)`}
              </pre>
            </div>

            <h4 className="text-xl font-semibold text-ink mb-4">Response Object</h4>
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
{`curl -X GET "https://www.allowanceguard.com/api/allowances?wallet=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6&page=1&pageSize=25&riskOnly=true"`}
              </pre>
            </div>
          </div>
        </Container>
      </Section>

      {/* Smart Contract Integration */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Smart Contract Integration</H2>
            <p className="text-lg text-stone leading-relaxed mb-8">
              For revocation actions, you should interact directly with the token contracts themselves. This is a non-custodial and permissionless method that works with any ERC20, ERC721, or ERC1155 token.
            </p>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">ERC20 Token Revocation</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              For ERC20 tokens, call the approve function with amount 0 to revoke an allowance.
            </p>
            
            <h4 className="text-xl font-semibold text-ink mb-4">ERC20 ABI</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`[
  {
    "type": "function",
    "name": "approve",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "type": "bool", "name": "" }]
  }
]`}
              </pre>
            </div>

            <h4 className="text-xl font-semibold text-ink mb-4">Web3.js Example</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`import { ethers } from 'ethers';

async function revokeERC20Allowance(tokenAddress, spenderAddress, signer) {
  const tokenContract = new ethers.Contract(tokenAddress, [
    'function approve(address spender, uint256 amount) returns (bool)'
  ], signer);
  
  const tx = await tokenContract.approve(spenderAddress, 0);
  await tx.wait();
  
  console.log('Allowance revoked:', tx.hash);
  return tx.hash;
}

// Usage
const tokenAddress = '0xA0b86a33E6c6c6c6c6c6c6c6c6c6c6c6c6c6c6c6';
const spenderAddress = '0xB1c97d44E7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d7d';
const txHash = await revokeERC20Allowance(tokenAddress, spenderAddress, signer);`}
              </pre>
            </div>

            <h3 className="text-2xl font-semibold text-ink mb-6">ERC721/ERC1155 Revocation</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              For NFT collections, call setApprovalForAll with approved set to false.
            </p>
            
            <h4 className="text-xl font-semibold text-ink mb-4">ERC721/ERC1155 ABI</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`[
  {
    "type": "function",
    "name": "setApprovalForAll",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "operator", "type": "address" },
      { "name": "approved", "type": "bool" }
    ],
    "outputs": []
  }
]`}
              </pre>
            </div>

            <h4 className="text-xl font-semibold text-ink mb-4">Web3.js Example</h4>
            <div className="bg-white border border-line rounded-lg p-6 mb-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`async function revokeNFTApproval(collectionAddress, operatorAddress, signer) {
  const nftContract = new ethers.Contract(collectionAddress, [
    'function setApprovalForAll(address operator, bool approved)'
  ], signer);
  
  const tx = await nftContract.setApprovalForAll(operatorAddress, false);
  await tx.wait();
  
  console.log('NFT approval revoked:', tx.hash);
  return tx.hash;
}`}
              </pre>
            </div>
          </div>
        </Container>
      </Section>

      {/* Risk Data Attribution */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Understanding Risk Scores</H2>
            <p className="text-lg text-stone leading-relaxed mb-8">
              Our risk scoring system evaluates allowances based on multiple heuristics to identify potentially dangerous permissions.
            </p>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Risk Flags</h3>
            <div className="space-y-4">
              <div className="bg-white border border-line rounded-lg p-6">
                <h4 className="text-lg font-semibold text-ink mb-2">UNLIMITED (Score: +50)</h4>
                <p className="text-stone">
                  The allowance amount equals the maximum uint256 value, giving the spender unlimited access to the token. This is the highest risk as it allows complete drainage of the token balance.
                </p>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-6">
                <h4 className="text-lg font-semibold text-ink mb-2">STALE (Score: +10)</h4>
                <p className="text-stone">
                  The allowance was last seen more than 90 days ago (650,000 blocks on Ethereum, 900,000 blocks on Arbitrum/Base). Stale allowances may indicate forgotten permissions or abandoned integrations.
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-ink mb-6 mt-8">Risk Score Calculation</h3>
            <div className="bg-white border border-line rounded-lg p-6">
              <pre className="text-sm text-ink overflow-x-auto">
{`Risk Score = 0
if (is_unlimited) Risk Score += 50
if (stale && amount > 0) Risk Score += 10

Risk Level:
- High: Score >= 50 (unlimited allowances)
- Medium: Score >= 10 (stale allowances)
- Low: Score < 10 (recent, limited allowances)`}
              </pre>
            </div>
          </div>
        </Container>
      </Section>

      {/* Supported Networks */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Supported Networks</H2>
            <p className="text-lg text-stone leading-relaxed mb-8">
              Allowance Guard currently supports three major networks with comprehensive allowance scanning and risk assessment.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-line rounded-lg p-6">
                <h3 className="text-lg font-semibold text-ink mb-2">Ethereum</h3>
                <p className="text-stone text-sm mb-2">Chain ID: 1</p>
                <p className="text-stone text-sm mb-2">Block Time: ~12 seconds</p>
                <p className="text-stone text-sm">Stale Threshold: 650,000 blocks (~90 days)</p>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-6">
                <h3 className="text-lg font-semibold text-ink mb-2">Arbitrum</h3>
                <p className="text-stone text-sm mb-2">Chain ID: 42161</p>
                <p className="text-stone text-sm mb-2">Block Time: ~0.25 seconds</p>
                <p className="text-stone text-sm">Stale Threshold: 900,000 blocks (~90 days)</p>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-6">
                <h3 className="text-lg font-semibold text-ink mb-2">Base</h3>
                <p className="text-stone text-sm mb-2">Chain ID: 8453</p>
                <p className="text-stone text-sm mb-2">Block Time: ~2 seconds</p>
                <p className="text-stone text-sm">Stale Threshold: 900,000 blocks (~90 days)</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Best Practices */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Implementation Best Practices</H2>
            <p className="text-lg text-stone leading-relaxed mb-8">
              Follow these guidelines to ensure a secure and user-friendly integration.
            </p>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Attribution</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              Always clearly state that your integration is powered by Allowance Guard. Never imply that you are generating this data yourself without attribution. Include a link to www.allowanceguard.com in your UI.
            </p>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Displaying Allowances</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              We recommend displaying allowances in a sortable table. Always show the token logo, name, spender name/address, amount, and the risk score prominently. Use color cautiously (e.g., red only for high-risk items). Group by risk level with unlimited allowances at the top.
            </p>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Executing Revocations</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              Always clearly explain the transaction the user is about to sign. Show the estimated gas fee. Upon successful revocation, update the UI immediately to reflect the change (e.g., remove the item or show a success state). Consider implementing batch revocation for multiple allowances to save gas costs.
            </p>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Error Handling</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              Implement proper error handling for API failures, network issues, and transaction failures. Provide clear error messages to users and fallback options when the API is unavailable.
            </p>
          </div>
        </Container>
      </Section>

      {/* Troubleshooting */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Troubleshooting</H2>
            
            <h3 className="text-2xl font-semibold text-ink mb-6">Common Issues</h3>
            
            <div className="space-y-6">
              <div className="bg-white border border-line rounded-lg p-6">
                <h4 className="text-lg font-semibold text-ink mb-2">API returns no allowances for a new address</h4>
                <p className="text-stone">
                  The indexer may take a short time to sync new addresses. Please retry after a few minutes. For addresses with no transaction history, the API will return an empty result.
                </p>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-6">
                <h4 className="text-lg font-semibold text-ink mb-2">Revocation transaction fails</h4>
                <p className="text-stone">
                  This is often due to insufficient gas. Prompt the user to try again with a higher gas limit. Some tokens may have additional restrictions or require specific approval patterns.
                </p>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-6">
                <h4 className="text-lg font-semibold text-ink mb-2">Spender name is unknown</h4>
                <p className="text-stone">
                  Our database relies on public labels and contract verification. You can fall back to displaying the contract address. Consider implementing your own labeling system for common protocols.
                </p>
              </div>
              
              <div className="bg-white border border-line rounded-lg p-6">
                <h4 className="text-lg font-semibold text-ink mb-2">Risk scores seem incorrect</h4>
                <p className="text-stone">
                  Risk scores are calculated based on our heuristics. If you believe a score is incorrect, please report it to our support team with the specific allowance details.
                </p>
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold text-ink mb-6 mt-8">Getting Help</h3>
            <p className="text-lg text-stone leading-relaxed mb-6">
              For technical issues with integration, open an issue on our GitHub repository. For general questions, reach out to our team at support@allowanceguard.com. We typically respond within 24 hours.
            </p>
            
            <div className="bg-white border border-line rounded-lg p-6">
              <h4 className="text-lg font-semibold text-ink mb-2">Integration Support</h4>
              <p className="text-stone mb-4">
                We provide dedicated support for integration partners. Contact us at support@allowanceguard.com with &quot;Integration Support&quot; in the subject line for priority assistance.
              </p>
              <a 
                href="mailto:support@allowanceguard.com?subject=Integration Support"
                className="inline-flex items-center px-6 py-3 border border-cobalt text-cobalt rounded-lg font-medium hover:bg-cobalt hover:text-white transition-colors duration-200"
              >
                Contact Integration Support
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}
