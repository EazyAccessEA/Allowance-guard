import { redirect } from 'next/navigation'

/**
 * /docs/api/examples — redirect to canonical API reference.
 *
 * The previous page documented a pre-v1 unauthenticated API with non-existent
 * endpoints (/api/allowances, /api/risk/assess, /api/networks/roadmap) and
 * wrong rate limits ("5 requests per minute"). That content was actively
 * misleading. Code samples for the real v1 API live on /docs/api-reference.
 */
export default function ApiExamplesRedirect() {
  redirect('/docs/api-reference')
}
