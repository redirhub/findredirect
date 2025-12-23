import { createClient } from '@sanity/client';
import OpenAI from 'openai';
import { allLanguages } from '../../../config/i18n';

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

const SUPPORTED_LOCALES = allLanguages.filter(locale => locale !== 'en');

const LOCALE_NAMES = {
  de: 'German (Deutsch)',
  es: 'Spanish (español)',
  fr: 'French (français)',
  it: 'Italian (italiano)',
  pt: 'Portuguese (português)',
  ja: 'Japanese (日本語)',
  zh: 'Chinese (简体中文)',
  ko: 'Korean (한국어)',
};

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

async function createTranslatedDocument(sourceDoc, targetLocale) {
  const translatedTitle = await translateText(sourceDoc.title, targetLocale);
  const translatedExcerpt = sourceDoc.excerpt
    ? await translateText(sourceDoc.excerpt, targetLocale)
    : null;
  const translatedContent = await translatePortableText(
    sourceDoc.content,
    targetLocale
  );

  let translatedFaqs = [];
  if (Array.isArray(sourceDoc.faqs) && sourceDoc.faqs.length > 0) {
    translatedFaqs = await Promise.all(
      sourceDoc.faqs.map(async (faq) => ({
        question: await translateText(faq.question, targetLocale),
        answer: await translateText(faq.answer, targetLocale),
        _key: faq._key,
      }))
    );
  }

  const baseSlug = sourceDoc.slug?.current;

  const existingTranslation = await sanityClient.fetch(
    `*[_type == "post" && locale == $locale && slug.current == $baseSlug][0]`,
    {
      baseSlug,
      locale: targetLocale,
    }
  );

  const translatedDoc = {
    _type: 'post',
    locale: targetLocale,
    title: translatedTitle,
    slug: sourceDoc.slug,
    excerpt: translatedExcerpt,
    content: Array.isArray(translatedContent) ? translatedContent : [],
    tags: Array.isArray(sourceDoc.tags) ? sourceDoc.tags : [],
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

// Plain API route to process translation immediately (no Vercel Queue SDK)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { documentId, targetLocales } = req.body || {};

  if (!documentId) {
    return res.status(400).json({ error: 'Document ID is required' });
  }

  try {
    console.log(`[Queue] Processing translation for document: ${documentId}`);

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
        locale
      }`,
      { id: documentId }
    );

    if (!sourceDoc) {
      console.error(`[Queue] Document not found: ${documentId}`);
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    if (sourceDoc.locale !== 'en') {
      console.error(`[Queue] Only English documents can be translated`);
      return res.status(400).json({
        success: false,
        error: 'Only English documents can be translated',
      });
    }

    const locales = targetLocales || SUPPORTED_LOCALES;
    const results = [];

    for (const locale of locales) {
      try {
        console.log(`[Queue] Translating to ${locale}...`);
        const translatedDoc = await createTranslatedDocument(sourceDoc, locale);
        results.push({
          locale,
          status: 'success',
          documentId: translatedDoc._id,
        });
        console.log(`[Queue] ✓ Translated to ${locale}`);
      } catch (error) {
        console.error(`[Queue] Error translating to ${locale}:`, error);
        results.push({
          locale,
          status: 'error',
          error: error.message,
        });
      }
    }

    console.log(`[Queue] Translation complete for document: ${documentId}`);
    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error('[Queue] Translation job failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}