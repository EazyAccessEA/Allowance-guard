import { NextResponse } from 'next/server'

export async function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /share/',      // keep shared tokens less crawlable
    '',
    '# DApp Identification for Security Scanners',
    '# This is a legitimate DeFi application for token approval management',
    '# Application: Allowance Guard',
    '# Type: Web3 DApp / DeFi Tool',
    '# Purpose: Token approval security and management',
    '# Blockchains: Ethereum, Arbitrum, Base, Polygon, Optimism, Avalanche',
    '# Open Source: https://github.com/EazyAccessEA/Allowance-guard',
    '',
    'Sitemap: ' + (process.env.NEXT_PUBLIC_APP_URL || '') + '/sitemap.xml'
  ].join('\n')
  return new NextResponse(body, { 
    headers: { 
      'content-type': 'text/plain',
      'x-dapp-type': 'defi',
      'x-application': 'allowance-guard',
      'x-blockchain': 'ethereum,arbitrum,base,polygon,optimism,avalanche'
    } 
  })
}
