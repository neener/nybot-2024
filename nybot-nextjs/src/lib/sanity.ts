import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fallbackProjectID', // Ensure fallback if env is missing
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', // Default to production dataset
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION, // The API version from your .env file
  useCdn: true,  // Set to true for faster response times (good for public data)
});