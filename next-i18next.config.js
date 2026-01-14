// next-i18next.config.js
const HttpBackend = require('i18next-http-backend/cjs')
const ChainedBackend = require('i18next-chained-backend').default
const { allLanguages, defaultLocale } = require('./src/sanity/config/i18n')

const path = require('path');
const isBrowser = typeof window !== 'undefined'
const isDev = process.env.NODE_ENV === 'development'

class NoLoadHttpBackend extends HttpBackend {
    read(language, namespace, callback) {
        // Prevent loading by returning empty object
        return callback(null, {}) // or callback(null, undefined)
    }
}

module.exports = {
    i18n: {
        locales: allLanguages,
        defaultLocale: defaultLocale,
        // localeDetection: true,
    },
    backend: {
        backendOptions: [
            {
                loadPath: '', // disabled
                addPath: '/api/translation/missing',
                allowedAddOrUpdateHosts: () => '/api/translation/missing',
                projectId: 'c129fb28-4614-4731-b76e-c6ca068a4f60',
                apiKey: 'ad0d830f-0c5a-4d85-9e67-14a8f69e51fc',
                referenceLng: 'en',
            }
        ],
        backends: isBrowser ? [ NoLoadHttpBackend ] : [],
    },
    partialBundledLanguages: isBrowser && true,
    use: isBrowser ? [ ChainedBackend ] : [],
    debug: isDev,
    localePath: path.resolve(process.cwd(), 'public/locales'),
    revalidate: isDev,
    saveMissing: true,
    interpolation: {
        escapeValue: false,
    },
    react: {
        bindI18n: 'languageChanged loaded',
        useSuspense: false
    },
    serializeConfig: false,
}
