/**
 * schema.org / JSON-LD builders. Pure functions returning plain objects;
 * `Seo.astro` serialises them. `origin` is passed in so nothing here
 * depends on Astro globals (keeps it unit-testable).
 */
import { SITE } from './site';

type Json = Record<string, unknown>;

export function organizationSchema(origin: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: SITE.name,
    description: SITE.description,
    url: origin,
    genre: ['electronic', 'house', 'bass'],
    foundingLocation: { '@type': 'Place', name: SITE.city },
    logo: new URL('/favicon.png', origin).href,
  };
}

export function websiteSchema(origin: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: origin,
    inLanguage: SITE.locale,
  };
}

export interface EventSchemaInput {
  readonly title: string;
  readonly start: Date;
  readonly end?: Date | undefined;
  readonly venue: string;
  readonly city: string;
  readonly address?: string | undefined;
  readonly url: string;
  readonly cancelled: boolean;
  readonly lineup: readonly string[];
  readonly ticketUrl?: string | undefined;
  readonly image?: string | undefined;
  readonly description?: string | undefined;
}

export function eventSchema(input: EventSchemaInput, origin: string): Json {
  const schema: Json = {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: input.title,
    startDate: input.start.toISOString(),
    eventStatus: input.cancelled
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: input.url,
    location: {
      '@type': 'Place',
      name: input.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: input.city,
        ...(input.address ? { streetAddress: input.address } : {}),
      },
    },
    organizer: { '@type': 'Organization', name: SITE.name, url: origin },
  };
  if (input.end) schema.endDate = input.end.toISOString();
  if (input.description) schema.description = input.description;
  if (input.image) schema.image = new URL(input.image, origin).href;
  if (input.lineup.length > 0) {
    schema.performer = input.lineup.map((name) => ({ '@type': 'PerformingGroup', name }));
  }
  if (input.ticketUrl) {
    schema.offers = {
      '@type': 'Offer',
      url: input.ticketUrl,
      availability: input.cancelled ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    };
  }
  return schema;
}

export function breadcrumbSchema(
  trail: ReadonlyArray<{ name: string; path: string }>,
  origin: string,
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: new URL(crumb.path, origin).href,
    })),
  };
}
