/**
 * build-static-blog.ts — Static export of the AllowanceGuard blog + a sunset
 * landing page, with zero runtime dependencies.
 *
 * The live product (scanner, API, extension backend, crons, database) is being
 * retired. The blog is the only surface worth preserving, and it is already
 * pure static data: src/app/blog/blog-index.ts (card metadata) and
 * src/app/blog/[slug]/blog-data.ts (full HTML bodies). This script renders both
 * into a folder of plain HTML that Cloudflare Pages (free tier) serves as-is —
 * no Next.js, no Node server, no vendor bill beyond the domain.
 *
 * URLs are preserved exactly: /blog and /blog/<slug> keep working so the few
 * links Google has indexed do not 404.
 *
 * Run:  node --experimental-strip-types scripts/build-static-blog.ts
 * Out:  out-static/   (Cloudflare Pages "build output directory")
 */

import { blogPosts } from '../src/app/blog/[slug]/blog-data.ts'
import { blogPosts as blogIndex } from '../src/app/blog/blog-index.ts'
import { mkdirSync, writeFileSync, copyFileSync, readdirSync, rmSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'out-static')
const SITE = 'https://www.allowanceguard.com'
const REPO = 'https://github.com/EazyAccessEA/Allowance-guard'
// Recommended live alternative for anyone who lands here needing the actual tool.
// This is a security surface being retired; leaving people without a pointer is worse.
const ALT = 'https://revoke.cash'

// ---- index metadata keyed by slug (image, excerpt, category, readTime, date) ----
const meta = new Map(blogIndex.map((p) => [p.slug, p]))

