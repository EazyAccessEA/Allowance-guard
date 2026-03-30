'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2, H3 } from '@/components/ui/Heading'
import { useState } from 'react'
import { Copy, Check, Code, Terminal, Globe, Package } from 'lucide-react'

export default function APIExamplesPage() {
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
        className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
      >
        {copiedCode === id ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
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

  return (
    <div className="min-h-screen bg-white text-ink">
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">API Examples & Code Samples</H1>
          <p className="text-lg text-stone leading-relaxed mb-8">
            Comprehensive code examples for integrating with the AllowanceGuard API in multiple programming languages and frameworks.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Language Tabs */}
      <Section className="py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* cURL Examples */}
              <div>
                <div className="flex items-center mb-6">
                  <Terminal className="mr-3 text-blue-600" size={24} />
                  <H2>cURL Examples</H2>
                </div>
                <p className="text-stone mb-6">
                  Command-line examples for testing the API directly.
                </p>
                <CodeBlock code={curlExample} language="bash" id="curl" />
              </div>

              {/* JavaScript Examples */}
              <div>
                <div className="flex items-center mb-6">
                  <Code className="mr-3 text-yellow-600" size={24} />
                  <H2>JavaScript/Node.js</H2>
                </div>
                <p className="text-stone mb-6">
                  Vanilla JavaScript examples for both browser and Node.js environments.
                </p>
                <CodeBlock code={javascriptExample} language="javascript" id="javascript" />
              </div>

              {/* Python Examples */}
              <div>
                <div className="flex items-center mb-6">
                  <Code className="mr-3 text-green-600" size={24} />
                  <H2>Python</H2>
                </div>
                <p className="text-stone mb-6">
                  Python examples using the requests library for API integration.
                </p>
                <CodeBlock code={pythonExample} language="python" id="python" />
              </div>

              {/* React Examples */}
              <div>
                <div className="flex items-center mb-6">
                  <Globe className="mr-3 text-blue-500" size={24} />
                  <H2>React Component</H2>
                </div>
                <p className="text-stone mb-6">
                  React component example for displaying allowances in a web application.
                </p>
                <CodeBlock code={reactExample} language="jsx" id="react" />
              </div>

              {/* Node.js SDK */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <Package className="mr-3 text-purple-600" size={24} />
                  <H2>Node.js SDK Class</H2>
                </div>
                <p className="text-stone mb-6">
                  Complete Node.js SDK class for easy integration into backend services.
                </p>
                <CodeBlock code={nodeExample} language="javascript" id="nodejs" />
              </div>

            </div>
          </div>
        </Container>
      </Section>

      {/* Integration Tips */}
      <Section className="py-16 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Integration Tips</H2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-line">
                <H3 className="mb-4">Error Handling</H3>
                <p className="text-stone mb-4">
                  Always implement proper error handling for network requests and API responses.
                </p>
                <ul className="text-sm text-stone space-y-2">
                  <li>• Check HTTP status codes</li>
                  <li>• Handle rate limiting (429 status)</li>
                  <li>• Implement retry logic for transient failures</li>
                  <li>• Validate response data structure</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-line">
                <H3 className="mb-4">Performance</H3>
                <p className="text-stone mb-4">
                  Optimize your API usage for better performance and user experience.
                </p>
                <ul className="text-sm text-stone space-y-2">
                  <li>• Use pagination for large datasets</li>
                  <li>• Implement client-side caching</li>
                  <li>• Batch requests when possible</li>
                  <li>• Use appropriate page sizes</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-line">
                <H3 className="mb-4">Rate Limiting</H3>
                <p className="text-stone mb-4">
                  Respect rate limits to ensure reliable API access.
                </p>
                <ul className="text-sm text-stone space-y-2">
                  <li>• 5 requests per minute for public access</li>
                  <li>• Higher limits available with API key</li>
                  <li>• Implement exponential backoff</li>
                  <li>• Monitor rate limit headers</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-line">
                <H3 className="mb-4">Security</H3>
                <p className="text-stone mb-4">
                  Follow security best practices when integrating the API.
                </p>
                <ul className="text-sm text-stone space-y-2">
                  <li>• Validate wallet addresses client-side</li>
                  <li>• Sanitize user inputs</li>
                  <li>• Use HTTPS for all requests</li>
                  <li>• Store API keys securely</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
