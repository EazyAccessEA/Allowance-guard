# AllowanceGuard — Design Council: Phase 1–2 Audit Strategy

> A systematic audit of the existing design system, accessibility posture, performance baseline, and migration plan.

---

## 1. Design Principles

Every design decision maps back to five principles:

| Principle | Meaning | Concrete Decisions |
|-----------|---------|-------------------|
| **Clarity** | No visual noise; information hierarchy is instant | High-contrast type, generous whitespace, single-column focus areas |
| **Trust** | Earn confidence with every interaction | Consistent patterns, no surprise modals, predictable button placement |
| **Precision** | Every decision is deliberate | 4px spacing grid, systematic type scale, named design tokens |
| **Reassurance** | Users feel safe and competent | Clear feedback on actions, confirmation dialogs for destructive ops, progress indicators |
| **Minimalism** | Remove everything unnecessary | No decorative elements, no gratuitous animation, content-first layouts |

---

## 2. Current State Audit

### 2.1 Component Inventory

| Component | Location | Variants | Status |
|-----------|----------|----------|--------|
| Button | `src/components/ui/Button.tsx` | primary, secondary, ghost, destructive, outline, success, warning, info, link, subtle, accent | ✅ Complete |
| Card | `src/components/ui/Card.tsx` | elevated, outlined, interactive, glass | ✅ Complete |
| Input | `src/components/ui/Input.tsx` | default, error, with icon, with label | ✅ Complete |
| Badge | `src/components/ui/Badge.tsx` | default, primary, success, danger, warning, info, outline, secondary + StatusBadge, RiskBadge, ChainBadge | ✅ Complete |
| Modal | `src/components/ui/Modal.tsx` | default, confirm | ✅ Complete |
| Alert | `src/components/ui/Alert.tsx` | success, error, warning, info + Toast | ✅ Complete |

### 2.2 Identified Inconsistencies

| Issue | Location | Severity | Fix |
|-------|----------|----------|-----|
| Mixed color hardcoding | Various components | Medium | Replace with design tokens |
| Inconsistent focus rings | Button vs Input vs Badge | High | Standardize to `--shadow-focus` |
| Typography scale drift | Some headings use arbitrary sizes | Medium | Enforce token scale |
| Motion inconsistency | Some transitions use 200ms, others 300ms | Low | Align to token durations (150/250/500ms) |
| Dark mode gaps | Some semantic backgrounds miss dark variants | Medium | Audit all semantic bg usage |

---

## 3. Accessibility Audit

### 3.1 WCAG AA Compliance Checklist

| Requirement | Target | Current Status | Action Needed |
|-------------|--------|----------------|---------------|
| Text contrast ratio | ≥ 4.5:1 (normal), ≥ 3:1 (large) | ✅ Passes | Monitor on new components |
| UI component contrast | ≥ 3:1 against adjacent colors | ⚠️ Partial | Audit all borders and icons |
| Focus indicators | Visible on all interactive elements | ⚠️ Partial | Standardize focus ring across all components |
| Keyboard navigation | All features operable via keyboard | ⚠️ Partial | Audit modals, dropdowns, table interactions |
| Screen reader support | ARIA labels on all non-semantic controls | ⚠️ Partial | Add missing `aria-label` attributes |
| Reduced motion | `prefers-reduced-motion` respected | ✅ Passes | Ensure all new animations respect it |
| Touch targets | Minimum 48×48px | ⚠️ Partial | Audit mobile button/link sizes |

### 3.2 Risk Communication — Never Color Alone

Risk indicators **must always** use three signals simultaneously:

| Risk Level | Color | Icon | Label | Background Tint |
|------------|-------|------|-------|-----------------|
| **Low** | `#22C55E` (green) | ✓ (checkmark) | "Low" | `rgba(34, 197, 94, 0.1)` |
| **Medium** | `#F59E0B` (amber) | ⚠ (warning) | "Medium" | `rgba(245, 158, 11, 0.1)` |
| **High** | `#F97316` (orange) | ▲ (triangle) | "High" | `rgba(249, 115, 22, 0.1)` |
| **Critical** | `#EF4444` (red) | ✕ (cross) | "Critical" | `rgba(239, 68, 68, 0.1)` |

**Rule**: If any component displays risk using only color, it fails review and must be fixed before shipping.

### 3.3 Focus Management

- **Focus ring**: `box-shadow: 0 0 0 3px rgba(0, 194, 179, 0.15)` (teal glow)
- **Destructive focus**: `box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15)` (red glow)
- **Tab order**: Follows visual reading order (top-to-bottom, left-to-right)
- **Focus trap**: Required in modals and dialogs
- **Skip link**: Required on every page (`Skip to main content`)

---

## 4. Performance Audit

### 4.1 Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Hero section / main table render |
| **INP** (Interaction to Next Paint) | < 200ms | Button clicks, filter toggles, table interactions |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Font loading, image loading, dynamic content |

### 4.2 Font Loading Strategy

| Font | Weight(s) | Format | Loading |
|------|-----------|--------|---------|
| Satoshi | 700, 800 | woff2 | `next/font/local`, `font-display: swap` |
| Inter | 400, 500, 600, 700 | woff2 | `next/font/local`, `font-display: swap` |
| JetBrains Mono | 400, 500 | woff2 | `next/font/local`, `font-display: swap` |

- Self-hosted from `public/fonts/` (no external requests)
- Subset to Latin characters where possible
- Preload critical weights (Inter 400, Satoshi 700)

### 4.3 Image Optimization

- All images: `loading="lazy"`, `decoding="async"`
- CSS `aspect-ratio` on all `<img>` to prevent CLS
- Fallback CSS gradient for every image slot
- Use Next.js `<Image>` component in production (automatic WebP/AVIF)

