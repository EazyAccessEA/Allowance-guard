import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'
import { blogPosts } from '../blog/[slug]/blog-data'

/**
 * Human-readable sitemap. Separate from /sitemap.xml (which is for crawlers).
 *
 * Council:
 *  #13 UX: organised by section, not alphabetical
 *  Kael: uses existing Ledger components — no new patterns
 *  Noor: semantic <nav> with grouped <ul>, proper heading hierarchy
 *  #17 Thane: server component, static, zero JS
 *  #5 Marketing: boosts internal linking + SEO
 */

export const metadata: Metadata = {
  title: 'Sitemap — AllowanceGuard',
  description: 'All pages on AllowanceGuard, organised by section.',
}

type Group = {
  title: string
  links: { href: string; label: string }[]
}

const GROUPS: Group[] = [
  {
    title: 'Main',
    links: [
      { href: '/', label: 'Home' },
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/networks', label: 'Supported networks' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Documentation',
    links: [
      { href: '/docs', label: 'Documentation home' },
      { href: '/docs/api', label: 'API v1 docs' },
      { href: '/docs/api-reference', label: 'API reference' },
      { href: '/docs/api/examples', label: 'Code examples' },
      { href: '/docs/integration', label: 'Integration guide' },
      { href: '/docs/widget', label: 'Widget builder' },
    ],
  },
  {
    title: 'Blog',
    links: [
      { href: '/blog', label: 'Blog index' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/terms', label: 'Terms of Service' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/cookies', label: 'Cookie Policy' },
      { href: '/dpa', label: 'Data Processing Agreement' },
      { href: '/sla', label: 'Service Level Agreement' },
      { href: '/refund', label: 'Refund Policy' },
    ],
  },
]

export default function SitemapPage() {
  // Group blog posts by category for discoverability
  const blogByCategory = blogPosts.reduce<Record<string, typeof blogPosts>>((acc, post) => {
    (acc[post.category] ||= []).push(post)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-paper text-ink">

      {/* Hero */}
      <section className="paper grain relative py-24 sm:py-32 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 15% 25%, rgba(245,158,11,0.10) 0%, transparent 55%),' +
              'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(250,244,230,0.6) 0%, transparent 80%)',
          }}
        />
        <Container className="relative z-10">
          <SectionHeader
            number="§"
            eyebrow="Sitemap"
            title="All pages on AllowanceGuard."
            lede="Organised by section. If you know what you&rsquo;re looking for, you&rsquo;ll find it here."
          />
        </Container>
      </section>

      {/* Main groups */}
      <section className="paper-sub grain py-20 sm:py-28">
        <Container>
          <nav aria-label="Sitemap" className="max-w-4xl">
            <div className="grid sm:grid-cols-2 gap-10 sm:gap-14">
              {GROUPS.map((group, i) => (
                <CascadingScrollAnimation key={group.title} direction="up" distance={30} delay={i * 80}>
                  <div>
                    <h2 className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep mb-4 pb-3 border-b border-ink-rule">
                      {group.title}
                    </h2>
                    <ul className="space-y-3">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="font-plex text-[15px] text-ink-soft hover:text-amber-deep transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CascadingScrollAnimation>
              ))}
            </div>
          </nav>
        </Container>
      </section>

      {/* Blog posts grouped by category */}
      <section className="paper grain py-20 sm:py-28">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-12">
              <SectionHeader
                number="01"
                eyebrow="Blog"
                title="All articles."
                lede={`${blogPosts.length} posts across ${Object.keys(blogByCategory).length} categories.`}
              />
            </div>

            <nav aria-label="Blog articles">
              <div className="space-y-10">
                {Object.entries(blogByCategory).map(([category, posts], i) => (
                  <CascadingScrollAnimation key={category} direction="up" distance={30} delay={i * 80}>
                    <div>
                      <h3 className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep mb-4 pb-3 border-b border-ink-rule">
                        {category} &middot; {posts.length}
                      </h3>
                      <ul className="space-y-3">
                        {posts.map((post) => (
                          <li key={post.slug}>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="font-plex text-[15px] text-ink-soft hover:text-amber-deep transition-colors"
                            >
                              {post.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CascadingScrollAnimation>
                ))}
              </div>
            </nav>
          </div>
        </Container>
      </section>

      {/* Footer note */}
      <section className="paper-sub grain py-12">
        <Container className="max-w-4xl">
          <p className="font-plex text-xs text-ink-whisper text-center">
            Looking for the machine-readable sitemap? See{' '}
            <Link href="/sitemap.xml" className="text-amber-deep hover:underline">
              /sitemap.xml
            </Link>
            .
          </p>
        </Container>
      </section>
    </div>
  )
}
