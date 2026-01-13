/**
 * Language Switcher Plugin
 *
 * Provides a UI panel for managing document translations across all supported languages.
 *
 * Features:
 * - Shows all available language versions for a document
 * - Allows navigation between language versions
 * - Triggers AI translation via the "AI Translate" button
 *
 * The AI translation button calls /api/sanity/process-translations which uses
 * the generalized translation service from src/lib/translation/translate-document.ts
 *
 * Supported document types: post, support, legal, faqSet
 */

import { definePlugin } from 'sanity'
import { Badge, Button, Card, Flex, Stack, Text } from '@sanity/ui'
import { useState, useEffect } from 'react'
import { useRouter } from 'sanity/router'
import { LANGUAGES } from '@/sanity/config/i18n'

interface Translation {
  _id: string
  locale: string
  title?: string
  pageSlug?: string
}

interface LanguageSwitcherProps {
  document: any
  documentId: string
  documentType: string
}

// Document types that support translation
const TRANSLATABLE_TYPES = ['post', 'support', 'legal', 'faqSet']

function LanguageSwitcherComponent({
  document,
  documentId,
  documentType,
}: LanguageSwitcherProps) {
  const router = useRouter()
  const [translations, setTranslations] = useState<Translation[]>([])
  const [loading, setLoading] = useState(false)
  const [jobLoading, setJobLoading] = useState(false)

  useEffect(() => {
    // For faqSet, use pageSlug; for others use slug.current
    const identifier = documentType === 'faqSet'
      ? document?.pageSlug
      : document?.slug?.current

    if (!identifier) {
      setTranslations([])
      return
    }

    setLoading(true)

    // Build query based on document type
    const query = documentType === 'faqSet'
      ? `*[_type == "${documentType}" && pageSlug == $slug]{ _id, locale, title, pageSlug }`
      : `*[_type == "${documentType}" && slug.current == $slug]{ _id, locale, title }`

    fetch(
      `/api/sanity/query?query=${encodeURIComponent(query)}&slug=${identifier}&fresh=true`
    )
      .then((res) => res.json())
      .then((data) => {
        setTranslations(data || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching translations:', error)
        setLoading(false)
      })
  }, [document?.slug, document?.pageSlug, documentType])

  const handleNavigate = (translationId: string) => {
    router.navigateIntent('edit', {
      id: translationId,
      type: documentType,
    })
  }

  const currentLocale = document?.locale || 'en'
  const currentLang = LANGUAGES.find((l) => l.id === currentLocale)

  return (
    <Card padding={4} radius={2} shadow={1} style={{ marginTop: 20 }}>
      <Stack space={3}>
        <Flex align="center" gap={2}>
          <Text size={2} weight="semibold">
            🌐 Language Versions
          </Text>
          <Badge tone="primary" fontSize={1}>
            {currentLang?.flag} {currentLang?.nativeName}
          </Badge>
        </Flex>

        {loading ? (
          <Text size={1} muted>
            Loading translations...
          </Text>
        ) : (
          <Flex wrap="wrap" gap={2}>
            {LANGUAGES.map((lang) => {
              const translation = translations.find(
                (t) => t.locale === lang.id
              )
              const isCurrent = lang.id === currentLocale
              const exists = Boolean(translation)

              return (
                <Button
                  key={lang.id}
                  mode={isCurrent ? 'default' : 'ghost'}
                  tone={exists ? 'primary' : 'default'}
                  fontSize={1}
                  padding={2}
                  disabled={isCurrent || !exists}
                  onClick={() => translation && handleNavigate(translation._id)}
                  text={
                    <Flex align="center" gap={2}>
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                      {!exists && (
                        <Badge mode="outline" tone="caution" fontSize={0}>
                          Missing
                        </Badge>
                      )}
                      {isCurrent && (
                        <Badge tone="primary" fontSize={0}>
                          Current
                        </Badge>
                      )}
                    </Flex>
                  }
                />
              )
            })}
          </Flex>
        )}

        {currentLocale === 'en' && (
          <Button
            mode="ghost"
            tone="positive"
            fontSize={1}
            padding={2}
            disabled={jobLoading}
            onClick={async () => {
              if (!document?._id) {
                alert('Document ID not found. Please save the document first.')
                return
              }

              setJobLoading(true)

              try {
                // Call the API endpoint which uses the new translateDocument service
                const response = await fetch(
                  `/api/sanity/process-translations?docId=${document._id}`,
                  { method: 'POST' }
                )

                const result = await response.json()

                if (!result.ok) {
                  throw new Error(result.error || 'Translation failed')
                }

                // Show success feedback
                console.log('✅ Translation completed:', result)

                // Reload translations with retry logic (Sanity has eventual consistency)
                const identifier = documentType === 'faqSet'
                  ? document?.pageSlug
                  : document?.slug?.current

                if (identifier) {
                  setLoading(true)
                  const query = documentType === 'faqSet'
                    ? `*[_type == "${documentType}" && pageSlug == $slug]{ _id, locale, title, pageSlug }`
                    : `*[_type == "${documentType}" && slug.current == $slug]{ _id, locale, title }`

                  // Use fresh=true to bypass Sanity CDN cache after translation
                  const queryResponse = await fetch(
                    `/api/sanity/query?query=${encodeURIComponent(query)}&slug=${identifier}&fresh=true`
                  )
                  const data = await queryResponse.json()

                  setTranslations(data)
                  setLoading(false)
                }

              } catch (err) {
                console.error('Translation error:', err)
                alert(`❌ Translation failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
              } finally {
                setJobLoading(false)
              }
            }}
            text={
              <Flex align="center" gap={2}>
                {jobLoading && <span>⏳</span>}
                <span>{jobLoading ? 'Translating...' : 'AI Translate'}</span>
              </Flex>
            }
          />
        )}
      </Stack>
    </Card>
  )
}

export const languageSwitcherPlugin = definePlugin({
  name: 'language-switcher',
  form: {
    components: {
      input: (props) => {
        // Apply to all translatable document types
        if (TRANSLATABLE_TYPES.includes(props.schemaType.name)) {
          return (
            <>
              {props.renderDefault(props)}
              <LanguageSwitcherComponent
                document={props.value}
                documentId={props.id}
                documentType={props.schemaType.name}
              />
            </>
          )
        }
        return props.renderDefault(props)
      },
    },
  },
})
