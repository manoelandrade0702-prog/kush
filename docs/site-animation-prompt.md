# Prompt — Site TAPX (landing page 100% animada)

> Prompt de referência gerado a partir do mockup enviado (marca **TAPX**, sistema
> NFC/QR). Use este texto como briefing completo para uma IA geradora de código
> (v0, Lovable, Cursor, Claude, etc.) ou para um time de design/dev construir a
> landing page reproduzindo fielmente o visual e comportamento do mockup, com
> **cada seção animada** (entrada, scroll, hover e efeitos ambientes contínuos).

---

## 1. Visão geral da marca

TAPX é uma tecnologia de conexão física-digital via **NFC e QR Code**: um toque
em uma tag/pingente resolve uma ação (avaliar, pagar, seguir, abrir cardápio,
conectar wi-fi, etc.). O tom visual é **tech, premium, noturno, "hacker-luxo"**:
preto absoluto, verde neon elétrico, vidro/cromo 3D, tipografia condensada em
caixa alta, tags estilo HUD/terminal (`TAPX://CONNECT`, `[ TAPX_001 ]`).

Sensação-alvo: um site que parece **vivo** — luzes pulsando, ondas de sinal se
propagando, texto que "liga" como um circuito, cards que reagem ao cursor.

---

## 2. Sistema de design

### Paleta oficial TAPX
- `--neon`: `#B7FF00` — verde TAPX principal (CTAs, sublinhados, números de etapa, ícones ativos)
- `--neon-glow`: `#9EFF00` — verde elétrico/glow (usado em `box-shadow`/`text-shadow`, halos pulsantes, anéis de sinal NFC)
- `--bg`: `#050505` — preto principal (base de todas as seções)
- `--bg-alt`: `#0A0A0A` — preto secundário (variação sutil entre seções/blocos)
- `--card`: `#101010` — fundo de cards
- `--white`: `#F5F5F0` — branco principal (títulos, texto primário)
- `--gray-light`: `#D8D8D2` — branco/cinza secundário (subtítulos, textos de apoio)
- `--gray`: `#777777` — cinza (parágrafos, legendas, labels secundárias)
- `--border`: `rgba(245,245,240,0.08)` (linhas e bordas de cards, sobre `--card`)
- Glow padrão: `box-shadow: 0 0 24px rgba(158,255,0,0.45)` em elementos ativos.

**Proporção de uso (identidade premium):** ~**80% preto/grafite** (`--bg`,
`--bg-alt`, `--card`) + ~**12% branco/cinza** (`--white`, `--gray-light`,
`--gray` em textos e ícones) + ~**8% verde TAPX** (`--neon`/`--neon-glow`,
reservado para CTAs, glows, acentos e estados ativos — nunca usado como cor
de preenchimento de grandes áreas, sempre como destaque pontual e luminoso).

### Tipografia
- Display/headlines: sans condensada **ultra-bold**, caixa alta, tracking
  levemente negativo (estilo Clash Display / Neue Machina / General Sans
  Extrabold). Tamanhos hero: `clamp(3rem, 8vw, 6.5rem)`, `line-height: 0.95`.
- Labels/tags: mono ou sans com `letter-spacing: 0.2em`, `font-size: 0.7rem`,
  sempre precedidas por um "bullet" quadrado verde (▪).
- Corpo/parágrafo: sans regular, `--gray`, `max-width: 34ch` para legibilidade.
- Números de etapa ("01", "02", "03"): display bold, `--neon`, grande.

### Texturas e materiais
- Fundo com **grão/ruído sutil** (film grain, opacidade ~4%) sobre todo o site.
- Rocha/concreto rachado com veios de luz verde escapando pelas fendas (hero,
  base do "X" 3D).
- O logo "X" e o dispositivo NFC são renderizados como **vidro/cromo 3D** com
  refração, reflexo especular e núcleo interno emissor de luz verde.
- Grid técnico/scanlines muito discreto (opacidade ~3%) em áreas escuras vazias,
  reforçando a leitura "sistema digital".

### Cursor e microinterações globais
- Cursor customizado: círculo outline branco de 24px que vira **preenchido em
  verde neon** ao passar sobre qualquer elemento clicável, com spring
  (`stiffness: 300, damping: 20`).
- Todo botão pill tem efeito **magnético**: desloca-se até 6px em direção ao
  cursor dentro de um raio de 40px (usar `mousemove` + lerp).
- `prefers-reduced-motion: reduce` deve desativar parallax, glow pulsante e
  auto-loop, mantendo apenas fades curtos (~150ms) — acessibilidade obrigatória.

