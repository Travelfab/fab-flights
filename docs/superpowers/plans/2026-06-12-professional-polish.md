# fab.flights Professional Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved "Editorial" redesign — self-hosted Fraunces/Outfit typography, SVG icons and flags replacing all emoji, London photo hero + per-destination photography, WhatsApp og:image previews, Companies House trust strip, and the research-backed destination order — while keeping the site static, zero-JS, and Spanish-only.

**Architecture:** Pure static Astro 5 + Tailwind 4 site. All changes are build-time: fonts and photos are self-hosted static assets, images go through `astro:assets` (sharp) for AVIF/WebP, icons/flags are tiny inline-SVG `.astro` components. No client-side JavaScript is added anywhere. No test framework exists in this repo; per the approved spec, verification is `pnpm build` + targeted `grep`/file checks + visual screenshots, run at every task.

**Tech Stack:** Astro 5 (`astro:assets`, content collections), Tailwind CSS 4 (`@theme` variables), fontsource woff2 files via jsDelivr, Unsplash photography (downloaded, self-hosted).

**Spec:** `docs/superpowers/specs/2026-06-12-professional-polish-design.md`

**File map (who owns what):**

| File | Action | Responsibility |
|---|---|---|
| `public/fonts/*.woff2` (5 files) | Create | Self-hosted Fraunces 600/600i + Outfit 400/600/700, latin subset |
| `src/styles/global.css` | Modify | `@font-face`, theme fonts, serif headings via base layer |
| `src/config.ts` | Modify | Registered company name, number, founded year (single source of truth) |
| `src/layouts/Base.astro` | Modify | Font preloads, white header, footer legal line, floating WA button icon, og:image meta |
| `src/components/icons/*.astro` (7 files) | Create | One inline-SVG icon per file (`currentColor`, class prop) |
| `src/components/flags/*.astro` (5) + `index.ts` | Create | One inline-SVG flag per country + slug→component map |
| `src/components/WhatsAppButton.astro` | Modify | Use shared `IconWhatsApp` |
| `src/components/DestinationCard.astro` | Modify | Photo thumbnail + SVG flag card |
| `src/assets/photos/*.jpg` (6) + `index.ts` | Create | Self-hosted photos + slug→ImageMetadata map |
| `src/pages/index.astro` | Modify | Photo hero + trust strip, icon steps, icon bullets + experience bullet |
| `src/pages/[slug].astro` | Modify | Photo banner hero, SVG flag, og image |
| `src/content.config.ts` | Modify | Drop `flag` emoji field from schema |
| `src/content/destinations/*.md` (5) | Modify | Remove `flag:` line; swap `order` of panama (4→5) and peru (5→4) |

---

### Task 1: Self-hosted typography (Fraunces + Outfit)

**Files:**
- Create: `public/fonts/fraunces-latin-600-normal.woff2`, `public/fonts/fraunces-latin-600-italic.woff2`, `public/fonts/outfit-latin-400-normal.woff2`, `public/fonts/outfit-latin-600-normal.woff2`, `public/fonts/outfit-latin-700-normal.woff2`
- Modify: `src/styles/global.css`
- Modify: `src/layouts/Base.astro` (head: preloads)

- [ ] **Step 1: Download the five woff2 files from the fontsource CDN**

```bash
cd "/Users/fabia/Documents/001 Dev/fab-flights"
mkdir -p public/fonts
curl -fL -o public/fonts/fraunces-latin-600-normal.woff2 "https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-600-normal.woff2"
curl -fL -o public/fonts/fraunces-latin-600-italic.woff2 "https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-600-italic.woff2"
curl -fL -o public/fonts/outfit-latin-400-normal.woff2  "https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-400-normal.woff2"
curl -fL -o public/fonts/outfit-latin-600-normal.woff2  "https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-600-normal.woff2"
curl -fL -o public/fonts/outfit-latin-700-normal.woff2  "https://cdn.jsdelivr.net/fontsource/fonts/outfit@latest/latin-700-normal.woff2"
```

- [ ] **Step 2: Verify the downloads are real woff2 files (not error pages)**

Run: `file public/fonts/*.woff2 && ls -la public/fonts/`
Expected: every file reports `Web Open Font Format (Version 2)`, each roughly 10–40 KB. If any file is HTML or 0 bytes, the URL pattern changed — fetch the correct URL from `https://fontsource.org/fonts/fraunces` / `https://fontsource.org/fonts/outfit` (CDN tab) and re-download.

- [ ] **Step 3: Add `@font-face` rules and theme fonts to `src/styles/global.css`**

Replace the existing `@theme` block (lines 3–19) with:

