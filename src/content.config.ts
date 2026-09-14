import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Path to an image under `public/`. Kept as a string (not the `image()`
 * helper) because the seed set is SVG placeholder art that needs no
 * transform; swap in real photos by dropping files in `public/` and
 * updating the frontmatter path.
 */
const publicImage = z
  .string()
  .refine((v) => v.startsWith('/'), { message: 'must be an absolute /public path' });

const events = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string().min(1),
    /** Local start time with offset, e.g. 2026-03-14T23:00:00-03:00 */
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    venue: z.string().min(1),
    city: z.string().min(1),
    address: z.string().optional(),
    lineup: z.array(z.string()).default([]),
    /** Optional — omit entirely to hide the "ingressos" button. */
    ticketUrl: z.string().url().optional(),
    /** e.g. "18+". Omit for all-ages. */
    ageRestriction: z.string().optional(),
    cancelled: z.boolean().default(false),
    poster: publicImage.optional(),
    blurb: z.string().max(320).optional(),
    /** Flag seed data so the UI can badge it and tests can spot it. */
    placeholder: z.boolean().default(false),
  }),
});

const artists = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/artists' }),
  schema: z.object({
    name: z.string().min(1),
    role: z.enum(['Residente', 'Convidada', 'Convidado', 'Coletivo']).default('Residente'),
    genres: z.array(z.string()).default([]),
    bio: z.string().min(1),
    links: z
      .object({
        soundcloud: z.string().url().optional(),
        bandcamp: z.string().url().optional(),
        instagram: z.string().url().optional(),
        ra: z.string().url().optional(),
      })
      .default({}),
    photo: publicImage.optional(),
    order: z.number().int().nonnegative().default(99),
    placeholder: z.boolean().default(false),
  }),
});

const mixes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/mixes' }),
  schema: z.object({
    title: z.string().min(1),
    artist: z.string().min(1),
    date: z.coerce.date(),
    /** Display string, e.g. "58:12". */
    duration: z.string().regex(/^\d{1,3}:\d{2}$/, 'use mm:ss or hh:mm:ss-ish "M:SS"'),
    /** External player link — opened in a new tab, never embedded. */
    listenUrl: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    placeholder: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/gallery' }),
  schema: z.object({
    event: z.string().min(1),
    date: z.coerce.date(),
    photographer: z.string().optional(),
    photos: z
      .array(
        z.object({
          src: publicImage,
          alt: z.string().min(1, 'every photo needs descriptive alt text'),
          width: z.number().int().positive().default(1200),
          height: z.number().int().positive().default(800),
        }),
      )
      .min(1),
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { events, artists, mixes, gallery };
