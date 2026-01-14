import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { UPTIME_API_BASE, UPTIME_API_KEY, UPTIME_CACHE_EXPIRES } from '@/configs/constant'

// Set axios instance defaults
axios.defaults.params = {
  ['api-key']: UPTIME_API_KEY,
}
axios.defaults.baseURL = UPTIME_API_BASE

let cachedData: any = null
let cacheTimestamp = 0

async function fetchData(services: string[]) {
  try {
    const now = new Date()
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000))
    const formattedYesterday = yesterday.toISOString().replace('T', ' ').replace(/\..*$/, '') + ' UTC'

    const sitesData = await Promise.all(
      services.map((token) => {
        return Promise.all([
          axios.get(`checks/${token}`),
          axios.get(`checks/${token}/metrics`, { params: { from: formattedYesterday } }),
        ])
      })
    )
    const nodes = await axios.get(`/nodes`)

    return {
      sites: sitesData.map((check) => check.map((c) => c.data)),
      nodes: nodes.data,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const servicesParam = searchParams.get('services')

    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': `public, s-maxage=${UPTIME_CACHE_EXPIRES}`,
    }

    // Validate services parameter is provided
    if (!servicesParam) {
      return NextResponse.json(
        {
          error: 'Missing required parameter: services',
          usage: 'Use ?services=token1,token2,token3'
        },
        { status: 400, headers }
      )
    }

    // Parse and validate services
    const services = servicesParam.split(',').map(s => s.trim()).filter(Boolean)

    if (services.length === 0) {
      return NextResponse.json(
        {
          error: 'Invalid services parameter: must contain at least one service token',
          usage: 'Use ?services=token1,token2,token3'
        },
        { status: 400, headers }
      )
    }

    const cacheExpirationTime = Number(UPTIME_CACHE_EXPIRES) * 1000
    let msg = 'Data fetched from memory cache'

    // Note: Current implementation uses single-entry cache
    // For production with multiple comparison pages, consider implementing
    // multi-entry cache keyed by service combination
    if (!cachedData || Date.now() > cacheTimestamp + cacheExpirationTime) {
      cachedData = await fetchData(services)
      cacheTimestamp = Date.now()
      msg = 'Data fetched from API'
    }

    return NextResponse.json(
      { data: cachedData, msg, services: services.join(',') },
      { headers }
    )
  } catch (error: any) {
    console.error('Request error:', error)
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
