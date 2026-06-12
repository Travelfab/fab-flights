import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const destinations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/destinations' }),
  schema: z.object({
    country: z.string(),
    title: z.string(),
    flag: z.string(),
    cities: z.array(z.string()).min(1),
    heroLine: z.string(),
    waText: z.string(),
    priceNote: z.string().default('Consultar — cotizamos al mejor precio del día'),
    order: z.number().int(),
    factsVerified: z.boolean().default(false),
  }),
});

export const collections = { destinations };
