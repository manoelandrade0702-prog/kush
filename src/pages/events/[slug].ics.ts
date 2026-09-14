import type { APIRoute, GetStaticPaths } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { buildIcs } from '../../lib/ics';
import { SITE } from '../../lib/site';

interface RouteProps {
  event: CollectionEntry<'events'>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await getCollection('events');
  return events.map((event) => ({
    params: { slug: event.id },
    props: { event } satisfies RouteProps,
  }));
};

export const GET: APIRoute = ({ props, site }) => {
  const { event } = props as RouteProps;
  const origin = site ? site.origin : new URL(SITE.origin).origin;

  const ics = buildIcs({
    uid: `${event.id}@kush-house`,
    title: `${SITE.name} — ${event.data.title}`,
    start: event.data.date,
    end: event.data.endDate,
    location: [event.data.venue, event.data.address, event.data.city].filter(Boolean).join(', '),
    description:
      event.data.blurb ??
      (event.data.lineup.length > 0 ? `Line-up: ${event.data.lineup.join(', ')}` : SITE.name),
    url: new URL(`/events#${event.id}`, origin).href,
  });

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.id}.ics"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
