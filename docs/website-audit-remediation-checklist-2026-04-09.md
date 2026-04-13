# Website Audit Remediation Checklist (File-by-File)

Date: 2026-04-09  
Source: SquirrelScan quick + surface audits on `https://www.allowanceguard.com`

Use this as the execution board for engineering/design/content/legal.  
Council ownership references seats in `CLAUDE.md`.

---

## 0) Priority legend

- `P0` = blocks award-readiness or user trust (accessibility, broken links, major perf)
- `P1` = high-impact growth and credibility improvements
- `P2` = polish and authority-building

---

## 1) P0 tasks (do first)

### A. Global metadata quality + social previews

- **Files**
  - `src/app/layout.tsx`
  - Key route metadata files (or add route-level metadata) for:
    - `src/app/page.tsx`
    - `src/app/features/page.tsx`
    - `src/app/pricing/page.tsx`
    - `src/app/docs/page.tsx`
    - `src/app/blog/page.tsx`
- **Why**
  - Squirrel reported short title/description across many pages, duplicate title, missing `og:image`.
- **Owner**
  - Seat 1 (Editor), Seat 5 (Product marketing), Seat 11 (Founder voice), Seat 13 (UX writer)
- **Checklist**
  - [ ] Unique title per major landing page (home/features/pricing/docs/blog)
  - [ ] Unique description per major landing page
  - [ ] Add `openGraph.images` and `twitter.images` defaults
  - [ ] Remove blanket “free-only” framing; match open-core + paid services
- **Done when**
  - Core SEO warnings materially reduced on those routes in next surface audit

### B. Sitemap + broken route hygiene

- **Files**
  - `src/app/sitemap.xml/route.ts`
  - `src/app/pricing/page.tsx` (broken link source)
  - `src/app/account/keys/page.tsx` (likely intended destination)
- **Why**
  - Audit flagged sitemap 4xx (`/security`) and broken internal link to `/account/api-keys`.
- **Owner**
  - Seat 6 (B2B/API), Seat 10 (SRE), Seat 16 (QA)
- **Checklist**
  - [ ] Remove or implement `/security` route (no 404 in sitemap)
  - [ ] Add missing high-value public URLs to sitemap (`/pricing`, `/networks`, and canonical marketing pages)
  - [ ] Fix pricing CTA link from `/account/api-keys` to valid route (`/account/keys` if that is canonical)
  - [ ] Recheck for orphan pages from docs/account surfaces
- **Done when**
  - `crawl/sitemap-4xx` and `links/broken-links` are clear

### C. Accessibility blockers in docs surfaces

- **Files**
  - `src/app/docs/widget/page.tsx`
  - `src/app/docs/integration/page.tsx`
  - `src/app/docs/api/examples/page.tsx`
  - `src/app/pricing/page.tsx`
  - `src/app/contact/page.tsx`
  - `src/components/MobileNavigation.tsx` and/or `src/components/Header.tsx` (for `mobile-menu` ARIA mismatch)
- **Why**
  - Missing accessible names on copy buttons and inputs; duplicate/missing ARIA references; multiple `main`; hidden-focus issues.
- **Owner**
  - Seat 8 (Accessibility veto), Seat 13 (UX writer), Seat 16 (QA)
- **Checklist**
  - [ ] Add explicit `aria-label` to all icon-only copy buttons in docs pages
  - [ ] Ensure range/text inputs have visible labels and programmatic labels
  - [ ] Fix `mobile-menu` ARIA target mismatch (`aria-controls` id must exist exactly once)
  - [ ] Ensure only one `<main>` landmark on `/pricing` (keep layout main; remove page-level main)
  - [ ] Verify hidden honeypot field in `/contact` is not focusable by AT (`aria-hidden` + inert or remove focusability)
  - [ ] Add table captions / accessible names where flagged
- **Done when**
  - No error-level a11y findings on docs/pricing/contact in surface audit

### D. Performance payload reduction (largest wins)

- **Files**
  - `next.config.ts`
  - `src/app/layout.tsx`
  - `src/components/VideoBackground.tsx`
  - `src/app/blog/page.tsx`
  - `src/app/features/page.tsx`
  - `src/app/contact/page.tsx`
- **Why**
  - Very large JS chunk (~5MB), high total byte weight, lazy above-the-fold images on blog.
- **Owner**
  - Seat 17 (Performance), Seat 15 (Architect), Seat 10 (SRE)
