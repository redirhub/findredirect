import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import https from 'https'

// Create a custom HTTPS agent that doesn't verify SSL certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

// Calculate dynamic timeout based on URL count
function getTimeout(urlCount: number): number {
  if (urlCount <= 5) return 3000      // 1-5 URLs: 3 seconds
  if (urlCount <= 20) return 5000     // 6-20 URLs: 5 seconds
  return 8000                         // >20 URLs: 8 seconds
}

// Function to check a single URL
async function checkSingleUrl(url: string, timeout = 5000) {
  url = url.trim()

  // fix url if it doesn't have a scheme
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`
  }

  const results: any[] = []
  let currentUrl = url
  let redirectCount = 0
  const maxRedirects = 5
  let proceed = true

  try {
    while (proceed && redirectCount < maxRedirects) {
      let start = new Date().getTime()
      const response = await axios({
        method: 'get',
        url: currentUrl,
        timeout: timeout,
        headers: {
          'User-Agent': 'FindRedirect_Checker/1.0',
        },
        maxRedirects: 0,
        validateStatus: null,
        httpsAgent: httpsAgent,
      })

      const result = {
        url: currentUrl,
        time: new Date().toISOString(),
        succeed: response.status < 400,
        http_code: response.status,
        redirect: response.headers['location'] || false,
        alltime: (new Date().getTime() - start) / 1000,
        header: response.headers,
        ip: response.request.socket.remoteAddress,
        scheme: currentUrl.split(':')[0].toUpperCase(),
        ssl_verify_result: response.request.socket.authorized ? 1 : 0,
      }

      results.push(result)

      if (response.headers['location']) {
        // Handle both absolute and relative URLs
        const locationUrl = new URL(response.headers['location'], currentUrl)
        currentUrl = locationUrl.href
        redirectCount += 1
      } else {
        proceed = false
      }
    }
  } catch (error: any) {
    results.push({
      url: url,
      time: new Date().toISOString(),
      succeed: false,
      error_no: error.response?.status || 0,
      error_msg: error.message,
    })
  }
  return results
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url, urls } = body

    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Support batch processing (urls array) or single URL
    if (urls && Array.isArray(urls)) {
      // Batch mode: process up to 10 URLs in parallel
      const urlsToCheck = urls.slice(0, 10) // Limit to 10 URLs per request

      if (urlsToCheck.length === 0) {
        return NextResponse.json(
          { error: 'URLs array is empty' },
          { status: 400, headers }
        )
      }

      const timeout = getTimeout(urlsToCheck.length)

      // Process all URLs in parallel
      const allResults = await Promise.all(
        urlsToCheck.map((u: string) => checkSingleUrl(u, timeout))
      )

      // Flatten results: each URL may have multiple redirect hops
      const flatResults = allResults.flat()

      return NextResponse.json(
        { results: flatResults },
        { headers }
      )
    } else if (url) {
      // Single URL mode
      const results = await checkSingleUrl(url, 5000)
      return NextResponse.json(
        { results },
        { headers }
      )
    } else {
      return NextResponse.json(
        { error: 'Missing url or urls parameter' },
        { status: 400, headers }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
