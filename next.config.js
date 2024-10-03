module.exports = {
  i18n: {
    locales: [ 'en', 'zh', 'pt' ],
    defaultLocale: process.env.NEXT_PUBLIC_LOCALE || 'en',
    localeDetection: false,
  },
}