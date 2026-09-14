import { getCollection, type CollectionEntry } from 'astro:content';
import { compareByDateDesc } from './dates';

/** All events, unsorted (callers partition via `partitionEvents`). */
export async function getEvents(): Promise<CollectionEntry<'events'>[]> {
  return getCollection('events');
}

/** Residents/guests ordered by `order`, then name (pt-BR collation). */
export async function getArtists(): Promise<CollectionEntry<'artists'>[]> {
  const all = await getCollection('artists');
  return all.sort(
    (a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name, 'pt-BR'),
  );
}

/** Mixes, newest first. */
export async function getMixes(): Promise<CollectionEntry<'mixes'>[]> {
  const all = await getCollection('mixes');
  return all.sort((a, b) => compareByDateDesc(a.data.date, b.data.date));
}

/** Photo galleries, newest first. */
export async function getGalleries(): Promise<CollectionEntry<'gallery'>[]> {
  const all = await getCollection('gallery');
  return all.sort((a, b) => compareByDateDesc(a.data.date, b.data.date));
}
