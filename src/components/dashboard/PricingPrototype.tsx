'use client'

import React, { useState } from 'react'
import { Check, X, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TIERS, COMPARISON_FEATURES } from './pricing-data'

/**
 * Pricing Prototype — Phase 7 Build 2
 *
 * Three-tier pricing with monthly/yearly toggle, feature comparison table.
 * Responsive: cards stack on mobile, row on desktop.
 */
export default function PricingPrototype() {
  const [yearly, setYearly] = useState(false)

  const formatPrice = (tier: (typeof TIERS)[number]) => {
    if (tier.monthlyPrice === 0) return 'Free'
    const price = yearly ? tier.yearlyPrice : tier.monthlyPrice
    return `$${price}`
  }

  const period = (tier: (typeof TIERS)[number]) => {
    if (tier.monthlyPrice === 0) return 'forever'
    return yearly ? '/year' : '/month'
  }

  const savings = (tier: (typeof TIERS)[number]) => {
    if (tier.monthlyPrice === 0) return null
    const monthlyCost = tier.monthlyPrice * 12
    const saved = Math.round(((monthlyCost - tier.yearlyPrice) / monthlyCost) * 100)
    return saved > 0 ? saved : null
  }

  return (
    <div className="min-h-screen bg-background-secondary dark:bg-dark-bg-primary py-16 px-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-text-primary dark:text-secondary-100">
            Security that scales with you
          </h1>
          <p className="mt-4 text-lg text-secondary-500 dark:text-secondary-400 max-w-xl mx-auto">
            Core tool: free and open source. Always. Premium monitoring and API
            access for power users and teams.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span
              className={cn(
                'text-sm font-medium transition-colors duration-150',
                !yearly
                  ? 'text-text-primary dark:text-secondary-100'
                  : 'text-secondary-400 dark:text-secondary-500'
              )}
            >
              Monthly
            </span>
            <button
              onClick={() => setYearly((p) => !p)}
              role="switch"
              aria-checked={yearly}
              aria-label="Toggle yearly billing"
              className={cn(
                'relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary-900',
                yearly
                  ? 'bg-primary-500'
                  : 'bg-secondary-300 dark:bg-secondary-600'
              )}
            >
              <span
                className={cn(
                  'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200',
                  yearly ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
            <span
              className={cn(
                'text-sm font-medium transition-colors duration-150',
                yearly
                  ? 'text-text-primary dark:text-secondary-100'
                  : 'text-secondary-400 dark:text-secondary-500'
              )}
            >
              Yearly
            </span>
            {yearly && (
              <span className="ml-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                Save up to 34%
              </span>
            )}
          </div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TIERS.map((tier) => {
            const yearlySavings = yearly ? savings(tier) : null

            return (
              <div
                key={tier.name}
                className={cn(
                  'relative flex flex-col rounded-xl border p-6 lg:p-8 transition-all duration-250',
                  tier.highlighted
                    ? 'border-primary-300 dark:border-primary-600 bg-background-primary dark:bg-dark-bg-secondary shadow-lg ring-1 ring-primary-200 dark:ring-primary-700 scale-[1.02]'
                    : 'border-secondary-700 bg-background-primary dark:bg-dark-bg-secondary shadow-sm'
                )}
              >
                {/* Badge */}
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold text-white bg-primary-500 dark:bg-primary-600 px-3 py-1 rounded-full shadow-sm">
                    {tier.badge}
                  </span>
                )}

                {/* Tier info */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary dark:text-secondary-100">
                    {tier.name}
                  </h2>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-text-primary dark:text-secondary-100 font-mono">
                      {formatPrice(tier)}
                    </span>
                    <span className="text-sm text-secondary-400 dark:text-secondary-500">
                      {period(tier)}
                    </span>
                  </div>
                  {yearlySavings && (
                    <p className="text-xs text-semantic-success-600 dark:text-semantic-success-400 font-medium mt-1">
                      Save {yearlySavings}% vs monthly
                    </p>
                  )}
                </div>

                {/* CTA */}
                <button
                  className={cn(
                    'w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary-900',
                    tier.buttonVariant === 'primary' &&
                      'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md',
                    tier.buttonVariant === 'secondary' &&
                      'bg-secondary-100 dark:bg-secondary-800 text-text-primary dark:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-700 border border-secondary-700 dark:border-secondary-600',
                    tier.buttonVariant === 'ghost' &&
                      'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 border border-secondary-700'
                  )}
                >
                  {tier.buttonLabel}
                </button>

                {/* Features */}
                <ul className="mt-6 space-y-3 flex-1" aria-label={`${tier.name} features`}>
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-secondary-600 dark:text-secondary-300"
                    >
                      <Check
                        className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Feature comparison table */}
        <div className="rounded-xl border border-secondary-700 bg-background-primary dark:bg-dark-bg-secondary overflow-hidden">
          <div className="px-6 py-5 border-b border-secondary-700">
            <h2 className="text-xl font-semibold text-text-primary dark:text-secondary-100">
              Compare plans
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-700">
                  <th className="text-left py-3 px-6 font-medium text-secondary-500 dark:text-secondary-400 min-w-[200px]">
                    Feature
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-500 dark:text-secondary-400 w-28">
                    Free
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-primary-600 dark:text-primary-400 w-28">
                    Pro
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-500 dark:text-secondary-400 w-28">
                    Sentinel
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((feature, i) => (
                  <tr
                    key={feature.name}
                    className={cn(
                      'border-b border-secondary-700/50 dark:border-secondary-800',
                      i % 2 === 0
                        ? 'bg-background-primary dark:bg-dark-bg-secondary'
                        : 'bg-secondary-50/50 dark:bg-secondary-800/30'
                    )}
                  >
                    <td className="py-3 px-6 text-text-primary dark:text-secondary-200">
                      <span className="flex items-center gap-1.5">
                        {feature.name}
                        {feature.tooltip && (
                          <span
                            className="group relative"
                            aria-label={feature.tooltip}
                          >
                            <HelpCircle className="h-3.5 w-3.5 text-secondary-400 cursor-help" />
                            <span
                              role="tooltip"
                              className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-xs text-white bg-secondary-900 dark:bg-secondary-100 dark:text-secondary-900 rounded-lg shadow-lg whitespace-nowrap z-10"
                            >
                              {feature.tooltip}
                            </span>
                          </span>
                        )}
                      </span>
                    </td>
                    {(['free', 'pro', 'sentinel'] as const).map((tier) => {
                      const val = feature[tier]
                      return (
                        <td key={tier} className="py-3 px-4 text-center">
                          {val === true ? (
                            <Check
                              className="h-4 w-4 text-primary-500 mx-auto"
                              aria-label="Included"
                            />
                          ) : val === false ? (
                            <X
                              className="h-4 w-4 text-secondary-300 dark:text-secondary-600 mx-auto"
                              aria-label="Not included"
                            />
                          ) : (
                            <span className="text-xs font-medium text-secondary-600 dark:text-secondary-300">
                              {val}
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
