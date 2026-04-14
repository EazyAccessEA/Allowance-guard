import type { MetadataRoute } from 'next'
import { blogPosts } from './blog/[slug]/blog-data'

const BASE = 'https://www.allowanceguard.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },

    // Marketing
    { url: `${BASE}/features`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/networks`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },

    // Blog index
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },

    // Documentation
    { url: `${BASE}/docs`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/docs/api`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/docs/api-reference`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/docs/api/examples`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/docs/integration`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/docs/widget`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },

    // Legal
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/dpa`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/sla`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/refund`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },

    // Sitemap (human-readable)
    { url: `${BASE}/sitemap`, lastModified: now, changeFrequency: 'weekly', priority: 0.3 },
  ]

  // Dynamic blog posts
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
