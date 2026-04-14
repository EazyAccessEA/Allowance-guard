import { redirect } from 'next/navigation'

/**
 * The old /docs/api page documented a pre-v1 unauthenticated API and
 * was actively misleading. The single source of truth is /docs/api-reference.
 */
export default function ApiDocsRedirect() {
  redirect('/docs/api-reference')
}
