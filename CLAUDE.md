# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based web application that provides redirect checking, URL expansion, and uptime monitoring tools. The project is internationalized (i18n) supporting 9 languages and uses Chakra UI for styling.

## Development Commands

```bash
# Start development server
yarn dev

# Build for production (includes locale generation)
yarn build

# Run production server
yarn start

# Lint
yarn lint

# Fix linting issues automatically
yarn lint:fix

# Generate locale files from translation API
yarn generate-locales
```

## Architecture

### Pages-Based Routing (Next.js Pages Router)

The project uses Next.js Pages Router with the following main pages:
- `/` - Index page (configurable via `NEXT_PUBLIC_INDEX` env var, defaults to uptime)
- `/redirect` - Redirect checker tool
- `/block` - Block checker tool
- `/uptime` - Uptime monitoring dashboard
- `/expander` - URL expander tool
- `/blog` - Blog page

### Internationalization (i18n)

The i18n setup is complex and uses a custom backend chain:

1. **Translation Generation**: Run `yarn generate-locales` before build to fetch translations from the API
2. **Locales**: Supports en, de, es, fr, it, pt, ja, zh, ko
3. **Configuration**: `next-i18next.config.js` defines the i18n setup
4. **Custom Backend**: Uses `NoLoadHttpBackend` in browser to prevent runtime fetching
5. **Locale Files**: Generated in `public/locales/{lang}/common.json`
6. **Default Locale**: Set via `NEXT_PUBLIC_LOCALE` env var (defaults to 'en')
7. **Missing Keys**: API endpoint at `/api/translation/missing` for tracking

### API Routes

Key API endpoints:
- `/api/redirects` - POST endpoint for checking URL redirects (max 5 hops)
- `/api/uptime` - GET endpoint for uptime data (cached, from updown.io API)
- `/api/block` - Block checking functionality
- `/api/translation/[slug]` - Translation fetching
- `/api/translation/missing` - Missing translation tracking
- `/api/sanity/*` - Sanity CMS integration endpoints (translation, content generation)

### Middleware

- **CORS**: `corsMiddleware.js` wraps API handlers for CORS support
- **Rate Limiting**: `rateLimitMiddleware.js.js` uses Upstash/Vercel KV for rate limiting (100 req/60s per IP, disabled in development)

### Component Structure

```
src/components/
├── common/          # Shared UI components (Header, Footer, LanguageMenu, etc.)
├── redirect-check/  # Redirect checker feature components
├── block-check/     # Block checker feature components
└── uptime/          # Uptime monitoring components
```

### Configuration System

All environment-based configuration is centralized in `src/configs/constant.js`. Key configs:
- App name, logo, and branding
- API keys and base URLs for uptime monitoring
- Translation URLs
- Social media links
- Navigation configuration
- Locale settings

### Styling

- **Framework**: Chakra UI with custom theme in `src/theme/`
- **Global Styles**: `src/styles/globals.scss`
- **Theme Components**: Custom button, heading, and text components

### Pre-commit Hooks

The project uses Husky + lint-staged:
- Runs ESLint with auto-fix on staged `.js` files
- Runs `yarn lint:fix` on all files before commit

## Important Implementation Notes

### SSL Verification Disabled

The redirect checker (`/api/redirects`) and locale generation script disable SSL certificate verification (`rejectUnauthorized: false`). This is intentional for checking redirects on sites with self-signed or invalid certificates.

### Caching Strategy

- **Uptime data**: In-memory cache with configurable TTL (`CACHE_EXPIRES_AFTER_SECONDS` env var)
- **API responses**: Set Cache-Control headers for CDN caching

### Rate Limiting

Rate limiting is configured for production only (skipped in development). Uses Vercel KV with sliding window algorithm.

### Sitemap Generation

`next-sitemap` runs post-build to generate sitemap.xml and robots.txt. Non-English locales are excluded from sitemap.

## Environment Variables

Required environment variables (see `.env` for examples):
- `API_BASE` - Uptime monitoring API base URL (e.g., updown.io)
- `API_KEY` - Uptime monitoring API key
- `SITES` - JSON array of site tokens to monitor
- `TRANSLATION_URL` - Translation API endpoint with `{{lng}}` placeholder
- `NEXT_PUBLIC_BASE_URL` - Base URL for the application
- `NEXT_PUBLIC_LOCALE` - Default locale (defaults to 'en')

## Known Quirks

1. Rate limit middleware file has duplicate `.js.js` extension
2. Locale generation must run before build (handled in build script)
3. No test suite currently configured
4. Uses Yarn as package manager (not npm)
