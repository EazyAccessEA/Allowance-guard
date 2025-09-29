'use client'
import Image from 'next/image'
import { AlertTriangle } from 'lucide-react'

type Props = {
  name: string
  symbol: string
  tokenAddress: string
  chainName: string
  verified: boolean
  categories: string[]
  description?: string | null
  website?: string | null
  logoUrl?: string | null
  score?: number
}

export default function TokenResultCard(p: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-900/5 p-4 sm:p-6 md:p-8 hover:shadow-xl hover:shadow-slate-900/10 hover:border-slate-300 transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {/* Token Logo/Icon */}
        <div className="flex-shrink-0 w-full sm:w-auto flex items-center gap-4 sm:block">
          {p.logoUrl ? (
            <Image 
              src={p.logoUrl} 
              alt={`${p.name} logo`}
              width={64}
              height={64}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover border-2 border-slate-100"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
          ) : null}
          <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-slate-100 ${p.logoUrl ? 'hidden' : ''}`}>
            <span className="text-lg sm:text-2xl font-bold text-white">
              {p.symbol.charAt(0)}
            </span>
          </div>
        </div>

        {/* Token Info */}
        <div className="flex-1 min-w-0 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                  {p.name}
                </h3>
                {p.verified && (
                  <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 border border-green-200 rounded-full w-fit">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs font-semibold text-green-700">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-base sm:text-lg font-medium text-slate-600 mb-1">
                {p.symbol}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 font-mono break-all">
                {p.tokenAddress}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25">
                Check Approvals
              </button>
              {p.website && (
                <a 
                  href={p.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  Official Site
                </a>
              )}
            </div>
          </div>

          {/* Security Warning for Unverified Tokens */}
          {!p.verified && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-amber-800 mb-1">Unverified Token</p>
                  <p className="text-xs sm:text-sm text-amber-700">This token has not been verified. Exercise caution before granting approvals.</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {p.description && (
            <p className="text-slate-600 mb-4 sm:mb-6 line-clamp-2 leading-relaxed text-sm sm:text-base">
              {p.description}
            </p>
          )}

          {/* Badges and Metadata */}
          <div className="space-y-3 sm:space-y-4">
            {/* Chain and Categories */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 text-slate-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border border-slate-200">
                {p.chainName}
              </span>

              {p.categories?.slice(0, 2).map(c => (
                <span 
                  key={c} 
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border border-blue-200"
                >
                  {c}
                </span>
              ))}

              {p.categories && p.categories.length > 2 && (
                <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 text-slate-600 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border border-slate-200">
                  +{p.categories.length - 2} more
                </span>
              )}

              {typeof p.score === 'number' && (
                <span className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-50 text-indigo-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border border-indigo-200">
                  Score: {p.score.toFixed(2)}
                </span>
              )}
            </div>

            {/* Website Link */}
            {p.website && (
              <div className="pt-1 sm:pt-2">
                <a 
                  href={p.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <span>Visit Official Website</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}