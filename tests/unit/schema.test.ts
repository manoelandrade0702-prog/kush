import { describe, it, expect } from 'vitest';
import { eventSchema, organizationSchema, breadcrumbSchema } from '../../src/lib/schema';

const origin = 'https://kush-house.example';

describe('eventSchema', () => {
  const input = {
    title: 'Cavernas',
    start: new Date('2026-03-15T02:00:00Z'),
    end: new Date('2026-03-15T09:00:00Z'),
    venue: 'Galpão 7',
    city: 'São Paulo',
    url: `${origin}/events#cavernas`,
    cancelled: false,
    lineup: ['DK', 'Nhã'],
    ticketUrl: 'https://example.com/ingressos',
  };

  it('is a MusicEvent with ISO dates and a place', () => {
    const s = eventSchema(input, origin) as Record<string, unknown>;
    expect(s['@type']).toBe('MusicEvent');
    expect(s.startDate).toBe('2026-03-15T02:00:00.000Z');
    expect(s.endDate).toBe('2026-03-15T09:00:00.000Z');
    expect((s.location as { name: string }).name).toBe('Galpão 7');
  });

  it('maps performers from the line-up', () => {
    const s = eventSchema(input, origin) as Record<string, unknown>;
    expect(s.performer).toHaveLength(2);
  });

  it('reflects cancellation in status and offer availability', () => {
    const s = eventSchema({ ...input, cancelled: true }, origin) as Record<string, unknown>;
    expect(s.eventStatus).toBe('https://schema.org/EventCancelled');
    expect((s.offers as { availability: string }).availability).toBe('https://schema.org/SoldOut');
  });

  it('omits offers when there is no ticket URL', () => {
    const { ticketUrl: _omit, ...noTicket } = input;
    const s = eventSchema(noTicket, origin) as Record<string, unknown>;
    expect(s.offers).toBeUndefined();
  });
});

describe('other builders', () => {
  it('organizationSchema is a MusicGroup rooted at the origin', () => {
    const s = organizationSchema(origin);
    expect(s['@type']).toBe('MusicGroup');
    expect(s.url).toBe(origin);
  });

  it('breadcrumbSchema numbers positions from 1 and absolutises paths', () => {
    const s = breadcrumbSchema(
      [
        { name: 'Início', path: '/' },
        { name: 'Agenda', path: '/events' },
      ],
      origin,
    ) as { itemListElement: Array<{ position: number; item: string }> };
    expect(s.itemListElement[0]?.position).toBe(1);
    expect(s.itemListElement[1]?.item).toBe(`${origin}/events`);
  });
});
