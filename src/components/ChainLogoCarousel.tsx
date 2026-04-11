/**
 * ChainCoverageStrip — typographic coverage bar
 *
 * Replaces the earlier image-based logo row. The previous implementation
 * mixed wordmark SVGs (Ethereum, Arbitrum, Base, Polygon, Optimism,
 * Avalanche, zkSync, Linea) with icon-only glyphs (BSC, Fantom, Mantle,
 * Gnosis, Celo, Scroll, Polygon zkEVM) and then crushed everything with a
 * grayscale + brightness filter. The filter destroyed the icon-only shapes
 * and left the row looking like a line of broken black blobs.
 *
 * New treatment: each chain rendered as a typographic wordmark in the
 * display face. Uniform. Monochrome. Matches the Ledger paper+ink
 * aesthetic without depending on third-party brand assets.
 *
 * Council:
 *  #5 Marketing: trust signal preserved — the count "27 EVM networks" and
 *    the full list of names remain the proof
 *  #7 Visual / Maren: uniform type beats broken mixed-media
 *  #8 Accessibility / Noor: text has native AA contrast and native
 *    screen-reader semantics (veto satisfied)
 *  #13 UX writer: chain names are the content; logos were decoration
 *  #17 Performance / Thane: removes 15 image loads from marketing surface
 *
 * Note: file is still named ChainLogoCarousel.tsx to avoid an import
 * cascade across page.tsx. Component is no longer a carousel.
 */

const CHAINS = [
  'Ethereum',
  'Arbitrum',
  'Base',
  'Optimism',
  'Polygon',
  'Avalanche',
  'BNB Chain',
  'Fantom',
  'zkSync Era',
  'Polygon zkEVM',
  'Mantle',
  'Gnosis',
  'Linea',
  'Scroll',
  'Celo',
  'Blast',
  'Cronos',
  'Moonbeam',
  'Aurora',
  'opBNB',
  'Manta Pacific',
  'Mode',
  'Taiko',
  'Metis',
  'Kava',
  'ZetaChain',
  'Worldchain',
]

export default function ChainLogoCarousel() {
  return (
    <section className="paper-sub relative py-10 sm:py-12 overflow-hidden">
      {/* Top amber hairline — signature */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 8%, rgba(133,79,8,0.6) 50%, transparent 92%)',
        }}
      />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        {/* Single-line label + counts */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
              Coverage
            </span>
            <span className="font-plex text-sm text-ink-muted">
              Scanning approvals across <strong className="text-ink font-semibold">27 EVM networks</strong>
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-ink-whisper">
            One dashboard · One scan
          </span>
        </div>

        {/* Typographic chain wordmarks — uniform, scannable, ink-tone */}
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-4"
          aria-label="Supported networks"
        >
          {CHAINS.map((chain) => (
            <li
              key={chain}
              className="font-display-tight text-ink text-lg sm:text-xl leading-none tracking-tight"
            >
              {chain}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom amber hairline — signature */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 8%, rgba(133,79,8,0.6) 50%, transparent 92%)',
        }}
      />
    </section>
  )
}