---

## 3. Comportamento global de scroll/entrada

- **Smooth scroll** em toda a página (Lenis ou equivalente), inércia suave,
  duration ~1.2, easing `expo.out`.
- **Preloader** (1.5–2s): o traço do "X" se desenha (stroke-dashoffset 0→1),
  depois "acende" com um flash de glow verde e um leve *bloom*; barra de
  progresso fininha verde no rodapé da tela. Ao concluir, faz *wipe* vertical
  (cortina preta sobe) revelando o hero.
- **Reveal on scroll** padrão para blocos de texto: `opacity: 0 → 1` +
  `translateY: 24px → 0`, `duration: 0.8s`, `ease: power3.out`, disparado via
  IntersectionObserver/ScrollTrigger a 20% de visibilidade, com **stagger de
  80–120ms** entre elementos irmãos (linhas de título, itens de lista, cards).
- **Parallax leve** em imagens de fundo e no monumento 3D (`translateY`
  proporcional ao scroll, ~15–30px de deslocamento), sempre mais lento que o
  conteúdo em primeiro plano (profundidade).
- Barra de navegação fixa: comprime altura (~72px → 56px) e ganha
  `backdrop-filter: blur(12px)` + fundo semitransparente ao passar de 40px de
  scroll, com transição de 0.3s.

---

## 4. Seção a seção

### 4.1 Header / Navegação
**Layout:** logo "TAPX" à esquerda (ícone de onda/wifi integrado), menu central
(PRODUTOS · BUSINESS · HOME · COMO FUNCIONA · CONTATO), botão pill outline
verde "QUERO MINHA TAPX →" à direita.

**Animações:**
- Entrada: logo e itens de menu chegam com fade+slide-down escalonado
  (delay 60ms cada), 0.2s depois do preloader sumir.
- Item ativo ("HOME"): sublinhado verde com `transform: scaleX(0→1)` a partir
  do centro, `transition: 0.3s ease-out`.
- Hover em itens de menu: mesmo sublinhado aparece com scaleX, cor do texto
  interpola cinza→branco.
- Botão CTA: no hover, preenchimento verde desliza da esquerda para a direita
  (`background-position` ou pseudo-elemento `::before` com `scaleX`), texto
  passa a preto, seta desliza +4px.
- Em telas pequenas: ícone hambúrguer que, ao abrir, transforma-se em "X" com
  rotação 45°/-45° das duas linhas; menu mobile entra em *slide* da direita com
  overlay preto 80% opacidade + blur.

### 4.2 Hero — "ENCOSTOU. RESOLVEU."
**Layout:** tag `▪ TAPX://CONNECT`; título em duas linhas ("ENCOSTOU." branco,
"RESOLVEU." verde neon); parágrafo cinza; dois CTAs (preenchido verde
"CONHEÇA A TAPX →" / outline branco "VER PRODUTOS"); rail de 6 ícones+labels
(CASA, EMPRESAS, CARRO, PET, PESSOAS, EVENTOS). À direita, o monumento 3D: um
"X" gigante de vidro/cromo com glow verde interno sobre uma rocha escura
rachada com veios luminosos. Topo direito: tag `● TAPX SYSTEM` + "NFC / QR" +
"ONLINE" (piscando) e a frase "O MUNDO FÍSICO. CONECTADO." Rodapé direito:
"SCROLL TO CONNECT" na vertical + seta.

**Animações:**
- Título: cada linha entra com **clip-path wipe** (de baixo pra cima) +
  leve *blur-to-focus* (`filter: blur(8px)→0`), 0.9s, `stagger 0.15s` entre
  "ENCOSTOU." e "RESOLVEU.".
- Palavra "RESOLVEU." ganha um pulso de glow contínuo e sutil (loop
  `box-shadow`/`text-shadow` 0↔100% a cada 2.4s, `ease-in-out`) — como se
  "ligasse".
- Parágrafo e CTAs: fade+slide-up com delay após o título (stagger 100ms).
- Ícones do rail inferior: aparecem em leque (fade+scale 0.8→1) da esquerda
  para a direita; no hover, cada ícone sobe 4px e ganha glow verde.
- **Monumento 3D (X):** rotação leve e contínua em Y (±6°) reagindo à posição
  do mouse (parallax 3D via `perspective`/`rotateY`/`rotateX`, com *damping*),
  simulando um objeto "vivo" à luz do cursor. Reflexos internos verdes pulsam
  em loop lento (4s). Ao entrar em viewport: emerge com scale 0.85→1 + fade,
  acompanhado de um "flash" de luz saindo das rachaduras da rocha
  (`opacity 0→1→0.6` em 0.6s).
