import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const css = readFileSync(
  fileURLToPath(new URL('../../src/styles/tokens.css', import.meta.url)),
  'utf8',
);

/** Read a `--name: #rrggbb;` literal out of tokens.css. */
function token(name: string): string {
  const hex = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
  if (!hex) throw new Error(`token --${name} not found as a hex literal`);
  return hex;
}

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const void_ = token('c-void');
const smoke = token('c-smoke');
const bone = token('c-bone');
const boneDim = token('c-bone-dim');
const ember = token('c-ember');
const emberBright = token('c-ember-bright');
const kush = token('c-kush');
const onAccent = token('text-on-accent');

describe('WCAG contrast of core token pairs', () => {
  it('primary text on the page background is AAA', () => {
    expect(contrast(bone, void_)).toBeGreaterThanOrEqual(7);
  });

  it('dimmed text on the page background is AA (>= 4.5)', () => {
    expect(contrast(boneDim, void_)).toBeGreaterThanOrEqual(4.5);
  });

  it('dimmed text on inset surfaces is AA', () => {
    expect(contrast(boneDim, smoke)).toBeGreaterThanOrEqual(4.5);
  });

  it('accent text on the background is AA', () => {
    expect(contrast(ember, void_)).toBeGreaterThanOrEqual(4.5);
  });

  it('the kush accent on the background is AA', () => {
    expect(contrast(kush, void_)).toBeGreaterThanOrEqual(4.5);
  });

  it('button label on the accent fill is AA', () => {
    expect(contrast(onAccent, ember)).toBeGreaterThanOrEqual(4.5);
  });

  it('focus ring vs background meets the 3:1 non-text threshold', () => {
    expect(contrast(emberBright, void_)).toBeGreaterThanOrEqual(3);
  });
});
