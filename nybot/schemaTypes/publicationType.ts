import {defineField, defineType} from 'sanity'

export const publicationType = defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule
        .required()
        .error(`Required to generate a page on the website`),
      hidden: ({document}) => !document?.title,
    }),
    defineField({
      name: 'category',
      title: 'Original or Facsimile?',
      type: 'string',
      options: {
        list: [
          { title: 'Original', value: 'original'},
          { title: 'Facsimile', value: 'facsimile'}
        ],
        layout: 'dropdown'
      }
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [{
        type: 'image',
        fields: [
          {
            name: 'caption',
            type: 'string',
            title: 'Caption',
            options: {
              isHighlighted: true
            }
          },
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative Text',
            description: 'Important for SEO and accessibility.',
            options: {
              isHighlighted: true
            }
          },
        ]
      }]
    }),
    defineField({
      name: 'event',
      type: 'reference',
      to: [{ type: 'event'}]
    }),
    defineField({
      name: 'artists',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'artist' }],
        },
      ],
    }),
    defineField({
      name: 'location',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'location' }],
        },
      ],
    }),
    defineField({
      name: 'institution',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'institution' }],
        },
      ],
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'gallery' }],
        },
      ],
    }),
    defineField({
      name: 'business',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'business' }],
        },
      ],
    }),
    defineField({
      name: 'dimensions',
      type: 'string',
    }),
    defineField({
      name: 'editions',
      type: 'number',
    }),
    defineField({
      name: 'year',
      type: 'number',
    }),
    defineField({
      name: 'date',
      type: 'datetime',
    }),
    defineField({
      name: 'start_date',
      type: 'string',
    }),
    defineField({
      name: 'end_date',
      type: 'string',
    }),
    defineField({
      name: 'pdfFile',
      title: 'PDF File',
      type: 'file',
      options: {
        accept: '.pdf'
      }
    }),
    defineField({
      name: 'visibility',
      title: 'Visibility',
      type: 'string',
      options: {
        list: [
          { title: 'Public', value: 'public' },
          { title: 'Private', value: 'private' },
        ],
        layout: 'radio', // This makes it a radio button
      },
    })
  ],
})