- **Checklist**
  - [ ] Audit imported client-side dependencies on top routes and defer non-critical code paths
  - [ ] Remove unnecessary global preloads/prefetches from layout if they are not critical
  - [ ] Ensure above-the-fold blog images are eager/priority where appropriate
  - [ ] Add poster + preload strategy for background videos, and disable heavy video on constrained devices/reduced motion
  - [ ] Run bundle analysis to identify top offenders in vendor chunk
- **Done when**
  - Reduced total-byte-weight warnings and measurable JS payload drop on home/blog

---

## 2) P1 tasks (high-value after P0)

### E. Security hardening

- **Files**
  - `next.config.ts`
  - `src/middleware.ts` (if CSP/nonces need middleware handling)
  - `src/app/contact/page.tsx` and `src/app/api/contact/*` route (anti-abuse)
- **Owner**
  - Seat 4 (Security), Seat 9 (Legal), Seat 19 (Privacy)
- **Checklist**
  - [ ] Introduce `Content-Security-Policy-Report-Only` first
  - [ ] Collect/triage CSP reports, then enforce CSP
  - [ ] Add stronger anti-abuse for contact form (captcha or rate-limit + challenge strategy)
  - [ ] Manually validate “leaked secret” findings are placeholders/examples only
- **Done when**
  - `security/csp` warning resolved and form-abuse risk documented/mitigated

### F. E-E-A-T and authority surfaces

- **Files**
  - `src/app/about/page.tsx` (new route)
  - `src/app/contact/page.tsx`
  - `src/app/privacy/page.tsx`
  - `src/app/blog/[slug]/page.tsx`
- **Owner**
  - Seat 12 (Ecosystem), Seat 5 (Marketing), Seat 1 (Editor)
- **Checklist**
  - [ ] Add About page with team/mission/operational credibility
  - [ ] Ensure privacy/contact discoverability from nav/footer
  - [ ] Add `datePublished`/`dateModified` structured data for blog posts
- **Done when**
  - E-E-A-T warnings reduced to non-critical level

---

## 3) P2 tasks (polish)

### G. Video accessibility + schema

- **Files**
  - `src/components/VideoBackground.tsx`
  - Video-using pages (`src/app/features/page.tsx`, `src/app/contact/page.tsx`, `src/app/blog/page.tsx`, etc.)
- **Owner**
  - Seat 8 (Accessibility), Seat 17 (Performance), Seat 7 (Visual)
- **Checklist**
  - [ ] Add captions/tracks where videos are meaningful content
  - [ ] Add `poster` attributes to videos
  - [ ] Add `VideoObject` schema where video is content-relevant
- **Done when**
  - Video warnings materially reduced in next full scan

### H. Content quality cleanups

- **Files**
  - `src/app/blog/page.tsx`
  - `src/app/blog/[slug]/page.tsx`
  - `src/components/docs/*`
- **Owner**
  - Seat 1 (Editor), Seat 13 (UX writer)
- **Checklist**
  - [ ] Replace generic anchor text like “learn more”
  - [ ] Reduce redundant image alt text that duplicates adjacent headings
  - [ ] Improve internal linking to reduce orphan/weak pages
- **Done when**
  - Link-text and redundant-alt warnings are reduced

---

## 4) Parallel execution lanes

Run these in parallel to compress cycle time:

- **Lane 1 (A11y P0)**: docs + pricing + mobile navigation ARIA
- **Lane 2 (SEO/Crawl P0)**: metadata + sitemap + broken links
- **Lane 3 (Perf P0)**: bundle/JS/CSS/video/image loading
- **Lane 4 (Security P1)**: CSP + contact anti-abuse

Each lane should produce:
- a patch
- before/after Squirrel summary for affected rules
- manual spot-check notes (keyboard/Lighthouse where relevant)

---

## 5) Verification protocol after each batch

```bash
# Re-run target checks after each batch
squirrel audit https://www.allowanceguard.com -C quick --format llm

# End-of-sprint benchmark
squirrel audit https://www.allowanceguard.com -C surface --format llm

# Release-grade quality gate
squirrel audit https://www.allowanceguard.com -C full --format llm
```

Quality gates:
- [ ] No error-level accessibility findings on core routes
- [ ] No broken internal links
- [ ] No sitemap 4xx entries
- [ ] CSP deployed (report-only or enforce based on phase)
- [ ] Core metadata uniqueness implemented on major landing pages

