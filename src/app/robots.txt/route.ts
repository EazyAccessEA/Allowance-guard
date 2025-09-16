import { NextResponse } from 'next/server'

export async function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /share/',      // keep shared tokens less crawlable
    'Sitemap: ' + (process.env.NEXT_PUBLIC_APP_URL || '') + '/sitemap.xml'
  ].join('\n')
  return new NextResponse(body, { headers: { 'content-type': 'text/plain' } })
}
