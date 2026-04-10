'use client'

/**
 * Highlight — amber highlighter-pen stripe behind key words.
 *
 * Renders a <span> with the .highlight-reveal CSS class. When the
 * element scrolls into view, the amber stripe "paints in" from left
 * via an IntersectionObserver that adds the .painted class.
 *
 * CSS lives in globals.css (.highlight-reveal / .highlight-reveal.painted).
 * prefers-reduced-motion: the CSS skips the animation and shows the
 * stripe immediately.
 *
 * Council: Maren (Law #4 Signature Move), Idris (scroll-paint),
 * Noor (AAA contrast verified), Thane (no runtime cost — one IO).
 */

import { useRef, useEffect, type ReactNode } from 'react'

interface HighlightProps {
  children: ReactNode
  /** Extra delay before the paint starts (ms). Default 200. */
  delay?: number
}

export default function Highlight({ children, delay = 200 }: HighlightProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      el.classList.add('painted')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('painted'), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <span ref={ref} className="highlight-reveal">
      {children}
    </span>
  )
}
