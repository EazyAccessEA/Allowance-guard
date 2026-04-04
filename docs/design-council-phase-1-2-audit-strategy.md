# Design Council — Phase 1: Audit & Deconstruction + Phase 2: Strategic Foundation

> Council members: **Maren** (Visual), **Idris** (Motion), **Sable** (IA/UX), **Kael** (Systems), **Noor** (Accessibility), **Thane** (Performance)

---

## PHASE 1: AUDIT & DECONSTRUCTION

**Lead: Sable & Kael**

### 1.1 Current Component Catalogue

From the live codebase (`src/components/ui/` and `src/components/`), the following components and patterns are in active use:

**Core UI Components:**
- `Button.tsx` — 11 variants (primary, secondary, ghost, destructive, outline, link, success, warning, info, subtle, accent) × 10 sizes. CVA-based.
- `Card.tsx` — 10 variants including `glass` and `glass-accent` (glassmorphism). Sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter.
- `Badge.tsx` — Standard + specialized: StatusBadge, RiskBadge, ChainBadge.
- `Input.tsx` — With error/success/warning states, icon support.
- `Modal.tsx` — Focus-trapped accessible dialogs.
- `Alert.tsx` — Semantic variants with auto-dismiss toasts.

**Product Components:**
- `AllowanceTable.tsx` — The core product table. Standard HTML table with risk badges.
- `WalletSecurity.tsx` — Radial gauge for security scoring.
- `Hero.tsx` — Homepage hero with animated mesh gradient background.
- `Header.tsx` — Floating pill navigation (Phase 6 redesign addition).
- `Footer.tsx` — Standard multi-column footer.
- `AppArea.tsx` — Main security dashboard wrapper.

**Design System Infrastructure:**
- `src/design/tokens.ts` — Comprehensive token file (colors, typography, spacing, motion, elevation, layout, z-index).
- `tailwind.config.js` — Full Tailwind integration with custom theme.
- `src/styles/hex.css` — Legacy hexagonal primitive system.
- `src/app/globals.css` — Global styles, animations, mesh-gradient keyframes.

### 1.2 PuredgeOS: Deeper Critique

**What PuredgeOS got right (problems it correctly identified):**

| Problem | PuredgeOS Response | Assessment |
|---------|-------------------|------------|
| Users overwhelmed by crypto complexity | 8th-grade reading level microcopy | **Valid.** Readability matters for security tools. |
| Visual noise causes decision fatigue | "Clarity-first" — minimal decoration | **Valid intent, wrong execution.** Clarity ≠ absence of identity. |
| Users need immediate system feedback | Explicit feedback patterns | **Valid.** Transaction feedback is critical. |
| Accessibility as baseline | WCAG AA compliance targets | **Valid and non-negotiable.** |

**Where PuredgeOS failed — specifics:**

**MAREN's critique:** *"PuredgeOS confused restraint with timidity. Apple is restrained — but every surface, every type choice, every colour decision screams intention. PuredgeOS achieves restraint by simply not making choices. The current Serum Teal (#00C2B3) is a pleasant colour that says nothing. It could belong to a dental clinic, a fintech startup, or a meditation app. A security product's palette should make you feel protected, not relaxed."*

**IDRIS's critique:** *"The site is static. No scroll choreography, no entrance animations, no hover energy. The mesh gradient on the hero is the only motion — and it's a slow, ambient blob with no purpose. Motion in a security product should feel like a precision instrument — sharp, responsive, controlled. The current motion tokens (150ms/250ms/500ms) are fine as base values but they're applied with generic easing (ease-in-out). That's the motion equivalent of Times New Roman."*

**SABLE's critique:** *"The information architecture has three critical failures:*
1. *Navigation inconsistency — homepage nav differs from inner page nav. The floating pill nav (Phase 6 addition) is ambitious but creates confusion when some pages use it and others don't.*
2. *Competing CTAs — 'Connect Wallet' and 'Upgrade' fight for attention. Neither wins. The primary user action (scan my wallet) gets lost.*
3. *The dashboard and the marketing site feel like different products. There's no narrative bridge from 'you have a problem' (marketing) to 'here's what you do about it' (dashboard).'"*

