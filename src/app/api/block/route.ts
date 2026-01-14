import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { Ratelimit } from '@upstash/ratelimit'
import { kv } from '@vercel/kv'
import { DEBUG_MODE } from '@/configs/constant'

const execAsync = promisify(exec)

// Rate limiting setup
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, '60 s'), // 100 requests from the same IP in 60 seconds
})

export async function POST(req: NextRequest) {
  try {
    // Rate limiting (skip in development)
    if (process.env.NODE_ENV !== 'development') {
      const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown'
      const { success } = await ratelimit.limit(ip)

      if (!success) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        )
      }
    }

    const body = await req.json()
    const { domain, ip = '75.2.48.81' } = body // Default IP

    if (!domain) {
      return NextResponse.json(
        { error: 'Missing domain' },
        { status: 400 }
      )
    }

    const proxy = '111.231.2.142:32180' // Define your proxy URL here
    const httpsCmd = `curl --socks5 ${proxy} --proxy-user po:xyz --resolve "${domain}:443:${ip}" -o /dev/null -s -w "%{http_code} %{time_total}" -k "https://${domain}/" 2>&1`
    const httpCmd = `curl --socks5 ${proxy} --proxy-user po:xyz --resolve "${domain}:80:${ip}" -o /dev/null -s -w "%{http_code} %{time_total}" "http://${domain}/" 2>&1`

    const startTime = process.hrtime()

    // Execute both commands in parallel
    const [httpsResult, httpResult] = await Promise.all([
      execAsync(httpsCmd).catch(err => ({ stdout: '000 0', stderr: err.message })),
      execAsync(httpCmd).catch(err => ({ stdout: '000 0', stderr: err.message }))
    ])

    const httpsOutput = httpsResult.stdout.trim().split(' ')
    const httpsStatus = httpsOutput[0] || '000'
    const httpsTime = parseFloat(httpsOutput[1] || '0').toFixed(2)
    const httpsError = httpsResult.stderr || null

    const httpOutput = httpResult.stdout.trim().split(' ')
    const httpStatus = httpOutput[0] || '000'
    const httpTime = parseFloat(httpOutput[1] || '0').toFixed(2)
    const httpError = httpResult.stderr || null

    const endTime = process.hrtime(startTime)
    const totalTime = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(0)

    return NextResponse.json({
      http_pass: httpStatus !== '000',
      https_pass: httpsStatus !== '000',
      http_result: httpStatus,
      http_time: httpTime,
      https_result: httpsStatus,
      https_time: httpsTime,
      total_time: totalTime,
      error: {
        https: httpsError,
        http: httpError
      },
      debug: {
        https: DEBUG_MODE ? httpsCmd : '',
        http: DEBUG_MODE ? httpCmd : ''
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
