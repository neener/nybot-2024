import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fallbackProjectID', // Ensure fallback if env is missing
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', // Default to production dataset
  apiVersion: '2023-07-24',
  useCdn: process.env.NODE_ENV === 'production', // Enable CDN for production
});