```css
@font-face {
  font-family: 'Fraunces';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/fraunces-latin-600-normal.woff2') format('woff2');
}
@font-face {
  font-family: 'Fraunces';
  font-style: italic;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/fraunces-latin-600-italic.woff2') format('woff2');
}
@font-face {
  font-family: 'Outfit';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/outfit-latin-400-normal.woff2') format('woff2');
}
@font-face {
  font-family: 'Outfit';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/outfit-latin-600-normal.woff2') format('woff2');
}
@font-face {
  font-family: 'Outfit';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/outfit-latin-700-normal.woff2') format('woff2');
}

@theme {
  /* Brand palette: deep night-flight navy, warm sun accent, WhatsApp green for CTAs */
  --color-navy-50: #f0f4fa;
  --color-navy-100: #d9e2f0;
  --color-navy-700: #1d3a63;
  --color-navy-800: #13294b;
  --color-navy-900: #0b2545;
  --color-sun-300: #ffd166;
  --color-sun-400: #ffc233;
  --color-sun-500: #ffb703;
  --color-wa-500: #25d366;
  --color-wa-600: #1ebe5b;
  --color-wa-700: #128c7e;

  --font-sans: 'Outfit', ui-sans-serif, system-ui, -apple-system, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-serif: 'Fraunces', Georgia, 'Times New Roman', serif;
}

/* Headings site-wide use the serif (covers page templates AND guide markdown) */
@layer base {
  h1,
  h2,
  h3 {
    font-family: var(--font-serif);
  }
}
```

Keep the existing `.guide` rules below unchanged.

- [ ] **Step 4: Preload the above-the-fold fonts in `src/layouts/Base.astro`**

Add inside `<head>`, directly after the favicon `<link>`:

```html
<link rel="preload" href="/fonts/fraunces-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/outfit-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
```

- [ ] **Step 5: Build and verify**

Run: `pnpm build`
Expected: build succeeds. Then: `grep -c 'fonts/fraunces' dist/index.html` → at least `1` (preload present); `ls dist/fonts/` → the five woff2 files.

- [ ] **Step 6: Visual check**

Run: `pnpm preview &` then screenshot `http://localhost:4321` (Playwright MCP or browser). Headings must render in a serif; body text in Outfit. Kill preview after.

- [ ] **Step 7: Commit**

```bash
git add public/fonts src/styles/global.css src/layouts/Base.astro
git commit -m "feat: self-hosted Fraunces/Outfit typography, serif headings"
```

---

### Task 2: Trust facts in config + white header + footer legal line

**Files:**
- Modify: `src/config.ts`
- Modify: `src/layouts/Base.astro` (header + footer)

- [ ] **Step 1: Update `src/config.ts`**

Replace the `SITE` object (keep `waLink` and `DEFAULT_WA_TEXT` unchanged):

```ts
export const SITE = {
  name: 'Fab Flights',
  url: 'https://fab.flights',
  // Registered name + number exactly as on the Companies House register (verified 2026-06-12).
  company: 'Travel Fab Limited',
  companyNumber: '08910640',
  foundedYear: 2014,
  tagline: 'Vuelos a Latinoamérica desde Londres, con atención en español',
  description:
    'Te ayudamos a encontrar y reservar tu vuelo a Ecuador, Colombia, Brasil, Panamá o Perú desde el Reino Unido. Atención personal en español por WhatsApp.',
  // WhatsApp Business number — international format, digits only (no "+", no spaces).
  whatsappNumber: '442071481727',
} as const;
```

Note: `companyNote` is removed — the footer line is now derived from the fields above.

- [ ] **Step 2: White header in `src/layouts/Base.astro`**

Replace the `<header>` block:

```astro
<header class="border-b border-navy-100 bg-white text-navy-900">
  <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
    <a href="/" class="text-lg font-bold tracking-tight">
      fab<span class="text-sun-500">.</span>flights
    </a>
    <a
      href={waLink(DEFAULT_WA_TEXT)}
      class="rounded-full bg-wa-500 px-4 py-2 text-sm font-semibold text-white hover:bg-wa-600"
    >
      Escríbenos
    </a>
  </div>
</header>
```

- [ ] **Step 3: Footer legal line in `src/layouts/Base.astro`**

Replace the `<footer>` block:

```astro
<footer class="mt-16 bg-navy-900 px-4 py-10 text-center text-sm text-navy-100">
  <p class="font-semibold text-white">{SITE.name} — {SITE.tagline}</p>
  <p class="mt-2">
    {SITE.company} · Registrada en Inglaterra y Gales, n.º {SITE.companyNumber} · Desde {SITE.foundedYear}
  </p>
  <p class="mt-2">Atención en español e inglés · Londres, Reino Unido</p>
</footer>
```

- [ ] **Step 4: Build and verify**

Run: `pnpm build && grep -o '08910640' dist/index.html | head -1`
Expected: build green; output `08910640`. Also `grep -c 'companyNote' -r src/` → `0`.

- [ ] **Step 5: Commit**

```bash
git add src/config.ts src/layouts/Base.astro
git commit -m "feat: Companies House trust facts in config, white header, footer legal line"
```

---

### Task 3: Icon components (kill emoji, DRY the WhatsApp glyph)

**Files:**
- Create: `src/components/icons/IconWhatsApp.astro`, `IconSearch.astro`, `IconPlane.astro`, `IconLuggage.astro`, `IconPassport.astro`, `IconPerson.astro`, `IconCheck.astro`
- Modify: `src/components/WhatsAppButton.astro`, `src/layouts/Base.astro` (floating button)

All stroke icons share this skeleton — 24×24 viewBox, `currentColor`, class prop with default:

- [ ] **Step 1: Create `src/components/icons/IconWhatsApp.astro`** (fill-based brand glyph, moved from the two inline copies)