// Newest first for listings.
const posts = [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** JSX authored content strings leaked `className=` — normalise to real HTML. */
const cleanBody = (html: string) =>
  html.replace(/\bclassName=/g, 'class=').trim()

const fmtDate = (iso: string) => {
  // Avoid Date() (unavailable in some sandboxes / non-deterministic) — parse the ISO by hand.
  const [y, m, d] = iso.split('T')[0].split('-')
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const mi = Number(m) - 1
  if (!y || Number.isNaN(mi) || !months[mi]) return iso
  return `${months[mi]} ${Number(d)}, ${y}`
}

// ---------------------------------------------------------------------------
// shared chrome
// ---------------------------------------------------------------------------
const RETIRED_BANNER = `
    <div class="banner" role="note">
      <strong>AllowanceGuard has been retired.</strong> The scanner, API, and browser
      extension are no longer running. These articles remain as a free, archived
      reference. To review or revoke live wallet approvals today, use
      <a href="${ALT}" rel="noopener">Revoke.cash</a>.
    </div>`

function shell(opts: {
  title: string
  description: string
  canonical: string
  body: string
  bodyClass?: string
  jsonLd?: string
}): string {
  const { title, description, canonical, body, bodyClass = '', jsonLd = '' } = opts
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<link rel="canonical" href="${canonical}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonical}" />
<meta name="robots" content="index,follow" />
<link rel="icon" href="/images/ag-logo-ink.png" />
<link rel="stylesheet" href="/styles.css" />
${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ''}
</head>
<body class="${bodyClass}">
<header class="site-header">
  <a class="brand" href="/"><img src="/images/ag-logo-ink.png" alt="" width="28" height="28" /><span>AllowanceGuard</span></a>
  <nav>
    <a href="/blog/">Archive</a>
    <a href="${REPO}" rel="noopener">Source</a>
  </nav>
</header>
<main>
${body}
</main>
<footer class="site-footer">
  <p>AllowanceGuard was an open-source Web3 wallet-approval scanner. The live
  product is retired; this archive is preserved under
  <a href="${REPO}/blob/main/LICENSE" rel="noopener">AGPL-3.0</a>.</p>
  <p class="muted">Advisory content only. Nothing here is financial or security advice.
  For live approval management use <a href="${ALT}" rel="noopener">Revoke.cash</a>.</p>
</footer>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// pages
// ---------------------------------------------------------------------------
function sunsetPage(): string {
  const recent = posts.slice(0, 6)
  const cards = recent
    .map((p) => {
      const m = meta.get(p.slug)
      return `      <a class="mini-card" href="/blog/${p.slug}/">
        <span class="mini-cat">${esc(m?.category ?? 'Article')}</span>
        <span class="mini-title">${esc(p.title)}</span>
      </a>`
    })
    .join('\n')

  const body = `
  <section class="hero">
    <p class="eyebrow">Project status</p>
    <h1><span class="ital">AllowanceGuard</span> has been retired.</h1>
    <p class="lede">The wallet-approval scanner, REST API, and browser extension are no
    longer operating. The project is discontinued and no longer maintained. What
    remains — and stays free and public — is the writing: ${posts.length} articles on
    token approvals, Permit2, revocation, and wallet security.</p>
    <div class="cta-row">
      <a class="btn btn-primary" href="/blog/">Read the archive</a>
      <a class="btn btn-ghost" href="${REPO}" rel="noopener">View the source on GitHub</a>
    </div>
  </section>

  <section class="notice">
    <h2>Need to check or revoke approvals right now?</h2>
    <p>AllowanceGuard can no longer do this for you. Use a maintained tool such as
    <a href="${ALT}" rel="noopener">Revoke.cash</a>, or the approval view built into
    wallets like Rabby. Do not rely on any AllowanceGuard endpoint, extension, or
    cached page for live security decisions.</p>
  </section>

  <section class="recent">
    <h2>From the archive</h2>
    <div class="mini-grid">
${cards}
    </div>
    <p class="more"><a href="/blog/">All ${posts.length} articles &rarr;</a></p>
  </section>`

  return shell({
    title: 'AllowanceGuard — Retired. Blog archive & open-source code.',
    description: `AllowanceGuard, the open-source Web3 wallet-approval scanner, has been retired. ${posts.length} articles on approvals, Permit2 and wallet security remain as a free archive.`,
    canonical: `${SITE}/`,
    body,
    bodyClass: 'page-sunset',
  })
}

function blogIndexPage(): string {
  const rows = posts
    .map((p) => {
      const m = meta.get(p.slug)
      const img = m?.image
      const media = img
        ? `<img class="card-img" src="${esc(img)}" alt="" loading="lazy" width="480" height="270" />`
        : `<div class="card-img card-img--empty" aria-hidden="true"></div>`
      return `    <article class="card">
      <a href="/blog/${p.slug}/" class="card-link">
        ${media}
        <div class="card-body">
          <span class="card-cat">${esc(m?.category ?? 'Article')}</span>
          <h2 class="card-title">${esc(p.title)}</h2>
          <p class="card-sub">${esc(p.subtitle)}</p>
          <p class="card-meta">${esc(fmtDate(p.publishedAt))} &middot; ${esc(m?.readTime ?? '')}</p>
        </div>
      </a>
    </article>`
    })
    .join('\n')

  const body = `
  ${RETIRED_BANNER}
  <section class="page-head">
    <p class="eyebrow">Archive</p>
    <h1>The <span class="ital">AllowanceGuard</span> writing</h1>
    <p class="lede">${posts.length} articles on token approvals, Permit2, revocation, and the
    craft of reading a transaction before you sign it. Preserved as a reference.</p>
  </section>
  <section class="card-grid">
${rows}
  </section>`

  return shell({
    title: 'Archive — AllowanceGuard',
    description: `All ${posts.length} AllowanceGuard articles on wallet approvals, Permit2, revocation and Web3 security.`,
    canonical: `${SITE}/blog/`,
    body,
    bodyClass: 'page-index',
  })
}

function postPage(p: (typeof posts)[number], i: number): string {
  const m = meta.get(p.slug)
  const hero = m?.image
    ? `<img class="post-hero" src="${esc(m.image)}" alt="" width="1200" height="630" />`
    : ''
  // prev/next within the sorted (newest-first) list
  const newer = posts[i - 1]
  const older = posts[i + 1]
  const nav = `
    <nav class="post-nav">
      ${older ? `<a class="pn pn-prev" href="/blog/${older.slug}/"><span>Older</span>${esc(older.title)}</a>` : '<span></span>'}
      ${newer ? `<a class="pn pn-next" href="/blog/${newer.slug}/"><span>Newer</span>${esc(newer.title)}</a>` : '<span></span>'}
    </nav>`

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.subtitle,
    datePublished: p.publishedAt.split('T')[0],
    author: { '@type': 'Organization', name: 'AllowanceGuard' },
    publisher: { '@type': 'Organization', name: 'AllowanceGuard' },
    mainEntityOfPage: `${SITE}/blog/${p.slug}/`,
    ...(m?.image ? { image: `${SITE}${m.image}` } : {}),
  })

  const body = `
  ${RETIRED_BANNER}
  <article class="post">
    <div class="post-head">
      <p class="post-cat">${esc(m?.category ?? 'Article')}</p>
      <h1>${esc(p.title)}</h1>
      <p class="post-sub">${esc(p.subtitle)}</p>
      <p class="post-meta">${esc(fmtDate(p.publishedAt))} &middot; ${esc(m?.readTime ?? '')}</p>
    </div>
    ${hero}
    <div class="post-body">
${cleanBody(p.content)}
    </div>
    ${nav}
    <p class="back"><a href="/blog/">&larr; All articles</a></p>
  </article>`

  return shell({
    title: `${p.title} — AllowanceGuard`,
    description: p.subtitle,
    canonical: `${SITE}/blog/${p.slug}/`,
    body,
    bodyClass: 'page-post',
    jsonLd,
  })
}

