import {defineField, defineType} from 'sanity'

export const holdingType = defineType({
  name: 'holding',
  title: 'Holding',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule
        .required()
        .error(`Required to generate a page on the website`),
      hidden: ({document}) => !document?.name,
    }),
    defineField({
      name: 'artist',
      type: 'reference',
      to: [{ type: 'artist'}]
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
      name: 'dimensions',
      type: 'string',
    }),
    defineField({
      name: 'medium',
      type: 'string',
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
      name: 'acquired',
      type: 'number',
    }),
    defineField({
      name: 'accession_number',
      type: 'number',
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
    }),
    defineField({
      name: 'seller',
      type: 'string',
    }),
    defineField({
      name: 'price_paid',
      type: 'number',
    }),
    defineField({
      name: 'value',
      type: 'number',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
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
    {
      name: 'relatedArtists',
      title: 'Related Artists',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'artist' } }]
    },
    {
      name: 'relatedPublications',
      title: 'Related Publications',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'publication' } }]
    },
    {
      name: 'relatedLocations',
      title: 'Related Locations',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'location' } }]
    },
    {
      name: 'relatedHappenings',
      title: 'Related Happenings',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'happening' } }]
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
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Painting', value: 'painting' },
          { title: 'Drawing', value: 'drawing' },
          { title: 'Sculpture', value: 'sculpture' },
          { title: 'Performance', value: 'performance' },
          { title: 'Installation', value: 'installation' },
          { title: 'Book', value: 'book' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'tags', // Allows you to add multiple options as tags
      },
    }),
  ],
})