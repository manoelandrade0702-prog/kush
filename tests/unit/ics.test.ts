import { describe, it, expect } from 'vitest';
import { buildIcs } from '../../src/lib/ics';

const base = {
  uid: 'cavernas@kush-house',
  title: 'KUSH HOUSE — Cavernas; parte 2',
  start: new Date('2026-03-15T02:00:00Z'),
  end: new Date('2026-03-15T09:00:00Z'),
  location: 'Galpão 7, São Paulo',
  description: 'Linha 1\nLinha 2, com vírgula',
  url: 'https://kush-house.example/events#cavernas',
};

describe('buildIcs', () => {
  const ics = buildIcs(base);

  it('wraps a single VEVENT in a VCALENDAR', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
    expect((ics.match(/BEGIN:VEVENT/g) ?? []).length).toBe(1);
  });

  it('uses CRLF line endings', () => {
    const lines = ics.split('\r\n');
    expect(lines.length).toBeGreaterThan(8);
    expect(ics.split('\n').every((l) => l === '' || l.endsWith('\r'))).toBe(true);
  });

  it('escapes commas, semicolons and newlines in text values', () => {
    expect(ics).toContain('SUMMARY:KUSH HOUSE — Cavernas\\; parte 2');
    expect(ics).toContain('DESCRIPTION:Linha 1\\nLinha 2\\, com vírgula');
  });

  it('emits compact UTC timestamps', () => {
    expect(ics).toContain('DTSTART:20260315T020000Z');
    expect(ics).toContain('DTEND:20260315T090000Z');
  });

  it('defaults DTEND to +4h when no end is given', () => {
    const noEnd = buildIcs({ ...base, end: undefined });
    expect(noEnd).toContain('DTEND:20260315T060000Z');
  });

  it('folds long lines at 75 octets', () => {
    const longUrl = `https://kush-house.example/events#${'x'.repeat(120)}`;
    const folded = buildIcs({ ...base, url: longUrl });
    for (const line of folded.split('\r\n')) {
      // continuation lines start with a single space
      expect(line.length).toBeLessThanOrEqual(75);
    }
  });
});
