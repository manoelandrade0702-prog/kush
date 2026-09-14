/**
 * Pure helpers for the newsletter form. The form does not POST anywhere —
 * there is no backend in this build. On submit it composes a `mailto:`
 * message the visitor sends from their own mail client.
 */

/**
 * Pragmatic email check: one '@', a dot in the domain, no spaces, length
 * bounds. Not a full RFC 5322 parser — good enough to catch typos before
 * opening a mail client, and the real validation is a human reading it.
 */
export function isPlausibleEmail(value: string): boolean {
  const email = value.trim();
  if (email.length < 6 || email.length > 254) return false;
  if (/\s/.test(email)) return false;
  return /^[^@]+@[^@]+\.[^@.]{2,}$/.test(email);
}

export interface NewsletterMailto {
  readonly to: string;
  readonly from: string;
  readonly listName: string;
}

/** Build the `mailto:` URL that subscribes `from` to `listName`. */
export function buildNewsletterMailto({ to, from, listName }: NewsletterMailto): string {
  const subject = `Entrar na lista — ${listName}`;
  const body = [
    `Quero receber os avisos de próximas noites da ${listName}.`,
    '',
    `E-mail para cadastro: ${from}`,
    '',
    '(Enviado pelo formulário do site.)',
  ].join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
