'use client'

import { useEffect } from 'react'

interface DeferredScriptProps {
  src: string
  strategy?: 'afterInteractive' | 'lazyOnload' | 'beforeInteractive'
  onLoad?: () => void
  onError?: () => void
}

export const DeferredScript = ({ 
  src, 
  strategy = 'lazyOnload',
  onLoad,
  onError 
}: DeferredScriptProps) => {
  useEffect(() => {
    // Lighthouse recommendation: Load third-party scripts after page load
    if (strategy === 'lazyOnload') {
      const loadScript = () => {
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.defer = true
        
        script.onload = () => onLoad?.()
        script.onerror = () => onError?.()
        
        document.head.appendChild(script)
      }

      // Load after page is fully loaded (Lighthouse best practice)
      if (document.readyState === 'complete') {
        loadScript()
      } else {
        window.addEventListener('load', loadScript)
      }

      return () => {
        window.removeEventListener('load', loadScript)
      }
    }
  }, [src, strategy, onLoad, onError])

  return null
}
