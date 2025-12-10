import { client } from '@/sanity/lib/client';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, baseSlug } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const result = await client.fetch(query, { baseSlug });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Sanity query error:', error);
    return res.status(500).json({
      error: 'Query failed',
      details: error.message,
    });
  }
}

