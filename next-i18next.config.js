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
        defaultLocale: process.env.NEXT_PUBLIC_LOCALE || 'en',
        localeDetection: false,
        defaultNS: 'common',
    },
    backend: {
        backendOptions: [
            {
                loadPath: '/api/translation/{{lng}}',
                addPath: '/api/translation/missing',
                allowedAddOrUpdateHosts: () => '/api/translation/missing',
                projectId: 'c129fb28-4614-4731-b76e-c6ca068a4f60',
                apiKey: 'ad0d830f-0c5a-4d85-9e67-14a8f69e51fc',
                referenceLng: 'en',
            }
        ],
        backends: isBrowser ? [ HttpBackend ] : [],
    },
    partialBundledLanguages: isBrowser && true,
    use: isBrowser ? [ ChainedBackend ] : [],
    debug: isDev,
    reloadOnPrerender: isDev,
    localePath:
        isBrowser
            ? path.resolve('./public/locales')
            : 'public/locales',
    saveMissing: true,
    interpolation: {
        escapeValue: false
    },
    react: { // used only for the lazy reload
        bindI18n: 'languageChanged loaded',
        useSuspense: false
    },
    serializeConfig: false,
}
