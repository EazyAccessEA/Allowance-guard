import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://allowanceguard.com'
  
  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/features', priority: '0.9', changefreq: 'monthly' },
    { url: '/docs', priority: '0.9', changefreq: 'weekly' },
    { url: '/docs/api', priority: '0.8', changefreq: 'weekly' },
    { url: '/docs/integration', priority: '0.8', changefreq: 'monthly' },
    { url: '/docs/contributing', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog', priority: '0.8', changefreq: 'weekly' },
    { url: '/blog/hardware-wallets-and-multisigs-elevating-your-security', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/understanding-smart-contract-risk-beyond-allowances', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/building-your-personal-web3-security-routine', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/programmable-safety-future-allowance-security', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/staying-safe-with-defi-dapps', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/how-to-self-audit-your-wallet', priority: '0.7', changefreq: 'monthly' },
    { url: '/blog/what-are-token-allowances', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/faq', priority: '0.8', changefreq: 'monthly' },
    { url: '/security', priority: '0.8', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.6', changefreq: 'yearly' },
    { url: '/terms', priority: '0.6', changefreq: 'yearly' },
    { url: '/cookies', priority: '0.5', changefreq: 'yearly' },
    { url: '/contribute', priority: '0.7', changefreq: 'monthly' },
    { url: '/thank-you', priority: '0.5', changefreq: 'yearly' },
    { url: '/coming-soon', priority: '0.3', changefreq: 'monthly' }
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
    }
  })
}
