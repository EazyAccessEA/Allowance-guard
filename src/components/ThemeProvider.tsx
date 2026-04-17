'use client'

/**
 * ThemeProvider — retired to a no-op shim per ADR 0007 (2026-04-17).
 *
 * AllowanceGuard is single-theme Ledger. There is no dark mode. The
 * previous implementation added a `.dark` class to <html> when
 * `prefers-color-scheme: dark` was reported, which flipped CSS custom
 * properties (--platinum, --surface-base) to navy and produced the
 * canon-crossing dark panels on /home. That mechanism is now removed.
 *
 * This shim is kept only so existing imports (`<ThemeProvider>` in
 * `src/app/layout.tsx`, `useTheme()` elsewhere) still compile. When
 * those imports are cleaned up across the codebase the whole file can
 * go.
 */

import React, { createContext, useContext } from 'react'

interface ThemeContextValue {
  theme: 'light'
  resolvedTheme: 'light'
  setTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider
      value={{ theme: 'light', resolvedTheme: 'light', setTheme: () => {} }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * ThemeToggle is retained as a no-op render so any existing callsite
 * doesn't crash. It renders nothing; the toggle UX is retired.
 */
export function ThemeToggle(_: { className?: string; variant?: 'default' | 'navbar' }) {
  return null
}
