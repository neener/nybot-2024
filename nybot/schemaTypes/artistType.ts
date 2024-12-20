import {defineField, defineType} from 'sanity'

export const artistType = defineType({
  name: 'artist',
  title: 'Artist',
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
      name: 'pseudonym',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    {
      name: 'relatedArtworks',
      title: 'Related Artworks',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'artwork' } }]
    },
    {
      name: 'relatedPublications',
      title: 'Related Publications',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'publication' } }]
    },
    {
      name: 'relatedHappenings',
      title: 'Related Happenings',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'happening' } }]
    },
    {
      name: 'relatedLocations',
      title: 'Related Locations',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'location' } }]
    },
    {
      name: 'relatedHoldings',
      title: 'Related Holdings',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'holding' } }],
    },
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
      name: 'about',
      title: 'About',
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
  ],
})