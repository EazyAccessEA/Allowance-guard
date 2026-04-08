import Image from 'next/image'

/**
 * Framed marquee — amber hairlines top and bottom. Signature move repeats
 * one final time to close the page. Mono eyebrow matches the SectionHeader system.
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
    <section className="relative py-20 sm:py-24 bg-[#060A14] overflow-hidden">
      {/* Top amber hairline */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.45) 50%, transparent 90%)',
          boxShadow: '0 0 10px rgba(245,158,11,0.18)',
        }}
      />

      {/* Eyebrow */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3">
          <span className="h-px w-8 bg-amber-400/50" aria-hidden="true" />
          <span className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase text-amber-400">
            06 &nbsp; · &nbsp; Coverage
          </span>
          <span className="h-px w-8 bg-amber-400/50" aria-hidden="true" />
        </div>
        <p className="mt-5 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Fifteen chains. One dashboard.
        </p>
      </div>

      {/* Mobile: stacked */}
      <div className="block sm:hidden">
        <div className="flex flex-col items-center gap-6 px-4">
          {CHAINS.map((chain) => (
            <div key={chain.alt} className="flex items-center opacity-60">
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
                  className="flex items-center opacity-80 hover:opacity-100 transition-opacity duration-300"
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
        className="absolute bottom-0 inset-x-0 h-px"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.45) 50%, transparent 90%)',
          boxShadow: '0 0 10px rgba(245,158,11,0.18)',
        }}
      />
    </section>
  )
}
