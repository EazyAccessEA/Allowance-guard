/**
 * Troubleshooting section — common issues, glossary, support routes.
 *
 * Extracted from DocsContentSecondary to keep Secondary under the 600-line
 * limit. Glossary uses a typographic description list with divide-y hairlines
 * rather than stacked cards.
 *
 * Council:
 *  Kael: No cards. Typography + dividers carry structure.
 *  #13 UX writer: Questions phrased as the user would search them.
 *  Noor: Glossary dt/dd use correct semantics for screen readers.
 */

import Link from 'next/link'

const glossary = [
  ['Allowance', 'A permission granted to a smart contract to spend a specific amount of your tokens. Necessary for DeFi interactions; a security risk if left unchecked.'],
  ['Revocation', 'Setting an allowance to zero, removing a contract’s ability to spend your tokens. Requires an on-chain transaction.'],
  ['Gas', 'The fee required to execute transactions on an EVM chain. Paid to validators. Varies with network congestion.'],
  ['Spender', 'The smart contract address you granted permission to — typically a DEX router, NFT marketplace, or lending vault.'],
  ['dApp', 'Decentralised application. Blockchain-based software that typically requires token approvals to function.'],
  ['Non-custodial', 'A security model where you hold your keys and sign your own transactions. No third party can move your funds.'],
] as const

export default function TroubleshootingSection() {
  return (
    <div className="space-y-16">
      <section className="space-y-5">
        <h2 id="common-issues-solutions" className="font-display-tight text-ink tracking-tight leading-[1.0] text-4xl sm:text-5xl">
          Troubleshooting.
        </h2>
        <p className="font-plex text-lg text-ink-muted leading-[1.6]">
          The four questions we get most often, a glossary of terms, and how to reach a human.
        </p>
      </section>

      <section className="space-y-7">
        <h3 id="common-issues" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          Common issues.
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Why can&rsquo;t I see my allowances?</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Three causes, in order of likelihood. First &mdash; you genuinely have no approvals, which is a good security posture. Second &mdash; a transient network or RPC issue prevented the scan from completing; retry or switch networks. Third &mdash; the indexer is delayed; wait a minute and refresh. If it persists, contact support with your wallet address and the chains you expected to see.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Why did my revoke transaction fail?</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Usually gas &mdash; insufficient balance to cover the fee, or underpaid in congestion. Check your wallet balance; increase the gas price. Sometimes a nonce conflict if you have multiple pending transactions; wait a minute and retry. Rarely, the contract has non-standard revoke semantics that require a specific method; file an issue and we&rsquo;ll add support.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Why is a known protocol flagged as risky?</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              The engine errs toward over-flagging. A well-known protocol can still score high if it holds unlimited allowances, has unverified source, or was associated with a past incident. The score is a prompt to review, not a condemnation. You can keep the allowance if the protocol is one you trust and still use; revoke it if you don&rsquo;t.
            </p>
          </div>
          <div>
            <h4 className="font-plex font-semibold text-ink text-base mb-2">Why is my scan taking so long?</h4>
            <p className="font-plex text-base text-ink-muted leading-[1.6]">
              Wallets with long histories across many chains can take a few minutes. Scans run in a background queue; you can navigate away and come back. If it appears frozen for more than a few minutes, refresh the page or reconnect the wallet.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 id="glossary" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          Glossary.
        </h3>
        <dl className="border-t border-b border-ink-rule divide-y divide-ink-rule">
          {glossary.map(([term, def]) => (
            <div key={term} className="flex flex-col sm:flex-row sm:gap-8 py-4">
              <dt className="font-plex font-semibold text-ink text-base sm:w-40 shrink-0">{term}</dt>
              <dd className="font-plex text-base text-ink-muted leading-[1.6] flex-1 m-0">{def}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-6">
        <h3 id="getting-help" className="font-display-tight text-ink tracking-tight text-2xl sm:text-3xl">
          Getting help.
        </h3>
        <div className="space-y-4">
          <p className="font-plex text-base text-ink-muted leading-[1.6]">
            <strong className="text-ink font-semibold">Technical support.</strong> Email{' '}
            <Link href="mailto:support@allowanceguard.com" className="text-amber-deep hover:underline underline-offset-2">support@allowanceguard.com</Link>{' '}
            for wallet connection issues, transaction failures, or platform questions. Typical response within 24 hours.
          </p>
          <p className="font-plex text-base text-ink-muted leading-[1.6]">
            <strong className="text-ink font-semibold">Bug reports.</strong> File an issue on the GitHub repository with your browser, wallet, chain, and steps to reproduce. That gets fixed fastest.
          </p>
          <p className="font-plex text-base text-ink-muted leading-[1.6]">
            <strong className="text-ink font-semibold">Updates and security notes.</strong> Follow{' '}
            <Link href="https://x.com/allowanceguard" className="text-amber-deep hover:underline underline-offset-2">@allowanceguard on X</Link>{' '}
            for platform updates, incident notices, and new-feature announcements.
          </p>
        </div>
      </section>
    </div>
  )
}
