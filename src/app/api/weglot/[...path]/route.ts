import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleWeglotRequest(req, params, 'GET')
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleWeglotRequest(req, params, 'POST')
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleWeglotRequest(req, params, 'PUT')
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleWeglotRequest(req, params, 'DELETE')
}

async function handleWeglotRequest(
  req: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    const { path } = params
    const fullPath = path.join('/')
    const targetUrl = `https://www.redirhub.test/api/weglot/${fullPath}`

    console.log('Incoming request:', method, fullPath)
    console.log('Forwarding to:', targetUrl)

    const headers: Record<string, string> = {}
    req.headers.forEach((value, key) => {
      headers[key] = value
    })
    headers['host'] = 'www.redirhub.test'

    const fetchOptions: RequestInit = {
      method,
      headers,
      // @ts-ignore
      agent: httpsAgent,
    }

    if (method !== 'GET' && method !== 'HEAD') {
      const body = await req.text()
      if (body) {
        fetchOptions.body = body
      }
    }

    const response = await fetch(targetUrl, fetchOptions)
    const data = await response.text()
    const contentType = response.headers.get('content-type') || 'text/plain'

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': contentType
      }
    })
  } catch (error: any) {
    console.error('Error forwarding request:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
