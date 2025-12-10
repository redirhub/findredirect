import { definePlugin } from 'sanity';
import { Button, Card, Flex, Stack, Text } from '@sanity/ui';
import { useState, useEffect } from 'react';

const LOCALE_FLAGS = {
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  zh: '🇨🇳',
  ar: '🇸🇦',
  ja: '🇯🇵',
};

const LOCALE_NAMES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  zh: 'Chinese',
  ar: 'Arabic',
  ja: 'Japanese',
};

function LanguageSwitcherComponent({ document, schemaType }) {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (document?.baseSlug) {
      fetchTranslations(document.baseSlug);
    }
  }, [document?.baseSlug]);

  const fetchTranslations = async (baseSlug) => {
    setLoading(true);
    try {
      const query = `*[_type == "post" && baseSlug == $baseSlug]{
        _id,
        locale,
        title,
        "slug": slug.current
      }`;

      const result = await fetch(
        `/api/sanity/query?query=${encodeURIComponent(query)}&baseSlug=${baseSlug}`
      ).then((res) => res.json());

      setTranslations(result || []);
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!document._id) {
      alert('Please save the document first before translating.');
      return;
    }

    if (document.locale !== 'en') {
      alert('Only English documents can be used as translation source.');
      return;
    }

    setTranslating(true);
    try {
      const response = await fetch('/api/blog/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: document._id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Translation completed! Refresh to see the new translations.');
        if (document.baseSlug) {
          fetchTranslations(document.baseSlug);
        }
      } else {
        alert(`Translation failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Check console for details.');
    } finally {
      setTranslating(false);
    }
  };

  const navigateToTranslation = (documentId) => {
    window.location.href = `/studio/desk/post;${documentId}`;
  };

  if (schemaType.name !== 'post') {
    return null;
  }

  return (
    <Card padding={4} radius={2} shadow={1} style={{ marginTop: 20 }}>
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Text size={2} weight="semibold">
            🌐 Translations
          </Text>
          {document?.locale === 'en' && (
            <Button
              text="Auto-Translate"
              tone="primary"
              fontSize={1}
              padding={2}
              onClick={handleTranslate}
              disabled={translating || !document._id}
              loading={translating}
            />
          )}
        </Flex>

        {loading ? (
          <Text size={1} muted>
            Loading translations...
          </Text>
        ) : translations.length > 0 ? (
          <Stack space={2}>
            {translations.map((translation) => {
              const isActive = translation._id === document._id;
              return (
                <Card
                  key={translation._id}
                  padding={2}
                  radius={2}
                  tone={isActive ? 'primary' : 'default'}
                  style={{
                    cursor: isActive ? 'default' : 'pointer',
                    border: isActive ? '2px solid #4C6EF5' : '1px solid #E0E0E0',
                  }}
                  onClick={() =>
                    !isActive && navigateToTranslation(translation._id)
                  }
                >
                  <Flex align="center" gap={2}>
                    <Text size={2}>{LOCALE_FLAGS[translation.locale]}</Text>
                    <Text size={1} weight={isActive ? 'semibold' : 'regular'}>
                      {LOCALE_NAMES[translation.locale]} {isActive && '(Current)'}
                    </Text>
                  </Flex>
                </Card>
              );
            })}
          </Stack>
        ) : (
          <Text size={1} muted>
            No translations available yet.
            {document?.locale === 'en' &&
              ' Use the "Auto-Translate" button to generate translations.'}
          </Text>
        )}

        {!document?.baseSlug && document?._id && (
          <Card padding={2} tone="caution">
            <Text size={1}>
              ⚠️ Please set a Base Slug to enable translations.
            </Text>
          </Card>
        )}
      </Stack>
    </Card>
  );
}


export const languageSwitcherPlugin = definePlugin({
  name: 'language-switcher',
  document: {
    productionUrl: async (prev, { document }) => {
      const locale = document.locale || 'en';
      const slug = document.slug?.current;
      if (!slug) return prev;

      const baseUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000';
      return locale === 'en'
        ? `${baseUrl}/blog/${slug}`
        : `${baseUrl}/${locale}/blog/${slug}`;
    },
  },
  form: {
    components: {
      input: (props) => {
        if (props.schemaType.name === 'post') {
          return (
            <>
              {props.renderDefault(props)}
              <LanguageSwitcherComponent
                document={props.value}
                schemaType={props.schemaType}
              />
            </>
          );
        }
        return props.renderDefault(props);
      },
    },
  },
});

