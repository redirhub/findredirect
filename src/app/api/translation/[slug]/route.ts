import { NextRequest, NextResponse } from 'next/server'
import https from 'https'
import { TRANSLATION_URL } from '@/configs/constant'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!TRANSLATION_URL) {
      return NextResponse.json(
        { error: 'TRANSLATION_URL not configured' },
        { status: 500 }
      )
    }

    const url = TRANSLATION_URL.replace('{{lng}}', slug)

    const response = await fetch(url, {
      // @ts-ignore
      agent: httpsAgent
    })

    const data = await response.json()

    const headers: Record<string, string> = {}
    if (process.env.NODE_ENV === 'production') {
      headers['Cache-Control'] = 'public, max-age=3600'
    }

    return NextResponse.json(data, {
      status: response.status,
      headers
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
