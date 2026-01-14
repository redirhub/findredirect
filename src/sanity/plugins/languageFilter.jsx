import { definePlugin } from 'sanity';
import { Flex, Select, Text, Box } from '@sanity/ui';
import { useRouter, useRouterState } from 'sanity/router';
import { LANGUAGES, defaultLocale } from '@/sanity/config/i18n';

// Language Filter Component for Studio Navbar
function LanguageFilterNavbar(props) {
  const router = useRouter();
  const routerState = useRouterState();

  // Get current language from URL params, default to 'en'
  const params = new URLSearchParams(routerState?._searchParams || []);
  const savedLang = sessionStorage.getItem('studio-lang');
  const currentLanguage = savedLang || params.get('lang') || defaultLocale;

  const handleLanguageChange = (event) => {
    const newLang = event.currentTarget.value;

    sessionStorage.setItem('studio-lang', newLang);

    if (newLang !== currentLanguage) {
      window.location.reload();
    }
  };

  return (
    <>
      {props.renderDefault(props)}
      <Flex align="center" gap={2} padding={0}>
        <Box style={{ minWidth: '150px' }}>
          <Select
            value={currentLanguage}
            onChange={handleLanguageChange}
            fontSize={1}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.flag} {lang.nativeName || lang.title}
              </option>
            ))}
          </Select>
        </Box>
      </Flex>
    </>
  );
}

export const languageFilterPlugin = definePlugin({
  name: 'language-filter',
  studio: {
    components: {
      toolMenu: LanguageFilterNavbar,
    },
  },
});
