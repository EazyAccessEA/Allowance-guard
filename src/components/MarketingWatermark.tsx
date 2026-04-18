'use client'

/**
 * MarketingWatermark — the actual AG logo rendered at oversized scale behind
 * marketing surfaces as a brand presence detail. Same mark that sits in the
 * header and on every email; here it lives large, faint, and shimmers once
 * on each page visit.
 *
 * Council calls honoured in the implementation:
 *   Maren (visual):   the canonical AG mark at editorial scale. One signature
 *                     move; centred; faint enough to recede behind content.
 *   Noor (a11y):      aria-hidden; base opacity stays below anything that
 *                     would interfere with body-copy legibility. Shimmer
 *                     disabled under prefers-reduced-motion (see globals.css
 *                     keyframes with the @media branch).
 *   Thane (perf):     single fixed-position layer, transform + opacity only,
 *                     will-change: opacity. GPU-compositable. The PNG source
 *                     is 4KB; served via next/image with priority=false so
 *                     it never blocks LCP on marketing hero paints.
 *   Idris (motion):   4-second slow-brighten → amber-tinted peak → return.
 *                     Fires once per mount. Each route change re-mounts
 *                     the component under App Router; no recurring loops.
 *   Kael (systems):   uses the canonical logo file at
 *                     public/images/branding/ag-logo-ink.png — same artwork
 *                     the header and email templates use.
 *   #2 OSS:           fully open-source; no DRM, no anti-copy, nothing
 *                     hostile. Pure design detail.
 */

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function MarketingWatermark() {
  const pathname = usePathname()
  const [shimmering, setShimmering] = useState(false)

  // Fire a single shimmer sweep on mount + on each pathname change.
  // usePathname() triggers a re-render when the route changes; the effect
  // below restarts the shimmer timer so every new page the user navigates
  // to gets its own subtle brightening once, never repeating.
  useEffect(() => {
    setShimmering(false)
    const arm = window.requestAnimationFrame(() => {
      setShimmering(true)
    })
    const end = window.setTimeout(() => setShimmering(false), 4200)
    return () => {
      window.cancelAnimationFrame(arm)
      window.clearTimeout(end)
    }
  }, [pathname])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center overflow-hidden select-none"
    >
      <div
        className={[
          'ag-watermark-mark',
          'relative',
          'w-[90vmin] h-[90vmin] sm:w-[80vmin] sm:h-[80vmin] lg:w-[70vmin] lg:h-[70vmin]',
          shimmering ? 'ag-watermark-shimmer' : '',
        ].join(' ')}
      >
        <Image
          src="/images/branding/ag-logo-ink.png"
          alt=""
          fill
          priority={false}
          className="object-contain"
          sizes="(max-width: 640px) 90vmin, (max-width: 1024px) 80vmin, 70vmin"
        />
      </div>
    </div>
  )
}
