export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'FindRedirect';
export const APP_LOGO = process.env.NEXT_PUBLIC_APP_LOGO || '/logo.png';
export const APP_LOGO_DARK = process.env.NEXT_PUBLIC_APP_LOGO || '/logo-dark.png';
export const INDEX_PAGE = process.env.NEXT_PUBLIC_INDEX || 'uptime';
export const HIDE_NAV = process.env.NEXT_PUBLIC_HIDE_NAV || false;
export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE || false;
export const UPTIME_API_BASE = process.env.API_BASE || 'https://api.uptimerobot.com/v2/';
export const UPTIME_API_KEY = process.env.API_KEY || 'your-api-key';
export const UPTIME_SITES = process.env.SITES || '["your-site-token"]';
export const UPTIME_CACHE_EXPIRES = process.env.CACHE_EXPIRES_AFTER_SECONDS || 3600;

export const TRANSLATION_URL = process.env.TRANSLATION_URL;
export const TRANSLATION_MISSING_URL = process.env.TRANSLATION_MISSING_URL;

export const QUESTION_URL = process.env.NEXT_PUBLIC_QUESTION_URL;
export const X_URL = process.env.NEXT_PUBLIC_X_URL;
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL;
export const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL;
export const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL;
export const NAVS = process.env.NEXT_PUBLIC_NAVS;
export const EXAMPLE_REDIRECT_URL = process.env.NEXT_PUBLIC_EXAMPLE_REDIRECT_URL;
export const EXAMPLE_EXPANDER_URL = process.env.NEXT_PUBLIC_EXAMPLE_EXPANDER_URL;
export const ALL_LOCALES = process.env.NEXT_PUBLIC_LOCALES.split(',');