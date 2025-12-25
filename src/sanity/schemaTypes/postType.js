import { defineField, defineType } from 'sanity'
import { LANGUAGES, defaultLocale, getLocaleLabel } from '../../config/i18n'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'URL slug - identical across all language versions of this article',
      options: {
        source: 'title',
        isUnique: (slug, context) => {
          const { document, getClient } = context;
          const locale = document?.locale || 'en';
          const docId = document?._id || '';

          // Handle both draft and published IDs
          const publishedId = docId.replace(/^drafts\./, '');
          const draftId = `drafts.${publishedId}`;

          const client = getClient({ apiVersion: '2024-01-01' });

          const query = `
            !defined(*[
              _type == "post" &&
              slug.current == $slug &&
              locale == $locale &&
              !(_id in [$publishedId, $draftId])
            ][0]._id)
          `;

          return client.fetch(query, { slug, locale, publishedId, draftId });
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceSlug',
      type: 'string',
      title: 'Source Slug (Deprecated)',
      description: 'DEPRECATED: No longer used. All translations now share the same slug.',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
      description: 'A brief description of the post',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [ { type: 'string' } ],
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description: 'Helpful for accessibility and SEO',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Featured Image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      title: 'Author',
      to: [ { type: 'author' } ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      description: 'Optional: 1–5 FAQs for this article',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', title: 'Question' },
            { name: 'answer', type: 'text', title: 'Answer' },
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' },
            prepare({ title, subtitle }) {
              return { title, subtitle }
            },
          },
        },
      ],
      validation: (rule) => rule.max(5),
    }),
    defineField({
      name: 'locale',
      type: 'string',
      title: 'Language',
      description: 'Language of this document',
      options: {
        list: LANGUAGES.map(lang => ({
          title: lang.nativeName || lang.title,
          value: lang.id,
        })),
        layout: 'dropdown',
      },
      initialValue: defaultLocale,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'needsTranslation',
      type: 'boolean',
      title: 'Needs Translation',
      description: 'Auto translate post in background',
      initialValue: false,
      hidden: ({ document }) => document?.locale !== 'en',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      locale: 'locale',
      slug: 'slug',
      media: 'image',
    },
    prepare({ title, locale, slug, media }) {
      return {
        title: title,
        subtitle: `${getLocaleLabel(locale)} • ${slug?.current || slug}`,
        media,
      }
    },
  },
})