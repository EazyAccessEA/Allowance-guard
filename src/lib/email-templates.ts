/**
 * Email templates — Ledger canon.
 *
 * Four kinds, each rendered by `createEmailHTML(content, recipientEmail, kind)`:
 *
 *   - marketing:   waitlist welcome, re-engagement, contact-form user
 *                  confirmation, future newsletter. Quiet wordmark header,
 *                  one-line privacy + unsub footer. No risk warning.
 *   - alert:       risk-approval alerts, drift detection, webhook dispatcher
 *                  emails. Paper-deep canvas, oxblood beat for urgency,
 *                  privacy + unsub + financial-risk warning footer.
 *   - operational: payment receipts, payment failures, trial ending, card
 *                  expiring, magic-link sign-in, team invite. Paper canvas,
 *                  oxblood CTA, privacy + terms + support footer.
 *   - operator:    contact-form messages routed to internal inbox. Minimal
 *                  Ledger frame, monospace technical fields, "reply to" hint.
 *                  No marketing footer (internal email).
 *
 * All four:
 *   - 600px max width, table-based layout (Outlook compatibility)
 *   - WCAG AA verified contrast (Noor's veto)
 *   - System-font fallbacks (Georgia for italic display, system-ui for body)
 *   - No webfonts (graceful degradation)
 *   - No tracking pixels
 *   - Inline `<style>` block + critical inline styles for client robustness
 *
 * Authors caller-side content using the same class names across kinds:
 *   `.success-box`, `.alert-box`, `.button`, `.address`. Each kind defines
 *   these classes in its own CSS so caller content needs no per-kind branching.
 *
 * Council:
 *   #7 Maren (Visual): paper / ink / oxblood enforced; no off-canon hex
 *   Noor (Accessibility VETO): contrast verified per token doc
 *   #1 Editor-in-chief: footer copy tightened; risk warning where warranted
 *   #11 Investor voice: banned-phrase free; "open source" framing preserved
 *   #24 Data protection (VETO): unsub + privacy on marketing/alert
 */

export type EmailKind = 'marketing' | 'alert' | 'operational' | 'operator'

// Ledger tokens — single source of truth for email rendering.
// Mirrors tailwind.config token set.
const TOKENS = {
  paper: '#F7F5F0',
  paperSub: '#EFECE3',
  paperDeep: '#E6E2D5',
  ink: '#0F1115',
  inkSoft: '#2A2D33',
  inkMuted: '#4A4D54',
  inkWhisper: '#585C64',
  inkRule: 'rgba(15,17,21,0.14)',
  amberDeep: '#854F08',
  crimsonPaper: '#B3151F',
  oxblood: '#2D0A0A',
  cream: '#F7F5F0',
} as const

const FONT_DISPLAY = "Georgia, 'Times New Roman', serif"
const FONT_BODY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const FONT_MONO = "ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', monospace"

const PRIVACY_URL = 'https://allowanceguard.com/privacy'
const TERMS_URL = 'https://allowanceguard.com/terms'
const UNSUB_URL = (email: string) =>
  `https://allowanceguard.com/unsubscribe?email=${encodeURIComponent(email)}`

// Asset served from the marketing site so Gmail, Outlook, and Apple Mail
// can proxy-cache it without mixed-content warnings. Flat ink silhouette
// on transparent — the same working mark used by the site header, footer,
// and watermark. Flat geometry survives gradient-stripping email clients
// far better than the previous photograph-style asset.
const LOGO_URL = 'https://www.allowanceguard.com/images/branding/ag-logo-ink.png'

/**
 * Logo + wordmark row. Table-based because Outlook ignores flex/grid
 * and because explicit cell alignment is the only reliable way to
 * vertically centre an <img> next to text across all email clients.
 * Pass a `suffix` for sub-kinds (e.g. "alert" or "operator inbox")
 * and a `variant` to pick a display-italic (marketing/operational)
 * or uppercase-plex (alert/operator) treatment.
 */
