import {defineField, defineType} from 'sanity'

export const businessType = defineType({
  name: 'business',
  title: 'Business',
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
      name: 'address',
      type: 'string',
    }),
    defineField({
      name: 'location',
      type: 'reference',
      to: [{ type: 'location'}]
    })
  ],
})