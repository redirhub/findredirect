import { defineField, defineType } from 'sanity'
import { LANGUAGES, defaultLocale, getLocaleLabel } from '../../config/i18n'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page Title',
      description: 'Main H1 title for the tool page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'URL Slug',
      description: 'URL path (e.g., "redirect-checker" becomes /redirect-checker)',
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
              _type == "page" &&
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
      name: 'metaTitle',
      type: 'string',
      title: 'Meta Title',
      description: 'SEO meta title (appears in search results)',
      validation: (rule) => rule.max(60).warning('Should be 60 characters or less'),
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      title: 'Meta Description',
      description: 'SEO meta description (appears in search results)',
      validation: (rule) => rule.max(160).warning('Should be 160 characters or less'),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      description: 'Page category for organizing footer links',
      options: {
        list: [
          { title: 'Tools', value: 'tools' },
          { title: 'Company', value: 'company' },
          { title: 'Resources', value: 'resources' },
        ],
        layout: 'radio',
      },
      initialValue: 'tools',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'widget',
      type: 'string',
      title: 'Widget Type',
      description: 'Which tool widget to display (select "None" for regular content pages)',
      options: {
        list: [
          { title: 'Redirect Checker', value: 'redirect' },
          { title: 'Block Checker', value: 'block' },
          { title: 'None (Content Page)', value: 'none' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'heroIcon',
      type: 'string',
      title: 'Hero Icon',
      description: 'React icon name (e.g., FaLink, FaBan) - Only for tool pages',
      initialValue: 'FaLink',
      hidden: ({ document }) => document?.widget === 'none',
    }),
    defineField({
      name: 'heroHeading',
      type: 'string',
      title: 'Hero Heading',
      description: 'Main heading displayed above the widget - Only for tool pages',
      hidden: ({ document }) => document?.widget === 'none',
    }),
    defineField({
      name: 'heroDescription',
      type: 'text',
      title: 'Hero Description',
      description: 'Description text displayed below the hero heading - Only for tool pages',
      hidden: ({ document }) => document?.widget === 'none',
    }),
    defineField({
      name: 'widgetConfig',
      type: 'array',
      title: 'Widget Configuration',
      description: 'Key-value configuration for the widget (e.g., key: "buttonText", value: "Check Now" or key: "examples", value: "url1,url2,url3")',
      hidden: ({ document }) => document?.widget === 'none',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'key',
              type: 'string',
              title: 'Key',
              description: 'Configuration key (e.g., buttonText, examples, placeholder)',
              validation: (rule) => rule.required(),
            },
            {
              name: 'value',
              type: 'text',
              title: 'Value',
              description: 'Configuration value (use comma-separated for lists)',
              rows: 2,
              validation: (rule) => rule.required(),
            },
          ],
          preview: {
            select: { key: 'key', value: 'value' },
            prepare({ key, value }) {
              return {
                title: key,
                subtitle: value?.length > 60 ? value.substring(0, 60) + '...' : value
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'contentBeforeWidget',
      type: 'array',
      title: 'Content Before Widget / Main Content',
      description: 'For tool pages: content before widget. For content pages: main page content',
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
      name: 'contentAfterWidget',
      type: 'array',
      title: 'Content After Widget',
      description: 'Optional content to display after the widget',
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
      name: 'faqs',
      title: 'FAQs (Optional)',
      type: 'array',
      description: 'Frequently Asked Questions (recommended: 5-10 for tool pages, optional for content pages)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              type: 'string',
              title: 'Question',
              validation: (rule) => rule.required(),
            },
            {
              name: 'answer',
              type: 'text',
              title: 'Answer',
              validation: (rule) => rule.required(),
            },
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle: subtitle?.length > 80
                  ? subtitle.substring(0, 80) + '...'
                  : subtitle
              }
            },
          },
        },
      ],
      validation: (rule) => rule.max(15),
    }),
    defineField({
      name: 'locale',
      type: 'string',
      title: 'Language',
      description: 'Language of this tool page',
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
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customStructuredData',
      type: 'text',
      title: 'Custom Structured Data (JSON-LD)',
      description: 'Optional: Custom schema.org JSON-LD (advanced use only)',
      rows: 10,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      locale: 'locale',
      category: 'category',
    },
    prepare({ title, slug, locale, category }) {
      return {
        title: title,
        subtitle: `${getLocaleLabel(locale)} • /${slug?.current || slug} • ${category || 'tools'}`,
      }
    },
  },
})