function wordmarkRow(opts: {
  suffix?: string
  variant: 'display' | 'meta'
  borderColor?: string
}): string {
  const { suffix, variant, borderColor = TOKENS.inkRule } = opts
  const textStyle =
    variant === 'display'
      ? `font-family: ${FONT_DISPLAY}; font-style: italic; font-size: 20px; font-weight: normal; color: ${TOKENS.ink}; letter-spacing: -0.01em;`
      : `font-family: ${FONT_BODY}; font-size: 12px; font-weight: 600; color: ${TOKENS.ink}; letter-spacing: 0.02em;`
  const suffixStyle = `font-family: ${FONT_BODY}; font-size: 11px; font-weight: 500; color: ${TOKENS.inkMuted}; letter-spacing: 0.08em; text-transform: uppercase;`
  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; margin: 0 0 28px; padding-bottom: 20px; border-bottom: 1px solid ${borderColor};">
      <tr>
        <td style="width: 40px; vertical-align: middle;">
          <img src="${LOGO_URL}" alt="AllowanceGuard" width="32" height="32" style="display: block; border: 0; outline: none; text-decoration: none; width: 32px; height: 32px;" />
        </td>
        <td style="vertical-align: middle; padding-left: 12px;">
          <span style="${textStyle}">AllowanceGuard</span>${
    suffix
      ? ` <span style="${suffixStyle}">&nbsp;·&nbsp; ${suffix}</span>`
      : ''
  }
        </td>
      </tr>
    </table>`.trim()
}

/**
 * Public dispatcher. Default `operational` is the safest neutral choice
 * for any new caller that doesn't think about kind.
 */
export function createEmailHTML(
  content: string,
  recipientEmail: string,
  kind: EmailKind = 'operational',
): string {
  switch (kind) {
    case 'marketing':
      return marketingTemplate(content, recipientEmail)
    case 'alert':
      return alertTemplate(content, recipientEmail)
    case 'operator':
      return operatorTemplate(content)
    case 'operational':
    default:
      return operationalTemplate(content, recipientEmail)
  }
}

// ---------------------------------------------------------------------------
// Marketing — Ledger canon, paper + ink, single oxblood beat
// ---------------------------------------------------------------------------

function marketingTemplate(content: string, recipientEmail: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AllowanceGuard</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${TOKENS.paper}; color: ${TOKENS.ink}; font-family: ${FONT_BODY}; line-height: 1.55; -webkit-font-smoothing: antialiased; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 32px 48px; background-color: ${TOKENS.paper}; }
    h1, h2 { font-family: ${FONT_DISPLAY}; font-style: italic; font-weight: normal; color: ${TOKENS.ink}; letter-spacing: -0.015em; line-height: 1.2; }
    h1 { font-size: 28px; margin: 0 0 16px; }
    h2 { font-size: 22px; margin: 32px 0 12px; }
    h3 { font-family: ${FONT_BODY}; font-size: 15px; font-weight: 600; color: ${TOKENS.ink}; margin: 0 0 8px; }
    p { margin: 0 0 16px; color: ${TOKENS.inkSoft}; font-size: 15px; }
    a { color: ${TOKENS.amberDeep}; text-decoration: underline; }
    ul { margin: 0 0 16px; padding-left: 18px; }
    li { color: ${TOKENS.inkSoft}; font-size: 15px; margin-bottom: 6px; }
    strong { color: ${TOKENS.ink}; font-weight: 600; }
    .success-box, .alert-box { padding: 18px 22px; background-color: ${TOKENS.paperDeep}; border-left: 2px solid ${TOKENS.oxblood}; margin: 24px 0; }
    .button { display: inline-block; padding: 12px 24px; background-color: ${TOKENS.oxblood}; color: ${TOKENS.cream} !important; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 0.01em; }
    .address { display: block; font-family: ${FONT_MONO}; font-size: 13px; padding: 10px 14px; background-color: ${TOKENS.paperSub}; border: 1px solid ${TOKENS.inkRule}; word-break: break-all; }
    .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid ${TOKENS.inkRule}; font-size: 12px; color: ${TOKENS.inkWhisper}; line-height: 1.55; }
    .footer a { color: ${TOKENS.inkWhisper}; text-decoration: underline; }
    .footer p { margin: 0 0 6px; color: ${TOKENS.inkWhisper}; font-size: 12px; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${TOKENS.paper};">
  <div class="container">
    ${wordmarkRow({ variant: 'display' })}
    ${content}
    <div class="footer">
      <p>You're receiving this because you opted in to AllowanceGuard updates.</p>
      <p>
        <a href="${PRIVACY_URL}">Privacy</a>
        &nbsp;·&nbsp;
        <a href="${UNSUB_URL(recipientEmail)}">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`.trim()
}

