/**
 * Date helpers — pure, deterministic, and locale-fixed to pt-BR /
 * America/Sao_Paulo so the output does not depend on the machine that
 * runs the build. All functions accept `Date` objects (Astro's content
 * loader already coerces frontmatter strings via `z.coerce.date()`).
 */

const TZ = 'America/Sao_Paulo';
const LOCALE = 'pt-BR';

const weekdayFmt = new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, weekday: 'short' });

const monthYearFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  month: 'long',
  year: 'numeric',
});

const timeFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  hour: '2-digit',
  minute: '2-digit',
});

const partsFmt = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function clean(value: string): string {
  // pt-BR short formats append a trailing dot to abbreviations ("sáb.").
  return value.replace(/\./g, '').replace(/\s+/g, ' ').trim();
}

export interface DateParts {
  /** Two-digit day, e.g. "14". */
  day: string;
  /** Three-letter lowercase month, e.g. "mar". */
  month: string;
  /** Four-digit year, e.g. "2026". */
  year: string;
}

/** Split a date into display parts in the fixed locale/timezone. */
export function getDateParts(date: Date): DateParts {
  const map: Record<string, string> = {};
  for (const part of partsFmt.formatToParts(date)) {
    if (part.type !== 'literal') map[part.type] = part.value;
  }
  return {
    day: map.day ?? '',
    month: clean(map.month ?? ''),
    year: map.year ?? '',
  };
}

/** e.g. "sáb 14 mar 2026" (components are uppercased in the UI via CSS). */
export function formatEventDate(date: Date): string {
  const parts = getDateParts(date);
  return `${clean(weekdayFmt.format(date))} ${parts.day} ${parts.month} ${parts.year}`;
}

/** e.g. "março 2026". */
export function formatMonthYear(date: Date): string {
  return clean(monthYearFmt.format(date));
}

/** e.g. "23:00". */
export function formatTime(date: Date): string {
  return timeFmt.format(date);
}

/** Value for a <time datetime="…"> attribute (UTC ISO 8601). */
export function toDatetimeAttr(date: Date): string {
  return date.toISOString();
}

/** UTC timestamp for an .ics VEVENT, e.g. "20260314T230000Z". */
export function toIcsTimestamp(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

/** True when `date` is strictly in the future relative to `now`. */
export function isUpcoming(date: Date, now: Date = new Date()): boolean {
  return date.getTime() > now.getTime();
}

export function compareByDateAsc(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}

export function compareByDateDesc(a: Date, b: Date): number {
  return b.getTime() - a.getTime();
}
