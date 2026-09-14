import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { writeFileSync } from 'node:fs';
import type { AstroIntegration } from 'astro';
import { CSP_META_DIRECTIVES, SECURITY_HEADERS } from './src/lib/security';

/**
 * Production origin. Placeholder by default — `.example` is a reserved TLD
 * (RFC 2606) and is never a real site. Override at build time:
 *   SITE_URL=https://your-real-domain npm run build
 */
const SITE_URL = process.env.SITE_URL ?? 'https://kush-house.example';

/**
 * Emits `dist/_headers` from `src/lib/security.ts` so that module is the
 * single source of truth for security headers on Netlify. Cannot live in
 * `src/pages/` because Astro excludes `_`-prefixed routes.
 */
function netlifyHeaders(): AstroIntegration {
  return {
    name: 'kush-house:netlify-headers',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const security = Object.entries(SECURITY_HEADERS)
          .map(([name, value]) => `  ${name}: ${value}`)
          .join('\n');
        const body = `# Generated from src/lib/security.ts at build time — do not edit by hand.

/*
${security}

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/placeholder/*
  Cache-Control: public, max-age=604800
`;
        writeFileSync(new URL('_headers', dir), body, 'utf8');
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  compressHTML: true,
  prefetch: false,
  integrations: [sitemap({ filter: (page) => !page.includes('/legal') }), netlifyHeaders()],
  experimental: {
    // Astro hashes every inline <script> it emits and writes a per-page
    // <meta http-equiv="content-security-policy"> combining these directives
    // with `script-src 'self' <hashes>` and `style-src 'self'`.
    csp: {
      algorithm: 'SHA-256',
      directives: [...CSP_META_DIRECTIVES],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
  build: {
    // All component/global CSS ships as external files, so `style-src 'self'`
    // needs no hashes.
    inlineStylesheets: 'never',
    assets: '_astro',
  },
});
