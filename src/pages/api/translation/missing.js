import fetch from 'node-fetch';
import https from 'https';
import { TRANSLATION_MISSING_URL } from '@/configs/constant';

export default async function handler(req, res) {
  try {
    const rawUrl = TRANSLATION_MISSING_URL;
    if (!rawUrl) {
      return res.status(500).json({ error: 'TRANSLATION_MISSING_URL is not configured' });
    }

    let targetUrl;
    try {
      // Prefer absolute; fallback to build from host
      targetUrl = new URL(rawUrl, rawUrl.startsWith('http') ? undefined : getBaseUrl(req)).toString();
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

    const data = await response.json();
    return res.status(response.status).json(data);
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
