import Image from 'next/image'

/**
 * ChainCoverageStrip — calm static trust bar (formerly the marquee)
 *
 * Replaces the old animated carousel. Now positioned right after the hero
 * as immediate proof: "we cover 15 chains, this is real infrastructure."
 * Marquee animation removed — coverage is information, not decoration.
 *
 * Council:
 *  #5 Marketing: trust signal lives early in funnel where it converts
 *  #13 UX writer: static = scannable in 2 seconds; marquee was decoration
 *  #17 Performance: -1 animation, -2 logo set duplications
 *  Maren: amber hairlines top + bottom preserved as the signature beat
 *
 * Note: file is still named ChainLogoCarousel.tsx to avoid an import
 * cascade across page.tsx and friends. Component is no longer a carousel.
 */

const CHAINS = [
  { src: '/chains/ethereum.svg', alt: 'Ethereum' },
  { src: '/chains/arbitrum.svg', alt: 'Arbitrum' },
  { src: '/chains/base.svg', alt: 'Base' },
  { src: '/chains/polygon.svg', alt: 'Polygon' },
  { src: '/chains/optimism.svg', alt: 'Optimism' },
  { src: '/chains/avalanche.svg', alt: 'Avalanche' },
  { src: '/chains/bsc.svg', alt: 'BNB Smart Chain' },
  { src: '/chains/fantom.svg', alt: 'Fantom' },
  { src: '/chains/zksync.svg', alt: 'zkSync Era' },
  { src: '/chains/polygon-zkevm.svg', alt: 'Polygon zkEVM' },
  { src: '/chains/mantle.svg', alt: 'Mantle' },
  { src: '/chains/gnosis.svg', alt: 'Gnosis' },
  { src: '/chains/linea.svg', alt: 'Linea' },
  { src: '/chains/scroll.svg', alt: 'Scroll' },
  { src: '/chains/celo.svg', alt: 'Celo' },
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
              Coverage
            </span>
            <span className="font-plex text-sm text-ink-muted">
              Scanning approvals across <strong className="text-ink font-semibold">15 EVM networks</strong>
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-ink-whisper">
            One dashboard · One scan
          </span>
        </div>

        {/* Static logo grid — calm, scannable, monochrome ink */}
        <ul
          className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 xl:grid-cols-[repeat(15,minmax(0,1fr))] gap-x-6 gap-y-5 items-center"
          aria-label="Supported networks"
        >
          {CHAINS.map((chain) => (
            <li key={chain.alt} className="flex items-center justify-center">
              <Image
                src={chain.src}
                alt={chain.alt}
                width={96}
                height={28}
                className="h-7 w-auto opacity-85 transition-opacity hover:opacity-100"
                style={{ filter: 'grayscale(1) brightness(0.25) contrast(1.25)' }}
              />
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
