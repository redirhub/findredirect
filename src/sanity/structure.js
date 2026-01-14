import { LANGUAGES, defaultLocale } from '@/sanity/config/i18n';

export const structure = (S) => {
  // Get language from sessionStorage (client-side), default to 'en'
  let selectedLanguage = defaultLocale;
  if (typeof window !== 'undefined') {
    const saved = sessionStorage.getItem('studio-lang');
    selectedLanguage = saved || defaultLocale;
  }

  // Find the selected language info
  const selectedLang = LANGUAGES.find(l => l.id === selectedLanguage) || LANGUAGES[0];

  return S.list()
    .title('Content')
    .items([
      // Posts
      S.listItem()
        .id('posts')
        .title('Posts')
        .icon(() => '📝')
        .child(
          S.documentTypeList('post')
            .title(`Posts - ${selectedLang.flag} ${selectedLang.nativeName || selectedLang.title}`)
            .filter('_type == "post" && locale == $locale')
            .params({ locale: selectedLanguage })
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
      // Pages
      S.listItem()
        .id('pages')
        .title('Pages')
        .icon(() => '📄')
        .child(
          S.documentTypeList('page')
            .title(`Pages - ${selectedLang.flag} ${selectedLang.nativeName || selectedLang.title}`)
            .filter('_type == "page" && locale == $locale')
            .params({ locale: selectedLanguage })
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !['post', 'page'].includes(listItem.getId())
      ),
    ]);
};