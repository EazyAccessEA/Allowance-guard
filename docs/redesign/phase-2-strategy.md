# Phase 2: Strategic Foundation

> **Council Leads:** Sable (IA & UX) & Maren (Visual)
> **Contributors:** All six architects

---

## 1. Brand Design Principles

Replacing PuredgeOS. These five principles govern every design decision.

### 1. Controlled Aggression
Every design choice is bold — but intentional. Nothing is loud for shock value. Every colour, every weight, every animation serves a communication purpose. The site doesn't shout; it speaks with absolute certainty.

### 2. Earned Trust
A security product earns trust through transparency, not softness. Show the data. Show the risk. Show the open-source code. Trust comes from competence, not from rounded corners and pastel colours.

### 3. Relentless Clarity
Inherited from PuredgeOS's valid goal — but executed with conviction. Information hierarchy is razor-sharp. Every element earns its space. But clarity doesn't mean boring — it means the user never wastes a second.

### 4. Signature Presence
Every page is unmistakably AllowanceGuard. A visitor should recognise the brand from a screenshot of any page, even without the logo visible. One visual signature, one colour commitment, one typographic voice — consistent everywhere.

### 5. Power to the User
The user is in control. The UI communicates agency — "you can see everything, you can act on anything, nothing is hidden." The dashboard is a command center, not a passive display.

---

## 2. Narrative Arc — The Story AllowanceGuard Tells

The site tells one story: **"You are exposed. We show you how. You take control."**

| Stage | Page(s) | Emotion | Message |
|-------|---------|---------|---------|
| 1. Confrontation | Homepage hero | Tension, urgency | "Your wallet has hidden risks right now" |
| 2. Evidence | Homepage stats, dashboard summary | Concern → understanding | "Here's what we've found across 50K+ wallets" |
| 3. Clarity | Dashboard, Features | Confidence, comprehension | "Every approval, every risk, one clear view" |
| 4. Action | Dashboard revoke, batch actions | Power, control | "Revoke with one click. Take back control." |
| 5. Ongoing protection | Pricing, monitoring features | Security, peace of mind | "Stay protected. We watch while you sleep." |
| 6. Community | Docs, Blog, Open source | Belonging, trust | "Built in the open. Verified by the community." |

---

## 3. Refined User Personas

### Persona A — "The DeFi Power User"
- **Who:** Active DeFi participant, 5-20 dApp interactions per week
- **Technical literacy:** High — understands gas, chains, MEV, contract interactions
- **Goal:** Fast scan, fast revoke, minimal friction. Wants batch operations.
- **Frustration:** Tools that are slow, require too many clicks, or don't support their chains
- **Current alternative:** Revoke.cash (more chains but less features), Etherscan (manual, tedious)
- **What wins them:** Speed, data density, power features (Time Machine, batch revoke, keyboard shortcuts)
- **Tier target:** Pro

### Persona B — "The Security-Conscious Holder"
- **Who:** Holds crypto, may use 1-3 dApps, heard about approval exploits
- **Technical literacy:** Medium — knows wallets and tokens, less familiar with contracts
- **Goal:** Audit their wallet, understand risk, revoke anything dangerous
- **Frustration:** Tools that assume too much knowledge, unclear risk communication
- **Current alternative:** Nothing (they google "how to check token approvals" and find us)
- **What wins them:** Clear risk labels, explanations, reassurance, guided flow
- **Tier target:** Free → Pro upgrade path

### Persona C — "The Institutional Operator"
- **Who:** DAO treasurer, fund manager, compliance officer monitoring multiple wallets
- **Technical literacy:** High — but needs audit trails, not just a dashboard
- **Goal:** Monitor 10-50 wallets, automated alerts, export compliance reports
- **Frustration:** Consumer tools that don't support teams, lack webhooks, no API
- **Current alternative:** Custom scripts, De.Fi, manual Etherscan checks
- **What wins them:** Team dashboard, automated rules, webhook integrations, API access
- **Tier target:** Sentinel

---

## 4. New Site Map

```
AllowanceGuard.com
├── / (Homepage)                    — Brand statement + immediate scan CTA
├── /features                       — Visual feature showcase (not text walls)
├── /pricing                        — Tier comparison + API plans
├── /docs                           — Documentation hub
│   ├── /docs/getting-started       — Onboarding guide
│   ├── /docs/core-concepts         — Allowances, risk scoring, chains
│   ├── /docs/guides                — Usage walkthroughs
│   ├── /docs/api                   — API reference
│   ├── /docs/api/examples          — Code examples
│   ├── /docs/security              — Security model & audit info
│   ├── /docs/contributing          — Open source contribution guide
│   └── /docs/changelog             — Version history (NEW)
├── /blog                           — Blog listing
│   └── /blog/[slug]                — Blog post
├── /contact                        — Support channels
├── /about                          — Team & mission (NEW — replaces scattered info)
├── /tokens                         — Token discovery
├── /networks                       — Supported chains
│
├── /account                        — Account dashboard (authed)
│   ├── /account/billing            — Subscription management
│   ├── /account/api                — API key management
│   └── /account/usage              — Usage analytics
├── /settings                       — Wallet & alert settings (authed)
├── /team/[id]                      — Team dashboard (authed, Sentinel)
├── /report/[wallet]                — Wallet report
├── /share/[token]                  — Public shared view
│
├── /privacy                        — Privacy policy
├── /terms                          — Terms of service
├── /cookies                        — Cookie policy
├── /refund                         — Refund policy
├── /sla                            — SLA
└── /dpa                            — Data processing agreement
```

### Navigation Changes
- **Unified nav** (desktop + mobile): Home, Features, Pricing, Docs, Blog
- **Secondary nav** (footer): About, Contact, Networks, Tokens, Changelog
- **Account nav** (authed): Dashboard, Billing, API Keys, Usage, Settings
- **Remove** inconsistency between mobile and desktop menus
- **Single primary CTA**: "Connect Wallet" (when disconnected) or "Scan" (when connected)
- **Upgrade CTA**: Secondary placement, never competing with the primary action

---

## 5. Emotional Design Brief

### What Should a Visitor FEEL?

| Touchpoint | Target Emotion | Design Implication |
|------------|---------------|-------------------|
| First page load | "This is serious" | Dark, precise, high-contrast. No playfulness. |
| Reading the hero | "I might be at risk" | Urgent copy, tension in the colour, sharp typography |
| Connecting wallet | "This is safe to use" | Trust signals visible, non-custodial messaging, open-source badge |
| Viewing the dashboard | "I'm in control" | Dense but scannable data, clear actions, command-center feel |
| Seeing a Critical risk badge | "I need to act now" | Red pulls attention immediately, action button is obvious |
| Completing a revoke | "I did something powerful" | Satisfying transition, status confirmation, risk score update |
| Exploring Time Machine | "This is clever" | Distinctive UI treatment, simulation feels like a superpower |
| Viewing pricing | "This is fair" | Generous free tier, clear value in upgrading, no dark patterns |
| Reading docs | "These people know what they're doing" | Precise writing, clean code examples, professional layout |

### Emotional Palette
- **Primary emotions:** Power, control, protection, precision
- **Secondary emotions:** Confidence, intelligence, transparency
- **NOT:** Warmth, friendliness, playfulness, casualness
- **The brand voice:** A senior security engineer who speaks plainly, acts decisively, and has nothing to hide
