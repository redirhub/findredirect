import { createClient } from '@sanity/client';
import OpenAI from 'openai';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, 
  useCdn: false,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SUPPORTED_LOCALES = ['es', 'fr', 'de', 'it', 'zh', 'ar', 'ja'];

const LOCALE_NAMES = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  zh: 'Chinese (Simplified)',
  ar: 'Arabic',
  ja: 'Japanese',
};


async function translatePortableText(content, targetLocale) {
  if (!content || !Array.isArray(content)) return content;

  const translated = [];

  for (const block of content) {
    if (block._type === 'block' && block.children) {
      const textToTranslate = block.children
        .filter((child) => child._type === 'span' && child.text)
        .map((child) => child.text)
        .join(' ');

      if (textToTranslate.trim()) {
        const translatedText = await translateText(textToTranslate, targetLocale);
        
        const translatedBlock = {
          ...block,
          children: [
            {
              _type: 'span',
              text: translatedText,
              marks: [],
            },
          ],
        };
        translated.push(translatedBlock);
      } else {
        translated.push(block);
      }
    } else {
      translated.push(block);
    }
  }

  return translated;
}


async function translateText(text, targetLocale) {
  const targetLanguage = LOCALE_NAMES[targetLocale];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the following text to ${targetLanguage}. Maintain the tone, style, and formatting. Only return the translated text without any explanations.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content.trim();
}


async function createTranslatedDocument(sourceDoc, targetLocale) {
  const translatedTitle = await translateText(sourceDoc.title, targetLocale);
  const translatedExcerpt = sourceDoc.excerpt
    ? await translateText(sourceDoc.excerpt, targetLocale)
    : null;
  const translatedContent = await translatePortableText(
    sourceDoc.content,
    targetLocale
  );

  let translatedFaqs = null;
  if (sourceDoc.faqs && sourceDoc.faqs.length > 0) {
    translatedFaqs = await Promise.all(
      sourceDoc.faqs.map(async (faq) => ({
        question: await translateText(faq.question, targetLocale),
        answer: await translateText(faq.answer, targetLocale),
        _key: faq._key,
      }))
    );
  }

  const existingTranslation = await sanityClient.fetch(
    `*[_type == "post" && baseSlug == $baseSlug && locale == $locale][0]`,
    {
      baseSlug: sourceDoc.baseSlug,
      locale: targetLocale,
    }
  );

  const translatedDoc = {
    _type: 'post',
    locale: targetLocale,
    baseSlug: sourceDoc.baseSlug,
    title: translatedTitle,
    slug: {
      _type: 'slug',
      current: sourceDoc.slug.current, 
    },
    excerpt: translatedExcerpt,
    content: translatedContent,
    tags: sourceDoc.tags, // Keep tags as is
    image: sourceDoc.image, 
    publishedAt: sourceDoc.publishedAt,
    author: sourceDoc.author,
    faqs: translatedFaqs,
  };

  if (existingTranslation) {
    return await sanityClient
      .patch(existingTranslation._id)
      .set(translatedDoc)
      .commit();
  } else {
    return await sanityClient.create(translatedDoc);
  }
}

/**
 * Main API handler
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentId, targetLocales } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    // Fetch the source document (English)
    const sourceDoc = await sanityClient.fetch(
      `*[_id == $id][0]{
        _id,
        title,
        slug,
        excerpt,
        content,
        tags,
        image,
        publishedAt,
        author,
        faqs,
        baseSlug,
        locale
      }`,
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

    // Determine which locales to translate to
    const locales = targetLocales || SUPPORTED_LOCALES;

    // Translate to all target locales
    const results = [];
    for (const locale of locales) {
      try {
        const translatedDoc = await createTranslatedDocument(sourceDoc, locale);
        results.push({
          locale,
          status: 'success',
          documentId: translatedDoc._id,
        });
      } catch (error) {
        console.error(`Error translating to ${locale}:`, error);
        results.push({
          locale,
          status: 'error',
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      message: 'Translation completed',
      results,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({
      error: 'Translation failed',
      details: error.message,
    });
  }
}