function notFoundPage(): string {
  const body = `
  <section class="hero">
    <p class="eyebrow">404</p>
    <h1>That page has moved on.</h1>
    <p class="lede">AllowanceGuard is retired. The app pages are gone, but the writing lives on.</p>
    <div class="cta-row"><a class="btn btn-primary" href="/blog/">Read the archive</a></div>
  </section>`
  return shell({
    title: 'Not found — AllowanceGuard',
    description: 'Page not found. AllowanceGuard is retired; the blog archive remains.',
    canonical: `${SITE}/404`,
    body,
    bodyClass: 'page-sunset',
  })
}

// ---------------------------------------------------------------------------
// stylesheet — self-contained; mirrors the live amber/navy palette
// ---------------------------------------------------------------------------
const STYLES = `
@font-face{font-family:'Space Grotesk';src:url('/fonts/SpaceGrotesk-Regular.ttf') format('truetype');font-weight:400;font-display:swap}
@font-face{font-family:'Space Grotesk';src:url('/fonts/SpaceGrotesk-Medium.ttf') format('truetype');font-weight:500;font-display:swap}
@font-face{font-family:'Space Grotesk';src:url('/fonts/SpaceGrotesk-SemiBold.ttf') format('truetype');font-weight:600;font-display:swap}
@font-face{font-family:'Space Grotesk';src:url('/fonts/SpaceGrotesk-Bold.ttf') format('truetype');font-weight:700;font-display:swap}
@font-face{font-family:'Instrument Serif';src:url('/fonts/InstrumentSerif-Regular.ttf') format('truetype');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'Instrument Serif';src:url('/fonts/InstrumentSerif-Italic.ttf') format('truetype');font-weight:400;font-style:italic;font-display:swap}

:root{
  --paper:#FBFAF7; --paper-2:#F4F2EC; --ink:#0F172A; --ink-2:#334155; --muted:#64748B;
  --line:#E2E8F0; --amber:#B45309; --amber-bright:#F59E0B; --amber-wash:#FEF3C7;
  --maxw:72rem;
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);
  font-family:'Space Grotesk',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  line-height:1.6;font-size:17px;-webkit-font-smoothing:antialiased}
a{color:var(--amber);text-decoration:none}
a:hover{text-decoration:underline}
img{max-width:100%;height:auto;display:block}
main{max-width:var(--maxw);margin:0 auto;padding:0 1.25rem}
.ital{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400;letter-spacing:.01em}

/* header / footer */
.site-header{max-width:var(--maxw);margin:0 auto;padding:1.25rem;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:.55rem;color:var(--ink);font-weight:600;font-size:1.05rem}
.brand:hover{text-decoration:none}
.site-header nav{display:flex;gap:1.25rem}
.site-header nav a{color:var(--ink-2);font-size:.95rem}
.site-footer{max-width:var(--maxw);margin:4rem auto 3rem;padding:2rem 1.25rem 0;border-top:1px solid var(--line);color:var(--ink-2);font-size:.9rem}
.site-footer .muted{color:var(--muted)}

/* banner */
.banner{background:var(--amber-wash);border:1px solid #FCD34D;border-radius:12px;
  padding:.9rem 1.1rem;margin:0 0 2.5rem;font-size:.95rem;color:#5b3a09}
.banner a{color:var(--amber)}

/* hero / sunset */
.eyebrow{text-transform:uppercase;letter-spacing:.18em;font-size:.72rem;font-weight:600;color:var(--amber);margin:0 0 .75rem}
.hero{padding:3.5rem 0 2rem;max-width:46rem}
.hero h1{font-size:clamp(2.2rem,5vw,3.4rem);line-height:1.08;margin:.2rem 0 1.1rem;font-weight:700;letter-spacing:-.02em}
.lede{font-size:1.18rem;color:var(--ink-2);margin:0 0 1.75rem}
.cta-row{display:flex;flex-wrap:wrap;gap:.75rem}
.btn{display:inline-block;padding:.75rem 1.35rem;border-radius:10px;font-weight:600;font-size:.98rem}
.btn:hover{text-decoration:none}
.btn-primary{background:var(--ink);color:#fff}
.btn-primary:hover{background:#1e293b}
.btn-ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
.btn-ghost:hover{border-color:var(--ink-2)}

.notice{margin:3rem 0;padding:1.5rem 1.6rem;background:var(--paper-2);border-radius:14px;max-width:46rem}
.notice h2{margin:0 0 .5rem;font-size:1.25rem}
.notice p{margin:0;color:var(--ink-2)}

.recent{margin:3.5rem 0}
.recent h2{font-size:1.1rem;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);font-weight:600}
.mini-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:1rem;margin:1.25rem 0}
.mini-card{display:flex;flex-direction:column;gap:.4rem;padding:1rem 1.1rem;border:1px solid var(--line);border-radius:12px;background:#fff}
.mini-card:hover{border-color:var(--amber);text-decoration:none}
.mini-cat{font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--amber);font-weight:600}
.mini-title{color:var(--ink);font-weight:600;line-height:1.3}
.more a{font-weight:600}

/* index */
.page-head{padding:3rem 0 1rem;max-width:44rem}
.page-head h1{font-size:clamp(2rem,4.5vw,3rem);margin:.2rem 0 1rem;letter-spacing:-.02em;font-weight:700}
.card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(20rem,1fr));gap:1.5rem;margin:2rem 0 1rem}
.card{border:1px solid var(--line);border-radius:16px;overflow:hidden;background:#fff;transition:border-color .15s}
.card:hover{border-color:var(--amber)}
.card-link{color:inherit;display:block}
.card-link:hover{text-decoration:none}
.card-img{width:100%;aspect-ratio:16/9;object-fit:cover;background:var(--paper-2)}
.card-img--empty{display:block}
.card-body{padding:1.1rem 1.2rem 1.35rem}
.card-cat{font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--amber);font-weight:600}
.card-title{font-size:1.18rem;line-height:1.25;margin:.4rem 0 .5rem;color:var(--ink)}
.card-sub{color:var(--ink-2);font-size:.95rem;margin:0 0 .85rem}
.card-meta{color:var(--muted);font-size:.82rem;margin:0}

/* post */
.post{max-width:44rem;margin:0 auto;padding:2rem 0 0}
.post-head{margin:0 0 1.5rem}
.post-cat{text-transform:uppercase;letter-spacing:.14em;font-size:.74rem;font-weight:600;color:var(--amber);margin:0 0 .6rem}
.post-head h1{font-size:clamp(1.9rem,4vw,2.8rem);line-height:1.12;margin:0 0 .8rem;letter-spacing:-.02em;font-weight:700}
.post-sub{font-size:1.2rem;color:var(--ink-2);font-family:'Instrument Serif',Georgia,serif;font-style:italic;margin:0 0 .8rem}
.post-meta{color:var(--muted);font-size:.85rem;margin:0}
.post-hero{width:100%;border-radius:16px;margin:1.5rem 0 2rem;aspect-ratio:1200/630;object-fit:cover}
.post-body{font-size:1.06rem;color:#1f2937}
.post-body h2{font-size:1.6rem;margin:2.4rem 0 .9rem;letter-spacing:-.01em;line-height:1.2}
.post-body h3{font-size:1.25rem;margin:1.8rem 0 .7rem}
.post-body p{margin:0 0 1.15rem}
.post-body ul,.post-body ol{margin:0 0 1.15rem;padding-left:1.4rem}
.post-body li{margin:.35rem 0}
.post-body a{color:var(--amber);text-decoration:underline}
.post-body strong{color:var(--ink)}
.post-body blockquote{margin:1.5rem 0;padding:.5rem 0 .5rem 1.25rem;border-left:3px solid var(--amber);color:var(--ink-2);font-style:italic}
.post-body code{background:var(--paper-2);padding:.12em .4em;border-radius:5px;font-size:.9em}
.post-body pre{background:var(--ink);color:#e2e8f0;padding:1rem 1.2rem;border-radius:12px;overflow-x:auto;font-size:.85rem}
.post-body pre code{background:none;padding:0;color:inherit}
.post-body img{border-radius:12px;margin:1.5rem 0}
.post-body table{width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:.95rem;display:block;overflow-x:auto}
.post-body th,.post-body td{border:1px solid var(--line);padding:.6rem .8rem;text-align:left;vertical-align:top}
.post-body th{background:var(--paper-2);font-weight:600}

.post-nav{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:3rem 0 1rem;border-top:1px solid var(--line);padding-top:1.5rem}
.pn{display:flex;flex-direction:column;gap:.3rem;padding:1rem 1.1rem;border:1px solid var(--line);border-radius:12px;color:var(--ink);font-weight:600;font-size:.95rem}
.pn:hover{border-color:var(--amber);text-decoration:none}
.pn span{font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-weight:600}
.pn-next{text-align:right}
.back{margin:1.5rem 0 0}

@media (max-width:640px){
  .post-nav{grid-template-columns:1fr}
  .pn-next{text-align:left}
}

@media (prefers-color-scheme:dark){
  :root{--paper:#0B1220;--paper-2:#111c30;--ink:#F1F5F9;--ink-2:#CBD5E1;--muted:#94A3B8;--line:#1e293b;--amber:#FBBF24;--amber-wash:#2a2410}
  .card,.mini-card{background:#0f1a2e}
  .btn-primary{background:var(--amber-bright);color:#0F172A}
  .btn-primary:hover{background:#FCD34D}
  .btn-ghost{color:var(--ink)}
  .post-body{color:#dbe4f0}
  .post-body strong{color:var(--ink)}
  .banner{color:#f5e9c8}
}
`

