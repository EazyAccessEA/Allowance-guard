/**
 * Logo — AG shield monogram as inline SVG.
 *
 * Council:
 *  Maren: shield shape = brand equity, keep it
 *  Thane: SVG = zero file weight, infinite scaling
 *  Kael: Ledger palette — ink (#0F1115) primary, amber-deep (#854F08) accent
 *  Noor: aria-label for accessibility, role="img"
 *
 * Variants:
 *  - 'ink' (default): ink colour on transparent — for paper surfaces
 *  - 'amber': amber-deep colour — for accent use
 *  - 'cream': cream colour — for oxblood/dark backgrounds
 */

interface LogoProps {
  size?: number
  variant?: 'ink' | 'amber' | 'cream'
  className?: string
}

const COLORS = {
  ink: '#0F1115',
  amber: '#854F08',
  cream: '#F7F5F0',
}

export default function Logo({ size = 32, variant = 'ink', className = '' }: LogoProps) {
  const fill = COLORS[variant]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="AllowanceGuard"
      className={className}
    >
      {/* Shield outline */}
      <path
        d="M50 5 L88 22 L88 55 C88 73 72 88 50 95 C28 88 12 73 12 55 L12 22 Z"
        fill="none"
        stroke={fill}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* A letterform */}
      <path
        d="M38 68 L50 30 L62 68 M42 56 L58 56"
        fill="none"
        stroke={fill}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* G letterform — wraps around the A */}
      <path
        d="M65 40 C72 40 78 46 78 55 C78 64 72 70 63 70 L58 70 L58 58 L66 58"
        fill="none"
        stroke={fill}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
