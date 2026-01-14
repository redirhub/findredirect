// CommonJS bridge for next-i18next.config.js compatibility
// This duplicates the essential exports from i18n.ts for require() compatibility

const LANGUAGES = [
  { id: 'en', title: 'English', nativeName: 'English', flag: '🇬🇧' },
  { id: 'de', title: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { id: 'es', title: 'Spanish', nativeName: 'español', flag: '🇪🇸' },
  { id: 'fr', title: 'French', nativeName: 'français', flag: '🇫🇷' },
  { id: 'it', title: 'Italian', nativeName: 'italiano', flag: '🇮🇹' },
  { id: 'pt', title: 'Portuguese', nativeName: 'português', flag: '🇵🇹' },
  { id: 'ja', title: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { id: 'zh', title: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { id: 'ko', title: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
]

const allLanguages = LANGUAGES.map((lang) => lang.id)
const defaultLocale = 'en'

const getLocaleLabel = (locale) => {
  const lang = LANGUAGES.find((l) => l.id === locale)
  return lang ? `${lang.flag} ${lang.nativeName}` : locale
}

const getLanguageByLocale = (locale) => {
  return LANGUAGES.find((l) => l.id === locale)
}

module.exports = {
  LANGUAGES,
  allLanguages,
  defaultLocale,
  getLocaleLabel,
  getLanguageByLocale,
}
