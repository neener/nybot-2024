import {defineField, defineType} from 'sanity'

export const artworkType = defineType({
  name: 'artwork',
  title: 'Artwork',
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
      name: 'dimensions',
      type: 'string',
    }),
    defineField({
      name: 'medium',
      type: 'string',
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
    defineField({
      name: 'videoUrls',
      title: 'Video URLs',
      type: 'array',
      of: [{ type: 'url' }],
      options: {
        layout: 'tags' // optional: makes the input look more compact
      }
    }),
    defineField({
      name: 'press',
      title: 'Press',
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
      name: 'available',
      title: 'Available',
      type: 'string',
      options: {
        list: [
          { title: 'Yes', value: 'yes' },
          { title: 'No', value: 'no' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'availabilityInfo',
      title: 'Availability Info',
      type: 'text',
      description: 'Provide additional details about availability.',
    }),
    {
      name: 'relatedLocations',
      title: 'Related Locations',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'location' } }]
    },
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
    {
      name: 'access',
      title: 'Access',
      type: 'string',
      options: {
        list: [
          { title: 'Public', value: 'public' },
          { title: 'Private', value: 'private' }
        ],
        layout: 'radio' 
      }
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