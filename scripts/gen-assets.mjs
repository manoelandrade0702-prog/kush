/**
 * Generates KUSH HOUSE placeholder art + icons. Deterministic: same seed
 * in, same bytes out, so the committed files never drift on re-run.
 *
 *   node scripts/gen-assets.mjs
 *
 * Outputs (all committed to the repo):
 *   public/favicon.svg
 *   public/favicon.png            96x96
 *   public/apple-touch-icon.png   180x180
 *   public/og.png                 1200x630
 *   public/placeholder/poster-*.svg   (4)  — event posters, 1200x1500
 *   public/placeholder/artist-*.svg   (6)  — portraits,      1200x1500
 *   public/placeholder/night-*.svg    (10) — gallery photos, 1500x1000
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const ph = join(pub, 'placeholder');
mkdirSync(ph, { recursive: true });

const VOID = '#09090a';
const INK = '#14141a';
const EMBER = '#ff6a2b';
const KUSH = '#77c043';
const BONE = '#f1ece3';

/** mulberry32 — tiny deterministic PRNG. */
function rng(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i += 1) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (r, list) => list[Math.floor(r() * list.length)];
const round = (n) => Math.round(n * 100) / 100;

function grainFilter(id, freq) {
  return `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"/>
      <feComposite operator="in" in2="SourceGraphic"/>
      <feBlend mode="screen" in2="SourceGraphic"/>
    </filter>`;
}

function artwork({ seed, w, h, glyph, accent }) {
  const r = rng(seed);
  const angle = Math.floor(r() * 360);
  const c1 = pick(r, [EMBER, KUSH, accent]);
  const cx = round(10 + r() * 80);
  const cy = round(10 + r() * 60);
  const blobR = round(30 + r() * 30);
  const barY = round(h * (0.55 + r() * 0.3));
  const barH = round(h * (0.02 + r() * 0.05));
  const rot = Math.floor(-8 + r() * 16);
  const fontSize = round(Math.min(w, h) * (0.9 + r() * 0.5));
  const gx = round(w * (0.1 + r() * 0.3));
  const gy = round(h * (0.7 + r() * 0.2));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <defs>
    <linearGradient id="bg" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0" stop-color="${VOID}"/>
      <stop offset="0.55" stop-color="${INK}"/>
      <stop offset="1" stop-color="${VOID}"/>
    </linearGradient>
    <radialGradient id="blob" cx="${cx}%" cy="${cy}%" r="${blobR}%">
      <stop offset="0" stop-color="${c1}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
    ${grainFilter('grain', round(0.7 + r() * 0.3))}
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#blob)"/>
  <g font-family="Archivo, Arial, sans-serif" font-weight="800" fill="${BONE}" fill-opacity="0.05">
    <text x="${gx}" y="${gy}" font-size="${fontSize}" transform="rotate(${rot} ${gx} ${gy})">${glyph}</text>
  </g>
  <rect x="0" y="${barY}" width="${w}" height="${barH}" fill="${c1}" fill-opacity="0.8" transform="rotate(${rot} ${w / 2} ${barY})"/>
  <rect width="${w}" height="${h}" filter="url(#grain)" fill="${BONE}" fill-opacity="0.5"/>
  <rect x="8" y="8" width="${w - 16}" height="${h - 16}" fill="none" stroke="${BONE}" stroke-opacity="0.12" stroke-width="2"/>
</svg>
`;
}

function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="10" fill="${VOID}"/>
  <path d="M20 14h9v15l12-15h11L37 32l16 18H41L29 34v16h-9z" fill="${EMBER}"/>
</svg>
`;
}

function iconPng(size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="${size >= 180 ? 12 : 10}" fill="${VOID}"/>
    <path d="M20 14h9v15l12-15h11L37 32l16 18H41L29 34v16h-9z" fill="${EMBER}"/>
  </svg>`;
  return sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
}

function ogPng() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <linearGradient id="g" gradientTransform="rotate(20 .5 .5)">
        <stop offset="0" stop-color="${VOID}"/><stop offset="0.6" stop-color="${INK}"/><stop offset="1" stop-color="${VOID}"/>
      </linearGradient>
      <radialGradient id="e" cx="18%" cy="0%" r="60%">
        <stop offset="0" stop-color="${EMBER}" stop-opacity="0.5"/><stop offset="1" stop-color="${EMBER}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <rect width="1200" height="630" fill="url(#e)"/>
    <g font-family="Archivo, Arial, sans-serif" font-weight="800" fill="${BONE}">
      <text x="80" y="330" font-size="150" letter-spacing="-4">KUSH</text>
      <text x="80" y="470" font-size="150" letter-spacing="-4" fill-opacity="0.55">HOUSE</text>
    </g>
    <text x="82" y="545" font-family="Archivo, Arial, sans-serif" font-weight="600" font-size="30"
      letter-spacing="6" fill="${EMBER}">COLETIVO DE MÚSICA — SÃO PAULO</text>
    <rect x="8" y="8" width="1184" height="614" fill="none" stroke="${BONE}" stroke-opacity="0.14" stroke-width="2"/>
  </svg>`;
  return sharp(Buffer.from(svg)).resize(1200, 630).png({ compressionLevel: 9 }).toBuffer();
}

async function main() {
  writeFileSync(join(pub, 'favicon.svg'), faviconSvg());
  writeFileSync(join(pub, 'favicon.png'), await iconPng(96));
  writeFileSync(join(pub, 'apple-touch-icon.png'), await iconPng(180));
  writeFileSync(join(pub, 'og.png'), await ogPng());

  const posters = ['CAVERNAS', 'RITUAL', 'BAIXO', 'ATÉ TARDE'];
  posters.forEach((glyph, i) => {
    writeFileSync(
      join(ph, `poster-${i + 1}.svg`),
      artwork({ seed: `poster-${glyph}`, w: 1200, h: 1500, glyph, accent: EMBER }),
    );
  });

  const artists = ['DK', 'NHÃ', 'RUÍDO', 'MParty', 'B.LIMA', 'TOTÓ'];
  artists.forEach((glyph, i) => {
    writeFileSync(
      join(ph, `artist-${i + 1}.svg`),
      artwork({ seed: `artist-${glyph}-v2`, w: 1200, h: 1500, glyph, accent: KUSH }),
    );
  });

  for (let i = 1; i <= 10; i += 1) {
    writeFileSync(
      join(ph, `night-${i}.svg`),
      artwork({
        seed: `night-${i}-frame`,
        w: 1500,
        h: 1000,
        glyph: 'KH',
        accent: i % 2 ? EMBER : KUSH,
      }),
    );
  }

  console.log('gen-assets: wrote icons + %d placeholders', 4 + 6 + 10);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