```astro
---
interface Props {
  class?: string;
}
const { class: className = 'h-5 w-5' } = Astro.props;
---

<svg viewBox="0 0 32 32" class={`fill-current ${className}`} aria-hidden="true">
  <path
    d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.3c1.9 1 4 1.6 6.2 1.6h.5c6.6 0 12-5.3 12-11.9C30 8.3 24.6 3 16 3zm6.8 16.9c-.3.8-1.7 1.6-2.3 1.6-.6.1-1.4.1-2.2-.1-.5-.2-1.2-.4-2-.8-3.5-1.5-5.8-5-6-5.3-.2-.2-1.4-1.9-1.4-3.6s.9-2.5 1.2-2.9c.3-.3.7-.4.9-.4h.7c.2 0 .5-.1.8.6.3.7 1 2.5 1.1 2.7.1.2.2.4 0 .7-.1.2-.2.4-.4.6l-.6.7c-.2.2-.4.4-.2.8.2.3 1 1.6 2.1 2.6 1.5 1.3 2.7 1.7 3.1 1.9.4.2.6.2.8-.1.2-.2.9-1.1 1.2-1.5.2-.3.5-.3.8-.2.3.1 2.1 1 2.4 1.2.4.2.6.3.7.4.1.3.1 1-.2 1.7z"
  ></path>
</svg>
```

- [ ] **Step 2: Create the six stroke icons**

`src/components/icons/IconSearch.astro`:

```astro
---
interface Props {
  class?: string;
}
const { class: className = 'h-6 w-6' } = Astro.props;
---

<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
  aria-hidden="true"
>
  <circle cx="11" cy="11" r="8"></circle>
  <path d="m21 21-4.3-4.3"></path>
</svg>
```

`IconPlane.astro` — same skeleton, body:

```html
<path
  d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
></path>
```

`IconLuggage.astro` — same skeleton, body:

```html
<path d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2"></path>
<path d="M8 18V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12"></path>
<path d="M10 20h4"></path>
<circle cx="16" cy="20" r="2"></circle>
<circle cx="8" cy="20" r="2"></circle>
```

`IconPassport.astro` — same skeleton, body:

```html
<rect x="5" y="3" width="14" height="18" rx="2"></rect>
<circle cx="12" cy="10" r="3"></circle>
<path d="M9 16h6"></path>
```

`IconPerson.astro` — same skeleton, body:

```html
<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
<circle cx="12" cy="7" r="4"></circle>
```

`IconCheck.astro` — same skeleton (default class `'h-4 w-4'` instead), body:

```html
<path d="M20 6 9 17l-5-5"></path>
```

- [ ] **Step 3: DRY `src/components/WhatsAppButton.astro`**

Replace the whole file:

```astro
---
import { waLink } from '../config';
import IconWhatsApp from './icons/IconWhatsApp.astro';

interface Props {
  text: string;
  label?: string;
  size?: 'md' | 'lg';
}

const { text, label = 'Cotiza por WhatsApp', size = 'lg' } = Astro.props;
const sizeClasses =
  size === 'lg' ? 'px-7 py-3.5 text-lg' : 'px-5 py-2.5 text-base';
---

<a
  href={waLink(text)}
  class={`inline-flex items-center gap-2 rounded-full bg-wa-500 font-bold text-white shadow-md hover:bg-wa-600 ${sizeClasses}`}
>
  <IconWhatsApp class="h-5 w-5" />
  {label}
</a>
```

- [ ] **Step 4: Floating button in `src/layouts/Base.astro`**

Import at the top of the frontmatter: `import IconWhatsApp from '../components/icons/IconWhatsApp.astro';`
Replace the floating link's inline `<svg>…</svg>` with: `<IconWhatsApp class="h-8 w-8 text-white" />`

- [ ] **Step 5: Build and verify**

Run: `pnpm build`
Expected: green. `grep -c 'M16 3C9.4' src/components/WhatsAppButton.astro src/layouts/Base.astro` → `0` for both (no inline copies left).

- [ ] **Step 6: Commit**

```bash
git add src/components/icons src/components/WhatsAppButton.astro src/layouts/Base.astro
git commit -m "feat: inline SVG icon components, DRY WhatsApp glyph"
```

---

### Task 4: SVG flags + drop emoji flag field + research-backed order

**Files:**
- Create: `src/components/flags/FlagEC.astro`, `FlagCO.astro`, `FlagBR.astro`, `FlagPA.astro`, `FlagPE.astro`, `src/components/flags/index.ts`
- Modify: `src/content.config.ts`, all 5 `src/content/destinations/*.md`, `src/components/DestinationCard.astro`, `src/pages/index.astro` (flag prop), `src/pages/[slug].astro` (flag usage)

- [ ] **Step 1: Create the five flag components** (all: viewBox `0 0 24 16`, class prop defaulting to `'h-4 w-6'`)

`src/components/flags/FlagCO.astro`:

```astro
---
interface Props {
  class?: string;
}
const { class: className = 'h-4 w-6' } = Astro.props;
---

<svg viewBox="0 0 24 16" class={`rounded-[2px] ${className}`} aria-hidden="true">
  <rect width="24" height="8" fill="#FCD116"></rect>
  <rect y="8" width="24" height="4" fill="#003893"></rect>
  <rect y="12" width="24" height="4" fill="#CE1126"></rect>
</svg>
```

`FlagEC.astro` — same frame, body (Colombia layout + muted crest hint so the two read differently at small size):

