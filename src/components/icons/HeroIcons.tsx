'use client'

/**
 * Bespoke SVG illustrations for homepage sections.
 * Hand-crafted to match AllowanceGuard's crimson/volt brand language.
 * Each icon is designed at 80x80 with internal glow effects.
 */

interface IconProps {
  className?: string
  size?: number
}

/** Step 1: Shield with scan beam — represents wallet connection + scanning */
export function ScanShieldIcon({ className, size = 80 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="scan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E53E3E" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F87171" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="scan-beam" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00F0C8" stopOpacity="0" />
          <stop offset="50%" stopColor="#00F0C8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00F0C8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Outer glow */}
      <circle cx="40" cy="40" r="36" fill="url(#scan-glow)" opacity="0.15" />
      {/* Shield body */}
      <path
        d="M40 12L18 22V38C18 52.36 27.48 65.68 40 70C52.52 65.68 62 52.36 62 38V22L40 12Z"
        stroke="#E53E3E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />
      {/* Inner shield highlight */}
      <path
        d="M40 18L23 26V38C23 49.84 31 61.28 40 65C49 61.28 57 49.84 57 38V26L40 18Z"
        fill="#E53E3E"
        opacity="0.08"
      />
      {/* Scan beam — horizontal line across shield */}
      <rect x="22" y="38" width="36" height="3" rx="1.5" fill="url(#scan-beam)" opacity="0.9">
        <animate attributeName="y" values="24;54;24" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2.5s" repeatCount="indefinite" />
      </rect>
      {/* Checkmark emerging */}
      <path
        d="M32 40L37 45L48 34"
        stroke="#00F0C8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

/** Step 2: Magnifying glass with risk graph — represents analysis */
export function AnalyzeIcon({ className, size = 80 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="analyze-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E53E3E" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F87171" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="bar-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#E53E3E" />
          <stop offset="100%" stopColor="#F87171" />
        </linearGradient>
      </defs>
      {/* Outer glow */}
      <circle cx="36" cy="36" r="30" fill="url(#analyze-glow)" opacity="0.12" />
      {/* Magnifying glass circle */}
      <circle
        cx="36"
        cy="36"
        r="20"
        stroke="#E53E3E"
        strokeWidth="2"
        fill="none"
        opacity="0.85"
      />
      {/* Glass inner fill */}
      <circle cx="36" cy="36" r="18" fill="#E53E3E" opacity="0.06" />
      {/* Handle */}
      <line
        x1="52"
        y1="52"
        x2="66"
        y2="66"
        stroke="#E53E3E"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Risk bars inside magnifying glass */}
      <rect x="26" y="40" width="5" height="10" rx="1" fill="url(#bar-grad)" opacity="0.7" />
      <rect x="33" y="34" width="5" height="16" rx="1" fill="url(#bar-grad)" opacity="0.85" />
      <rect x="40" y="28" width="5" height="22" rx="1" fill="#00F0C8" opacity="0.7" />
      {/* Alert dot */}
      <circle cx="47" cy="25" r="3" fill="#F87171" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

/** Step 3: Lightning bolt through broken chain — represents revocation */
export function RevokeIcon({ className, size = 80 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="revoke-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0C8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00F0C8" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="bolt-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00F0C8" />
          <stop offset="100%" stopColor="#00D4B0" />
        </linearGradient>
      </defs>
      {/* Outer glow */}
      <circle cx="40" cy="40" r="36" fill="url(#revoke-glow)" opacity="0.12" />
      {/* Broken chain link — left */}
      <path
        d="M22 32C22 28 25 24 30 24H34C34 24 32 28 32 32C32 36 34 40 34 40H30C25 40 22 36 22 32Z"
        stroke="#E53E3E"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      {/* Broken chain link — right */}
      <path
        d="M58 48C58 52 55 56 50 56H46C46 56 48 52 48 48C48 44 46 40 46 40H50C55 40 58 44 58 48Z"
        stroke="#E53E3E"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      {/* Break marks */}
      <line x1="35" y1="36" x2="38" y2="32" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="42" y1="48" x2="45" y2="44" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Lightning bolt — centre */}
      <path
        d="M44 16L34 42H42L36 64L54 34H44L50 16Z"
        fill="url(#bolt-grad)"
        stroke="#00F0C8"
        strokeWidth="1"
        opacity="0.95"
      />
    </svg>
  )
}

/** Feature: Non-custodial lock icon */
export function LockShieldIcon({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="#E53E3E" opacity="0.08" />
      <rect x="16" y="22" width="16" height="12" rx="2" stroke="#E53E3E" strokeWidth="1.5" fill="none" />
      <path d="M20 22V18C20 15.8 21.8 14 24 14C26.2 14 28 15.8 28 18V22" stroke="#E53E3E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="28" r="2" fill="#00F0C8" />
    </svg>
  )
}

/** Feature: Dashboard clarity icon */
export function DashboardIcon({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="#E53E3E" opacity="0.08" />
      <rect x="12" y="14" width="24" height="20" rx="3" stroke="#E53E3E" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="20" x2="36" y2="20" stroke="#E53E3E" strokeWidth="1.5" opacity="0.5" />
      <rect x="15" y="23" width="8" height="4" rx="1" fill="#00F0C8" opacity="0.6" />
      <rect x="15" y="29" width="5" height="2" rx="0.5" fill="#E53E3E" opacity="0.4" />
      <rect x="25" y="23" width="8" height="8" rx="1" stroke="#E53E3E" strokeWidth="1" fill="none" opacity="0.4" />
    </svg>
  )
}

/** Feature: AI/Risk intelligence icon */
export function BrainShieldIcon({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="#E53E3E" opacity="0.08" />
      <circle cx="24" cy="22" r="10" stroke="#E53E3E" strokeWidth="1.5" fill="none" />
      {/* Neural network dots */}
      <circle cx="24" cy="18" r="1.5" fill="#00F0C8" />
      <circle cx="20" cy="24" r="1.5" fill="#F87171" />
      <circle cx="28" cy="24" r="1.5" fill="#F87171" />
      <circle cx="24" cy="28" r="1.5" fill="#00F0C8" />
      {/* Connections */}
      <line x1="24" y1="18" x2="20" y2="24" stroke="#E53E3E" strokeWidth="0.75" opacity="0.5" />
      <line x1="24" y1="18" x2="28" y2="24" stroke="#E53E3E" strokeWidth="0.75" opacity="0.5" />
      <line x1="20" y1="24" x2="24" y2="28" stroke="#E53E3E" strokeWidth="0.75" opacity="0.5" />
      <line x1="28" y1="24" x2="24" y2="28" stroke="#E53E3E" strokeWidth="0.75" opacity="0.5" />
      {/* Antenna / alert */}
      <path d="M24 12V8" stroke="#E53E3E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 36L24 32L29 36" stroke="#E53E3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

/** Feature: Gas efficiency / batch icon */
export function BatchGasIcon({ className, size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="#00F0C8" opacity="0.06" />
      {/* Stacked layers — batch */}
      <rect x="14" y="20" width="20" height="12" rx="2" stroke="#E53E3E" strokeWidth="1.5" fill="none" />
      <rect x="17" y="17" width="20" height="12" rx="2" stroke="#E53E3E" strokeWidth="1" fill="none" opacity="0.5" />
      <rect x="20" y="14" width="20" height="12" rx="2" stroke="#E53E3E" strokeWidth="0.75" fill="none" opacity="0.3" />
      {/* Lightning bolt — gas savings */}
      <path d="M26 22L22 27H26L24 32" stroke="#00F0C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
