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
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [{ title: 'Strong', value: 'strong' }],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
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
    {
      name: 'relatedHappenings',
      title: 'Related Happenings',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'happening' } }]
    },
    {
      name: 'relatedArtists',
      title: 'Related Artists',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'artist' } }]
    },
    {
      name: 'relatedLocations',
      title: 'Related Locations',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'location' } }]
    },
    {
      name: 'relatedInstitutions',
      title: 'Related Institutions',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'institution' } }]
    },
    {
      name: 'relatedGalleries',
      title: 'Related Galleries',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'gallery' } }]
    },
    {
      name: 'relatedBusinesses',
      title: 'Related Businesses',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'business' } }]
    },
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
        layout: 'radio', 
      },
    })
  ],
})