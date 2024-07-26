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
    defineField({
      name: 'artwork',
      type: 'reference',
      to: [{ type: 'artwork'}]
    }),
    defineField({
      name: 'publication',
      type: 'reference',
      to: [{ type: 'publication'}]
    }),
    defineField({
      name: 'event',
      type: 'reference',
      to: [{ type: 'event'}]
    }),
    defineField({
      name: 'location',
      type: 'reference',
      to: [{ type: 'location'}]
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
      name: 'about',
      type: 'array',
      of: [{type: 'block'}],
    })
  ],
})