- Bullet do indicador "● TAPX SYSTEM" pisca (`opacity 1↔0.3`, 1.2s loop) como
  status "online".
- "SCROLL TO CONNECT": seta com bounce vertical infinito (`translateY 0↔8px`,
  1.4s `ease-in-out`), some com fade ao passar dos primeiros 100px de scroll.
- Textura de fundo (rocha superior esquerda): parallax leve inverso ao scroll.

### 4.3 "Um toque. Infinitas possibilidades." (NFC/QR)
**Layout:** à esquerda, foto de mão segurando celular próximo a um disco NFC
"TAPX" com anéis de sinal se propagando e a tela do celular mostrando
"Aproxime para conectar"; à direita, tag `▪ NFC / QR / SEM COMPLICAÇÃO`,
título, parágrafo e grade 2×3 de ações (AVALIAR, PAGAR, CONECTAR, ABRIR,
SEGUIR, COMPARTILHAR), cada uma com ícone.

**Animações:**
- **Anéis de sinal do disco NFC**: 3 círculos concêntricos que nascem no centro
  do disco e se expandem (`scale 0→2.2`, `opacity 0.8→0`) em loop contínuo,
  cada anel com delay de 0.6s entre si (efeito "radar"), cor verde neon com
  leve blur.
- Disco NFC com glow pulsante sincronizado ao anel (brilho aumenta quando um
  anel "nasce").
- Tela do celular: o texto "Aproxime para conectar" e o ícone de NFC piscam
  suavemente (`opacity 0.6↔1`, 1.8s) simulando estado de espera; ao entrar em
  viewport, simula uma "conexão" — ícone dá um flash mais forte e depois volta
  ao pulso normal (evento único de reforço, não repetido).
- Bloco de texto: mesmo padrão de entrada do hero (wipe/stagger nas linhas de
  título).
- Grade de 6 ações: cada item entra com fade+translateX(-12px→0), stagger de
  70ms, em ordem de leitura (esq→dir, cima→baixo). No hover: ícone faz um
  pequeno "bounce" de escala (1→1.15→1) e ganha cor verde; label sublinha.

### 4.4 "Aproximou. Aconteceu." (Como funciona)
**Layout:** título à esquerda + tag `TAPX://SIMPLE`; à direita, 3 cards
numerados (01 APROXIME, 02 ENCOSTE, 03 RESOLVEU), cada um com mockup de
celular ilustrando a etapa (radar procurando tag → toque com glow → tela
"CONECTADO" com check verde).

**Animações:**
- Cards entram em **stagger sequencial** (0.15s entre cada), fade+translateY,
  como se estivessem sendo "montados" da esquerda para a direita.
- Números "01/02/03": contam de leve *scale bounce* ao aparecer (0.9→1.05→1).
- Card 1 (mockup radar): ícone de wifi/sinal pulsa em ondas crescentes, igual
  ao padrão de radar da seção anterior, porém em miniatura.
- Card 2 (mockup encoste): glow verde "respira" ao redor do ponto de toque
  (halo `scale`/`opacity` loop 2s).
- Card 3 (mockup resolvido): o ✓ verde faz um *pop-in* com leve overshoot
  (`scale 0→1.2→1`) acompanhado de um "confete" discreto de partículas verdes
  (opcional, 4–6 partículas, fade rápido) — só na primeira vez que entra em
  viewport.
- Hover em qualquer card: eleva-se (`translateY -6px`), borda acende verde,
  sombra suave aumenta — transição 0.25s.

### 4.5 "Conheça o ecossistema TAPX." (Soluções)
**Layout:** título + parágrafo à esquerda; à direita, "TAPX" gigante em
watermark translúcido no fundo, tag "MESMA TECNOLOGIA. / INFINITAS
APLICAÇÕES." e código `[ TAPX_001 ]`. Abaixo, grade de 6 cards de produto
(REVIEW, MENU, SOCIAL, CARD, HOME, PAY), cada um com imagem, título, descrição
curta e link "SAIBA MAIS →".

**Animações:**
- Watermark "TAPX" de fundo: leve *drift* horizontal contínuo (translateX
  muito lento, alguns px por segundo) e parallax mais lento que o restante do
  conteúdo no scroll.
- Cards do ecossistema: stagger de entrada em grade (fade+scale 0.95→1),
  ordem por linha, delay 60ms entre colunas.
