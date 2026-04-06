'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Vanta.js NET effect — interactive WebGL mesh background.
 * Monochrome Pro: true black background, white/grey lines at LOW opacity (15-20%).
 * Radial gradient mask pushes the mesh behind text for legibility.
 * Respects prefers-reduced-motion (renders static frame).
 */
export default function VantaHeroBackground() {
  const vantaRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vantaEffect = useRef<any>(null)
  const [webglFailed, setWebglFailed] = useState(false)

  useEffect(() => {
    if (!vantaRef.current) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let cancelled = false

    async function initVanta() {
      try {
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

          // === Monochrome Pro ===
          // Background: True Black
          backgroundColor: 0x000000,
          // Lines + dots: cool grey — NOT crimson (red is reserved for danger)
          color: 0x3F3F46,

          // === Sparse mesh — confidence, not clutter ===
          points: 6,
          maxDistance: 20,
          spacing: 20,
          showDots: true,
        })
      } catch {
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

  // CSS fallback — monochrome gradients
  if (webglFailed) {
    return (
      <div
        className="absolute inset-0 animate-mesh-shift motion-reduce:animate-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(63, 63, 70, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 80% 20%, rgba(63, 63, 70, 0.04) 0%, transparent 55%),
            radial-gradient(ellipse 60% 70% at 50% 80%, rgba(63, 63, 70, 0.03) 0%, transparent 50%)
          `,
          backgroundSize: '200% 200%',
          backgroundColor: '#000000',
        }}
      />
    )
  }

  return (
    <div
      ref={vantaRef}
      className="absolute inset-0"
      aria-hidden="true"
      style={{ opacity: 0.18 }}
    />
  )
}
