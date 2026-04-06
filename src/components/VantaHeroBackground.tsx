'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Vanta.js NET effect — interactive WebGL mesh background.
 * Mouse-reactive network of nodes and lines in brand colours.
 * Falls back to CSS mesh gradient if WebGL is unavailable.
 * Respects prefers-reduced-motion (renders static frame).
 */
export default function VantaHeroBackground() {
  const vantaRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vantaEffect = useRef<any>(null)
  const [webglFailed, setWebglFailed] = useState(false)

  useEffect(() => {
    if (!vantaRef.current) return

    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let cancelled = false

    async function initVanta() {
      try {
        // Dynamic imports — tree-shakes in production
        const [THREE, { default: NET }] = await Promise.all([
          import('three'),
          import('vanta/dist/vanta.net.min'),
        ])

        if (cancelled || !vantaRef.current) return

        vantaEffect.current = NET({
          el: vantaRef.current,
          THREE,
          mouseControls: !prefersReduced,
          touchControls: !prefersReduced,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1.0,
          scaleMobile: 1.0,

          // === Brand Colours ===
          // Background: surface-base deep navy
          backgroundColor: 0x0B1120,
          // Lines + dots: crimson-500 at low intensity
          color: 0xE53E3E,

          // === Mesh Density ===
          // Sparse, confident — not a screensaver
          points: 8,
          maxDistance: 22,
          spacing: 18,
          showDots: true,
        })
      } catch {
        // WebGL not supported or vanta failed to load
        if (!cancelled) setWebglFailed(true)
      }
    }

    initVanta()

    return () => {
      cancelled = true
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  // CSS fallback — matches AnimatedBackground hero dark variant
  if (webglFailed) {
    return (
      <div
        className="absolute inset-0 animate-mesh-shift motion-reduce:animate-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(229, 62, 62, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 80% 20%, rgba(229, 62, 62, 0.05) 0%, transparent 55%),
            radial-gradient(ellipse 60% 70% at 50% 80%, rgba(0, 240, 200, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse 90% 40% at 10% 90%, rgba(229, 62, 62, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse 50% 80% at 90% 60%, rgba(0, 240, 200, 0.02) 0%, transparent 60%)
          `,
          backgroundSize: '200% 200%',
        }}
      />
    )
  }

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0"
      aria-hidden="true"
    />
  )
}