```html
<rect width="24" height="8" fill="#FFDD00"></rect>
<rect y="8" width="24" height="4" fill="#034EA2"></rect>
<rect y="12" width="24" height="4" fill="#ED1C24"></rect>
<ellipse cx="12" cy="8" rx="2.4" ry="3" fill="#7a6840" opacity="0.85"></ellipse>
```

`FlagBR.astro` — same frame, body:

```html
<rect width="24" height="16" fill="#009B3A"></rect>
<path d="M12 2 22 8 12 14 2 8z" fill="#FEDF00"></path>
<circle cx="12" cy="8" r="3" fill="#002776"></circle>
```

`FlagPA.astro` — same frame, body:

```html
<rect width="24" height="16" fill="#ffffff"></rect>
<rect x="12" width="12" height="8" fill="#D21034"></rect>
<rect y="8" width="12" height="8" fill="#005293"></rect>
<polygon points="6,2.0 6.53,3.47 8.09,3.52 6.86,4.48 7.29,5.98 6,5.1 4.71,5.98 5.14,4.48 3.91,3.52 5.47,3.47" fill="#005293"></polygon>
<polygon points="18,10.0 18.53,11.47 20.09,11.52 18.86,12.48 19.29,13.98 18,13.1 16.71,13.98 17.14,12.48 15.91,11.52 17.47,11.47" fill="#D21034"></polygon>
```

`FlagPE.astro` — same frame, body:

```html
<rect width="8" height="16" fill="#D91023"></rect>
<rect x="8" width="8" height="16" fill="#ffffff"></rect>
<rect x="16" width="8" height="16" fill="#D91023"></rect>
```

- [ ] **Step 2: Create the slug→component map `src/components/flags/index.ts`**

```ts
import FlagEC from './FlagEC.astro';
import FlagCO from './FlagCO.astro';
import FlagBR from './FlagBR.astro';
import FlagPA from './FlagPA.astro';
import FlagPE from './FlagPE.astro';

/** Destination slug (content collection id) → flag component. */
export const FLAGS = {
  ecuador: FlagEC,
  colombia: FlagCO,
  brasil: FlagBR,
  panama: FlagPA,
  peru: FlagPE,
} as const;

export type DestinationSlug = keyof typeof FLAGS;

/** Fail the build loudly if a guide is added without a flag. */
export function flagFor(slug: string) {
  const flag = FLAGS[slug as DestinationSlug];
  if (!flag) {
    throw new Error(
      `No flag component for destination slug "${slug}" — add it to src/components/flags/index.ts`
    );
  }
  return flag;
}
```

- [ ] **Step 3: Drop `flag` from the schema in `src/content.config.ts`**

Delete the line `flag: z.string(),`.

- [ ] **Step 4: Update the five markdown files**

In each of `src/content/destinations/{ecuador,colombia,brasil,panama,peru}.md`: delete the `flag: 🇽🇾` frontmatter line (the emoji inside `waText` stays — it is part of the WhatsApp message, where emoji are native). Then apply the research-backed order swap:
- `panama.md`: `order: 4` → `order: 5`
- `peru.md`: `order: 5` → `order: 4`

- [ ] **Step 5: Update `src/components/DestinationCard.astro`** (flag component instead of emoji prop; photo comes in Task 7)

Replace the whole file:

```astro
---
import { flagFor } from './flags';

interface Props {
  slug: string;
  country: string;
  cities: string[];
  heroLine: string;
}

const { slug, country, cities, heroLine } = Astro.props;
const Flag = flagFor(slug);
---

<a
  href={`/${slug}`}
  class="block rounded-2xl border border-navy-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
>
  <Flag class="h-5 w-[30px] shadow-sm" />
  <h3 class="mt-3 text-xl font-bold text-navy-900">{country}</h3>
  <p class="mt-1 text-sm text-navy-700">{cities.join(' · ')}</p>
  <p class="mt-3 text-sm leading-relaxed">{heroLine}</p>
  <span class="mt-4 inline-block text-sm font-semibold text-navy-700">
    Ver guía de vuelos →
  </span>
</a>
```

- [ ] **Step 6: Remove the `flag` prop from `src/pages/index.astro`**

In the destinations grid, delete the line `flag={d.data.flag}`.

- [ ] **Step 7: Replace the emoji flag in `src/pages/[slug].astro`**

In the frontmatter: remove `flag` from the destructured `destination.data`, and add:

```ts
import { flagFor } from '../components/flags';
const Flag = flagFor(destination.id);
```

In the template, replace `<p class="text-4xl" aria-hidden="true">{flag}</p>` with:

```astro
<Flag class="h-6 w-9 shadow-sm" />
```

- [ ] **Step 8: Build and verify**

Run: `pnpm build`
Expected: green. Then `grep -rc 'flag:' src/content/destinations/ | grep -v ':0'` → no output (field gone), and `grep -o 'order: [0-9]' src/content/destinations/panama.md src/content/destinations/peru.md` → panama `order: 5`, peru `order: 4`. Homepage card order in `dist/index.html`: Ecuador before Colombia before Brasil before Perú before Panamá — verify with `grep -o 'Ecuador\|Colombia\|Brasil\|Perú\|Panamá' dist/index.html | head -20`.

- [ ] **Step 9: Commit**