- **Hover nos cards**: tilt 3D sutil seguindo o cursor (`rotateX`/`rotateY`
  máx. 6°, via `perspective(800px)`), zoom leve na imagem interna (`scale
  1→1.06`), overlay de gradiente escurece menos revelando mais detalhe da
  foto, "SAIBA MAIS →" desliza a seta +4px.
- Borda do card acende com glow verde fininho ao hover (`border-color`
  transição 0.3s).
- Cada imagem de card tem um **loop ambiente muito sutil** condizente com o
  produto: TAPX SOCIAL — ícones (Instagram/TikTok/WhatsApp) piscam em
  round-robin; TAPX PAY — pequeno ícone de cartão "desliza" em loop lento;
  TAPX HOME — luz ambiente da sala pulsa suavemente.

### 4.6 "Sua empresa. A um toque." (Business)
**Layout:** título + parágrafo à esquerda sobre foto de bar/restaurante à
noite; à direita, lista vertical de segmentos (RESTAURANTE/BAR → AVALIAR NO
GOOGLE, CLÍNICA → CHAMAR NO WHATSAPP, LOJA → SEGUIR NO INSTAGRAM, HOTEL →
ACESSAR WI-FI, ACADEMIA → ACESSAR INFORMAÇÕES), cada linha separada por um
divisor fino.

**Animações:**
- Foto do estabelecimento: leve *ken burns* (zoom lentíssimo `scale 1→1.05`
  ao longo de ~20s, loop suave) para dar sensação de vídeo/vida.
- Luzes de neon da fachada na foto (se destacável via overlay): leve flicker
  ocasional (opacidade 1↔0.85, aleatório a cada poucos segundos) — efeito
  bem discreto.
- Lista de segmentos: cada linha entra com fade+translateX(-16px→0) em
  stagger 90ms conforme a seção entra em viewport.
- Hover em cada linha: fundo ganha leve tint verde (`rgba(183,255,0,0.05)`),
  seta "→" desliza para a direita, texto da ação acende em verde mais forte.
- Divisores entre linhas "desenham-se" da esquerda para a direita
  (`scaleX 0→1`) na entrada, como se fossem circuitos sendo traçados.

### 4.7 Rodapé (se existir, não mostrado no mockup mas recomendado)
- Mesmo padrão de reveal, com o "X" da marca reaparecendo em outline fino e
  fixo, glow leve ao passar o mouse por cima (elemento decorativo).

---

## 5. Stack técnica sugerida

- **Animação de scroll/timeline:** GSAP + ScrollTrigger (ou Framer Motion se o
  stack for React).
- **Scroll suave:** Lenis, sincronizado com o ScrollTrigger.
- **3D do "X" e disco NFC:** Three.js/React Three Fiber (glass material com
  `MeshPhysicalMaterial`, `transmission`, `roughness` baixo, luz pontual verde
  interna) — alternativa mais leve: vídeo/Lottie/sequência de frames pré-
  renderizada em loop para quem não quer runtime 3D.
- **Partículas/glow:** shaders simples em Canvas ou CSS `filter: blur()` +
  `mix-blend-mode: screen` para os halos neon (mais performático que partículas
  reais na maioria dos casos).
- **Cursor customizado:** elemento fixo controlado via `mousemove` com lerp,
  ou biblioteca leve (ex.: `cuberto`-style custom cursor).
- **Acessibilidade:** todos os loops/parallax devem checar
  `window.matchMedia('(prefers-reduced-motion: reduce)')` e cair para
  transições estáticas/curtas; manter contraste AA (texto cinza sobre preto já
  precisa ser validado); foco visível em todos os elementos interativos.
- **Performance:** lazy-load das imagens abaixo da dobra, `will-change`
  pontual (não global) nos elementos animados, pausar animações fora da
  viewport (`IntersectionObserver`), e usar `transform`/`opacity` (evitar
  animar `top/left/width` para não gerar reflow).

---

## 6. Resumo do "mood" para a IA geradora

> "Landing page escura, cinematográfica e tecnológica para a marca TAPX (NFC).
> Preto absoluto + verde-limão neon, tipografia condensada em caixa alta,
> elementos de vidro/cromo 3D com glow interno, tags estilo terminal/HUD. Cada
> seção deve parecer um circuito que liga: textos entram com wipe e leve blur,
> ícones e cards fazem stagger, sinais NFC pulsam em anéis concêntricos
> infinitos, botões têm efeito magnético e preenchimento deslizante, cards de
> produto fazem tilt 3D no hover, e o logotipo 'X' reage à posição do mouse
> como um objeto físico iluminado. Scroll suave e cinematográfico do início ao
> fim, com parallax discreto e respeito total a `prefers-reduced-motion`."