// ---------------------------------------------------------------------------
// Alert — paper-deep canvas, crimson rule for urgency, financial risk footer
// ---------------------------------------------------------------------------

function alertTemplate(content: string, recipientEmail: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AllowanceGuard alert</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${TOKENS.paperDeep}; color: ${TOKENS.ink}; font-family: ${FONT_BODY}; line-height: 1.55; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px 28px 40px; background-color: ${TOKENS.paper}; border-top: 4px solid ${TOKENS.oxblood}; }
    h1, h2 { font-family: ${FONT_DISPLAY}; font-style: italic; font-weight: normal; color: ${TOKENS.ink}; line-height: 1.2; letter-spacing: -0.015em; }
    h1 { font-size: 26px; margin: 0 0 14px; }
    h2 { font-size: 20px; margin: 28px 0 10px; }
    h3 { font-family: ${FONT_BODY}; font-size: 14px; font-weight: 600; color: ${TOKENS.ink}; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.06em; }
    p { margin: 0 0 14px; color: ${TOKENS.inkSoft}; font-size: 15px; }
    a { color: ${TOKENS.amberDeep}; text-decoration: underline; }
    ul { margin: 0 0 14px; padding-left: 18px; }
    li { color: ${TOKENS.inkSoft}; font-size: 15px; margin-bottom: 6px; }
    strong { color: ${TOKENS.ink}; font-weight: 600; }
    .alert-box { padding: 16px 20px; background-color: ${TOKENS.paperDeep}; border-left: 3px solid ${TOKENS.crimsonPaper}; margin: 20px 0; }
    .alert-box h2, .alert-box h3 { color: ${TOKENS.crimsonPaper}; }
    .success-box { padding: 16px 20px; background-color: ${TOKENS.paperDeep}; border-left: 3px solid ${TOKENS.amberDeep}; margin: 20px 0; }
    .button, .button-danger { display: inline-block; padding: 12px 24px; background-color: ${TOKENS.oxblood}; color: ${TOKENS.cream} !important; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 0.01em; }
    .address { display: block; font-family: ${FONT_MONO}; font-size: 12px; padding: 10px 14px; background-color: ${TOKENS.paperSub}; border: 1px solid ${TOKENS.inkRule}; word-break: break-all; color: ${TOKENS.inkSoft}; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid ${TOKENS.inkRule}; font-size: 11px; color: ${TOKENS.inkWhisper}; line-height: 1.55; }
    .footer a { color: ${TOKENS.inkWhisper}; text-decoration: underline; }
    .footer p { margin: 0 0 8px; color: ${TOKENS.inkWhisper}; font-size: 11px; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${TOKENS.paperDeep};">
  <div class="container">
    ${wordmarkRow({ variant: 'meta', suffix: 'alert' })}
    ${content}
    <div class="footer">
      <p><strong style="color:${TOKENS.inkMuted};">Risk warning.</strong> Cryptocurrency and DeFi activities involve substantial risk of loss. Allowance Guard provides visibility and tooling; you remain responsible for your own wallet decisions.</p>
      <p>
        <a href="${PRIVACY_URL}">Privacy</a>
        &nbsp;·&nbsp;
        <a href="${TERMS_URL}">Terms</a>
        &nbsp;·&nbsp;
        <a href="${UNSUB_URL(recipientEmail)}">Manage alerts</a>
      </p>
    </div>
  </div>
</body>
</html>`.trim()
}

// ---------------------------------------------------------------------------
// Operational — paper canvas, neutral framing, oxblood CTA, privacy+terms
// ---------------------------------------------------------------------------

function operationalTemplate(content: string, recipientEmail: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AllowanceGuard</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${TOKENS.paper}; color: ${TOKENS.ink}; font-family: ${FONT_BODY}; line-height: 1.55; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 0 auto; padding: 36px 28px 40px; background-color: ${TOKENS.paper}; }
    h1, h2 { font-family: ${FONT_DISPLAY}; font-style: italic; font-weight: normal; color: ${TOKENS.ink}; line-height: 1.2; letter-spacing: -0.015em; }
    h1 { font-size: 26px; margin: 0 0 14px; }
    h2 { font-size: 20px; margin: 28px 0 10px; }
    h3 { font-family: ${FONT_BODY}; font-size: 15px; font-weight: 600; color: ${TOKENS.ink}; margin: 0 0 8px; }
    p { margin: 0 0 14px; color: ${TOKENS.inkSoft}; font-size: 15px; }
    a { color: ${TOKENS.amberDeep}; text-decoration: underline; }
    ul { margin: 0 0 14px; padding-left: 18px; }
    li { color: ${TOKENS.inkSoft}; font-size: 15px; margin-bottom: 6px; }
    strong { color: ${TOKENS.ink}; font-weight: 600; }
    table { font-size: 14px; }
    .success-box { padding: 16px 20px; background-color: ${TOKENS.paperDeep}; border-left: 3px solid ${TOKENS.amberDeep}; margin: 20px 0; }
    .alert-box { padding: 16px 20px; background-color: ${TOKENS.paperDeep}; border-left: 3px solid ${TOKENS.crimsonPaper}; margin: 20px 0; }
    .button, .button-danger { display: inline-block; padding: 12px 24px; background-color: ${TOKENS.oxblood}; color: ${TOKENS.cream} !important; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 0.01em; }
    .address { display: block; font-family: ${FONT_MONO}; font-size: 13px; padding: 10px 14px; background-color: ${TOKENS.paperSub}; border: 1px solid ${TOKENS.inkRule}; word-break: break-all; color: ${TOKENS.inkSoft}; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid ${TOKENS.inkRule}; font-size: 12px; color: ${TOKENS.inkWhisper}; line-height: 1.55; }
    .footer a { color: ${TOKENS.inkWhisper}; text-decoration: underline; }
    .footer p { margin: 0 0 6px; color: ${TOKENS.inkWhisper}; font-size: 12px; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${TOKENS.paper};">
  <div class="container">
    ${wordmarkRow({ variant: 'display' })}
    ${content}
    <div class="footer">
      <p>Need help? Reply to this email or contact <a href="mailto:support@allowanceguard.com">support@allowanceguard.com</a>.</p>
      <p>
        <a href="${PRIVACY_URL}">Privacy</a>
        &nbsp;·&nbsp;
        <a href="${TERMS_URL}">Terms</a>
        &nbsp;·&nbsp;
        <a href="${UNSUB_URL(recipientEmail)}">Manage emails</a>
      </p>
    </div>
  </div>
</body>
</html>`.trim()
}

