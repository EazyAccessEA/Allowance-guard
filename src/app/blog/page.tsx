'use client'

/**
 * Blog index — Ledger aesthetic
 *
 * Council:
 *  Maren: paper/grain surfaces, font-display-tight headlines, Highlight signature, no glassmorphism
 *  Kael: SectionHeader, paper-card (no rounded-lg), system pills
 *  Idris: CascadingScrollAnimation on hero + every card
 *  Noor: semantic article elements, alt text on images, AA contrast
 *  Thane: No VideoBackground. Images use next/image with lazy loading.
 *  #20 Brand: "Thinking clearly about Web3 security" — editorial, not listicle
 *  #21 Technical: Categories as mono labels, not coloured pills
 *  #22 Conversion: Featured article earns prime position, clear read CTA
 */

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import SectionHeader from '@/components/ui/SectionHeader'
import Highlight from '@/components/ui/Highlight'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'
import { blogPosts, type BlogPost } from './blog-index'

const GRID_PAGE_SIZE = 9

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatDateShort(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const CATEGORIES = ['All', 'Security', 'Education', 'Tutorial', 'Community', 'Innovation'] as const

function byDateDesc(a: BlogPost, b: BlogPost) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [visibleCount, setVisibleCount] = useState(GRID_PAGE_SIZE)

  // Filter applies to everything — hero, secondary featured row, grid — so
  // a "Security" reader doesn't scroll past Community featured posts to get
  // to the grid that actually matches their filter.
  const filteredByCategory = useMemo(() => {
    return blogPosts
      .filter(post => activeCategory === 'All' || post.category === activeCategory)
      .sort(byDateDesc)
  }, [activeCategory])

  const featured = useMemo(() => filteredByCategory.filter(p => p.featured), [filteredByCategory])
  const heroPost = featured[0] ?? null
  const secondaryFeatured = featured.slice(1, 3)

  const gridPosts = useMemo(() => {
    // Anything not already rendered as hero or secondary-featured
    const topLevelSlugs = new Set<string>()
    if (heroPost) topLevelSlugs.add(heroPost.slug)
    for (const p of secondaryFeatured) topLevelSlugs.add(p.slug)
    return filteredByCategory.filter(p => !topLevelSlugs.has(p.slug))
  }, [filteredByCategory, heroPost, secondaryFeatured])

  const visibleGridPosts = gridPosts.slice(0, visibleCount)
  const hasMore = gridPosts.length > visibleCount

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: blogPosts.length }
    for (const post of blogPosts) {
      counts[post.category] = (counts[post.category] || 0) + 1
    }
    return counts
  }, [])

  // Reset the grid page size when the category changes so the user always
  // starts at page 1 of the new filter instead of landing mid-scroll.
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setVisibleCount(GRID_PAGE_SIZE)
  }

  return (
    <div className="min-h-screen bg-paper">

      {/* ── Hero ── */}
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
            number="AG"
            eyebrow="Blog"
            title={<>Thinking clearly about <Highlight>Web3 security.</Highlight></>}
            lede="Insights, guides, and deep dives into token allowances, wallet defence, and DeFi best practices."
          />
        </Container>
      </section>

      {/* ── Featured row ── hero + 2 medium cards ── */}
      {heroPost && (
        <section className="paper-sub grain py-20 sm:py-28 overflow-hidden">
          <Container>
            <div className="max-w-5xl mx-auto space-y-10">

              {/* Hero (largest) */}
              <CascadingScrollAnimation direction="up" distance={40} delay={0}>
                <article className="paper-card-raised overflow-hidden">
                  <div className="grid lg:grid-cols-2">
                    {heroPost.image && (
                      <div
                        className="relative h-64 lg:h-auto min-h-[320px] overflow-hidden bg-paper-sub"
                        style={{ viewTransitionName: `blog-hero-${heroPost.slug}` }}
                      >
                        <Image src={heroPost.image} alt={heroPost.title} fill className="object-cover" priority />
                      </div>
                    )}
                    <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                      <div className="inline-flex items-baseline gap-3 mb-5">
                        <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
                          Featured
                        </span>
                        <span className="h-px w-8 bg-ink-rule" aria-hidden="true" />
                        <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
                          {heroPost.category}
                        </span>
                      </div>
                      <h2
                        className="font-display-tight text-ink leading-[1.05] text-3xl sm:text-4xl mb-4"
                        style={{ viewTransitionName: `blog-title-${heroPost.slug}` }}
                      >
                        <Link href={`/blog/${heroPost.slug}`} className="hover:text-amber-deep transition-colors duration-200">
                          {heroPost.title}
                        </Link>
                      </h2>
                      <p className="font-plex text-ink-soft text-[15px] leading-relaxed mb-6">
                        {heroPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="font-mono text-xs text-ink-whisper tracking-wide">
                          {formatDate(heroPost.publishedAt)} &middot; {heroPost.readTime}
                        </div>
                        <Link href={`/blog/${heroPost.slug}`} className="paper-button text-sm">
                          Read article
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </CascadingScrollAnimation>

              {/* Secondary featured — up to two medium cards */}
              {secondaryFeatured.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {secondaryFeatured.map((post, i) => (
                    <CascadingScrollAnimation key={post.slug} direction="up" distance={30} delay={(i + 1) * 80}>
                      <article className="paper-card overflow-hidden h-full flex flex-col group">
                        {post.image && (
                          <div
                            className="relative h-52 overflow-hidden bg-paper-sub border-b border-ink-rule"
                            style={{ viewTransitionName: `blog-hero-${post.slug}` }}
                          >
                            <Image src={post.image} alt={post.title} fill className="object-cover" />
                          </div>
                        )}
                        <div className="p-6 sm:p-7 flex flex-col flex-1">
                          <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper mb-3">
                            {post.category}
                          </span>
                          <h3
                            className="font-display-tight text-ink leading-[1.1] text-xl mb-3 group-hover:text-amber-deep transition-colors duration-200"
                            style={{ viewTransitionName: `blog-title-${post.slug}` }}
                          >
                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                          </h3>
                          <p className="font-plex text-ink-muted text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink-rule">
                            <span className="font-mono text-[10px] text-ink-whisper tracking-wide">
                              {formatDateShort(post.publishedAt)} &middot; {post.readTime}
                            </span>
                            <Link href={`/blog/${post.slug}`} className="font-plex text-sm font-medium text-amber-deep hover:underline">
                              Read
                            </Link>
                          </div>
                        </div>
                      </article>
                    </CascadingScrollAnimation>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* ── All articles ── filter + grid + view more ── */}
      <section className="paper grain py-20 sm:py-28 overflow-hidden">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <SectionHeader number="01" eyebrow="Archive" title="All articles." />
            </div>

            {/* Category filter pills — covers hero, featured, and grid together */}
            <div
              className="mb-10 flex flex-wrap gap-2"
              role="group"
              aria-label="Filter articles by category"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  aria-pressed={activeCategory === cat}
                  className={[
                    'px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.22em] uppercase border border-ink-rule transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-deep focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                    activeCategory === cat
                      ? 'bg-ink text-paper'
                      : 'bg-paper text-ink-muted hover:text-ink hover:bg-paper-sub',
                  ].join(' ')}
                >
                  {cat} ({categoryCounts[cat] || 0})
                </button>
              ))}
            </div>

            {activeCategory !== 'All' && (
              <p className="font-plex text-sm text-ink-whisper mb-6" aria-live="polite">
                Showing {filteredByCategory.length} article{filteredByCategory.length === 1 ? '' : 's'} in {activeCategory}.
              </p>
            )}

            {visibleGridPosts.length === 0 ? (
              <p className="font-plex text-base text-ink-muted">
                No articles in this category yet.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleGridPosts.map((post, i) => (
                  <CascadingScrollAnimation key={post.slug} direction="up" distance={30} delay={(i % 3) * 80}>
                    <article className="paper-card overflow-hidden h-full flex flex-col group">
                      {post.image && (
                        <div
                          className="relative h-44 overflow-hidden bg-paper-sub border-b border-ink-rule"
                          style={{ viewTransitionName: `blog-hero-${post.slug}` }}
                        >
                          <Image src={post.image} alt={post.title} fill className="object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper mb-3">
                          {post.category}
                        </span>
                        <h3
                          className="font-display-tight text-ink leading-[1.1] text-lg mb-3 group-hover:text-amber-deep transition-colors duration-200"
                          style={{ viewTransitionName: `blog-title-${post.slug}` }}
                        >
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="font-plex text-ink-muted text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-ink-rule">
                          <span className="font-mono text-[10px] text-ink-whisper tracking-wide">
                            {formatDateShort(post.publishedAt)} &middot; {post.readTime}
                          </span>
                          <Link href={`/blog/${post.slug}`} className="font-plex text-sm font-medium text-amber-deep hover:underline">
                            Read
                          </Link>
                        </div>
                      </div>
                    </article>
                  </CascadingScrollAnimation>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisibleCount(c => c + GRID_PAGE_SIZE)}
                  className="paper-button text-sm"
                >
                  View more ({gridPosts.length - visibleCount} left)
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  )
}