```bash
git add src/components/flags src/components/DestinationCard.astro src/content.config.ts src/content/destinations src/pages
git commit -m "feat: SVG flag components replace emoji, Peru/Panama order swap per diaspora research"
```

---

### Task 5: Download photography (with user approval gate)

**Files:**
- Create: `src/assets/photos/hero-london.jpg`, `brasil.jpg`, `colombia.jpg`, `ecuador.jpg`, `panama.jpg`, `peru.jpg`
- Create: `src/assets/photos/index.ts`

- [ ] **Step 1: Download the three already-approved/verified photos**

(The London hero was chosen by Fabian from mockups; the Rio and Cartagena IDs were verified loading during brainstorming.)

```bash
cd "/Users/fabia/Documents/001 Dev/fab-flights"
mkdir -p src/assets/photos
curl -fL -o src/assets/photos/hero-london.jpg "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80&fm=jpg&fit=crop"
curl -fL -o src/assets/photos/brasil.jpg     "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1600&q=80&fm=jpg&fit=crop"
curl -fL -o src/assets/photos/colombia.jpg   "https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=1600&q=80&fm=jpg&fit=crop"
```

- [ ] **Step 2: Find and download Ecuador, Panamá, Perú photos**

Search Unsplash (web search or `https://unsplash.com/s/photos/<query>`) for: `quito ecuador old town` (or Cotopaxi/Andes), `panama city skyline`, `machu picchu peru` (or Cusco). Pick landscape-orientation photos that read clearly at card size (strong subject, not too busy), copy each photo's `images.unsplash.com/photo-…` URL, and download with the same `?w=1600&q=80&fm=jpg&fit=crop` suffix to `src/assets/photos/{ecuador,panama,peru}.jpg`. Unsplash license permits commercial use without attribution.

- [ ] **Step 3: Verify all six files are real JPEGs of adequate size**

Run: `file src/assets/photos/*.jpg && sips -g pixelWidth -g pixelHeight src/assets/photos/*.jpg 2>/dev/null | grep -A2 photos`
Expected: all `JPEG image data`; hero ≥1900px wide, others ≥1500px wide. No file under 50KB (likely an error page) or over 1.5MB (will slow the build; re-download with `q=70`).

- [ ] **Step 4: USER GATE — visual approval of the six photos**

Open the six files (e.g. `qlmanage -p src/assets/photos/*.jpg` or screenshot a contact sheet) and show them to Fabian. **Do not proceed to Task 6 until he approves or swaps picks.** This gate is required by the spec ("Exact picks get a visual check with Fabian during implementation").

- [ ] **Step 5: Create the photo map `src/assets/photos/index.ts`**

```ts
import type { ImageMetadata } from 'astro';
import ecuador from './ecuador.jpg';
import colombia from './colombia.jpg';
import brasil from './brasil.jpg';
import panama from './panama.jpg';
import peru from './peru.jpg';

/** Destination slug (content collection id) → card/banner photo. */
export const DESTINATION_PHOTOS: Record<string, ImageMetadata> = {
  ecuador,
  colombia,
  brasil,
  panama,
  peru,
};

/** Fail the build loudly if a guide is added without a photo. */
export function photoFor(slug: string): ImageMetadata {
  const photo = DESTINATION_PHOTOS[slug];
  if (!photo) {
    throw new Error(
      `No photo for destination slug "${slug}" — add it to src/assets/photos/index.ts`
    );
  }
  return photo;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/assets/photos
git commit -m "feat: self-hosted destination + hero photography (Unsplash, user-approved)"
```

---

### Task 6: Homepage photo hero + trust strip + icon sections

**Files:**
- Modify: `src/pages/index.astro` (full rewrite below)

- [ ] **Step 1: Replace `src/pages/index.astro` with:**

