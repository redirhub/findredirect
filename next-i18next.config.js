/** @type {import('next-i18next').UserConfig} */
const HttpBackend = require('i18next-http-backend/cjs')
const ChainedBackend = require('i18next-chained-backend').default

const path = require('path');
const isBrowser = typeof window !== 'undefined'
const isDev = process.env.NODE_ENV === 'development'
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
}
