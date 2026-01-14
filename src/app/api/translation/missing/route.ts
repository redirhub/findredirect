import { NextRequest, NextResponse } from 'next/server'
import https from 'https'
import { TRANSLATION_MISSING_URL } from '@/configs/constant'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!TRANSLATION_MISSING_URL) {
      return NextResponse.json(
        { error: 'TRANSLATION_MISSING_URL not configured' },
        { status: 500 }
      )
    }

    const url = TRANSLATION_MISSING_URL

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      // @ts-ignore
      agent: httpsAgent
    })

    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
