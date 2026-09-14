import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getEvents } from '../lib/collections';
import { compareByDateDesc } from '../lib/dates';
import { SITE } from '../lib/site';

export const GET: APIRoute = async (context) => {
  const events = (await getEvents()).sort((a, b) => compareByDateDesc(a.data.date, b.data.date));
  const site = context.site ?? new URL(SITE.origin);

  return rss({
    title: `${SITE.name} — Agenda`,
    description: SITE.description,
    site,
    trailingSlash: false,
    items: events.map((event) => ({
      title: event.data.title,
      pubDate: event.data.date,
      description: (
        event.data.blurb ??
        `${event.data.venue}, ${event.data.city}. ${event.data.lineup.join(', ')}`
      ).trim(),
      link: new URL(`/events#${event.id}`, site).href,
      categories: [event.data.cancelled ? 'cancelada' : 'agenda'],
    })),
    customData: '<language>pt-br</language>',
  });
};
