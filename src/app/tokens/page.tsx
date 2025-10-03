// Legacy Token Discovery Page - Redirects to Enhanced Version
// Handles old URL structure and redirects to SEO-optimized URLs

import { redirect } from 'next/navigation'

export default function LegacyTokensPage() {
  // Server-side redirect to search page
  redirect('/tokens/search')
}