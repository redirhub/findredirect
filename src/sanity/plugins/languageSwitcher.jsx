import { definePlugin } from 'sanity';
import { Button, Card, Flex, Stack, Text } from '@sanity/ui';
import { useState, useEffect, useRef } from 'react';
import { LANGUAGES } from '../../config/i18n';

const LOCALE_FLAGS = LANGUAGES.reduce((acc, lang) => {
  acc[lang.id] = lang.flag;
  return acc;
}, {});

const LOCALE_NAMES = LANGUAGES.reduce((acc, lang) => {
  acc[lang.id] = lang.nativeName || lang.title;
  return acc;
}, {});

function LanguageSwitcherComponent({ document, schemaType }) {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const lastFetchedSlug = useRef(null);

  const fetchTranslations = async (slug, signal) => {
    setLoading(true);
    try {
      const query = `*[_type == "post" && slug.current == $slug]{
        _id,
        locale,
        title,
        "slug": slug.current
      }`;

      const result = await fetch(
        `/api/sanity/query?query=${encodeURIComponent(query)}&slug=${slug}`,
        { signal }
      ).then((res) => res.json());

      setTranslations(result || []);
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error fetching translations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce fetches while slug input is being edited to avoid blocking INP
  useEffect(() => {
    const slug = document?.slug?.current;
    const hasId = Boolean(document?._id);

    if (!hasId || !slug || slug === lastFetchedSlug.current) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      lastFetchedSlug.current = slug;
      fetchTranslations(slug, controller.signal);
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
    // We intentionally omit translations from deps to only react to slug/id changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document?._id, document?.slug?.current]);

  // No long cooldown; we only disable while the request is in-flight

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
      // Fire the request but cap wait time so UI never blocks
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('/api/blog/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: document._id,
        }),
        signal: controller.signal,
      }).catch((error) => {
        if (error.name === 'AbortError') {
          return { ok: true, status: 202, json: async () => ({}) };
        }
        throw error;
      });

      clearTimeout(timeout);
      const result = await response.json();

      if (!response.ok) {
        const msg = result?.details || result?.error || 'Unknown error';
        alert(`Translation failed: ${msg}`);
        return;
      }

      // 202 Accepted means the job is queued
      if (response.status === 202) {
        alert(
          'Translation job started! 🎉\n\n' +
          'Translations are being created in the background. ' +
          'This may take a few minutes. Refresh in a moment to see the new translations.'
        );
        // Optionally refresh after a delay
        setTimeout(() => {
          if (document.slug?.current) {
            fetchTranslations(document.slug.current);
          }
        }, 5000);
      } else {
        // Fallback for immediate completion (shouldn't happen with queue)
        alert('Translation completed! Refresh to see the new translations.');
        if (document.slug?.current) {
          fetchTranslations(document.slug.current);
        }
      }
    } catch (error) {
      console.error('Translation error:', error);
      const msg =
        error?.message ||
        'Network connection failed. Please check your internet connection.';
      alert(`Translation failed: ${msg}`);
    } finally {
      // Stop the spinner quickly; button will re-enable immediately
      setTimeout(() => setTranslating(false), 200);
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

        {!document?.slug?.current && document?._id && (
          <Card padding={2} tone="caution">
            <Text size={1}>
              ⚠️ Please set a Slug to enable translations.
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

