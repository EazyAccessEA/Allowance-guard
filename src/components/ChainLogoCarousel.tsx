import Image from 'next/image'

const chains = [
  { src: '/ethereum-logo-landscape-purple.png', alt: 'Ethereum', width: 140 },
  { src: '/0923_Arbitrum_Logos_Primary_horizontal_RGB.svg', alt: 'Arbitrum', width: 120 },
  { src: '/Base_lockup_2color.svg', alt: 'Base', width: 120 },
  { src: '/Polygon Primary Dark.svg', alt: 'Polygon', width: 120 },
  { src: '/OPTIMISM-B.svg', alt: 'Optimism', width: 120 },
  { src: '/AvalancheLogo_Horizontal_4C_Primary.svg', alt: 'Avalanche', width: 120 },
]

function LogoSet() {
  return (
    <div className="flex items-center gap-16 lg:gap-24 flex-shrink-0">
      {chains.map((c) => (
        <div key={c.alt} className="flex items-center">
          <Image
            src={c.src}
            alt={c.alt}
            width={c.width}
            height={32}
            className="h-8 w-auto brightness-0 invert"
          />
        </div>
      ))}
    </div>
  )
}

export default function ChainLogoCarousel() {
  return (
    <div className="py-12 sm:py-16 bg-secondary-900 dark:bg-[#060A14]">
      <div className="w-full mb-6">
        <p className="text-base text-gray-300 font-medium text-center">
          Trusted by security-conscious users across
        </p>
      </div>

      {/* Mobile: Stacked Logos */}
      <div className="block sm:hidden">
        <div className="flex flex-col items-center gap-6 px-4">
          {chains.map((c) => (
            <div key={c.alt} className="flex items-center">
              <Image
                src={c.src}
                alt={c.alt}
                width={c.width}
                height={32}
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Continuous Scrolling */}
      <div className="hidden sm:block w-screen relative overflow-hidden h-12 -ml-4 sm:-ml-6 lg:-ml-8">
        <div className="flex items-center gap-16 lg:gap-24 animate-scroll h-12 whitespace-nowrap">
          <LogoSet />
          <LogoSet />
          <LogoSet />
        </div>
      </div>
    </div>
  )
}
