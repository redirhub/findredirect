import { queue } from '@vercel/functions';

// Verify webhook signature (optional but recommended)
function verifySignature(req) {
  // Sanity webhook secret - set this in your environment variables
  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('[Webhook] SANITY_WEBHOOK_SECRET not set - skipping verification');
    return true; // Allow in development
  }

  const signature = req.headers['sanity-webhook-signature'];
  if (!signature) {
    console.error('[Webhook] Missing signature header');
    return false;
  }

  // You can implement HMAC signature verification here
  // For now, we'll do a simple secret comparison
  return signature === webhookSecret;
}

// Kick off the cron job immediately so new posts get processed right away
async function triggerCronRun() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const response = await fetch(`${baseUrl}/api/cron`);

  if (!response.ok) {
    throw new Error(`Cron trigger failed (${response.status})`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook signature
  if (!verifySignature(req)) {
    console.error('[Webhook] Invalid signature');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = req.body;

    console.log('[Webhook] Received event:', payload._type, payload._id);

    // Only process 'post' documents in English locale
    if (payload._type !== 'post') {
      console.log('[Webhook] Ignoring non-post document');
      return res.status(200).json({ message: 'Ignored: Not a post' });
    }

    if (payload.locale !== 'en') {
      console.log('[Webhook] Ignoring non-English post');
      return res.status(200).json({ message: 'Ignored: Not English' });
    }

    // Check if this is a create or update event (not delete)
    if (!payload._id) {
      console.log('[Webhook] Missing document ID');
      return res.status(400).json({ error: 'Missing document ID' });
    }

    // Enqueue translation job with deduplication
    console.log(`[Webhook] Enqueuing translation for: ${payload._id}`);

    const translateQueue = queue('translate-article');
    await translateQueue.enqueue(
      {
        documentId: payload._id,
        targetLocales: null, // null = translate to all supported locales
      },
      {
        // Deduplication: Prevent duplicate jobs for same document
        // If document is updated multiple times quickly, only process once
        deduplicationId: `translate-${payload._id}`,
      }
    );

    console.log(`[Webhook] ✓ Translation job enqueued for: ${payload._id}`);

    // Also trigger the cron run so translations start immediately
    try {
      await triggerCronRun();
      console.log('[Webhook] ✓ Cron run triggered');
    } catch (error) {
      console.error('[Webhook] Failed to trigger cron:', error);
    }

    return res.status(200).json({
      message: 'Translation job enqueued',
      documentId: payload._id,
    });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    return res.status(500).json({
      error: 'Failed to process webhook',
      details: error.message,
    });
  }
}
