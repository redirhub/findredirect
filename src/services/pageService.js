/**
 * Page Service
 *
 * Handles all data fetching operations for pages from Sanity CMS
 */

import { client } from "@/sanity/lib/client";

/**
 * Fetch all published pages for footer links
 *
 * @param {string} locale - The locale to fetch pages for (default: 'en')
 * @returns {Promise<Array>} - Array of pages with title and slug
 */
export async function fetchToolPagesForFooter(locale = 'en') {
  try {
    const query = `*[
      _type == "page" &&
      defined(slug.current) &&
      locale == $locale
    ] | order(publishedAt desc) {
      title,
      "slug": slug.current
    }`;

    const pages = await client.fetch(query, { locale });
    return pages || [];
  } catch (error) {
    console.error('Error fetching pages for footer:', error);
    return [];
  }
}

/**
 * Fetch a single page by slug
 *
 * @param {string} slug - The slug of the page
 * @param {string} locale - The locale to fetch (default: 'en')
 * @returns {Promise<Object|null>} - Page data or null if not found
 */
export async function fetchPageBySlug(slug, locale = 'en') {
  try {
    const query = `*[
      _type == "page" &&
      slug.current == $slug &&
      locale == $locale
    ][0] {
      _id,
      title,
      slug,
      metaTitle,
      metaDescription,
      widget,
      heroIcon,
      heroHeading,
      heroDescription,
      widgetConfig,
      buttonText,
      exampleUrls,
      contentBeforeWidget,
      contentAfterWidget,
      faqs,
      locale,
      publishedAt,
      customStructuredData
    }`;

    let page = await client.fetch(query, { slug, locale });

    // Fallback to English if not found in current locale
    if (!page && locale !== 'en') {
      page = await client.fetch(query, { slug, locale: 'en' });
    }

    return page;
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
}

/**
 * Fetch all page slugs for static path generation
 *
 * @returns {Promise<Array>} - Array of objects with slug and locale
 */
export async function fetchAllPageSlugs() {
  try {
    const query = `*[
      _type == "page" && defined(slug.current)
    ] {
      "slug": slug.current,
      locale
    }`;

    const slugs = await client.fetch(query);
    return slugs || [];
  } catch (error) {
    console.error('Error fetching page slugs:', error);
    return [];
  }
}

/**
 * Fetch pages by widget type
 *
 * @param {string} widgetType - The widget type (redirect, block)
 * @param {string} locale - The locale to fetch (default: 'en')
 * @returns {Promise<Array>} - Array of pages
 */
export async function fetchToolPagesByWidget(widgetType, locale = 'en') {
  try {
    const query = `*[
      _type == "page" &&
      widget == $widgetType &&
      locale == $locale &&
      defined(slug.current)
    ] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      heroDescription,
      publishedAt
    }`;

    const pages = await client.fetch(query, { widgetType, locale });
    return pages || [];
  } catch (error) {
    console.error('Error fetching pages by widget:', error);
    return [];
  }
}

/**
 * Fetch recent pages
 *
 * @param {number} limit - Maximum number of pages to fetch (default: 5)
 * @param {string} locale - The locale to fetch (default: 'en')
 * @returns {Promise<Array>} - Array of recent pages
 */
export async function fetchRecentToolPages(limit = 5, locale = 'en') {
  try {
    const query = `*[
      _type == "page" &&
      locale == $locale &&
      defined(slug.current)
    ] | order(publishedAt desc) [0...${limit}] {
      title,
      "slug": slug.current,
      heroDescription,
      publishedAt
    }`;

    const pages = await client.fetch(query, { locale });
    return pages || [];
  } catch (error) {
    console.error('Error fetching recent pages:', error);
    return [];
  }
}

/**
 * Fetch all pages for footer links
 *
 * @param {string} locale - The locale to fetch (default: 'en')
 * @returns {Promise<Array>} - Array of all pages
 */
export async function fetchAllPagesForFooter(locale = 'en') {
  try {
    const query = `*[
      _type == "page" &&
      defined(slug.current) &&
      locale == $locale
    ] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      category
    }`;

    const pages = await client.fetch(query, { locale });
    return pages || [];
  } catch (error) {
    console.error('Error fetching all pages for footer:', error);
    return [];
  }
}

/**
 * Fetch company/content pages (pages with widget='none')
 *
 * @param {string} locale - The locale to fetch (default: 'en')
 * @returns {Promise<Array>} - Array of company pages
 */
export async function fetchCompanyPages(locale = 'en') {
  try {
    const query = `*[
      _type == "page" &&
      widget == "none" &&
      locale == $locale &&
      defined(slug.current)
    ] | order(title asc) {
      title,
      "slug": slug.current
    }`;

    const pages = await client.fetch(query, { locale });
    return pages || [];
  } catch (error) {
    console.error('Error fetching company pages:', error);
    return [];
  }
}
