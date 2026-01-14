/**
 * Sanity Query API Endpoint
 *
 * Executes GROQ queries against Sanity CMS.
 *
 * Parameters:
 * - query: GROQ query string (required)
 * - slug: Optional slug parameter for the query
 * - fresh: If "true", bypasses CDN cache (use after creating/updating documents)
 *
 * Examples:
 * - Cached: /api/sanity/query?query=...&slug=...
 * - Fresh:  /api/sanity/query?query=...&slug=...&fresh=true
 */

import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/lib/client'

// Mark this route as dynamic since it uses searchParams
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get('query')
    const slug = searchParams.get('slug')
    const fresh = searchParams.get('fresh') === 'true'

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Use writeClient (useCdn: false) for fresh queries to bypass CDN cache
    // This is essential after creating/updating documents to get immediate results
    const sanityClient = fresh ? writeClient : client
    const result = await sanityClient.fetch(query, { slug })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Sanity query error:', error)
    return NextResponse.json(
      {
        error: 'Query failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
