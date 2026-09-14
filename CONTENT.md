# Conteúdo — o que trocar antes de publicar

Tudo abaixo é **provisório**. O site compila e funciona com esses dados, mas eles
são inventados.

## 1. Identidade e contatos — `src/lib/site.ts`

| Campo             | Valor atual (placeholder)                         | Trocar por                                   |
| ----------------- | ------------------------------------------------- | -------------------------------------------- |
| `email`           | `contato@kush-house.example`                      | e-mail real de contato                       |
| `newsletterEmail` | `lista@kush-house.example`                        | e-mail que recebe as inscrições              |
| `origin`          | `https://kush-house.example`                      | domínio real (ou defina `SITE_URL` na build) |
| `city`            | `São Paulo`                                       | cidade-base                                  |
| `SOCIALS[].href`  | raízes de plataforma (`https://instagram.com`, …) | URLs reais dos perfis                        |

Um `href` de rede social igual a `#` some do rodapé automaticamente.

## 2. Coleções — `src/content/`

Cada arquivo `.md` tem um campo `placeholder: true`. Ao inserir dado real, **remova
essa linha** (ou ponha `false`) para tirar o selo “Exemplo” da interface.

- **`events/`** — um arquivo por noite. Campos em `src/content.config.ts`.
  `ticketUrl` é opcional: sem ele, o botão “Ingressos” não aparece.
  `cancelled: true` risca o card e esconde o botão.
- **`artists/`** — `order` controla a posição; `role` é
  `Residente | Convidada | Convidado | Coletivo`. `links` aceita
  `soundcloud | bandcamp | instagram | ra` (todos opcionais).
- **`mixes/`** — `duration` no formato `M:SS` / `MM:SS`. `listenUrl` opcional
  (sem ele mostra “Em breve”).
- **`gallery/`** — cada foto exige `alt` descritivo. `src` é um caminho em
  `public/`. Troque os SVGs de placeholder por fotos reais (`.avif`/`.webp`)
  e ajuste `width`/`height`.

## 3. Imagens — `public/`

`public/placeholder/*.svg`, `public/og.png`, `public/favicon.*` e
`public/apple-touch-icon.png` são gerados por `npm run assets`
(`scripts/gen-assets.mjs`, determinístico). Para arte definitiva, substitua os
arquivos e/ou edite o gerador.

## 4. Textos fixos nas páginas

Frases de seção estão nos componentes (`src/components/Hero.astro`,
`Manifesto.astro`, `HomeResidents.astro`, `JoinSection.astro`, etc.) e nas páginas
em `src/pages/`. A política de privacidade (`src/pages/legal.astro`) descreve o
comportamento real do site atual — revise se adicionar analytics, embeds ou backend.
