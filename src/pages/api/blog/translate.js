import { createClient } from '@sanity/client';
import OpenAI from 'openai';
import { LANGUAGES, allLanguages } from '../../../config/i18n';

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

const normalizeError = (error) => {
  const code =
    error?.code ||
    error?.type ||
    error?.response?.status ||
    error?.response?.data?.error?.code ||
    'translation_error';

  let message =
    error?.response?.data?.error?.message ||
    error?.error?.message ||
    error?.message ||
    'Unknown translation error';

  if (code === 'invalid_api_key') {
    message = 'Incorrect API key provided. Please provide a valid API key.';
  }

  return { code, message };
};

const LOCALE_NAMES = LANGUAGES.reduce((acc, lang) => {
  acc[lang.id] = lang.nativeName || lang.title;
  return acc;
}, {});

const slugify = (text) => {
  if (!text) return '';

  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96) || 'post';
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

  const baseSlug = sourceDoc.sourceSlug || sourceDoc.slug?.current;
  const translatedSlug = slugify(translatedTitle) || baseSlug;

  const existingTranslation = await sanityClient.fetch(
    `*[_type == "post" && locale == $locale && (
      sourceSlug == $baseSlug ||
      slug.current == $baseSlug ||
      slug.current == $translatedSlug
    )][0]`,
    {
      baseSlug,
      translatedSlug,
      locale: targetLocale,
    }
  );

  const translatedDoc = {
    _type: 'post',
    locale: targetLocale,
    title: translatedTitle,
    slug: {
      _type: 'slug',
      current: translatedSlug,
    },
    sourceSlug: baseSlug,
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentId, targetLocales } = req.body;

    if (!documentId) {
      return res.status(400).json({ error: 'Document ID is required' });
    }

    const sourceDoc = await sanityClient.fetch(
      `*[_id == $id][0]{
        _id,
        title,
        slug,
        sourceSlug,
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
      return res.status(404).json({ error: 'Document not found' });
    }

    if (sourceDoc.locale !== 'en') {
      return res.status(400).json({
        error: 'Only English documents can be used as translation source',
      });
    }

    const baseSlug = sourceDoc.sourceSlug || sourceDoc.slug?.current;

    if (!sourceDoc.sourceSlug && baseSlug) {
      await sanityClient
        .patch(sourceDoc._id)
        .set({ sourceSlug: baseSlug })
        .commit();
    }

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
        // Capture per-locale error so UI can surface what's wrong without failing the whole batch
        console.error(`Error translating to ${locale}:`, error);
        const { code, message } = normalizeError(error);

        results.push({
          locale,
          status: 'error',
          code,
          message,
          details: message,
          error: message,
        });
      }
    }

    // If any locale failed, return 207 Multi-Status-ish response with details; otherwise 200
    const hasError = results.some((r) => r.status === 'error');
    return res.status(hasError ? 207 : 200).json({
      message: hasError
        ? 'Translation completed with errors'
        : 'Translation completed',
      results,
    });
  } catch (error) {
    console.error('Translation error:', error);
    const { code, message } = normalizeError(error);
    return res.status(500).json({
      error: 'Translation failed',
      code,
      details: message,
    });
  }
}

