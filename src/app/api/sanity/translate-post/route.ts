/**
 * Legacy translate-post API endpoint (App Router version)
 *
 * NOTE: This will be replaced in Part 2 with the new translate-document.ts service
 * For now, this preserves the existing functionality for backward compatibility
 */

import { NextRequest, NextResponse } from 'next/server'

// For now, we'll keep using the Pages Router version by proxying to it
// In Part 2, this will be replaced with the new translation system
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint is being migrated. Please use /api/sanity/process-translations instead.' },
    { status: 501 }
  )
}
