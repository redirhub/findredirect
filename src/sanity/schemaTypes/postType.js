import {defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'locale',
      type: 'string',
      title: 'Language',
      description: 'Language of this document',
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: 'Spanish', value: 'es'},
          {title: 'French', value: 'fr'},
          {title: 'German', value: 'de'},
          {title: 'Italian', value: 'it'},
          {title: 'Chinese', value: 'zh'},
          {title: 'Arabic', value: 'ar'},
          {title: 'Japanese', value: 'ja'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'baseSlug',
      type: 'string',
      title: 'Base Slug',
      description: 'Common slug shared across all language versions',
      validation: (rule) => rule.required(),
    }),
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
      options: {source: 'title'},
      validation: (rule) => rule.required(),
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
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [{type: 'block'}],
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
      to: [{type: 'author'}],
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
            {name: 'question', type: 'string', title: 'Question'},
            {name: 'answer', type: 'text', title: 'Answer'},
          ],
          preview: {
            select: {title: 'question', subtitle: 'answer'},
            prepare({title, subtitle}) {
              return {title, subtitle}
            },
          },
        },
      ],
      validation: (rule) => rule.max(5),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      locale: 'locale',
      baseSlug: 'baseSlug',
      media: 'image',
    },
    prepare({title, locale, baseSlug, media}) {
      const localeLabels = {
        en: '🇬🇧 EN',
        es: '🇪🇸 ES',
        fr: '🇫🇷 FR',
        de: '🇩🇪 DE',
        it: '🇮🇹 IT',
        zh: '🇨🇳 ZH',
        ar: '🇸🇦 AR',
        ja: '🇯🇵 JA',
      }
      return {
        title: title,
        subtitle: `${localeLabels[locale] || locale} • ${baseSlug}`,
        media,
      }
    },
  },
})