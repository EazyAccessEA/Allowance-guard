# AllowanceGuard Voice Bible

## The Council of 8

Produced by the AllowanceGuard Copy Council: six specialist copywriters and two behavioural psychoanalysts. This document governs every word on the platform.

---

## The Copywriters

### C1 — The Technician (API & Developer docs)
**Voice**: Precise. Terse. Scannable. Speaks in commands. Zero opinion, all utility.
**Register**: Third-person imperative. Present tense. No contractions.
**Sentence length**: Max 15 words. Prefer fragments when unambiguous.
**Owns**: `/docs/api/*`, `/docs/integration/*`, `/docs/api-reference/*`, API error messages, code examples, endpoint descriptions in `docs-data.ts`

**Patterns**:
- "Returns a paginated list of allowances."
- "Requires API key in `Authorization` header."
- "Rate limit: 100 requests/day. Upgrade for more."

**Avoids**: Marketing language, benefit statements, "we", adjectives

---

### C2 — The Guide (User-facing docs & education)
**Voice**: Clear. Patient. Empowering. Treats the reader as intelligent but possibly new. Never patronises.
**Register**: Second-person ("you"). Active voice. One concept per paragraph.
**Sentence length**: 12-20 words avg. Short paragraphs (2-3 sentences).
**Owns**: DocsContent, OnboardingChecklist, tooltips, help text, HowItWorks, FeaturesPreview, Features page

**Patterns**:
- Lead with what the user gains, then explain the mechanism.
- "Your wallet stays in your control. We read public data only."
- When explaining a feature: Benefit first (1 sentence). Mechanism second (1 sentence). Stop.

**Avoids**: Jargon without context. "Simply", "just", "easy". Walls of text.

---

### C3 — The Advocate (Brand, community, open-source)
**Voice**: Warm. Direct. Mission-driven. Communicates the open-core value proposition without guilt-tripping.
**Register**: First-person plural ("we") when speaking as the team. Second-person when addressing the community.
**Sentence length**: Varies. Can be longer for mission statements, short for calls to action.
**Owns**: `/contribute`, `/docs/contributing`, blog copy, footer mission text, docs-data FAQ, thank-you page, community sections

**Patterns**:
- "The core scanner is free and open source. Premium features fund the mission."
- "Your contribution keeps the lights on and the code open."
- "No VC. No token. Community-funded security."

**Avoids**: Guilt language ("please donate", "we need your help"). Corporate speak. "Free Forever" (banned per messaging rules).

---

### C4 — The Sentinel (Security & trust messaging)
**Voice**: Calm authority. States facts. Implies consequences. Offers control. No fear-mongering.
**Register**: Declarative. Third-person for describing systems. Second-person for user actions.
**Sentence length**: Short and definitive. 8-14 words.
**Owns**: Risk labels, security scores, revocation confirmations, alert copy, warning states, WalletSecurity, AllowanceTable empty states

**Patterns**:
- "Unlimited approval. This contract can spend all your USDC."
- "Risk score: 73/100. Two high-risk approvals detected."
- "Revocation confirmed. This contract can no longer access your tokens."
- "No approvals found. Your wallet has a clean slate."

**Avoids**: "DANGER", "WARNING" in all-caps. Exclamation marks. Scare tactics. Vague risk language.

---

### C5 — The Closer (Conversion & pricing)
**Voice**: Confident. Transparent. Value-first. Respects the reader's intelligence about money. Never pushy.
**Register**: Second-person. Declarative headlines. Conversational body.
**Sentence length**: Headlines 3-8 words. Body 10-18 words.
**Owns**: Hero section, CTABand, PricingCard, ProNudge, UpgradePrompt, pricing page, billing pages

**Patterns**:
- Headlines are declarations, not questions: "Know what you've approved." not "Want to know what you've approved?"
- CTA buttons: 2-4 words. One verb. "Scan Your Wallet", "Connect Wallet", "Upgrade to Pro"
- Price anchoring: Show yearly savings as percentage. Lead with value, not cost.
- Trust line after every CTA: One sentence of reassurance.

**Avoids**: "Limited time", "Act now", "Don't miss out". Questions in headlines (weak). Price-first messaging.

---

### C6 — The Cartographer (Navigation, micro-copy, UI chrome)
**Voice**: Invisible when working. Functional. Every label, placeholder, button, empty state, loading state — functional clarity that doesn't draw attention to itself.
**Register**: Imperative for actions. Declarative for states. No personality.
**Sentence length**: 1-6 words for labels. Max 12 words for descriptions.
**Owns**: Header nav, Footer nav, all Button labels, Input placeholders, empty states, loading states, error messages, toasts, Badge labels, form validation

**Patterns**:
- Button labels: Verb + Object. "Scan Wallet", "Revoke Selected", "Export Report"
- Loading: Present participle. "Scanning...", "Loading dashboard...", "Processing revocation..."
- Empty states: State fact, then offer action. "No approvals found. Scan another wallet?"
- Errors: What happened + What to do. "Scan failed. Check your connection and try again."
- Placeholders: Example content. "0x1234...abcd", "Search docs..."

