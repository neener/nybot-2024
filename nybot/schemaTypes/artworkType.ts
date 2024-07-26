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
      type: 'array',
      of: [{type: 'block'}],
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
      name: 'artists',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'artist' }],
        },
      ],
    }),
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
    }
  ],
})