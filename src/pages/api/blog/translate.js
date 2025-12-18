import { queue } from '@vercel/functions';
import { createClient } from '@sanity/client';
import { allLanguages } from '../../../config/i18n';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const SUPPORTED_LOCALES = allLanguages.filter(locale => locale !== 'en');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentId, targetLocales } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    // Verify document exists and is English
    const sourceDoc = await sanityClient.fetch(
      `*[_id == $id][0]{ _id, locale }`,
      { id: documentId }
    );

    if (!sourceDoc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (sourceDoc.locale !== 'en') {
      return res.status(400).json({
        error: 'Only English documents can be used as translation source',
      });
    }

    // Enqueue translation job with deduplication
    const translateQueue = queue('translate-article');
    await translateQueue.enqueue(
      {
        documentId,
        targetLocales: targetLocales || null, // null = all supported locales
      },
      {
        // Deduplication: Only one job per document ID
        // If same documentId is queued within 5 minutes, it's deduplicated
        deduplicationId: `translate-${documentId}`,
      }
    );

    console.log(`[API] Translation job enqueued for document: ${documentId}`);

    // Return immediately - translation will happen in background
    return res.status(202).json({
      message: 'Translation job started. Translations will be created in the background.',
      documentId,
      status: 'processing',
      targetLocales: targetLocales || SUPPORTED_LOCALES,
    });
  } catch (error) {
    console.error('[API] Translation enqueue error:', error);
    return res.status(500).json({
      error: 'Failed to start translation job',
      details: error.message,
    });
  }
}
