import { useRouter } from 'next/router';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Icon,
  Text,
  HStack,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaGlobe } from 'react-icons/fa';

const LANGUAGE_CONFIG = {
  en: { label: 'English', flag: '🇬🇧', nativeName: 'English' },
  es: { label: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  fr: { label: 'French', flag: '🇫🇷', nativeName: 'Français' },
  de: { label: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  it: { label: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  zh: { label: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  ar: { label: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  ja: { label: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  pt: { label: 'Portuguese', flag: '🇵🇹', nativeName: 'Português' },
  ko: { label: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
};


export default function LanguageSwitcher({ availableTranslations, currentSlug }) {
  const router = useRouter();
  const { locale, pathname } = router;

  if (!availableTranslations || availableTranslations.length <= 1) {
    return null; 
  }

  const currentLanguage = LANGUAGE_CONFIG[locale] || LANGUAGE_CONFIG['en'];

  const handleLanguageChange = (newLocale) => {
    if (newLocale === locale) return;

    const targetTranslation = availableTranslations.find(
      (t) => t.locale === newLocale
    );

    if (targetTranslation) {
      router.push(
        `/blog/${targetTranslation.slug}`,
        `/blog/${targetTranslation.slug}`,
        { locale: newLocale }
      );
    } else {
      const englishTranslation = availableTranslations.find(
        (t) => t.locale === 'en'
      );
      if (englishTranslation) {
        router.push(
          `/blog/${englishTranslation.slug}`,
          `/blog/${englishTranslation.slug}`,
          { locale: 'en' }
        );
      }
    }
  };

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          leftIcon={<Icon as={FaGlobe} />}
          variant="outline"
          size="md"
          borderRadius="md"
          fontWeight="medium"
          _hover={{ bg: 'gray.50' }}
          _active={{ bg: 'gray.100' }}
        >
          <HStack spacing={2}>
            <Text>{currentLanguage.flag}</Text>
            <Text display={{ base: 'none', md: 'block' }}>
              {currentLanguage.nativeName}
            </Text>
          </HStack>
        </MenuButton>
        <MenuList maxH="400px" overflowY="auto" zIndex={10}>
          {availableTranslations.map((translation) => {
            const lang = LANGUAGE_CONFIG[translation.locale];
            const isActive = translation.locale === locale;

            return (
              <MenuItem
                key={translation.locale}
                onClick={() => handleLanguageChange(translation.locale)}
                bg={isActive ? 'purple.50' : 'transparent'}
                fontWeight={isActive ? 'bold' : 'normal'}
                _hover={{ bg: 'purple.100' }}
              >
                <HStack spacing={3} w="full">
                  <Text fontSize="lg">{lang.flag}</Text>
                  <Box>
                    <Text fontWeight={isActive ? 'bold' : 'medium'}>
                      {lang.nativeName}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {lang.label}
                    </Text>
                  </Box>
                  {isActive && (
                    <Text ml="auto" color="purple.600" fontSize="sm">
                      ✓
                    </Text>
                  )}
                </HStack>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Box>
  );
}

