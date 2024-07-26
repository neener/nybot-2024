import {defineField, defineType} from 'sanity'

export const galleryType = defineType({
  name: 'gallery',
  title: 'Gallery',
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
      name: 'address',
      type: 'string',
    }),
    defineField({
      name: 'location',
      type: 'reference',
      to: [{ type: 'location'}]
    }),
    defineField({
      name: 'artist',
      type: 'reference',
      to: [{ type: 'artist'}]
    })
  ],
})