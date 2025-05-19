// next-i18next.config.js
const path = require('path');

const allLanguages = [ "en", "de", "es", "fr", "it", "pt", "ja", "zh", "ko" ];

module.exports = {
  i18n: {
    locales: allLanguages,
    defaultLocale: 'en',
    localeDetection: true,
  },
  localePath: path.resolve('./public/locales'), // server + build-time only
  reloadOnPrerender: false,
  saveMissing: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
};