```astro
---
import { getCollection } from 'astro:content';
import { Picture } from 'astro:assets';
import Base from '../layouts/Base.astro';
import WhatsAppButton from '../components/WhatsAppButton.astro';
import DestinationCard from '../components/DestinationCard.astro';
import IconWhatsApp from '../components/icons/IconWhatsApp.astro';
import IconSearch from '../components/icons/IconSearch.astro';
import IconPlane from '../components/icons/IconPlane.astro';
import IconLuggage from '../components/icons/IconLuggage.astro';
import IconPassport from '../components/icons/IconPassport.astro';
import IconPerson from '../components/icons/IconPerson.astro';
import IconCheck from '../components/icons/IconCheck.astro';
import heroLondon from '../assets/photos/hero-london.jpg';
import { SITE, DEFAULT_WA_TEXT } from '../config';

const destinations = (await getCollection('destinations')).sort(
  (a, b) => a.data.order - b.data.order
);
const experienceYears = new Date().getFullYear() - SITE.foundedYear;
---

<Base title={`${SITE.name} — Vuelos a Latinoamérica desde Londres`}>
  <!-- Hero: London photo, navy overlay, serif headline, trust strip -->
  <section class="relative isolate overflow-hidden px-4 pb-16 pt-14 text-white">
    <Picture
      src={heroLondon}
      formats={['avif', 'webp']}
      widths={[768, 1280, 1920]}
      sizes="100vw"
      alt=""
      class="absolute inset-0 -z-20 h-full w-full object-cover"
      loading="eager"
      fetchpriority="high"
    />
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-b from-[rgba(7,22,46,0.55)] to-[rgba(7,22,46,0.8)]"
    >
    </div>
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="text-4xl font-semibold leading-tight sm:text-5xl">
        Vuelos a Latinoamérica,
        <em class="text-sun-400">desde Londres</em>
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-lg text-navy-100">
        Te buscamos la mejor ruta y precio a Ecuador, Colombia, Brasil,
        Panamá y Perú. Atención personal en español, por WhatsApp, de una
        agencia registrada en el Reino Unido.
      </p>
      <div class="mt-8">
        <WhatsAppButton text={DEFAULT_WA_TEXT} />
      </div>
      <ul
        class="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-navy-100 sm:text-sm"
      >
        <li class="flex items-center gap-1.5">
          <IconCheck class="h-4 w-4 text-sun-400" /> Travel Fab Ltd · Reg. 08910640
        </li>
        <li class="flex items-center gap-1.5">
          <IconCheck class="h-4 w-4 text-sun-400" /> Desde {SITE.foundedYear}
        </li>
        <li class="flex items-center gap-1.5">
          <IconCheck class="h-4 w-4 text-sun-400" /> Respuesta rápida
        </li>
      </ul>
    </div>
  </section>

  <!-- Cómo funciona -->
  <section class="px-4 py-14">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-center text-2xl font-semibold text-navy-900 sm:text-3xl">
        Así de fácil
      </h2>
      <div class="mt-8 grid gap-6 sm:grid-cols-3">
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-full bg-navy-50 text-navy-800"
          >
            <IconWhatsApp class="h-6 w-6" />
          </div>
          <h3 class="mt-3 text-lg font-semibold text-navy-900">1. Escríbenos</h3>
          <p class="mt-2 text-sm leading-relaxed">
            Mándanos por WhatsApp tus fechas, destino y cuántas maletas
            necesitas llevar.
          </p>
        </div>
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-full bg-navy-50 text-navy-800"
          >
            <IconSearch class="h-6 w-6" />
          </div>
          <h3 class="mt-3 text-lg font-semibold text-navy-900">2. Te cotizamos</h3>
          <p class="mt-2 text-sm leading-relaxed">
            Buscamos entre aerolíneas y rutas la mejor opción real del día —
            con el equipaje y las escalas claras desde el inicio.
          </p>
        </div>
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-full bg-navy-50 text-navy-800"
          >
            <IconPlane class="h-6 w-6" />
          </div>
          <h3 class="mt-3 text-lg font-semibold text-navy-900">3. Vuela tranquilo</h3>
          <p class="mt-2 text-sm leading-relaxed">
            Reservamos por ti y quedamos pendientes hasta que llegues.
            Cualquier duda, nos escribes al mismo número.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Destinos -->
  <section class="px-4 pb-14">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-center text-2xl font-semibold text-navy-900 sm:text-3xl">
        Guías de vuelos por destino
      </h2>
      <p class="mx-auto mt-2 max-w-xl text-center text-navy-700">
        Rutas, equipaje, escalas y cuándo comprar — lo que de verdad
        necesitas saber antes de cotizar.
      </p>
      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {
          destinations.map((d) => (
            <DestinationCard
              slug={d.id}
              country={d.data.country}
              cities={d.data.cities}
              heroLine={d.data.heroLine}
            />
          ))
        }
      </div>
    </div>
  </section>

  <!-- Por qué nosotros -->
  <section class="bg-white px-4 py-14">
    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-2xl font-semibold text-navy-900 sm:text-3xl">
        ¿Por qué reservar con nosotros?
      </h2>
      <ul class="mx-auto mt-6 max-w-xl space-y-4 text-left">
        <li class="flex gap-3">
          <IconCheck class="mt-0.5 h-5 w-5 shrink-0 text-wa-700" />
          <span>
            <strong>Empresa real y registrada en el Reino Unido</strong> —
            {SITE.company}, n.º {SITE.companyNumber}.
          </span>
        </li>
        <li class="flex gap-3">
          <IconPlane class="mt-0.5 h-5 w-5 shrink-0 text-wa-700" />
          <span>
            <strong>Más de {experienceYears} años de experiencia</strong> en
            vuelos y viajes a Latinoamérica, desde {SITE.foundedYear}.
          </span>
        </li>
        <li class="flex gap-3">
          <IconLuggage class="mt-0.5 h-5 w-5 shrink-0 text-wa-700" />
          <span>
            <strong>Cotizamos con el equipaje que necesitas</strong> — nada de
            sorpresas en el aeropuerto por maletas no incluidas.
          </span>
        </li>
        <li class="flex gap-3">
          <IconPassport class="mt-0.5 h-5 w-5 shrink-0 text-wa-700" />
          <span>
            <strong>Rutas sin escala en EE. UU.</strong> — evitamos trámites de
            visa de tránsito para ti y tu familia.
          </span>
        </li>
        <li class="flex gap-3">
          <IconPerson class="mt-0.5 h-5 w-5 shrink-0 text-wa-700" />
          <span>
            <strong>Una persona, no un bot</strong> — el mismo número de
            WhatsApp antes, durante y después de tu viaje.
          </span>
        </li>
      </ul>
      <div class="mt-8">
        <WhatsAppButton text={DEFAULT_WA_TEXT} label="Empieza tu cotización" />
      </div>
    </div>
  </section>
</Base>
```

