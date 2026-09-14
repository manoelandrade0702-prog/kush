import { describe, it, expect } from 'vitest';
import { isPlausibleEmail, buildNewsletterMailto } from '../../src/lib/mailto';

describe('isPlausibleEmail', () => {
  it.each(['a@b.co', 'nome.sobrenome@dominio.com.br', 'x_y+z@sub.exemplo.io'])(
    'accepts %s',
    (value) => {
      expect(isPlausibleEmail(value)).toBe(true);
    },
  );

  it.each(['', 'semarroba', 'a@b', 'a@b.', 'com espaco@x.com', 'a@@b.com', 'a@b .com'])(
    'rejects %s',
    (value) => {
      expect(isPlausibleEmail(value)).toBe(false);
    },
  );

  it('rejects absurdly long input', () => {
    expect(isPlausibleEmail(`${'a'.repeat(250)}@x.com`)).toBe(false);
  });
});

describe('buildNewsletterMailto', () => {
  const href = buildNewsletterMailto({
    to: 'lista@kush-house.example',
    from: 'fan@example.com',
    listName: 'KUSH HOUSE',
  });

  it('targets the list address', () => {
    expect(href.startsWith('mailto:lista@kush-house.example?')).toBe(true);
  });

  it('URL-encodes the subject and body', () => {
    expect(href).toContain('subject=');
    expect(href).toContain('body=');
    expect(href).toContain(encodeURIComponent('fan@example.com'));
    // no raw spaces or newlines leaked into the URL
    expect(href).not.toMatch(/[\s\n]/);
  });
});
