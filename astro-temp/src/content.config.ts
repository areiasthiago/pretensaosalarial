import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { categorias } from './src/data/categorias'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    description: z.string(),
    summary: z.string(),
    category: z.enum(
      categorias.map(c => c.label) as [string, ...string[]]
    ),
  }),
})

export const collections = { blog }