/**
 * Document Translation Service
 *
 * This module provides translation functionality for Sanity document types:
 * - post (blog posts)
 * - page (tool pages)
 */

import OpenAI from 'openai'
import { writeClient } from '@/sanity/lib/client'
import { allLanguages } from '@/sanity/config/i18n'

// Lazy initialize OpenAI client
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

const SUPPORTED_LOCALES = allLanguages.filter((locale) => locale !== 'en')

const LOCALE_NAMES: Record<string, string> = {
  de: 'German (Deutsch)',
  es: 'Spanish (español)',
  fr: 'French (français)',
  it: 'Italian (italiano)',
  pt: 'Portuguese (português)',
  ja: 'Japanese (日本語)',
  zh: 'Chinese (简体中文)',
  ko: 'Korean (한국어)',
}

type DocumentType = 'post' | 'page'

interface FAQ {
  _key?: string
  question: string
  answer: string
}

interface BaseDocument {
  _id: string
  _type: DocumentType
  locale: string
  title?: string
  slug?: { current: string }
  publishedAt?: string
}

interface PostDocument extends BaseDocument {
  _type: 'post'
  excerpt?: string
  tags?: string[]
  content?: any[]
  faqs?: FAQ[]
  image?: any
  author?: any
}

interface PageDocument extends BaseDocument {
  _type: 'page'
  metaTitle?: string
  metaDescription?: string
  heroHeading?: string
  heroDescription?: string
  contentBeforeWidget?: any[]
  contentAfterWidget?: any[]
  faqs?: FAQ[]
  category?: string
  widget?: string
  widgetConfig?: any[]
}

type Document = PostDocument | PageDocument

async function translateText(text: string, targetLocale: string): Promise<string> {
  const targetLanguage = LOCALE_NAMES[targetLocale]
  const openai = getOpenAIClient()

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
  })

  return response.choices[0].message.content?.trim() || text
}

