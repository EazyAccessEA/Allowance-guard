import Image from 'next/image'

const CHAINS = [
  { src: '/ethereum-logo-landscape-purple.png', alt: 'Ethereum', width: 140 },
  { src: '/0923_Arbitrum_Logos_Primary_horizontal_RGB.svg', alt: 'Arbitrum', width: 120 },
  { src: '/Base_lockup_2color.svg', alt: 'Base', width: 120 },
  { src: '/Polygon Primary Dark.svg', alt: 'Polygon', width: 120 },
  { src: '/OPTIMISM-B.svg', alt: 'Optimism', width: 120 },
  { src: '/AvalancheLogo_Horizontal_4C_Primary.svg', alt: 'Avalanche', width: 120 },
]

export default function ChainLogoCarousel() {
  return (
    <section className="relative py-16 sm:py-20 bg-[#060A14] overflow-hidden">
      {/* Gradient transition */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'linear-gradient(to bottom, #060A14 0%, transparent 100%)' }}
      />

      {/* Subtle crimson line top */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(90deg, transparent 20%, rgba(229,62,62,0.2) 50%, transparent 80%)',
        }}
      />

      <div className="text-center mb-10">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-400/80">
          Securing wallets across
        </p>
        <p className="mt-2 text-sm text-slate-400">15 EVM chains. One dashboard.</p>
      </div>

      {/* Mobile: Stacked */}
      <div className="block sm:hidden">
        <div className="flex flex-col items-center gap-6 px-4">
          {CHAINS.map((chain) => (
            <div key={chain.alt} className="flex items-center opacity-50 hover:opacity-80 transition-opacity">
              <Image
                src={chain.src}
                alt={chain.alt}
                width={chain.width}
                height={32}
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Continuous scroll — three sets */}
      <div className="hidden sm:block w-screen relative overflow-hidden h-12 -ml-4 sm:-ml-6 lg:-ml-8">
        <div className="flex items-center gap-20 lg:gap-28 animate-scroll h-12 whitespace-nowrap">
          {[0, 1, 2].map((setIndex) => (
            <div
              key={setIndex}
              className="flex items-center gap-20 lg:gap-28 flex-shrink-0"
            >
              {CHAINS.map((chain) => (
                <div
                  key={`${setIndex}-${chain.alt}`}
                  className="flex items-center opacity-70 hover:opacity-100 transition-opacity duration-300"
                >
                  <Image
                    src={chain.src}
                    alt={chain.alt}
                    width={chain.width}
                    height={32}
                    className="h-8 w-auto brightness-0 invert"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
