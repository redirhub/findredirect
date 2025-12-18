// Run (from repo root):
// node scripts/migrate-wordpress-to-sanity.js

const axios = require('axios');
const { randomUUID } = require('crypto');
const { createClient } = require('@sanity/client');
const { parse } = require('node-html-parser');
const { decode } = require('html-entities');
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
  process.env.WORDPRESS_API_BASE;
const DEFAULT_LOCALE = process.env.WORDPRESS_DEFAULT_LOCALE || 'en';
const PAGE_SIZE = 100;

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

const decodeEntities = (value = '') => decode(value);

const stripHtml = (html) => {
  const text = html ? html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';
  return decodeEntities(text);
};

const genKey = () => (typeof randomUUID === 'function' ? randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

const htmlToPortableText = async (html = '') => {
  const root = parse(html, {
    blockTextElements: {
      script: true,
      style: true,
      pre: true,
    },
  });

  const blocks = [];
  const linkKeyCache = new Map();

  const ensureLinkKey = (href, markDefs) => {
    if (!href) return null;
    if (linkKeyCache.has(href)) return linkKeyCache.get(href);
    const key = `link-${linkKeyCache.size + 1}`;
    linkKeyCache.set(href, key);
    markDefs.push({ _key: key, _type: 'link', href });
    return key;
  };

  const buildSpans = (node, activeMarks, markDefs) => {
    if (!node) return [];

    if (node.nodeType === 3) {
      const text = decodeEntities(node.rawText || '');
      if (!text || !text.trim()) return [];
      return [
        {
          _key: genKey(),
          _type: 'span',
          text,
          marks: activeMarks,
        },
      ];
    }

    if (node.nodeType !== 1) return [];

    let marks = [...activeMarks];
    const tag = (node.tagName || '').toLowerCase();

    if (tag === 'br') {
      return [
        {
          _key: genKey(),
          _type: 'span',
          text: '\n',
          marks,
        },
      ];
    }

    if (tag === 'strong' || tag === 'b') marks = [...marks, 'strong'];
    if (tag === 'em' || tag === 'i') marks = [...marks, 'em'];
    if (tag === 'code') marks = [...marks, 'code'];
    if (tag === 'a') {
      const href = node.getAttribute('href');
      const linkKey = ensureLinkKey(href, markDefs);
      if (linkKey) marks = [...marks, linkKey];
    }

    return node.childNodes.flatMap((child) =>
      buildSpans(child, marks, markDefs),
    );
  };

  const findImageInfo = (node) => {
    const tag = (node.tagName || '').toLowerCase();
    const imgNode =
      tag === 'img' ? node : node.querySelector && node.querySelector('img');
    if (!imgNode) return null;

    const src = imgNode.getAttribute('src');
    const srcsetRaw = imgNode.getAttribute('srcset') || '';
    const sourcesFromSrcset = srcsetRaw
      .split(',')
      .map((entry) => entry.trim().split(' ')[0])
      .filter(Boolean);
    const sources = Array.from(
      new Set([src, ...sourcesFromSrcset].filter(Boolean)),
    );
    if (!sources.length) return null;

    const alt = decodeEntities(imgNode.getAttribute('alt') || '');
    const captionNode =
      node.querySelector && node.querySelector('figcaption')
        ? node.querySelector('figcaption')
        : null;
    const caption = captionNode
      ? decodeEntities(captionNode.text || captionNode.innerText || '')
      : decodeEntities(imgNode.getAttribute('title') || '');

    return { sources, alt, caption };
  };

  const uploadImageWithFallback = async (sources) => {
    for (const source of sources) {
      const uploaded = await uploadImageFromUrl(
        source,
        filenameFromUrl(source),
      );
      if (uploaded) return uploaded;
    }
    return undefined;
  };

  const nodeToBlock = async (node) => {
    if (node.nodeType === 3) {
      const text = node.rawText?.trim();
      if (!text) return null;
      return {
        _key: genKey(),
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _key: genKey(),
            _type: 'span',
            text,
            marks: [],
          },
        ],
      };
    }

    if (node.nodeType !== 1) return null;

    const imageInfo = findImageInfo(node);
    if (imageInfo) {
      const uploaded = await uploadImageWithFallback(imageInfo.sources);
      if (!uploaded) return null;
      return {
        _key: genKey(),
        ...uploaded,
        alt: imageInfo.alt || imageInfo.caption || '',
        caption: imageInfo.caption || '',
      };
    }

    const tag = (node.tagName || '').toLowerCase();
    const markDefs = [];
    const styleMap = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      blockquote: 'blockquote',
    };

    if (tag === 'ul' || tag === 'ol') {
      const listItemStyle = tag === 'ul' ? 'bullet' : 'number';
      const items = node.childNodes.filter(
        (child) => child.tagName?.toLowerCase() === 'li',
      );

      const listBlocks = [];
      for (const item of items) {
        const children = buildSpans(item, [], markDefs);
        if (!children.length) continue;
        listBlocks.push({
          _key: genKey(),
          _type: 'block',
          style: 'normal',
          listItem: listItemStyle,
          markDefs,
          children,
        });
      }
      return listBlocks;
    }

    const style = styleMap[tag] || 'normal';
    const children = buildSpans(node, [], markDefs);
    if (!children.length) return null;

    return {
      _key: genKey(),
      _type: 'block',
      style,
      markDefs,
      children,
    };
  };

  for (const node of root.childNodes) {
    const blockOrBlocks = await nodeToBlock(node);
    if (Array.isArray(blockOrBlocks)) {
      blocks.push(...blockOrBlocks);
    } else if (blockOrBlocks) {
      blocks.push(blockOrBlocks);
    }
  }

  return blocks;
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
      params: { page, per_page: PAGE_SIZE, _embed: true, order: 'asc' },
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
    title: stripHtml(post.title?.rendered),
    excerpt: stripHtml(post.excerpt?.rendered),
    tags: extractTags(post),
    content: await htmlToPortableText(post.content?.rendered),
    image,
    publishedAt: new Date(post.date_gmt || post.date || Date.now()).toISOString(),
    author: authorRef,
  };
};

async function migrate() {
  const posts = await fetchAllPosts();

  let success = 0;
  let failures = 0;

  for (const post of posts) {
    try {
      const doc = await mapPostToSanity(post);
      await sanity.createOrReplace(doc);
      success += 1;
    } catch (error) {
      console.error(`❌ Failed "${post.slug || post.id}": ${error.message}`);
      failures += 1;
    }
  }

}

migrate().catch((error) => {
  console.error('❌ Migration aborted:', error);
  process.exit(1);
});

