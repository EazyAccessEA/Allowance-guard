'use client'
import Image from 'next/image'

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
 <div className="bg-paper-sub rounded-xl border border-ink-rule p-6 hover:border-amber-deep/30 hover:shadow-lg transition-all duration-200 group">
 <div className="flex items-start gap-4">
 {/* Token Logo/Icon */}
 <div className="flex-shrink-0">
 {p.logoUrl ? (
 <Image 
 src={p.logoUrl} 
 alt={`${p.name} logo`}
 width={48}
 height={48}
 className="w-12 h-12 rounded-lg object-cover"
 onError={(e) => {
 e.currentTarget.style.display = 'none'
 e.currentTarget.nextElementSibling?.classList.remove('hidden')
 }}
 />
 ) : null}
 <div className={`w-12 h-12 bg-amber-deep/10 rounded-lg flex items-center justify-center ${p.logoUrl ? 'hidden' : ''}`}>
 <span className="text-xl font-bold text-amber-deep">
 {p.symbol.charAt(0)}
 </span>
 </div>
 </div>

 {/* Token Info */}
 <div className="flex-1 min-w-0">
 {/* Header */}
 <div className="flex items-start justify-between gap-4 mb-3">
 <div className="min-w-0 flex-1">
 <h3 className="text-lg font-semibold text-ink truncate">
 {p.name}
 </h3>
 <p className="text-sm text-ink-muted">
 {p.symbol}
 </p>
 </div>
 
 {/* Action Button */}
 <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-4 py-2 bg-amber-deep text-ink rounded-lg text-sm font-medium hover:bg-amber-deep/90">
 View Details
 </button>
 </div>

 {/* Description */}
 {p.description && (
 <p className="text-sm text-ink-muted mb-4 line-clamp-2">
 {p.description}
 </p>
 )}

 {/* Token Address */}
 <div className="mb-4">
 <p className="text-xs text-ink-muted font-mono break-all">
 {p.tokenAddress}
 </p>
 </div>

 {/* Badges and Links */}
 <div className="flex flex-wrap items-center gap-2">
 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-bg text-ink-muted border border-ink-rule">
 {p.chainName}
 </span>
 
 {p.verified && (
 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-semantic-success-700/10 text-semantic-success-700 border border-semantic-success-700/20">
 ✓ Verified
 </span>
 )}
 
 {p.categories?.slice(0, 2).map(c => (
 <span 
 key={c} 
 className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-deep/10 text-amber-deep border border-amber-deep/20"
 >
 {c}
 </span>
 ))}
 
 {p.categories && p.categories.length > 2 && (
 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-text-secondary/10 text-ink-muted border border-text-secondary/20">
 +{p.categories.length - 2} more
 </span>
 )}
 
 {typeof p.score === 'number' && (
 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-paper-sub/10 text-ink-blue border border-indigo-500/20">
 Score: {p.score.toFixed(2)}
 </span>
 )}

 {/* Website Link */}
 {p.website && (
 <a 
 href={p.website} 
 target="_blank" 
 rel="noopener noreferrer"
 className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-paper-sub text-ink-blue border border-ink-blue/30/20 hover:bg-paper-sub transition-colors"
 >
 🌐 Website
 </a>
 )}
 </div>
 </div>
 </div>
 </div>
 )
}
