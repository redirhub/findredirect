// Run (from repo root):
// node scripts/migrate-wordpress-to-sanity.js

const axios = require('axios');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.development' });
require('dotenv').config();

const requiredEnv = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_API_TOKEN',
];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(
    `❌ Missing required env vars: ${missing.join(
      ', ',
    )}. Add them to .env.development before running.`,
  );
  process.exit(1);
}

const WP_API_BASE =
  process.env.WORDPRESS_API_BASE ||
  'https://managed-builder.redirhub.com/wp-json/wp/v2';
const DEFAULT_LOCALE = process.env.WORDPRESS_DEFAULT_LOCALE || 'en';
const PAGE_SIZE = 50;

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-09',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const slugify = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96) || 'post';

const stripHtml = (html) =>
  html ? html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';

const toPortableText = (html) => {
  const text = stripHtml(html);
  if (!text) return [];
  return [
    {
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', text, marks: [] }],
    },
  ];
};

const filenameFromUrl = (url, fallback = 'wp-image.jpg') => {
  try {
    const parsed = new URL(url);
    const name = parsed.pathname.split('/').filter(Boolean).pop();
    if (!name) return fallback;
    return name.split('?')[0] || fallback;
  } catch (_) {
    return fallback;
  }
};

async function uploadImageFromUrl(url, label) {
  if (!url) return undefined;
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const filename = label || filenameFromUrl(url);
    const asset = await sanity.assets.upload('image', buffer, { filename });
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    };
  } catch (error) {
    console.warn(`⚠️  Skipped image ${url}: ${error.message}`);
    return undefined;
  }
}

async function getOrCreateAuthor(author) {
  if (!author) return undefined;
  const name = author.name || 'Unknown';
  const slug = slugify(author.slug || name);
  const id = `author-${slug}`;

  const existingId = await sanity.fetch(
    '*[_type == "author" && _id == $id][0]._id',
    { id },
  );
  if (existingId) return { _type: 'reference', _ref: existingId };

  const avatarUrl =
    author.avatar_urls?.['256'] ||
    author.avatar_urls?.['96'] ||
    author.avatar_urls?.['48'];
  const image = await uploadImageFromUrl(avatarUrl, `${slug}-avatar.jpg`);

  await sanity.createIfNotExists({
    _id: id,
    _type: 'author',
    name,
    slug: { current: slug },
    bio: stripHtml(author.description),
    image,
  });

  return { _type: 'reference', _ref: id };
}

const extractTags = (post) => {
  const terms = post?._embedded?.['wp:term'] || [];
  const tags = terms
    .flat()
    .filter((term) => term?.taxonomy === 'post_tag')
    .map((term) => term.name)
    .filter(Boolean);
  return Array.from(new Set(tags));
};

const fetchAllPosts = async () => {
  let page = 1;
  const posts = [];

  while (true) {
    const response = await axios.get(`${WP_API_BASE}/posts`, {
      params: { per_page: PAGE_SIZE, page, _embed: true, order: 'asc' },
      responseType: 'json',
    });

    posts.push(...response.data);

    const totalPages = Number(response.headers['x-wp-totalpages'] || 1);
    if (page >= totalPages) break;
    page += 1;
  }

  return posts;
};

const mapPostToSanity = async (post) => {
  const slug = post.slug || slugify(post.title?.rendered);
  const documentId = `post-${slug}-${DEFAULT_LOCALE}`;

  const existingId = await sanity.fetch(
    '*[_type == "post" && slug.current == $slug && locale == $locale][0]._id',
    { slug, locale: DEFAULT_LOCALE },
  );

  const featured =
    post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    post.jetpack_featured_media_url;
  const image = await uploadImageFromUrl(featured, `${slug}-featured.jpg`);
  const authorRef = await getOrCreateAuthor(post._embedded?.author?.[0]);

  return {
    _id: existingId || documentId,
    _type: 'post',
    locale: DEFAULT_LOCALE,
    slug: { current: slug },
    sourceSlug: post.slug,
    title: stripHtml(post.title?.rendered),
    excerpt: stripHtml(post.excerpt?.rendered),
    tags: extractTags(post),
    content: toPortableText(post.content?.rendered),
    image,
    publishedAt: new Date(post.date_gmt || post.date || Date.now()).toISOString(),
    author: authorRef,
  };
};

async function migrate() {
  console.log('🚀 Starting WordPress → Sanity migration\n');
  console.log(`• WordPress API: ${WP_API_BASE}`);
  console.log(
    `• Sanity project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
  );
  console.log(`• Locale: ${DEFAULT_LOCALE}\n`);

  const posts = await fetchAllPosts();
  console.log(`Found ${posts.length} posts to process\n`);

  let success = 0;
  let failures = 0;

  for (const post of posts) {
    try {
      const doc = await mapPostToSanity(post);
      await sanity.createOrReplace(doc);
      console.log(`✓ Migrated "${doc.title}" (${doc.slug.current})`);
      success += 1;
    } catch (error) {
      console.error(`❌ Failed "${post.slug || post.id}": ${error.message}`);
      failures += 1;
    }
  }

  console.log('\n📊 Migration summary');
  console.log(`   ✓ Success: ${success}`);
  console.log(`   ⚠️  Failures: ${failures}`);
  console.log('Done.');
}

migrate().catch((error) => {
  console.error('❌ Migration aborted:', error);
  process.exit(1);
});

