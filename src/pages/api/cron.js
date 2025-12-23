import { createClient } from '@sanity/client';
import { allLanguages } from '../../config/i18n';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const SUPPORTED_LOCALES = allLanguages.filter((locale) => locale !== 'en');
const MAX_JOBS_PER_RUN = 10;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ranAt = new Date().toISOString();

  try {
    // Find English posts missing any target locales
    const postsNeedingTranslation = await sanityClient.fetch(
      `*[_type == "post" && locale == "en"]{
        _id,
        "slug": slug.current,
        "hasLocales": *[_type == "post" && slug.current == ^.slug && locale != "en"].locale
      }`
    );

    let enqueued = 0;

    // Get base URL
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    for (const post of postsNeedingTranslation) {
      if (enqueued >= MAX_JOBS_PER_RUN) break;

      const missingLocales = SUPPORTED_LOCALES.filter(
        (locale) => !(post.hasLocales || []).includes(locale)
      );

      if (missingLocales.length === 0) continue;

      // Enqueue by calling the queue endpoint
      try {
        const response = await fetch(`${baseUrl}/api/queue/translate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId: post._id,
            targetLocales: missingLocales,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to enqueue: ${response.statusText}`);
        }

        enqueued += 1;
        console.log(
          `[Cron] Enqueued translation for ${post._id} -> ${missingLocales.join(', ')}`
        );
      } catch (error) {
        console.error(`[Cron] Failed to enqueue ${post._id}:`, error);
      }
    }

    return res.status(200).json({
      ok: true,
      ranAt,
      enqueued,
      message: `Enqueued ${enqueued} translation jobs`,
    });
  } catch (error) {
    console.error('[Cron] Job failed', error);
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}