import fetch from 'node-fetch';
import https from 'https';
import { TRANSLATION_MISSING_URL } from '@/configs/constant';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const rawUrl = TRANSLATION_MISSING_URL;
    if (!rawUrl) {
      console.warn('[translation/missing] TRANSLATION_MISSING_URL not set; skipping');
      return res
        .status(200)
        .json({ ok: true, skipped: 'TRANSLATION_MISSING_URL not configured' });
    }

    let targetUrl;
    try {
      // Prefer absolute; fallback to build from host
      targetUrl = new URL(
        rawUrl,
        rawUrl.startsWith('http') ? undefined : getBaseUrl(req)
      ).toString();
    } catch (error) {
      console.error('[translation/missing] Invalid URL', error);
      return res.status(500).json({ error: 'Invalid TRANSLATION_MISSING_URL' });
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
      agent: new https.Agent({ rejectUnauthorized: false }),
    });

    const contentType = response.headers.get('content-type') || '';
    const rawBody = await response.text();

    let parsedBody = null;
    if (contentType.includes('application/json')) {
      try {
        parsedBody = JSON.parse(rawBody || '{}');
      } catch (parseError) {
        console.error('[translation/missing] Upstream JSON parse error', parseError);
      }
    }

    if (!response.ok) {
      console.error(
        '[translation/missing] Upstream error',
        response.status,
        parsedBody || rawBody
      );
      return res.status(response.status).json({
        error: 'Upstream translation service failed',
        status: response.status,
        details: parsedBody || rawBody || 'No body returned',
      });
    }

    return res.status(response.status).json(parsedBody ?? rawBody);
  } catch (error) {
    console.error('[translation/missing] Proxy failed', error);
    return res.status(500).json({ error: error.message });
  }
}

function getBaseUrl(req) {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost:3000';
  return `${proto}://${host}`;
}