**KAEL's critique:** *"The token system in `tokens.ts` is comprehensive — 500+ lines of well-organized values. But it's over-engineered for what it produces. You have 96 spacing values, 9 font weights, 10 button sizes, 10 card variants — and the visual output looks like a Bootstrap template with a custom colour. The system has breadth without conviction. I'd rather have 30 tokens used with absolute precision than 500 tokens that produce generic results."*

**NOOR's assessment:** *"Accessibility foundations are present — focus rings, ARIA patterns, semantic HTML intent. But implementation is inconsistent. The glassmorphism cards (`backdrop-blur`) reduce contrast in certain light conditions. The risk badges appear to use colour + icon + label, which is correct — but I need to verify this holds across all viewport sizes. The reduced-motion media query exists in concept but I see no evidence of the mandatory CSS block being applied globally."*

**THANE's assessment:** *"The tech stack is sound — Next.js 15 with Turbopack, React 19, Tailwind. But the design system has accumulated weight: `hex.css` is legacy dead code, the glassmorphism system adds backdrop-filter operations that impact compositing, and the mesh gradient animation runs continuously on the homepage regardless of visibility. The token file exports everything as a monolithic object. For the redesign, tokens should be CSS custom properties first, with TypeScript types generated from them — not the reverse."*

### 1.3 Gap Analysis: Current State vs. "Design With Conviction"

| Dimension | Current State | Target State | Gap Severity |
|-----------|--------------|-------------|-------------|
| **Brand Colour** | Safe teal, could be any SaaS | Pushed to maximum expression, unmistakably AllowanceGuard | **Critical** |
| **Typography** | Inter/Satoshi — clean, generic | Display font with authority, aggressive scale contrast | **Critical** |
| **Motion** | Near-static, ambient mesh blob | Choreographed, sharp, purposeful | **Critical** |
| **Visual Signature** | None — no recurring motif | One signature element on every page | **Critical** |
| **Dashboard** | Functional table | World-class data presentation with risk communication | **High** |
| **Navigation** | Inconsistent between pages | Unified, confident, clear hierarchy | **High** |
| **Imagery** | Zero photography/illustration | Art-directed, editorial quality | **High** |
| **Dark Mode** | Exists but feels like an afterthought | Dark-first, engineered surfaces | **Medium** |
| **Component Quality** | Correct but generic | Every state polished, every interaction considered | **Medium** |
| **Accessibility** | Foundations present, inconsistent | Complete, verified, zero compromises | **Medium** |
| **Performance** | Adequate | Aggressive budget, zero waste | **Low** (foundation is good) |

### 1.4 User Task Pain Points

Based on the functional spec and site structure:

1. **"Where do I start?"** — A new user landing on the homepage faces a wall of marketing before reaching the actual tool. The CTA hierarchy is unclear.
2. **"Is this approval dangerous?"** — Risk communication in the table relies on small badges. At data-dense scales, risk levels need to be scannable in < 3 seconds.
3. **"Can I trust this tool with my wallet?"** — Social proof uses fabricated testimonials. For a security product, this actively damages trust.
4. **"What's the difference between plans?"** — The pricing page is standard SaaS. It doesn't connect plan features to the user's actual pain.
5. **"I want to revoke, NOW"** — The batch revoke workflow needs to feel both powerful and safe. Users are executing real on-chain transactions.

---

## PHASE 2: STRATEGIC FOUNDATION

**Lead: Sable & Maren**

### 2.1 Narrative Arc

The AllowanceGuard site tells this story, section by section:

| Stage | Emotion | Message |
|-------|---------|---------|
| **1. Arrival** (Hero) | Tension → Power | "Your wallet has risks you don't know about. We find them." |
| **2. Evidence** (Stats/Proof) | Credibility | "X approvals scanned. Open source. On-chain verified." |
| **3. How** (Product Demo) | Clarity → Control | "Connect. Scan. See everything. Revoke what's dangerous." |
| **4. Depth** (Features) | Confidence | "We go deeper than anyone — Time Machine, batch revoke, continuous monitoring." |
| **5. Trust** (Social Proof) | Earned trust | GitHub stars, audit status, open source, ENS identity, on-chain stats. |
| **6. Tiers** (Pricing) | Empowerment | "The core is free. Forever. Upgrade for superpowers." |
| **7. Action** (Final CTA) | Urgency | "Every minute you wait is a minute your approvals are exposed." |

