/**
 * KUSH HOUSE — global site configuration.
 *
 * ⚠️  PLACEHOLDER CONTENT
 * Values marked `PLACEHOLDER` are invented for the build and are safe to
 * commit (no real inbox, handle, or domain). Replace them before launch.
 * Nothing here contacts a third party at build or runtime.
 */

export interface SocialLink {
  readonly label: string;
  readonly href: string;
  /** Inline-SVG path data drawn in a 24×24 viewBox. */
  readonly icon: string;
}

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export const SITE = {
  name: 'KUSH HOUSE',
  /** Used in <title> suffixes and structured data. */
  shortName: 'KUSH HOUSE',
  tagline: 'Um coletivo de música e as noites que ele constrói.',
  description:
    'KUSH HOUSE é um coletivo underground de música eletrônica e a série de festas que ele realiza — line-ups, residentes, mixes e o arquivo das noites passadas.',
  locale: 'pt-BR',
  lang: 'pt-BR',
  /** City the collective is based in — PLACEHOLDER. */
  city: 'São Paulo',
  /** Contact inbox — PLACEHOLDER (RFC 2606 reserved domain, no real inbox). */
  email: 'contato@kush-house.example',
  /** Address the newsletter form composes a message to — PLACEHOLDER. */
  newsletterEmail: 'lista@kush-house.example',
  /**
   * Canonical origin. Overridden at build time by `SITE_URL`
   * (see `astro.config.mjs`). `.example` is never a real site.
   */
  origin: 'https://kush-house.example',
} as const;

export const NAV: readonly NavItem[] = [
  { label: 'Agenda', href: '/events' },
  { label: 'Residentes', href: '/artists' },
  { label: 'Arquivo', href: '/archive' },
  { label: 'Mixes', href: '/mixes' },
];

/**
 * Social links — every `href` is a PLACEHOLDER pointing at the platform
 * root, not a real KUSH HOUSE profile. A link whose href is exactly '#'
 * is treated as "not configured" and is not rendered.
 */
export const SOCIALS: readonly SocialLink[] = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: 'M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.43.4.7.8.92 1.4.17.4.36 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.22.6-.48 1-.92 1.4-.4.43-.8.7-1.4.92-.4.17-1 .36-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42a3.8 3.8 0 0 1-1.4-.92c-.43-.4-.7-.8-.92-1.4-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.22-.6.48-1 .92-1.4.4-.43.8-.7 1.4-.92.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.44-1.3.83-.4.4-.63.8-.83 1.3-.16.4-.35 1-.4 2.1C2.6 9.9 2.6 10.3 2.6 12s0 2.1.07 3.3c.05 1.1.24 1.7.4 2.1.2.5.44.9.83 1.3.4.4.8.63 1.3.83.4.16 1 .35 2.1.4 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.44 1.3-.83.4-.4.63-.8.83-1.3.16-.4.35-1 .4-2.1.07-1.2.07-1.6.07-3.3s0-2.1-.07-3.3c-.05-1.1-.24-1.7-.4-2.1a3.5 3.5 0 0 0-.83-1.3 3.5 3.5 0 0 0-1.3-.83c-.4-.16-1-.35-2.1-.4C15.5 4 15.1 4 12 4Zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 1.8a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Zm5-3.3a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z',
  },
  {
    label: 'SoundCloud',
    href: 'https://soundcloud.com',
    icon: 'M3 14.5a.6.6 0 0 1 1.2 0v3a.6.6 0 0 1-1.2 0v-3Zm2.4-1.6a.6.6 0 0 1 1.2 0v4.6a.6.6 0 0 1-1.2 0v-4.6Zm2.4-1.1a.6.6 0 0 1 1.2 0v5.8a.6.6 0 0 1-1.2 0v-5.8Zm2.5-.6a.6.6 0 0 1 1.2 0v6.4a.6.6 0 0 1-1.2 0v-6.4Zm3.2-2.4c.35-.15.74-.23 1.15-.23A3.15 3.15 0 0 1 21 11.4a2.9 2.9 0 0 1-.9 5.7h-6.6a.6.6 0 0 1-.6-.6V9.2a.6.6 0 0 1 .35-.55l.05-.02.05-.02c.06-.02.13-.05.2-.07l.05-.02Z',
  },
  {
    label: 'Bandcamp',
    href: 'https://bandcamp.com',
    icon: 'M3 15.5 7.5 8h13.5L16.5 15.5H3Z',
  },
  {
    label: 'RSS',
    href: '/rss.xml',
    icon: 'M5 3a16 16 0 0 1 16 16 1.6 1.6 0 0 1-3.2 0A12.8 12.8 0 0 0 5 6.2 1.6 1.6 0 0 1 5 3Zm0 6.4a9.6 9.6 0 0 1 9.6 9.6 1.6 1.6 0 0 1-3.2 0A6.4 6.4 0 0 0 5 12.6a1.6 1.6 0 0 1 0-3.2ZM6.6 15.8a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8Z',
  },
] as const;

/** True when a link should be shown (i.e. it has been configured). */
export function isConfiguredHref(href: string): boolean {
  return href.trim() !== '' && href.trim() !== '#';
}