// ---------------------------------------------------------------------------
// emit
// ---------------------------------------------------------------------------
function write(rel: string, content: string) {
  const full = join(OUT, rel)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, content)
}

function copyDirFlat(fromRel: string, toRel: string, filter?: (f: string) => boolean) {
  const from = join(ROOT, fromRel)
  if (!existsSync(from)) return 0
  const to = join(OUT, toRel)
  mkdirSync(to, { recursive: true })
  let n = 0
  for (const f of readdirSync(from)) {
    if (filter && !filter(f)) continue
    try {
      copyFileSync(join(from, f), join(to, f))
      n++
    } catch {}
  }
  return n
}

// fresh out dir
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

// pages
write('index.html', sunsetPage())
write('blog/index.html', blogIndexPage())
posts.forEach((p, i) => write(`blog/${p.slug}/index.html`, postPage(p, i)))
write('404.html', notFoundPage())
write('styles.css', STYLES)

// assets
const nImg = copyDirFlat('public/images/blog', 'images/blog', (f) => /\.(webp|png|jpe?g|svg|avif)$/i.test(f))
const nFont = copyDirFlat('public/fonts', 'fonts', (f) => /-(Regular|Medium|SemiBold|Bold|Italic)\.ttf$/.test(f) && /(SpaceGrotesk|InstrumentSerif)/.test(f))
copyDirFlat('public/images/branding', 'images', (f) => /ag-logo-(ink|white)\.png/.test(f))

