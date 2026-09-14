import { describe, it, expect } from 'vitest';
import { CSP_META_DIRECTIVES, EDGE_CSP, SECURITY_HEADERS } from '../../src/lib/security';

describe('CSP meta directives (Astro appends script-src/style-src hashes)', () => {
  const joined = CSP_META_DIRECTIVES.join('; ');

  it('never allows inline, eval or a wildcard source', () => {
    expect(joined).not.toContain("'unsafe-inline'");
    expect(joined).not.toContain("'unsafe-eval'");
    expect(joined).not.toMatch(/(^|[\s;])\*([\s;]|$)/);
  });

  it('locks the fetch directives to self or none', () => {
    expect(CSP_META_DIRECTIVES).toContain("default-src 'self'");
    expect(CSP_META_DIRECTIVES).toContain("base-uri 'self'");
    expect(CSP_META_DIRECTIVES).toContain("object-src 'none'");
    expect(CSP_META_DIRECTIVES).toContain("frame-src 'none'");
    expect(CSP_META_DIRECTIVES).toContain('upgrade-insecure-requests');
  });

  it('does not try to set script-src/style-src (Astro owns those)', () => {
    expect(joined).not.toMatch(/script-src/);
    expect(joined).not.toMatch(/style-src/);
  });
});

describe('edge CSP (response header)', () => {
  it('only carries what a <meta> cannot express, with no conflicting fetch directive', () => {
    expect(EDGE_CSP).toContain("frame-ancestors 'none'");
    expect(EDGE_CSP).not.toMatch(/(?:^|;\s*)(?:default|script|style)-src/);
  });
});

describe('SECURITY_HEADERS', () => {
  it('carries the expected hardening headers', () => {
    expect(SECURITY_HEADERS['X-Content-Type-Options']).toBe('nosniff');
    expect(SECURITY_HEADERS['X-Frame-Options']).toBe('DENY');
    expect(SECURITY_HEADERS['Strict-Transport-Security']).toMatch(/max-age=\d+/);
    expect(SECURITY_HEADERS['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(SECURITY_HEADERS['Permissions-Policy']).toContain('geolocation=()');
    expect(SECURITY_HEADERS['Content-Security-Policy']).toBe(EDGE_CSP);
    expect(SECURITY_HEADERS['Cross-Origin-Opener-Policy']).toBe('same-origin');
  });
});
