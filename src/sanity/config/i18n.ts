// Centralized i18n configuration shared by Sanity and Next.js
export interface Language {
  id: string
  title: string
  nativeName: string
  flag: string
}

export const LANGUAGES: Language[] = [
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

export const allLanguages = LANGUAGES.map((lang) => lang.id)
export const defaultLocale = 'en'

export const getLocaleLabel = (locale: string): string => {
  const lang = LANGUAGES.find((l) => l.id === locale)
  return lang ? `${lang.flag} ${lang.nativeName}` : locale
}

export const getLanguageByLocale = (locale: string): Language | undefined => {
  return LANGUAGES.find((l) => l.id === locale)
}
