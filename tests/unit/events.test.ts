import { describe, it, expect } from 'vitest';
import { partitionEvents, nextEvent, type EventLike } from '../../src/lib/events';

const make = (iso: string, cancelled = false): EventLike & { id: string } => ({
  id: iso,
  data: { date: new Date(iso), cancelled },
});

const now = new Date('2026-06-15T12:00:00Z');

const events = [
  make('2026-01-10T23:00:00Z'), // past
  make('2026-06-20T23:00:00Z'), // upcoming
  make('2026-06-15T09:00:00Z'), // 3h before `now` — still upcoming (6h grace)
  make('2026-08-01T23:00:00Z', true), // upcoming but cancelled
  make('2026-03-03T23:00:00Z'), // past
];

describe('partitionEvents', () => {
  it('splits around now (with a 6h grace) and orders each side', () => {
    const { upcoming, past } = partitionEvents(events, now);
    expect(upcoming.map((e) => (e as { id: string }).id)).toEqual([
      '2026-06-15T09:00:00Z',
      '2026-06-20T23:00:00Z',
      '2026-08-01T23:00:00Z',
    ]);
    expect(past.map((e) => (e as { id: string }).id)).toEqual([
      '2026-03-03T23:00:00Z',
      '2026-01-10T23:00:00Z',
    ]);
  });

  it('does not mutate the input array', () => {
    const input = [...events];
    partitionEvents(input, now);
    expect(input).toEqual(events);
  });
});

describe('nextEvent', () => {
  it('returns the soonest upcoming event that is not cancelled', () => {
    const result = nextEvent(events, now) as (EventLike & { id: string }) | undefined;
    expect(result?.id).toBe('2026-06-15T09:00:00Z');
  });

  it('returns undefined when nothing is coming up', () => {
    const onlyPast = [make('2020-01-01T00:00:00Z')];
    expect(nextEvent(onlyPast, now)).toBeUndefined();
  });
});
