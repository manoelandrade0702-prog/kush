import { compareByDateAsc, compareByDateDesc } from './dates';

/** The subset of an event entry these pure helpers need. */
export interface EventLike {
  readonly data: {
    readonly date: Date;
    readonly cancelled: boolean;
  };
}

export interface PartitionedEvents<T extends EventLike> {
  /** Now or in the future — chronological. Includes cancelled (badge them). */
  readonly upcoming: readonly T[];
  /** In the past — reverse-chronological. */
  readonly past: readonly T[];
}

/**
 * Split events into upcoming / past around `now`. An event is "upcoming"
 * until the day after its start (a night that begins at 23:00 should not
 * flip to "past" at midnight), i.e. we compare against `now - 6h`.
 */
export function partitionEvents<T extends EventLike>(
  events: readonly T[],
  now: Date = new Date(),
): PartitionedEvents<T> {
  const cutoff = now.getTime() - 6 * 60 * 60 * 1000;

  const upcoming = events
    .filter((e) => e.data.date.getTime() >= cutoff)
    .slice()
    .sort((a, b) => compareByDateAsc(a.data.date, b.data.date));

  const past = events
    .filter((e) => e.data.date.getTime() < cutoff)
    .slice()
    .sort((a, b) => compareByDateDesc(a.data.date, b.data.date));

  return { upcoming, past };
}

/** The next event that has not been cancelled, if any. */
export function nextEvent<T extends EventLike>(
  events: readonly T[],
  now: Date = new Date(),
): T | undefined {
  return partitionEvents(events, now).upcoming.find((e) => !e.data.cancelled);
}
