import {defineField, defineType} from 'sanity'

export const locationType = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({
      name: 'city',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'city'},
      validation: (rule) => rule
        .required()
        .error(`Required to generate a page on the website`),
      hidden: ({document}) => !document?.city,
    }),
    defineField({
      name: 'venue',
      type: 'string',
    }),
    defineField({
      name: 'happening',
      type: 'reference',
      to: [{ type: 'happening'}]
    }),
    defineField({
      name: 'artist',
      type: 'reference',
      to: [{ type: 'artist'}]
    }),
    defineField({
      name: 'publication',
      type: 'reference',
      to: [{ type: 'publication'}]
    })
  ],
})