### 4.4 Bundle Considerations

- Tree-shake Lucide icons (import individual icons, not the full set)
- Lazy-load heavy components (charts, Time Machine visualization)
- Code-split per route (Next.js App Router handles this)

---

## 5. Brand Consistency Audit

### 5.1 Color Usage Rules

| Context | Color | Token |
|---------|-------|-------|
| Primary CTA | Serum Teal `#00C2B3` | `--color-primary-500` |
| Secondary text | Slate `#475569` | `--dark-text-secondary` |
| Destructive action | Red `#EF4444` | `--color-error-500` |
| Success feedback | Green `#22C55E` | `--color-success-500` |
| Warning feedback | Amber `#F59E0B` | `--color-warning-500` |
| Info/neutral | Blue `#0EA5E9` | `--color-info-500` |
| Card backgrounds | Glass `rgba(17,24,39,0.7)` | `--glass-surface` |

**Rule**: No hardcoded hex values in component CSS. Every color references a token.

### 5.2 Typography Hierarchy

| Element | Font | Size | Weight | Spacing |
|---------|------|------|--------|---------|
| Page title (h1) | Satoshi | 3rem | 700 | -0.03em |
| Section heading (h2) | Satoshi | 2.25rem | 700 | -0.03em |
| Card heading (h3) | Satoshi | 1.875rem | 700 | -0.025em |
| Subsection (h4) | Satoshi | 1.5rem | 600 | -0.02em |
| Body text | Inter | 1rem | 400 | 0 |
| Small/UI text | Inter | 0.875rem | 400–500 | 0 |
| Captions/labels | Inter | 0.75rem | 500 | 0.025em |
| Wallet addresses | JetBrains Mono | 0.75–0.875rem | 400 | 0 |

### 5.3 Spacing Grid

All spacing values must be multiples of 4px. Common values:

- Component gap: `--space-4` (16px)
- Card padding: `--space-6` (24px)
- Section margin: `--space-8` to `--space-12` (32–48px)
- Page padding: `--space-4` mobile, `--space-8` desktop

---

## 6. Component Gap Analysis

### 6.1 Missing Components (Priority Order)

| Component | Priority | Purpose |
|-----------|----------|---------|
| **Tooltip** | High | Feature explanations, truncated address hover |
| **Dropdown/Select** | High | Chain selection, sort options |
| **Toggle/Switch** | High | Time Machine, settings toggles |
| **Skeleton/Loading** | High | Loading states for tables, cards |
| **Tabs** | Medium | Dashboard sections, settings pages |
| **Accordion** | Medium | FAQ, mobile feature comparison |
| **Progress Bar** | Medium | Scan progress, batch revocation |
| **Avatar** | Low | Wallet identity, team members |
| **Breadcrumb** | Low | Docs navigation, nested pages |
| **Pagination** | Low | Large approval lists, API results |

### 6.2 Component Variant Gaps

| Component | Missing Variant | Priority |
|-----------|----------------|----------|
| Button | Loading state (spinner + disabled) | High |
| Card | Skeleton/loading state | High |
| Badge | Animated/pulsing for active alerts | Medium |
| Input | Search variant (with icon + clear button) | Medium |
| Table | Sortable column headers | Medium |

---

## 7. Migration Strategy

### 7.1 Rollout Plan

| Phase | Scope | Timeline | Risk |
|-------|-------|----------|------|
| **Phase A** | Token consolidation — replace all hardcoded values | Week 1–2 | Low |
| **Phase B** | Focus ring + a11y fixes across all components | Week 2–3 | Low |
| **Phase C** | Dark mode consistency pass | Week 3–4 | Medium |
| **Phase D** | New components (Tooltip, Dropdown, Toggle, Skeleton) | Week 4–6 | Medium |
| **Phase E** | Page-level redesigns (Dashboard, Pricing, Features) | Week 6–10 | High |

### 7.2 Testing Approach

- **Visual regression**: Screenshot comparison before/after each phase
- **Accessibility**: Automated axe-core scans + manual keyboard testing
- **Performance**: Lighthouse CI on every PR
- **Cross-browser**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Responsive**: Test at 375px, 768px, 1024px, 1440px

### 7.3 Backwards Compatibility

- Design token CSS variables are additive (old class names still work)
- Component API changes are non-breaking (new props, not renamed ones)
- Visual changes are deployed behind feature flags where impact is high
- Each phase has a rollback plan (git revert to previous commit)

---

## 8. Success Metrics

| Metric | Baseline | Target | How to Measure |
|--------|----------|--------|----------------|
| WCAG AA violations | TBD (audit) | 0 | axe-core automated scan |
| Hardcoded color values | TBD (grep) | 0 | `grep -r "#[0-9a-fA-F]" src/components/` |
| LCP | TBD | < 2.5s | Lighthouse CI |
| CLS | TBD | < 0.1 | Lighthouse CI |
| Component test coverage | TBD | > 80% | Playwright component tests |
| Design token adoption | TBD | 100% of components | Manual audit |

---

## Appendix: Audit Execution Checklist

- [ ] Run axe-core accessibility scan on all pages
- [ ] Grep codebase for hardcoded color values
- [ ] Verify all interactive elements are keyboard-accessible
- [ ] Confirm all risk badges use color + icon + label
- [ ] Run Lighthouse on Dashboard, Pricing, Features, Docs
- [ ] Test all components at 375px, 768px, 1024px, 1440px
- [ ] Verify font loading with network throttling (slow 3G)
- [ ] Check all focus rings are visible and consistent
- [ ] Confirm `prefers-reduced-motion` is respected globally
- [ ] Validate all images have `alt` text, `loading="lazy"`, `aspect-ratio`
