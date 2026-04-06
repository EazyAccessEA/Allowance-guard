'use client'

import { useState } from 'react'
import { Copy, Check, Code, Terminal, Globe, Package, AlertTriangle, Zap, Clock, Shield } from 'lucide-react'

export default function APIExamplesPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative rounded-lg overflow-hidden border border-slate-700/50">
      <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2.5 border-b border-slate-700/50">
        <span className="text-[10px] font-mono text-amber-500/70 uppercase tracking-wider">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
          aria-label="Copy code"
        >
          {copiedCode === id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedCode === id ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-[#0A0E1A] p-4 overflow-x-auto">
        <code className="text-sm font-mono text-slate-300 leading-relaxed">{code}</code>
      </pre>
    </div>
  )

  const curlExample = `curl -X GET "https://www.allowanceguard.com/api/allowances?wallet=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&page=1&pageSize=25" \\
  -H "Accept: application/json"`

  const javascriptExample = `// Fetch allowances for a wallet
async function getAllowances(walletAddress) {
  try {
    const response = await fetch(
      \`https://www.allowanceguard.com/api/allowances?wallet=\${walletAddress}&page=1&pageSize=25\`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching allowances:', error)
    throw error
  }
}

// Usage
getAllowances('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
  .then(allowances => {
    console.log('Allowances:', allowances)
    allowances.data.forEach(allowance => {
      console.log(\`Token: \${allowance.tokenName}, Spender: \${allowance.spenderName}, Risk: \${allowance.riskLevel}\`)
    })
  })
  .catch(error => {
    console.error('Failed to fetch allowances:', error)
  })`

  const pythonExample = `import requests
import json

def get_allowances(wallet_address, page=1, page_size=25):
    """
    Fetch token allowances for a given wallet address
    """
    url = "https://www.allowanceguard.com/api/allowances"
    params = {
        'wallet': wallet_address,
        'page': page,
        'pageSize': page_size
    }
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching allowances: {e}")
        raise

def get_risk_assessment(wallet_address, token_address, spender_address, chain_id=1):
    """
    Get risk assessment for a specific token approval
    """
    url = "https://www.allowanceguard.com/api/risk/assess"
    data = {
        'walletAddress': wallet_address,
        'tokenAddress': token_address,
        'spenderAddress': spender_address,
        'chainId': chain_id
    }
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error assessing risk: {e}")
        raise

# Usage examples
if __name__ == "__main__":
    wallet = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

    # Get all allowances
    allowances = get_allowances(wallet)
    print(f"Found {len(allowances['data'])} allowances")

    # Assess risk for a specific approval
    risk = get_risk_assessment(
        wallet,
        "0xA0b86a33E6441b8c4C8C0C8C0C8C0C8C0C8C0C8C",
        "0x1234567890123456789012345678901234567890"
    )
    print(f"Risk level: {risk['riskLevel']}")`

  const reactExample = `import React, { useState, useEffect } from 'react'

function AllowanceChecker({ walletAddress }) {
  const [allowances, setAllowances] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!walletAddress) return

    const fetchAllowances = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          \`https://www.allowanceguard.com/api/allowances?wallet=\${walletAddress}&page=1&pageSize=25\`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`)
        }

        const data = await response.json()
        setAllowances(data.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAllowances()
  }, [walletAddress])

  if (loading) return <div>Loading allowances...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h3>Token Allowances for {walletAddress}</h3>
      <div className="space-y-4">
        {allowances.map((allowance, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{allowance.tokenName}</h4>
                <p className="text-sm text-gray-600">Spender: {allowance.spenderName}</p>
                <p className="text-sm text-gray-600">Amount: {allowance.allowance}</p>
              </div>
              <span className={\`px-2 py-1 rounded text-xs font-medium \${
                allowance.riskLevel >= 3 ? 'bg-red-100 text-red-800' :
                allowance.riskLevel >= 2 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }\`}>
                Risk Level {allowance.riskLevel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllowanceChecker`

  const nodeExample = `const axios = require('axios')

class AllowanceGuardAPI {
  constructor(apiKey = null) {
    this.baseURL = 'https://www.allowanceguard.com/api'
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    if (apiKey) {
      this.headers['Authorization'] = \`Bearer \${apiKey}\`
    }
  }

  async getAllowances(walletAddress, options = {}) {
    const params = {
      wallet: walletAddress,
      page: options.page || 1,
      pageSize: options.pageSize || 25,
      ...options
    }

    try {
      const response = await axios.get(\`\${this.baseURL}/allowances\`, {
        params,
        headers: this.headers
      })
      return response.data
    } catch (error) {
      throw new Error(\`Failed to fetch allowances: \${error.message}\`)
    }
  }

  async assessRisk(walletAddress, tokenAddress, spenderAddress, chainId = 1) {
    const data = {
      walletAddress,
      tokenAddress,
      spenderAddress,
      chainId
    }

    try {
      const response = await axios.post(\`\${this.baseURL}/risk/assess\`, data, {
        headers: this.headers
      })
      return response.data
    } catch (error) {
      throw new Error(\`Failed to assess risk: \${error.message}\`)
    }
  }

  async getNetworks() {
    try {
      const response = await axios.get(\`\${this.baseURL}/networks/roadmap\`, {
        headers: this.headers
      })
      return response.data
    } catch (error) {
      throw new Error(\`Failed to fetch networks: \${error.message}\`)
    }
  }
}

// Usage
const api = new AllowanceGuardAPI()

async function main() {
  try {
    // Get allowances
    const allowances = await api.getAllowances('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
    console.log('Allowances:', allowances)

    // Assess risk
    const risk = await api.assessRisk(
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      '0xA0b86a33E6441b8c4C8C0C8C0C8C0C8C0C8C0C8C',
      '0x1234567890123456789012345678901234567890'
    )
    console.log('Risk assessment:', risk)

    // Get supported networks
    const networks = await api.getNetworks()
    console.log('Supported networks:', networks)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

main()`

  const tips = [
    {
      icon: AlertTriangle,
      title: 'Error Handling',
      description: 'Always implement proper error handling for network requests and API responses.',
      items: [
        'Check HTTP status codes',
        'Handle rate limiting (429 status)',
        'Implement retry logic for transient failures',
        'Validate response data structure',
      ],
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimize your API usage for better performance and user experience.',
      items: [
        'Use pagination for large datasets',
        'Implement client-side caching',
        'Batch requests when possible',
        'Use appropriate page sizes',
      ],
    },
    {
      icon: Clock,
      title: 'Rate Limiting',
      description: 'Respect rate limits to ensure reliable API access.',
      items: [
        '5 requests per minute for public access',
        'Higher limits available with API key',
        'Implement exponential backoff',
        'Monitor rate limit headers',
      ],
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Follow security best practices when integrating the API.',
      items: [
        'Validate wallet addresses client-side',
        'Sanitize user inputs',
        'Use HTTPS for all requests',
        'Store API keys securely',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#0F172A] to-[#0A0E1A]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-[0.15em]">
            API Documentation
          </span>
          <h1
            className="mt-4 text-4xl sm:text-5xl font-bold text-slate-100 tracking-tight"
            style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
          >
            Code Examples
          </h1>
          <p className="mt-4 text-lg text-slate-400 leading-relaxed max-w-2xl">
            Comprehensive code examples for integrating with the AllowanceGuard API
            in multiple programming languages and frameworks.
          </p>
        </div>
      </section>

      {/* Code Examples Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* cURL */}
          <div>
            <div className="flex items-center mb-4">
              <Terminal className="mr-3 text-amber-400" size={24} />
              <h2
                className="text-2xl font-bold text-slate-100"
                style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
              >
                cURL Examples
              </h2>
            </div>
            <p className="text-slate-400 mb-6">
              Command-line examples for testing the API directly.
            </p>
            <CodeBlock code={curlExample} language="bash" id="curl" />
          </div>

          {/* JavaScript */}
          <div>
            <div className="flex items-center mb-4">
              <Code className="mr-3 text-amber-400" size={24} />
              <h2
                className="text-2xl font-bold text-slate-100"
                style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
              >
                JavaScript/Node.js
              </h2>
            </div>
            <p className="text-slate-400 mb-6">
              Vanilla JavaScript examples for both browser and Node.js environments.
            </p>
            <CodeBlock code={javascriptExample} language="javascript" id="javascript" />
          </div>

          {/* Python */}
          <div>
            <div className="flex items-center mb-4">
              <Code className="mr-3 text-amber-400" size={24} />
              <h2
                className="text-2xl font-bold text-slate-100"
                style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
              >
                Python
              </h2>
            </div>
            <p className="text-slate-400 mb-6">
              Python examples using the requests library for API integration.
            </p>
            <CodeBlock code={pythonExample} language="python" id="python" />
          </div>

          {/* React */}
          <div>
            <div className="flex items-center mb-4">
              <Globe className="mr-3 text-amber-400" size={24} />
              <h2
                className="text-2xl font-bold text-slate-100"
                style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
              >
                React Component
              </h2>
            </div>
            <p className="text-slate-400 mb-6">
              React component example for displaying allowances in a web application.
            </p>
            <CodeBlock code={reactExample} language="jsx" id="react" />
          </div>

          {/* Node.js SDK */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Package className="mr-3 text-amber-400" size={24} />
              <h2
                className="text-2xl font-bold text-slate-100"
                style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
              >
                Node.js SDK Class
              </h2>
            </div>
            <p className="text-slate-400 mb-6">
              Complete Node.js SDK class for easy integration into backend services.
            </p>
            <CodeBlock code={nodeExample} language="javascript" id="nodejs" />
          </div>
        </div>
      </section>

      {/* Integration Tips */}
      <section className="border-t border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2
            className="text-3xl font-bold text-slate-100 mb-10"
            style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
          >
            Integration Tips
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <tip.icon className="w-5 h-5 text-amber-400" />
                  <h3
                    className="text-lg font-semibold text-slate-100"
                    style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}
                  >
                    {tip.title}
                  </h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">{tip.description}</p>
                <ul className="text-sm text-slate-400 space-y-2">
                  {tip.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-amber-500/60 mt-0.5">&#8226;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
