
// Load environment variables
require('dotenv').config({ path: '.env.development' });

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Sanity client configuration
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-09',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function generateSitemap() {
  const query = `*[
    (_type == "post" || _type == "page") && defined(slug.current) && locale == "en"
  ] {
    "slug": slug.current,
    _type
  }`;

  try {
    // Fetch slugs from Sanity
    const slugs = await writeClient.fetch(query);

    // Generate XML for each URL
    const urls = slugs.map(({ slug, _type }) => {
      const path = _type === 'post' ? `/blog/${slug}` : `/${slug}`;
      return `
        <url>
          <loc>${BASE_URL}${path}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `;
    });

    // Combine into a full XML sitemap
    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls.join('\n')}
      </urlset>
    `;

    // Write the sitemap to the public directory
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');
    console.log('✅ Sitemap generated at public/sitemap.xml');
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error.message);
    process.exit(1);
  }
}

// Run the script
generateSitemap();