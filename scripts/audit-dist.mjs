/**
 * Post-build gate. Fails `npm run build` if the emitted static site would
 * weaken its own security posture:
 *
 *   - every page carries a <meta http-equiv="content-security-policy">
 *     that includes every directive from `CSP_META_DIRECTIVES`, keeps
 *     `script-src`/`style-src` on `'self'` + hashes only, and never
 *     contains 'unsafe-inline' / 'unsafe-eval' / '*'
 *   - no page ships a <style> element, a style="" attribute or an on*=""
 *     handler (all of which a hash-based CSP cannot cover)
 *   - dist/_headers exists and matches `SECURITY_HEADERS`
 *   - sitemap, RSS, 404, icons present
 *   - nothing ships a TODO/FIXME/XXX marker
 *
 * Imports the .ts source directly (Node >= 22.6 strips types).
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSP_META_DIRECTIVES, SECURITY_HEADERS } from '../src/lib/security.ts';

const dist = join(fileURLToPath(new URL('..', import.meta.url)), 'dist');
const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

if (!existsSync(dist)) {
  console.error('audit-dist: dist/ not found — run `astro build` first.');
  process.exit(1);
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(dist);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const rel = (f) => relative(dist, f).replace(/\\/g, '/');
if (htmlFiles.length === 0) fail('no .html files in dist/');

const STYLE_EL = /<style[\s>]/i;
const STYLE_ATTR = /\sstyle=["']/i;
const HANDLER_ATTR = /\son[a-z]+=["']/i;
// CSP values use single quotes, so the attribute must be delimited by ".
const CSP_META = /<meta[^>]+http-equiv=["']content-security-policy["'][^>]*content="([^"]+)"/i;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const name = rel(file);

  if (STYLE_EL.test(html)) fail(`${name}: <style> element (a hashed CSP cannot cover it)`);
  if (STYLE_ATTR.test(html)) fail(`${name}: style="" attribute`);
  if (HANDLER_ATTR.test(html)) fail(`${name}: on*="" event handler attribute`);

  if (!/<html[^>]+\blang=/i.test(html)) fail(`${name}: <html> missing lang`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${name}: empty or missing <title>`);
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) fail(`${name}: missing viewport meta`);
  if (!/<meta[^>]+name=["']description["']/i.test(html)) warn(`${name}: missing meta description`);

  const csp = html.match(CSP_META)?.[1];
  if (!csp) {
    fail(`${name}: missing <meta http-equiv="content-security-policy">`);
    continue;
  }
  for (const directive of CSP_META_DIRECTIVES) {
    if (!csp.includes(directive)) fail(`${name}: CSP missing "${directive}"`);
  }
  for (const forbidden of ["'unsafe-inline'", "'unsafe-eval'"]) {
    if (csp.includes(forbidden)) fail(`${name}: CSP contains ${forbidden}`);
  }
  if (/(?:^|[\s;])\*(?:[\s;]|$)/.test(csp)) fail(`${name}: CSP contains a bare "*" source`);
  if (!/script-src[^;]*'self'/.test(csp)) fail(`${name}: CSP script-src is not 'self'-based`);
  if (!/script-src[^;]*'sha256-/.test(csp)) {
    fail(`${name}: CSP script-src has no inline-script hash (Astro CSP not applied?)`);
  }
  if (!/style-src[^;]*'self'/.test(csp)) fail(`${name}: CSP style-src is not 'self'-based`);
}

// ---- dist/_headers matches security.ts ---------------------------------

const headersPath = join(dist, '_headers');
if (!existsSync(headersPath)) {
  fail('dist/_headers not generated');
} else {
  const headers = readFileSync(headersPath, 'utf8');
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.includes(`${key}: ${value}`)) fail(`dist/_headers missing or wrong "${key}"`);
  }
}

// ---- required artifacts ----------------------------------------------

for (const required of [
  'sitemap-index.xml',
  'rss.xml',
  '404.html',
  'favicon.svg',
  'favicon.png',
  'apple-touch-icon.png',
  'og.png',
  'site.webmanifest',
  'robots.txt',
]) {
  if (!existsSync(join(dist, required))) fail(`dist/${required} missing`);
}

// ---- no TODO markers shipped ---------------------------------------

const TOKEN = /\b(?:TODO|FIXME|XXX)\b/;
for (const file of files) {
  if (!['.html', '.css', '.js', '.xml', '.svg', '.webmanifest'].includes(extname(file))) continue;
  if (TOKEN.test(readFileSync(file, 'utf8'))) fail(`${rel(file)}: ships a TODO/FIXME/XXX marker`);
}

// ---- JS weight (informational) ------------------------------------

let rawJs = 0;
for (const file of files.filter((f) => f.endsWith('.js'))) rawJs += readFileSync(file).byteLength;
let inlineJs = 0;
for (const file of htmlFiles) {
  for (const m of readFileSync(file, 'utf8').matchAll(
    /<script\b(?![^>]*\btype=["'](?:application\/(?:ld\+json|json)|importmap)["'])[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    inlineJs += Buffer.byteLength(m[1] ?? '');
  }
}
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log(
  `audit-dist: ${htmlFiles.length} pages · external JS ${kb(rawJs)} · inline JS ${kb(inlineJs)} (largest page, not summed)`,
);
if (inlineJs > 90 * 1024) warn(`inline JS totals ${kb(inlineJs)} across pages (> 90 KB)`);

// ---- report --------------------------------------------------------

for (const w of warnings) console.warn(`  warn  ${w}`);
if (errors.length > 0) {
  for (const e of errors) console.error(`  FAIL  ${e}`);
  console.error(`\naudit-dist: ${errors.length} failure(s).`);
  process.exit(1);
}
console.log('audit-dist: OK');