**Avoids**: Cute error messages. Robot humor. Unnecessary punctuation. "Oops", "Whoops", "Uh oh". Ellipsis in non-loading contexts.

---

## The Psychoanalysts

### P1 — Dr. Voss (Behavioural Crypto Psychologist)
**Lens**: Loss aversion, trust formation, decision fatigue in Web3
**Core insight**: Crypto users have been rugged, phished, and lied to. Every word must rebuild trust, not exploit anxiety.

**Rulings**:
1. **The Scam Radar Rule**: If copy could appear on a phishing site, rewrite it. No "revolutionary", "guaranteed", "risk-free", "100% safe". These trigger distrust in experienced crypto users.
2. **The Trust Stack**: Every page must contain at least one of:
   - **Transparency signal**: Open source, read-only, no keys, verifiable on-chain
   - **Control signal**: "You decide", "Your wallet", user-initiated
   - **Proof signal**: Specific numbers, verifiable claims, code links
3. **Loss Framing Ban**: Never frame actions as preventing loss ("Don't lose your tokens"). Frame as gaining control ("Take control of your approvals").
4. **Decision Fatigue Protection**: One primary CTA per viewport. No more than 3 options at any decision point. Progressive disclosure for complex information.
5. **Testimonial Authenticity**: Testimonials must sound like real people, not marketing copy. Include specific details (number of approvals, specific chains). Never use superlatives.

---

### P2 — Dr. Mara (Decision Architecture Specialist)
**Lens**: Cognitive load, choice architecture, conversion psychology
**Core insight**: The free tier must feel generous, not punishing. Upgrades must feel like unlocking, not paying to remove pain.

**Rulings**:
1. **The Cognitive Budget**:
   - Hero headline: 12 words max
   - Hero subhead: 25 words max
   - CTA buttons: 2-4 words
   - Feature cards: Benefit (1 sentence) + Mechanism (1 sentence)
   - Error messages: 2 sentences max (What happened + What to do)
2. **The Generosity Frame**: Free tier copy emphasises what you GET, not what you're missing. Never list locked features on the free plan. Instead, list what's included.
3. **The Unlock Frame**: Pro/Sentinel features are presented as "unlocking" capabilities, not removing restrictions. "Unlock continuous monitoring" not "Remove scan limits".
4. **Price-Value Sequencing**: Always present the value proposition before the price. Feature list comes first, price tag comes after.
5. **The Anchoring Rule**: Show yearly pricing as savings percentage. Position Pro as the "smart choice" through visual hierarchy (highlighted card), not through pressure copy.
6. **The Exit Dignity Rule**: Downgrade/cancel flows must be respectful. "Your premium features remain active until [date]" not "You'll lose access to..."

---

## Forbidden Words & Patterns

| Banned | Replacement |
|--------|-------------|
| "Revolutionary" | (delete — don't replace) |
| "Game-changing" | (delete — don't replace) |
| "Cutting-edge" | (delete — don't replace) |
| "Simply" | (delete — don't replace) |
| "Just" (minimising) | (delete — don't replace) |
| "Easy" | "Clear" or "Straightforward" |
| "Free Forever" | "Free and open source. Always." |
| "100% free" | "Core tool: free and open source" |
| "No premium features" | (delete — messaging has changed) |
| "Trust us" | (show, don't tell) |
| "Don't miss out" | (delete — no urgency tactics) |
| "Limited time" | (delete — no scarcity tactics) |
| "Oops" / "Whoops" | State the error plainly |
| "We're sorry" | State what happened + next step |
| Exclamation marks | Max 1 per page, testimonials only |

---

## The AllowanceGuard Register (Summary)

| Context | Voice | Example |
|---------|-------|---------|
| **Headlines** | Declarative. Short. Punchy. | "Know what you've approved." |
| **Subheads** | One idea. Benefit-first. | "Scan 10 chains. Revoke in one click." |
| **Body copy** | Active voice. One idea per sentence. | "Your wallet stays in your control." |
| **Buttons** | Verb + Object. 2-4 words. | "Scan Your Wallet" |
| **Loading** | Present participle. | "Scanning..." |
| **Empty states** | Fact + Action. | "No approvals found. Scan another wallet?" |
| **Errors** | What happened + What to do. | "Scan failed. Check your connection and try again." |
| **Security** | Calm authority. Facts. | "This contract can spend all your USDC." |
| **Pricing** | Value-first. Transparent. | "Unlock continuous monitoring. $9.99/month." |
| **Community** | Warm. Direct. Mission-driven. | "No VC. No token. Community-funded." |
| **API docs** | Terse. Imperative. Scannable. | "Returns paginated allowances. Max 100 per page." |

---

*This Bible is the source of truth for all copy on allowanceguard.com. Every string, label, headline, error message, and tooltip must pass through these voices before shipping.*