**The story in one line:** *"You have a problem you can't see. We make it visible. Then we give you the power to fix it."*

### 2.2 Refined User Personas

#### Persona 1: "The DeFi Power User" (Primary)

- **Name archetype:** Alex — swaps, farms, bridges weekly across 3+ chains
- **Technical literacy:** High. Understands gas, approvals, contract interactions.
- **Goal:** Fast scan, fast action. Wants to see all approvals across all chains, identify risks, batch-revoke, move on.
- **Frustration:** Current tools are slow, single-chain, or require too many clicks. Revoke.cash covers 100 chains but the UX is cluttered. Etherscan's approval checker is buried and single-chain.
- **What wins them:** Speed, density, multi-chain in one view, batch operations, keyboard shortcuts.
- **Competitive alternatives:** Revoke.cash (free, 100 chains, cluttered UX), De.Fi (multi-chain but slow), Etherscan (trusted but limited).

#### Persona 2: "The Security-Conscious Holder" (Secondary)

- **Name archetype:** Jordan — holds ETH and blue chips, uses 2-3 dApps, heard about approval exploits on Twitter/X
- **Technical literacy:** Medium. Understands wallets, less clear on approvals vs. transactions.
- **Goal:** Audit their wallet, understand what's risky, revoke anything dangerous. Needs reassurance.
- **Frustration:** Most tools assume DeFi literacy. Risk labels without explanation cause anxiety. "Unlimited approval" sounds terrifying without context.
- **What wins them:** Clear explanations, guided flow, risk context ("this approval allows X to spend Y"), one-click safety.
- **Competitive alternatives:** Doing nothing (the default), asking on Discord, Revoke.cash (intimidating for this persona).

#### Persona 3: "The Institutional Operator" (Tertiary — Sentinel Tier)

- **Name archetype:** Morgan — manages a DAO treasury or fund with 10+ wallets
- **Technical literacy:** High, plus compliance requirements.
- **Goal:** Monitor all wallets, automated rules, audit logs for compliance, webhook integrations.
- **Frustration:** No tool combines monitoring + compliance + team access. They're stitching together Revoke.cash + custom scripts + spreadsheets.
- **What wins them:** Multi-wallet dashboard, automated revocation rules, exportable audit logs, API access, team roles.
- **Competitive alternatives:** Custom internal tooling, Blowfish API (simulation, not revocation), manual processes.

### 2.3 New Site Map

```
AllowanceGuard.com
│
├── / (Homepage)
│   Purpose: Convert visitors → connected wallets
│   Hero → Evidence → Product Demo → Features Preview → Trust → Pricing CTA → Final CTA
│
├── /scan (Dashboard — THE PRODUCT)
│   Purpose: Scan, assess, revoke
│   Approval table, risk scoring, chain filters, batch revoke, Time Machine
│   [Requires wallet connection]
│
├── /pricing
│   Purpose: Convert free → paid
│   Tier cards, comparison table, billing toggle, FAQ
│
├── /features
│   Purpose: Deep feature exploration for evaluation-stage users
│   Visual feature showcases, not text walls
│
├── /docs
│   ├── /getting-started
│   ├── /core-concepts
│   ├── /usage-guides
│   ├── /api (B2B API documentation)
│   ├── /advanced
│   ├── /troubleshooting
│   └── /contributing
│   Purpose: Reference and onboarding
│
├── /blog
│   Purpose: SEO, education, thought leadership
│
├── /account
│   ├── /billing
│   ├── /api-keys
│   └── /settings
│   Purpose: User account management
│
├── /tokens
│   Purpose: Token discovery and search
│
├── /contact
│   Purpose: Support and inquiries
│
├── /about (NEW — recommended by council)
│   Purpose: Team, mission, open-source commitment, ENS identity
│
├── /changelog (NEW — recommended by council)
│   Purpose: Build trust through transparency, show active development
│
└── /404
    Purpose: Brand moment, redirect to safety
```