// sitemap + robots
const urls = [
  `${SITE}/`,
  `${SITE}/blog/`,
  ...posts.map((p) => `${SITE}/blog/${p.slug}/`),
]
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
    `\n</urlset>\n`,
)
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`)

// Cloudflare Pages redirects: retire every old app route to the sunset page,
// but keep /blog/* serving the archive. Order matters — specific before wildcard.
write(
  '_redirects',
  [
    '# AllowanceGuard is retired. Keep the blog; send everything else to the sunset page.',
    '/blog            /blog/            301',
    '/dashboard/*     /                 301',
    '/account/*       /                 301',
    '/settings/*      /                 301',
    '/docs            /                 301',
    '/docs/*          /                 301',
    '/pricing         /                 301',
    '/features        /                 301',
    '/api/*           /                 410',
    '',
  ].join('\n'),
)

// headers: long cache for assets, no-cache for html
write(
  '_headers',
  [
    '/images/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '/fonts/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '/styles.css',
    '  Cache-Control: public, max-age=86400',
    '',
  ].join('\n'),
)

console.log(`✓ static blog built → out-static/`)
console.log(`  ${posts.length} posts + index + sunset + 404`)
console.log(`  ${nImg} images, ${nFont} fonts copied`)
console.log(`  ${urls.length} URLs in sitemap`)