- [ ] **Step 2: Build**

Run: `pnpm build`
Expected: green. If the build fails with `MissingSharp`/"Could not find Sharp": run `pnpm add -D sharp` and rebuild.

- [ ] **Step 3: Verify output**

- `grep -c 'avif' dist/index.html` → ≥ 1 (Picture sources emitted)
- `grep -o 'fetchpriority="high"' dist/index.html | head -1` → present
- No emoji left on the homepage: `grep -o '💬\|🔎\|✈️\|🧳\|🛂\|🇬🇧' dist/index.html` → no output
- Hero budget: `ls -la dist/_astro/ | grep -i hero` → largest hero AVIF ≤ ~120KB

- [ ] **Step 4: Visual check**

`pnpm preview &`, screenshot `http://localhost:4321` at 1440×900 and 390×844. Hero photo with overlay + readable white serif headline + trust strip visible. Kill preview.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro package.json pnpm-lock.yaml
git commit -m "feat: photo hero with trust strip, SVG icon sections on homepage"
```

---

### Task 7: Destination card photos + guide page photo banners

**Files:**
- Modify: `src/components/DestinationCard.astro` (full rewrite)
- Modify: `src/pages/[slug].astro` (full rewrite)

- [ ] **Step 1: Replace `src/components/DestinationCard.astro` with:**

```astro
---
import { Picture } from 'astro:assets';
import { flagFor } from './flags';
import { photoFor } from '../assets/photos';

interface Props {
  slug: string;
  country: string;
  cities: string[];
  heroLine: string;
}

const { slug, country, cities, heroLine } = Astro.props;
const Flag = flagFor(slug);
const photo = photoFor(slug);
---

<a
  href={`/${slug}`}
  class="block overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
>
  <Picture
    src={photo}
    formats={['avif', 'webp']}
    widths={[400, 800]}
    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
    alt={`Foto de ${country}`}
    class="h-40 w-full object-cover"
    loading="lazy"
  />
  <div class="p-6">
    <Flag class="h-5 w-[30px] shadow-sm" />
    <h3 class="mt-3 text-xl font-bold text-navy-900">{country}</h3>
    <p class="mt-1 text-sm text-navy-700">{cities.join(' · ')}</p>
    <p class="mt-3 text-sm leading-relaxed">{heroLine}</p>
    <span class="mt-4 inline-block text-sm font-semibold text-navy-700">
      Ver guía de vuelos →
    </span>
  </div>
</a>
```

- [ ] **Step 2: Replace `src/pages/[slug].astro` with:**

```astro
---
import { getCollection, render } from 'astro:content';
import { Picture } from 'astro:assets';
import Base from '../layouts/Base.astro';
import WhatsAppButton from '../components/WhatsAppButton.astro';
import { flagFor } from '../components/flags';
import { photoFor } from '../assets/photos';

export async function getStaticPaths() {
  const destinations = await getCollection('destinations');
  return destinations.map((d) => ({
    params: { slug: d.id },
    props: { destination: d },
  }));
}

const { destination } = Astro.props;
const { Content } = await render(destination);
const { country, title, cities, heroLine, waText, priceNote } =
  destination.data;
const Flag = flagFor(destination.id);
const photo = photoFor(destination.id);
---

<Base title={title} description={heroLine} waText={waText}>
  <section class="relative isolate overflow-hidden px-4 py-14 text-white">
    <Picture
      src={photo}
      formats={['avif', 'webp']}
      widths={[768, 1280, 1600]}
      sizes="100vw"
      alt=""
      class="absolute inset-0 -z-20 h-full w-full object-cover"
      loading="eager"
      fetchpriority="high"
    />
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-b from-[rgba(7,22,46,0.55)] to-[rgba(7,22,46,0.8)]"
    >
    </div>
    <div class="mx-auto max-w-3xl">
      <Flag class="h-6 w-9 shadow-sm" />
      <h1 class="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
        {title}
      </h1>
      <p class="mt-3 text-navy-100">{cities.join(' · ')}</p>
      <div class="mt-6">
        <WhatsAppButton
          text={waText}
          label={`Cotizar vuelo a ${country}`}
          size="md"
        />
      </div>
    </div>
  </section>

  <article class="guide mx-auto max-w-3xl px-4 py-10">
    <Content />

    <div class="mt-10 rounded-2xl bg-white p-6 text-center shadow-sm">
      <p class="font-semibold text-navy-900">{priceNote}</p>
      <div class="mt-4">
        <WhatsAppButton text={waText} label={`Cotizar vuelo a ${country}`} />
      </div>
    </div>
  </article>
</Base>
```

- [ ] **Step 3: Build and verify**

Run: `pnpm build`
Expected: green; all five guide pages emitted (`ls dist/ecuador/index.html dist/colombia/index.html dist/brasil/index.html dist/panama/index.html dist/peru/index.html`). Card image budget: AVIF variants of destination photos at 800w ≤ ~40KB each (check `ls -la dist/_astro/`).

- [ ] **Step 4: Visual check**

`pnpm preview &`, screenshot `http://localhost:4321` (cards with photos) and `http://localhost:4321/ecuador` (photo banner). Text must stay readable over every photo — if any banner is too busy, deepen the overlay's first stop to `rgba(7,22,46,0.65)` for that check and re-verify. Kill preview.

