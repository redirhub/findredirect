/**
 * Translation Processing API Endpoint
 *
 * Processes translation jobs for Sanity documents (post and page types).
 * Uses the translate-document.ts service for AI-powered translations.
 *
 * Supports:
 * - Single document translation via ?docId=xxx
 * - Batch translation of documents with needsTranslation=true
 * - Both GET and POST requests
 */

import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { translateDocument } from '@/lib/translation/translate-document'

const MAX_JOBS_PER_RUN = 10

export async function GET(req: NextRequest) {
  return handleProcessTranslations(req)
}

export async function POST(req: NextRequest) {
  return handleProcessTranslations(req)
}

async function handleProcessTranslations(req: NextRequest) {
  const ranAt = new Date().toISOString()

  try {
    const searchParams = req.nextUrl.searchParams
    let docId = searchParams.get('docId')

    if (!docId && req.method === 'POST') {
      try {
        const body = await req.json()
        docId = body.docId
      } catch (e) {
        // Body might be empty, that's okay
      }
    }

    let documentsToProcess: Array<{ _id: string; _type: string; title: string }> = []

    if (docId) {
      // Single document translation
      const doc = await writeClient.fetch(
        `*[_id == $id][0]{ _id, _type, title }`,
        { id: docId }
      )

      if (!doc) {
        return NextResponse.json(
          { ok: false, error: 'Document not found' },
          { status: 404 }
        )
      }

      if (doc._type !== 'post' && doc._type !== 'page') {
        return NextResponse.json(
          { ok: false, error: `Unsupported document type: ${doc._type}` },
          { status: 400 }
        )
      }

      documentsToProcess.push(doc)
    } else {
      // Batch translation for documents with needsTranslation=true
      documentsToProcess = await writeClient.fetch(
        `*[
          _type in ["post", "page"] &&
          locale == "en" &&
          needsTranslation == true
        ][0...${MAX_JOBS_PER_RUN}]{
          _id,
          _type,
          title
        }`
      )

      if (documentsToProcess.length === 0) {
        return NextResponse.json({
          ok: true,
          ranAt,
          processed: 0,
          message: 'No documents found with needsTranslation=true',
          results: [],
        })
      }
    }

    let processed = 0
    const results: any[] = []

    for (const doc of documentsToProcess) {
      try {
        console.log(`[API] Processing translation: ${doc.title} (${doc._id})`)
        const result = await translateDocument(doc._id)

        processed += 1
        results.push({
          documentId: doc._id,
          type: doc._type,
          title: doc.title,
          status: 'success',
          result,
        })

        console.log(`[API] ✓ Completed translation for: ${doc.title}`)
      } catch (error: any) {
        console.error(`[API] Failed to translate ${doc._id}:`, error)
        results.push({
          documentId: doc._id,
          type: doc._type,
          title: doc.title,
          status: 'error',
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      ok: true,
      ranAt,
      processed,
      message: `Processed ${processed} translation job(s)`,
      results,
    })
  } catch (error: any) {
    console.error('[API] Translation job failed', error)
    return NextResponse.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
