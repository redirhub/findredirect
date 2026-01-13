# Performance Comparison Pages

This folder contains example Sanity page configurations for uptime monitoring and performance comparison pages.

## How It Works

The uptime widget now uses a **slug-based configuration system**. When you create a page with the uptime widget, the API automatically determines which services to monitor based on the page slug.

### Service Mapping

The API (`/api/uptime`) includes predefined mappings for common slugs:

**All Services:**
- `uptime` → All 5 services
- `link-shortener-uptime-comparison` → All 5 services

**Single Services:**
- `redirhub-performance` → yy6y (RedirHub)
- `bitly-performance` → ps0k (Bitly)
- `rebrandly-performance` → peet (Rebrandly)
- `easyredir-performance` → 1z19 (EasyRedir)
- `redirect-pizza-performance` → nwxh (Redirect Pizza)

**Head-to-Head Comparisons:**
- `bitly-vs-rebrandly` → ps0k, peet (Bitly vs Rebrandly)
- `redirhub-vs-bitly` → yy6y, ps0k
- `redirhub-vs-rebrandly` → yy6y, peet
- `bitly-vs-easyredir` → ps0k, 1z19
- `rebrandly-vs-easyredir` → peet, 1z19

**Multi-Service:**
- `top-link-shorteners` → yy6y, ps0k, peet
- `redirect-service-comparison` → yy6y, ps0k, peet, 1z19

## Service IDs

All available services:

| ID | Service | Website |
|----|---------|---------|
| yy6y | RedirHub | https://www.redirhub.com |
| ps0k | Bitly | https://bitly.com |
| peet | Rebrandly | https://www.rebrandly.com |
| 1z19 | EasyRedir | https://www.easyredir.com |
| nwxh | Redirect Pizza | https://redirect.pizza |

## Importing Pages to Sanity

### Option 1: Manual Creation (Recommended)

1. Open Sanity Studio
2. Create a new Page document
3. Copy the values from the JSON files:
   - Title, slug, meta title, meta description
   - Set widget to "Uptime Comparison"
   - Copy widgetConfig key-value pairs
   - Paste content blocks
   - Add FAQs

### import

```for file in pages-performance/*.json; do
  node scripts/import-page.js "$file"
done
```