// ---------------------------------------------------------------------------
// Operator — internal inbox, minimal frame, monospace fields, no marketing
// ---------------------------------------------------------------------------

function operatorTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AllowanceGuard — operator inbox</title>
  <style>
    body { margin: 0; padding: 0; background-color: ${TOKENS.paperSub}; color: ${TOKENS.ink}; font-family: ${FONT_BODY}; line-height: 1.55; }
    .container { max-width: 640px; margin: 0 auto; padding: 24px 24px 32px; background-color: ${TOKENS.paper}; border-left: 3px solid ${TOKENS.oxblood}; }
    h1, h2 { font-family: ${FONT_DISPLAY}; font-style: italic; font-weight: normal; color: ${TOKENS.ink}; line-height: 1.2; }
    h1 { font-size: 22px; margin: 0 0 12px; }
    h2 { font-size: 18px; margin: 24px 0 8px; }
    p { margin: 0 0 12px; color: ${TOKENS.inkSoft}; font-size: 14px; }
    a { color: ${TOKENS.amberDeep}; text-decoration: underline; }
    strong { color: ${TOKENS.ink}; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px; }
    table td { padding: 6px 0; vertical-align: top; }
    table td.label { width: 110px; color: ${TOKENS.inkMuted}; }
    .quote { padding: 14px 18px; background-color: ${TOKENS.paperDeep}; border-left: 2px solid ${TOKENS.oxblood}; font-size: 14px; color: ${TOKENS.ink}; white-space: pre-wrap; }
    .mono { font-family: ${FONT_MONO}; font-size: 12px; color: ${TOKENS.inkSoft}; }
    .reply-hint { margin-top: 20px; padding-top: 14px; border-top: 1px solid ${TOKENS.inkRule}; font-size: 12px; color: ${TOKENS.inkWhisper}; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${TOKENS.paperSub};">
  <div class="container">
    ${wordmarkRow({ variant: 'meta', suffix: 'operator inbox' })}
    ${content}
  </div>
</body>
</html>`.trim()
}
