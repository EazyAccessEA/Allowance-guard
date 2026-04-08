import Image from 'next/image'

/**
 * ChainLogoCarousel — Ledger aesthetic
 *
 * Paper-sub strip framing the page close. Amber hairlines top and bottom
 * (the signature move repeats one last time). Chain logos rendered in ink
 * tone via CSS filter so they unify on paper. Roman numeral headline.
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

const WIDTH = 110

export default function ChainLogoCarousel() {
  return (
    <section className="paper-sub grain relative py-20 sm:py-24 overflow-hidden">
      {/* Top amber hairline */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.6) 50%, transparent 90%)',
          boxShadow: '0 0 10px rgba(245,158,11,0.2)',
        }}
      />

      {/* Eyebrow + headline */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="h-px w-8 bg-amber-deep" aria-hidden="true" />
          <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
            Coverage
          </span>
          <span className="h-px w-8 bg-amber-deep" aria-hidden="true" />
        </div>
        <p className="font-display-tight text-2xl sm:text-3xl lg:text-4xl text-ink">
          Fifteen chains. One dashboard.
        </p>
      </div>

      {/* Mobile: stacked */}
      <div className="block sm:hidden">
        <div className="flex flex-col items-center gap-6 px-4">
          {CHAINS.map((chain) => (
            <div
              key={chain.alt}
              className="flex items-center opacity-70"
              style={{ filter: 'grayscale(1) brightness(0.2) contrast(1.2)' }}
            >
              <Image src={chain.src} alt={chain.alt} width={WIDTH} height={32} className="h-8 w-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: continuous marquee */}
      <div className="hidden sm:block w-screen relative overflow-hidden h-12 -ml-4 sm:-ml-6 lg:-ml-8">
        <div className="flex items-center gap-20 lg:gap-28 animate-scroll h-12 whitespace-nowrap">
          {[0, 1, 2].map((setIndex) => (
            <div key={setIndex} className="flex items-center gap-20 lg:gap-28 flex-shrink-0">
              {CHAINS.map((chain) => (
                <div
                  key={`${setIndex}-${chain.alt}`}
                  className="flex items-center opacity-75 hover:opacity-100 transition-opacity duration-300"
                  style={{ filter: 'grayscale(1) brightness(0.25) contrast(1.15)' }}
                >
                  <Image src={chain.src} alt={chain.alt} width={WIDTH} height={32} className="h-8 w-auto" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom amber hairline */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.6) 50%, transparent 90%)',
          boxShadow: '0 0 10px rgba(245,158,11,0.2)',
        }}
      />
    </section>
  )
}
