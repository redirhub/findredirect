import { definePlugin } from 'sanity';
import { Button, Card, Flex, Stack, Text, Badge } from '@sanity/ui';
import { useState, useEffect } from 'react';
import { useRouter } from 'sanity/router';
import { LANGUAGES } from '../../config/i18n';

function LanguageSwitcherComponent({ document, documentId }) {
  const router = useRouter();
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const slug = document?.slug?.current;
    if (!slug) {
      setTranslations([]);
      return;
    }

    setLoading(true);

    // Query Sanity for all posts with the same slug
    const query = `*[_type == "post" && slug.current == $slug]{
      _id,
      locale,
      title
    }`;

    fetch(`/api/sanity/query?query=${encodeURIComponent(query)}&slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setTranslations(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching translations:', error);
        setLoading(false);
      });
  }, [document?.slug?.current]);

  const handleNavigate = (translationId) => {
    router.navigateIntent('edit', {
      id: translationId,
      type: 'post',
    });
  };

  const currentLocale = document?.locale || 'en';
  const currentLang = LANGUAGES.find((l) => l.id === currentLocale);

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
          <Text size={1} muted>Loading translations...</Text>
        ) : (
          <Flex wrap="wrap" gap={2}>
            {LANGUAGES.map((lang) => {
              const translation = translations.find((t) => t.locale === lang.id);
              const isCurrent = lang.id === currentLocale;
              const exists = Boolean(translation);

              return (
                <Button
                  key={lang.id}
                  mode={isCurrent ? 'default' : 'ghost'}
                  tone={exists ? 'primary' : 'default'}
                  fontSize={1}
                  padding={2}
                  disabled={isCurrent || !exists}
                  onClick={() => exists && handleNavigate(translation._id)}
                  text={
                    <Flex align="center" gap={2}>
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                      {!exists && <Badge mode="outline" tone="caution" fontSize={0}>Missing</Badge>}
                      {isCurrent && <Badge tone="primary" fontSize={0}>Current</Badge>}
                    </Flex>
                  }
                />
              );
            })}
          </Flex>
        )}

        {currentLocale === 'en' && translations.length === 1 && (
          <Card padding={2} tone="caution" radius={2}>
            <Text size={1}>
              💡 Tip: Check "Needs Translation" and save to translate this post to all languages
            </Text>
          </Card>
        )}
      </Stack>
    </Card>
  );
}

export const languageSwitcherPlugin = definePlugin({
  name: 'language-switcher',
  form: {
    components: {
      input: (props) => {
        if (props.schemaType.name === 'post') {
          return (
            <>
              {props.renderDefault(props)}
              <LanguageSwitcherComponent
                document={props.value}
                documentId={props.id}
              />
            </>
          );
        }
        return props.renderDefault(props);
      },
    },
  },
});
