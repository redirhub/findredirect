import { queue } from '@vercel/functions';
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
const translateQueue = queue('translate-article');
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

    for (const post of postsNeedingTranslation) {
      if (enqueued >= MAX_JOBS_PER_RUN) break;

      const missingLocales = SUPPORTED_LOCALES.filter(
        (locale) => !(post.hasLocales || []).includes(locale)
      );

      if (missingLocales.length === 0) continue;

      await translateQueue.enqueue(
        {
          documentId: post._id,
          targetLocales: missingLocales,
        },
        {
          deduplicationId: `translate-${post._id}`,
        }
      );

      enqueued += 1;
      console.log(
        `[Cron] Enqueued translation for ${post._id} -> ${missingLocales.join(', ')}`
      );
    }

    return res.status(200).json({
      ok: true,
      ranAt,
      enqueued,
    });
  } catch (error) {
    console.error('[Cron] Job failed', error);
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}
