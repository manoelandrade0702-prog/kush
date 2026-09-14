import { describe, it, expect } from 'vitest';
import {
  compareByDateAsc,
  compareByDateDesc,
  formatEventDate,
  formatMonthYear,
  formatTime,
  getDateParts,
  isUpcoming,
  toIcsTimestamp,
} from '../../src/lib/dates';

// 2026-03-14 23:00 in America/Sao_Paulo (UTC-3) == 2026-03-15T02:00:00Z
const night = new Date('2026-03-15T02:00:00.000Z');

describe('date formatting (pt-BR / America/Sao_Paulo)', () => {
  it('keeps the local calendar day despite the UTC offset', () => {
    const parts = getDateParts(night);
    expect(parts.day).toBe('14');
    expect(parts.month).toBe('mar');
    expect(parts.year).toBe('2026');
  });

  it('formats a headline date without stray abbreviation dots', () => {
    const text = formatEventDate(night);
    expect(text).not.toContain('.');
    expect(text).toContain('14');
    expect(text).toContain('2026');
  });

  it('formats month + year in full', () => {
    expect(formatMonthYear(night)).toMatch(/^março (de )?2026$/);
  });

  it('formats local time', () => {
    expect(formatTime(night)).toBe('23:00');
  });
});

describe('date comparisons', () => {
  const a = new Date('2026-01-01T00:00:00Z');
  const b = new Date('2026-02-01T00:00:00Z');

  it('sorts ascending and descending', () => {
    expect(compareByDateAsc(a, b)).toBeLessThan(0);
    expect(compareByDateDesc(a, b)).toBeGreaterThan(0);
  });

  it('detects future dates relative to an injected now', () => {
    const now = new Date('2026-01-15T00:00:00Z');
    expect(isUpcoming(b, now)).toBe(true);
    expect(isUpcoming(a, now)).toBe(false);
  });
});

describe('toIcsTimestamp', () => {
  it('produces a compact UTC stamp', () => {
    expect(toIcsTimestamp(night)).toBe('20260315T020000Z');
  });
});
