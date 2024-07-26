import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'hd3sdon3',
  dataset: 'production',
  apiVersion: '2023-07-24', // use current UTC date
  useCdn: false,
});