- [ ] **Step 5: Commit**

```bash
git add src/components/DestinationCard.astro src/pages/\[slug\].astro
git commit -m "feat: destination card photos and guide page photo banners"
```

---

### Task 8: og:image / WhatsApp link previews

**Files:**
- Modify: `src/layouts/Base.astro` (ogImage prop + meta)
- Modify: `src/pages/index.astro` (pass hero)
- Modify: `src/pages/[slug].astro` (pass destination photo)

- [ ] **Step 1: Extend `src/layouts/Base.astro`**

Frontmatter — add imports and prop:

```astro
---
import '../styles/global.css';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import IconWhatsApp from '../components/icons/IconWhatsApp.astro';
import { SITE, waLink, DEFAULT_WA_TEXT } from '../config';

interface Props {
  title: string;
  description?: string;
  waText?: string;
  ogImage?: ImageMetadata;
}

const {
  title,
  description = SITE.description,
  waText = DEFAULT_WA_TEXT,
  ogImage,
} = Astro.props;
const canonical = new URL(Astro.url.pathname, SITE.url).href;
// 1200x630 JPEG for WhatsApp/social link previews; URL must be absolute.
const ogJpeg = ogImage
  ? await getImage({
      src: ogImage,
      width: 1200,
      height: 630,
      format: 'jpeg',
      fit: 'cover',
    })
  : null;
const ogImageUrl = ogJpeg ? new URL(ogJpeg.src, SITE.url).href : null;
---
```

Head — after the existing `og:locale` meta, add:

```astro
{
  ogImageUrl && (
    <Fragment>
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
    </Fragment>
  )
}
```

- [ ] **Step 2: Pass images from the pages**

`src/pages/index.astro`: change the Base opening tag to
`<Base title={`${SITE.name} — Vuelos a Latinoamérica desde Londres`} ogImage={heroLondon}>`

`src/pages/[slug].astro`: change the Base opening tag to
`<Base title={title} description={heroLine} waText={waText} ogImage={photo}>`

- [ ] **Step 3: Build and verify**

Run: `pnpm build`
Then:
- `grep -o 'og:image" content="https://fab.flights/[^"]*' dist/index.html` → one absolute `https://fab.flights/_astro/….jpg` URL
- `grep -o 'og:image" content="https://fab.flights/[^"]*' dist/ecuador/index.html` → present and different from the homepage one
- `grep -c 'summary_large_image' dist/index.html` → `1`

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro src/pages/index.astro src/pages/\[slug\].astro
git commit -m "feat: per-page og:image for WhatsApp link previews"
```

---

### Task 9: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Clean build from scratch**

Run: `rm -rf dist && pnpm build`
Expected: green, all 6 pages emitted.

- [ ] **Step 2: Spec checklist against `dist/`**

- Fonts: `ls dist/fonts/*.woff2 | wc -l` → `5`
- No display emoji anywhere: `grep -rlo '💬\|🔎\|✈️\|🧳\|🛂\|🇬🇧\|🇪🇨\|🇨🇴\|🇧🇷\|🇵🇦\|🇵🇪' dist/*.html dist/*/index.html` → only matches inside `wa.me` link hrefs (pre-filled WhatsApp messages), nowhere in visible HTML
- Trust: `grep -l '08910640' dist/index.html dist/ecuador/index.html` → both
- Budgets: list `dist/_astro/*.avif` sizes; hero ≤ ~120KB, cards ≤ ~40KB (largest variant each)
- Explicit dimensions: `grep -o '<img[^>]*' dist/index.html | grep -c 'width='` equals the img count (no CLS)

- [ ] **Step 3: Lighthouse (mobile)**

```bash
pnpm preview &
npx lighthouse http://localhost:4321 --only-categories=performance --form-factor=mobile --screenEmulation.mobile --chrome-flags="--headless" --output=json --output-path=/tmp/lh.json
node -e "console.log(require('/tmp/lh.json').categories.performance.score * 100)"
```

Expected: ≥ 95. If below: check the hero AVIF size and font preloads first. Kill preview after.

- [ ] **Step 4: Side-by-side screenshots for Fabian**

Screenshot homepage + one guide at 1440×900 and 390×844, show them to Fabian next to the approved mockup B for final sign-off.

- [ ] **Step 5: Deployment decision (USER GATE)**

Pushing `main` to GitHub auto-deploys to fab.flights via Coolify. **Ask Fabian before pushing.**

---

## Self-review (done at plan-writing time)

- **Spec coverage:** typography→T1, header/palette→T2, trust→T2+T6, icons→T3, flags→T4, order→T4, imagery→T5–T7, og→T8, verification→T9, guide banners→T7. "Not changing" list respected (no JS added, copy preserved except spec'd trust strip/bullet). ✓
- **Placeholders:** none — every code step has full code; the only open inputs (3 photo picks) are an explicit spec-mandated user gate with concrete search/download/verify procedure. ✓
- **Type consistency:** `flagFor`/`photoFor` defined in T4/T5, used in T6–T8; `SITE.companyNumber`/`foundedYear` defined in T2, used in T6; `ogImage?: ImageMetadata` matches `ImageMetadata` imports. ✓