**SABLE's note:** *"I've removed /settings as a top-level page — it's now under /account. The dashboard moves from implicit (AppArea component) to explicit (/scan). Two new pages: /about (trust-building, ENS identity showcase) and /changelog (transparency signal)."*

### 2.4 Emotional Design Brief

| Page/Stage | Primary Emotion | Design Implication |
|-----------|----------------|-------------------|
| Homepage Hero | **Tension → Power** | Dark, cinematic. The user should feel the weight of the problem before being offered the solution. |
| Homepage Evidence | **Credibility** | Clean data presentation. Real numbers. Open-source proof. No fluff. |
| Dashboard (first scan) | **Revelation → Control** | The scan reveals what's hidden. The UI shifts from "loading" to "here's everything." The moment should feel like a curtain being pulled back. |
| Dashboard (table view) | **Mastery** | Dense, scannable, efficient. The user feels like a professional operator. |
| Dashboard (revoke action) | **Power + Safety** | The revoke button is destructive-styled but the confirmation is reassuring. "You're in control." |
| Time Machine | **Intelligence** | This is the "wow" moment. The UI shift should feel like entering a different mode — simulation vs. reality. |
| Pricing | **Empowerment, not pressure** | Free tier feels generous. Upgrade feels like gaining superpowers, not unlocking what was taken away. |
| Docs | **Competence** | Clean, fast, searchable. The user finds answers without friction. |
| 404 | **Wit + Recovery** | A brand moment. Something memorable that redirects to safety. |

### 2.5 Brand Design Principles

Replacing PuredgeOS. These five principles govern every design decision:

#### 1. CONTROLLED AGGRESSION
*"Bold but precise. Every element hits hard but serves a purpose."*
— The opposite of PuredgeOS's passive minimalism. We don't whisper. We don't shout randomly. We speak with authority and intention. Every colour pushed to its most expressive version. Every headline written like a declaration. But never chaos — every bold choice is deliberate.

#### 2. EARNED TRUST
*"Authority through craft and transparency, not through claiming it."*
— A security product earns trust by demonstrating competence, not by saying "trust us." Open-source code, verifiable on-chain stats, the ENS identity, the engineering quality of the UI itself — these ARE the trust signals. No fabricated testimonials. No empty badges. The quality of the product is the proof.

#### 3. RELENTLESS CLARITY
*"Information is power. Never obscure, never decorate at clarity's expense."*
— This inherits PuredgeOS's best instinct but executes it differently. Clarity doesn't mean "no visual identity." Clarity means the user always knows: where they are, what they're looking at, what the risk is, and what to do about it. Achieved through hierarchy, density control, and risk communication design — not through stripping away all character.

#### 4. TACTILE PRECISION
*"Surfaces have weight. Interactions have texture. Nothing feels flat or generic."*
— The Born Again principle of materiality. UI surfaces have subtle depth cues — not gratuitous shadows, but engineered layering. Hover states that respond with energy. Transitions that feel mechanical and precise. The interface should feel like a precision instrument, not a web page.

#### 5. ZERO COMPROMISE
*"Accessibility, performance, and beauty coexist. Trading one for another is failure."*
— Noor's principle, endorsed unanimously. A bold design that fails WCAG is a failed design. A beautiful animation that tanks Core Web Vitals is a failed animation. The constraint of accessibility and performance makes us better designers, not worse ones. Every proposal must pass all three tests.

### 2.6 Council Vote Summary — Phase 2

| Decision | Vote | Dissent |
|----------|------|---------|
| Dark-first approach (dark as default, light as alternative) | 5-1 (Sable dissented) | Sable: "Marketing pages should be light-first for broader appeal." Council response: homepage can be dual, dashboard is dark-first. **Compromise adopted.** |
| Remove all fabricated testimonials | 6-0 | Unanimous. Replace with verifiable trust signals. |
| Space Grotesk as display font | 5-1 (Thane concerned about font weight) | Thane: "Ensure we self-host and subset aggressively." Accepted as implementation constraint. |
| "/scan" as explicit dashboard URL | 6-0 | Unanimous. The product deserves its own path. |
| The "Slash" as visual signature | 4-2 (Sable, Noor cautious) | See Phase 3 for full discussion. |

---

*Phase 1-2 complete. Proceed to Phase 3 (Design Language) →*
