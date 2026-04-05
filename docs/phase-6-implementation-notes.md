# Phase 6 — Implementation Notes

---

## Tech Stack Integration

Tokens flow: `src/design/tokens.ts` → CSS custom properties in `globals.css` → Tailwind config → component styles. Components consume tokens via Tailwind classes (`bg-primary-500`) or CSS variables (`var(--color-primary-500)`) for values Tailwind doesn't cover (custom easings, glassmorphism).

**Tailwind config** extends the default theme with the full token set. Colors map to `primary-{50-900}`, `secondary-{50-900}`, `semantic-{success,warning,error,info}-{50-900}`. Spacing uses the 4px grid directly. Border radius, shadows, and z-index all override defaults with handbook values.

**CVA** (class-variance-authority) drives all component variants. Each UI component exports its variant types for consumers. `cn()` from `src/lib/utils.ts` merges conditional classes. No runtime style objects — everything resolves to static class strings.

**Font loading:** Satoshi (display/heading) loaded via `next/font/local` with `font-display: swap`. Inter (body) loaded similarly. JetBrains Mono (code) loaded on-demand via `next/font/google` with subset `latin`. Fonts declared as CSS variables (`--font-heading`, `--font-body`, `--font-mono`) consumed by Tailwind's `fontFamily` extension.

---

## Production Performance

**Bundle strategy:** Components are client-side (`'use client'`) only when state is needed. Page shells, layouts, and static content remain Server Components. Dynamic imports (`next/dynamic`) with named skeleton loaders for heavy components (AllowanceTable, WalletSecurity, charts). This keeps initial JS payload under 150KB gzipped.

**Image strategy:** All images via `next/image` with `sizes` attribute matching breakpoints. Blog/feature images: WebP with AVIF fallback. Hero backgrounds: CSS gradients with optional canvas overlay (particle mesh) — canvas lazy-loaded, skipped on `prefers-reduced-motion: reduce`. Chain icons: inline SVG sprite for zero network requests.

**CSS performance:** Tailwind purges unused classes in production. CSS custom properties add ~2KB to the stylesheet — negligible. Dark mode via `class` strategy (not `media`) for user preference persistence. No CSS-in-JS runtime.

**Animation performance:** All motion uses CSS transforms and opacity only — GPU-composited, no layout thrash. `will-change` applied sparingly (hover-lift cards, modal entrance). `prefers-reduced-motion: reduce` disables all non-essential animation globally via a CSS media query block in `globals.css`. `motion.durations.instant` (0ms) applied as override.

**Critical rendering:** Above-fold content (hero, nav) inlined. Below-fold sections use Intersection Observer for `slideUp`/`fadeIn` entrance animations and lazy image loading. No layout shift — all images have explicit `width`/`height` or `aspect-ratio`.

---

## Asset Management

**Icons:** Lucide React exclusively. Tree-shaken — only imported icons ship. No icon fonts. For chain-specific icons (Ethereum, Polygon, etc.), custom SVG components in `src/components/icons/` with consistent 24px viewBox.

**Favicons:** Generated from the shield mark at `/public/favicon.ico` (32px), `/public/icon.svg` (scalable), `/public/apple-touch-icon.png` (180px). Manifest in `app/manifest.ts`.

**OG images:** Generated via `next/og` (Satori) at build time. Template: dark bg (`secondary-900`), `primary-500` shield icon, page title in Satoshi. Size: 1200×630. Per-page customization via metadata API.

---

## SEO

**Metadata:** Every page exports `metadata` or `generateMetadata`. Title pattern: `{Page} | AllowanceGuard`. Description: unique per page, 150-160 chars, includes primary keyword. Canonical URLs set explicitly.

**Structured data:** `Organization` schema on homepage. `SoftwareApplication` on features. `FAQPage` on FAQ. `Article` on blog posts. `BreadcrumbList` on all inner pages. JSON-LD via `<script type="application/ld+json">` in page head.

**Sitemap:** Auto-generated via `app/sitemap.ts`. Includes all public pages, blog posts, docs pages. Excludes admin, account, settings. `lastModified` from git or DB timestamps.

**Core Web Vitals targets:** LCP < 2.5s (hero image/text), FID < 100ms (no blocking JS), CLS < 0.1 (explicit dimensions on all media). Monitored via Vercel Analytics + Rollbar.
