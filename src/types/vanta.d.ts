declare module 'vanta/dist/vanta.net.min' {
  interface VantaNetOptions {
    el: HTMLElement
    THREE: typeof import('three')
    mouseControls?: boolean
    touchControls?: boolean
    gyroControls?: boolean
    minHeight?: number
    minWidth?: number
    scale?: number
    scaleMobile?: number
    backgroundColor?: number
    color?: number
    points?: number
    maxDistance?: number
    spacing?: number
    showDots?: boolean
  }

  interface VantaEffect {
    destroy: () => void
  }

  export default function NET(options: VantaNetOptions): VantaEffect
}
