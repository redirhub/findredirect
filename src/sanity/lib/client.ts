import { createClient, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// Read client (CDN-enabled for fast reads)
export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

// Write client (for mutations and fresh queries)
export const writeClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
