import { toIcsTimestamp } from './dates';

export interface IcsEvent {
  readonly uid: string;
  readonly title: string;
  readonly start: Date;
  readonly end?: Date | undefined;
  readonly location?: string | undefined;
  readonly description?: string | undefined;
  readonly url?: string | undefined;
}

/** RFC 5545 text escaping for property values. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Fold lines to <= 75 characters (RFC 5545 §3.1). Counts UTF-16 units,
 * not octets — close enough for the short ASCII-ish fields used here.
 */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let rest = line;
  chunks.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 74) {
    chunks.push(' ' + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  if (rest.length > 0) chunks.push(' ' + rest);
  return chunks.join('\r\n');
}

/**
 * Build a single-event VCALENDAR. Deterministic given its inputs (no
 * wall-clock `DTSTAMP`) so builds are reproducible and testable.
 */
export function buildIcs(event: IcsEvent): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KUSH HOUSE//Agenda//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escapeText(event.uid)}`,
    `DTSTAMP:${toIcsTimestamp(event.start)}`,
    `DTSTART:${toIcsTimestamp(event.start)}`,
    `DTEND:${toIcsTimestamp(event.end ?? new Date(event.start.getTime() + 4 * 60 * 60 * 1000))}`,
    `SUMMARY:${escapeText(event.title)}`,
  ];
  if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
  if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
  if (event.url) lines.push(`URL:${escapeText(event.url)}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.map(fold).join('\r\n') + '\r\n';
}
