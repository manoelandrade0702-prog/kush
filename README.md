# KUSH HOUSE

Site do coletivo de música **KUSH HOUSE** — landing narrativa com agenda, residentes,
arquivo de fotos e mixes. movimento, sem backend.

> **Conteúdo provisório.** Textos, eventos, artistas, fotos e contatos são exemplos
> (`placeholder: true`) e os domínios usam `*.example` (TLD reservado, RFC 2606).
> Veja **[CONTENT.md](CONTENT.md)** para a lista do que trocar antes de publicar.

## Stack

- **[Astro 5](https://astro.build)** — saída 100% movimento (`output: 'no static'`).
- **TypeScript** em modo `strictest`, **ESLint 9** (flat) + **Prettier**, zero supressões.
- **Ilhas de comportamento em TS puro** (com framework de UI) — o JS enviado é mínimo.
- Fontes **auto-hospedadas** via `@fontsource-variable/*` (nenhum CDN externo).
- **Vitest** (unidade) + **Playwright** com **axe-core** (e2e/acessibilidade).

## Comandos

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm run build      # astro check + astro build + auditoria de segurança do dist/
npm run preview    # serve o dist/ em http://localhost:4321
npm run lint       # eslint --max-warnings=0 + prettier --check
npm run test       # testes de unidade (Vitest)
npm run test:e2e   # build + Playwright (baixa o Chromium na 1ª vez)
npm run verify     # check + lint + test + build  (porta de qualidade completa)
npm run assets     # regenera ícones e arte-placeholder (determinístico)
```

Requer **Node >= 18.20.8** (recomendado 22).

## Estrutura

```
src/
  content/            eventos · artistas · mixes · galeria  (Markdown + schema Zod)
  content.config.ts   schemas das coleções
  layouts/Base.astro  <head>, header, footer, observer de reveal
  components/          UI (.astro) — estático + <script> TS por ilha
  pages/               /, /events, /artists, /archive, /mixes, /legal, 404,
                       rss.xml, events/[slug].ics
  lib/                lógica pura e testável (datas, eventos, ics, mailto,
                      schema.org, segurança)
  styles/             tokens.css (design tokens) + global.css
scripts/
  gen-assets.mjs      gera public/ (ícones + placeholders)
  audit-dist.mjs      falha o build se o HTML violar a própria CSP
tests/                unit/ (Vitest) · e2e/ (Playwright + axe)
```

## Modelo de segurança

- **`src/lib/security.ts` é a fonte única** da CSP e dos cabeçalhos. A build gera
  `dist/_headers` (Netlify) a partir dele e injeta a mesma CSP como `<meta>` no HTML
  de produção.
- CSP sem `'unsafe-inline'` / `'unsafe-eval'` / `*`: nenhum `<script>` inline,
  nenhum `<style>` inline, nenhum atributo `style="..."` ou `on*=`. Valores dinâmicos
  usam CSS custom properties setadas via CSSOM (permitido pela CSP).
- `scripts/audit-dist.mjs` roda ao final de todo `npm run build` e **falha** se
  qualquer página quebrar essas regras ou se `dist/_headers` divergir de `security.ts`.
- Cabeçalhos: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-*`.
- Formulário da lista: sem backend. Valida no cliente, tem honeypot + verificação de
  tempo anti-bot e compõe um `mailto:` — nada sai do navegador sem o usuário enviar.
- Links externos: `rel="noopener noreferrer"` + `target="_blank"` com aviso a leitores
  de tela. Nenhum `<iframe>` de terceiros.

## Acessibilidade

Landmarks semânticos, skip link, foco visível, navegação por teclado com _focus trap_
e `Esc` em menu e diálogos (`<dialog>` nativo), `aria-live` no formulário, alvos de
toque ≥ 44px, contraste WCAG AA verificado em teste (`tests/unit/contrast.test.ts`),
`prefers-reduced-motion` respeitado em todas as animações. `npm run test:e2e` roda
axe-core em cada página e no diálogo aberto.

## Performance

Zero framework de UI no cliente; hidratação só onde há interação. CSS externo e
dividido, imagens com `width`/`height` e `loading="lazy"` abaixo da dobra, fontes
`woff2` com `font-display: swap`, terceiros nunca embutidos. `audit-dist.mjs` reporta
o peso de JS e avisa acima de 60 KB _gzip_.

## Deploy (Netlify)

`netlify.toml` já aponta `command = "npm run build"` e `publish = "dist"`.
Antes de publicar:

1. Defina `SITE_URL=https://SEU-DOMINIO` nas variáveis de ambiente do site
   (usado em `canonical`, OG, sitemap, RSS).
2. Atualize o host em `public/robots.txt`.
3. Troque o conteúdo-placeholder (ver **CONTENT.md**).