async function translateMetadata(
  sourceDoc: Document,
  targetLocale: string
): Promise<any> {
  const targetLanguage = LOCALE_NAMES[targetLocale]

  // Build metadata object based on document type
  const metadata: any = {
    title: sourceDoc.title,
  }

  // Type-specific fields
  if (sourceDoc._type === 'post') {
    metadata.excerpt = sourceDoc.excerpt || ''
    metadata.tags = sourceDoc.tags || []
    metadata.faqs = sourceDoc.faqs || []
  } else if (sourceDoc._type === 'page') {
    metadata.metaTitle = sourceDoc.metaTitle || ''
    metadata.metaDescription = sourceDoc.metaDescription || ''
    metadata.heroHeading = sourceDoc.heroHeading || ''
    metadata.heroDescription = sourceDoc.heroDescription || ''
    metadata.faqs = sourceDoc.faqs || []
  }

  const openai = getOpenAIClient()
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the following document metadata to ${targetLanguage}. Maintain the tone, style, and context. Return ONLY a valid JSON object with the same structure, containing the translations. Do not add any explanations or markdown formatting.`,
      },
      {
        role: 'user',
        content: JSON.stringify(metadata, null, 2),
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  const translatedMetadata = JSON.parse(
    response.choices[0].message.content || '{}'
  )

  // Preserve _key fields from original FAQs if present
  if (Array.isArray(translatedMetadata.faqs)) {
    const originalFaqs = sourceDoc._type === 'post' || sourceDoc._type === 'page'
      ? sourceDoc.faqs || []
      : []

    translatedMetadata.faqs = translatedMetadata.faqs.map((faq: any, index: number) => ({
      ...faq,
      _key: originalFaqs[index]?._key || faq._key,
    }))
  }

  return translatedMetadata
}

async function translatePortableText(
  content: any[],
  targetLocale: string
): Promise<any[]> {
  if (!content || !Array.isArray(content)) return content

  // Translate all text blocks in parallel for speed
  const translatedBlocks = await Promise.all(
    content.map(async (block) => {
      if (block._type === 'block' && block.children) {
        const textToTranslate = block.children
          .filter((child: any) => child._type === 'span' && child.text)
          .map((child: any) => child.text)
          .join(' ')

        if (textToTranslate.trim()) {
          const translatedText = await translateText(
            textToTranslate,
            targetLocale
          )

          return {
            ...block,
            children: [
              {
                _type: 'span',
                text: translatedText,
                marks: [],
              },
            ],
          }
        }
      }
      return block
    })
  )

  return translatedBlocks
}

async function createTranslatedDocument(
  sourceDoc: Document,
  targetLocale: string
): Promise<any> {
  // Translate metadata and content in parallel
  const translationTasks = [translateMetadata(sourceDoc, targetLocale)]

  // Add content translation tasks based on document type
  if (sourceDoc._type === 'post' && sourceDoc.content) {
    translationTasks.push(translatePortableText(sourceDoc.content, targetLocale))
  } else if (sourceDoc._type === 'page') {
    translationTasks.push(
      sourceDoc.contentBeforeWidget
        ? translatePortableText(sourceDoc.contentBeforeWidget, targetLocale)
        : Promise.resolve([]),
      sourceDoc.contentAfterWidget
        ? translatePortableText(sourceDoc.contentAfterWidget, targetLocale)
        : Promise.resolve([])
    )
  }

  const [translatedMetadata, ...contentResults] = await Promise.all(translationTasks)

  const baseSlug = sourceDoc.slug?.current

  // Check if translation already exists
  const existingTranslation = await writeClient.fetch(
    `*[_type == $type && locale == $locale && slug.current == $baseSlug][0]`,
    {
      type: sourceDoc._type,
      baseSlug,
      locale: targetLocale,
    }
  )

  // Build translated document based on type
  let translatedDoc: any = {
    _type: sourceDoc._type,
    locale: targetLocale,
    title: translatedMetadata.title,
    slug: sourceDoc.slug,
    publishedAt: sourceDoc.publishedAt,
  }

  // Add type-specific fields
  if (sourceDoc._type === 'post') {
    const [translatedContent] = contentResults
    translatedDoc = {
      ...translatedDoc,
      excerpt: translatedMetadata.excerpt,
      tags: translatedMetadata.tags,
      content: Array.isArray(translatedContent) ? translatedContent : [],
      image: sourceDoc.image,
      author: sourceDoc.author,
      faqs: translatedMetadata.faqs,
    }
  } else if (sourceDoc._type === 'page') {
    const [translatedContentBefore, translatedContentAfter] = contentResults
    translatedDoc = {
      ...translatedDoc,
      metaTitle: translatedMetadata.metaTitle,
      metaDescription: translatedMetadata.metaDescription,
      heroHeading: translatedMetadata.heroHeading,
      heroDescription: translatedMetadata.heroDescription,
      contentBeforeWidget: Array.isArray(translatedContentBefore) ? translatedContentBefore : [],
      contentAfterWidget: Array.isArray(translatedContentAfter) ? translatedContentAfter : [],
      faqs: translatedMetadata.faqs,
      category: sourceDoc.category, // Preserve, not translated
      widget: sourceDoc.widget, // Preserve, not translated
      widgetConfig: sourceDoc.widgetConfig, // Preserve, not translated
    }
  }

  // Update or create the document
  if (existingTranslation) {
    return await writeClient
      .patch(existingTranslation._id)
      .set(translatedDoc)
      .commit()
  } else {
    return await writeClient.create(translatedDoc)
  }
}

export async function translateDocument(
  documentId: string,
  targetLocales?: string[]
): Promise<{ success: boolean; results: any[] }> {
  console.log(`[Translate] Processing translation for document: ${documentId}`)

  // Fetch the document - support post and page types
  const sourceDoc = await writeClient.fetch(
    `*[_id == $id][0]{
      _id,
      _type,
      title,
      slug,
      excerpt,
      content,
      tags,
      image,
      publishedAt,
      author,
      faqs,
      locale,
      metaTitle,
      metaDescription,
      heroHeading,
      heroDescription,
      contentBeforeWidget,
      contentAfterWidget,
      category,
      widget,
      widgetConfig
    }`,
    { id: documentId }
  )

  if (!sourceDoc) {
    const message = `Document not found: ${documentId}`
    console.error(`[Translate] ${message}`)
    throw new Error(message)
  }

  if (sourceDoc.locale !== 'en') {
    const message = 'Only English documents can be translated'
    console.error(`[Translate] ${message}`)
    throw new Error(message)
  }

  const identifier = sourceDoc.slug?.current || sourceDoc.title || 'unknown'
  const locales = targetLocales || SUPPORTED_LOCALES

  console.log(
    `[Translate] Starting parallel translation for ${sourceDoc._type}: ${identifier} to ${locales.length} languages`
  )

  // Translate all languages in parallel for maximum speed
  const results = await Promise.all(
    locales.map(async (locale) => {
      try {
        console.log(`[Translate] [${identifier}] Translating to ${locale}...`)
        const translatedDoc = await createTranslatedDocument(sourceDoc, locale)
        console.log(`[Translate] [${identifier}] ✓ Translated to ${locale}`)
        return {
          locale,
          status: 'success',
          documentId: translatedDoc._id,
        }
      } catch (error) {
        console.error(
          `[Translate] [${identifier}] Error translating to ${locale}:`,
          error
        )
        return {
          locale,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    })
  )

  // Mark the source document as no longer needing translation
  try {
    await writeClient.patch(documentId).set({ needsTranslation: false }).commit()
    console.log(`[Translate] [${identifier}] Marked needsTranslation=false`)
  } catch (error) {
    console.warn(`[Translate] [${identifier}] Could not update needsTranslation flag:`, error)
    // Don't fail the whole translation just because we couldn't update the flag
  }

  console.log(
    `[Translate] [${identifier}] Translation complete for document: ${documentId}`
  )
  return { success: true, results }
}
