# fab.flights — Professional Polish ("Editorial" direction) — Design Spec

**Date:** 2026-06-12
**Status:** Approved by Fabian (direction B mockup, hero photo, trust facts, destination order rationale)
**Goal:** Make the site look and feel like an established travel agency while keeping it simple: static Astro, zero client-side JavaScript, Spanish-only, WhatsApp-first conversion.

## Approved decisions

- **Direction:** B "Editorial" — destination photography + serif headlines. Chosen over A "Pulido" (no images) and C "Ruta" (flight-route motif). B includes all of A's upgrades.
- **Homepage hero photo:** London landmark (anchors "desde Londres"; neutral across all five destinations).
- **Trust facts (verified on Companies House):** TRAVEL FAB LIMITED, company no. 08910640, incorporated 25 February 2014.
- **Destination order:** Ecuador pinned first (core WhatsApp community); rest ordered by research below.

## 1. Typography

- **Fraunces** (serif) for headings: weights 600 and 600-italic.
- **Outfit** (sans) for body/UI: weights 400, 600, 700.
- Self-hosted woff2 files in `public/fonts/` (latin subset covers Spanish diacritics), declared via `@font-face` in `global.css` with `font-display: swap`. Preload the heading font used above the fold in `Base.astro`.
- Tailwind theme: `--font-sans` becomes Outfit (with system fallback stack), new `--font-serif` for Fraunces. All `h1/h2/h3` move to the serif; body and UI elements (buttons, trust strip, nav) stay sans.
- No Google Fonts runtime requests — fonts are static files served from our origin.

## 2. Header & palette

- Header switches from navy to **white background, navy text**, green "Escríbenos" pill unchanged. Wordmark "fab.flights" set in Outfit 700 with the amber dot.
- Palette otherwise unchanged: navy scale, amber (`sun-*`) accents, WhatsApp green CTAs. Footer stays navy.

## 3. Icons & flags (kill all emoji)

- `src/components/icons/` — one small `.astro` component per inline SVG icon (outline style, 24px grid, `stroke-width: 2`, `currentColor`): `IconWhatsApp`, `IconSearch`, `IconPlane`, `IconLuggage`, `IconPassport`, `IconPerson`, `IconCheck`. These replace the 💬 🔎 ✈️ 🧳 🛂 🇬🇧 emoji in "Así de fácil" and "¿Por qué reservar con nosotros?".
- `src/components/flags/` — five inline SVG flag components (`FlagEC`, `FlagCO`, `FlagBR`, `FlagPA`, `FlagPE`), rendered 24×16 with 2px rounded corners; replace emoji flags in destination cards and guide-page heroes. (Emoji flags don't render as flags on Windows.)
- The existing WhatsApp path SVG in buttons stays as is.

## 4. Imagery system

- Originals in `src/assets/photos/` — downloaded from Unsplash (free commercial license, no attribution required) and self-hosted; never hotlinked.
  - `hero-london.jpg` — London landmark (Unsplash photo `1513635269975-59663e0ac1ad`).
  - One per destination, used by both the homepage card and that guide page's banner: `ecuador.jpg` (Quito/Andes), `colombia.jpg` (Cartagena), `brasil.jpg` (Rio), `panama.jpg` (Panama City skyline), `peru.jpg` (Machu Picchu/Cusco). Exact picks get a visual check with Fabian during implementation.
- Rendered via `astro:assets` `<Picture>`: AVIF + WebP with JPEG fallback, explicit `width`/`height` (zero CLS), responsive `widths`/`sizes`.
- Homepage hero: photo with navy gradient overlay `linear-gradient(rgba(7,22,46,.5), rgba(7,22,46,.75))`, white serif headline, existing CTA. `loading="eager"` + `fetchpriority="high"`.
- Destination cards: photo thumbnail on top (rounded top corners), `loading="lazy"`.
- Guide pages: photo banner behind the existing navy hero block, same overlay treatment.
- **Performance budget:** hero ≤ 120KB (AVIF, 1600w); each card image ≤ 40KB (800w). Total added page weight on the homepage ≤ 350KB.

## 5. OG images / WhatsApp link previews

- Per-page `og:image` (1200×630 JPEG generated at build via `getImage()` from the same source photos) with **absolute URLs**: homepage → London hero; each destination page → its destination photo.
- Add `twitter:card: summary_large_image` and `og:image:width/height`.
- Rationale: links to this site are shared inside WhatsApp groups — the preview card is the first impression.

## 6. Trust signals

- **Hero trust strip** (small sans text under CTA): "Travel Fab Ltd · Reg. 08910640" · "Desde 2014" · "Respuesta rápida". Replaces the current "Respuesta rápida · Sin compromiso · Hablamos tu idioma" line (keeps "Respuesta rápida"; no unverifiable claims added).
- **Footer legal line:** "Travel Fab Limited · Registrada en Inglaterra y Gales, n.º 08910640 · Desde 2014".
- `config.ts`: `company` corrected to registered name `'Travel Fab Limited'`; add `companyNumber: '08910640'` and `foundedYear: 2014`; derive the footer line from these (single source of truth).
- "¿Por qué reservar con nosotros?" gains a bullet referencing 12 años de experiencia (derivable from `foundedYear`; copy: "Más de 12 años de experiencia — agencia registrada en el Reino Unido desde 2014").

## 7. Destination order (research-backed, 2026-06-12)

New `order` frontmatter: **1 Ecuador · 2 Colombia · 3 Brasil · 4 Perú · 5 Panamá** (vs. today only Perú/Panamá swap).

Rationale — verified claims from the deep-research run:

- London diaspora ranking (2011 Census detail, *Towards Visibility*, Queen Mary University/Trust for London): Brazil 31,357 > Colombia 19,338 > **Ecuador 7,171** > Argentina > Venezuela > Mexico > Peru 3,301 > Chile > Bolivia 2,694. Ecuador is London's third-largest Latin American community — fab.flights' core catchment — so pinning it first is also data-coherent.
- Census 2021 (ONS TS012/Nomis, verified): 254,222 South America-born residents in England & Wales (largest Americas-origin group) vs. only 23,573 born in **all of Central America combined** (incl. Panama and Mexico) — hence Perú ranks above Panamá.
- Colombia is the largest *Spanish-speaking* community and has the only Spanish-LatAm direct route (LHR–Bogotá); Brazil is the largest market overall but Portuguese-speaking — Colombia sits second for a Spanish-first audience.

## 8. Out of scope (future work)

- **Bolivia and Venezuela guides** — research suggests both deserve pages (sizeable, London-concentrated, Spanish-speaking, no direct flights = high agency value-add; unverified Census 2021 data puts Venezuela's community above Ecuador's). Each needs the same fact-verification pass as the existing five guides before publishing.
- Reviews/testimonials section — only once real reviews exist (none today; nothing gets invented).
- English-language version; Mexico/Argentina/Chile guides (weaker diaspora-VFR fit).

## Not changing

Zero client-side JS · static Astro output · Spanish-only copy · page structure and copy (except the trust strip/bullet noted above) · WhatsApp CTAs and per-page pre-filled attribution texts · no new runtime dependencies (fonts are static files; `astro:assets`/sharp is built into Astro).

## Verification

- `pnpm build` green; visual pass on desktop (1440) and mobile (390) screenshots of homepage + one guide.
- Image checks: explicit dimensions everywhere (no CLS), budgets met, AVIF/WebP served.
- OG checks: absolute `og:image` URLs resolve, 1200×630.
- Lighthouse mobile performance ≥ 95 after the change.
- Companies House facts as displayed match register entry 08910640.

## Research provenance note

Deep-research run 2026-06-12 (wf_93b47c06): 9 claims fully verified (3-0/2-0 adversarial votes) — these are the only figures cited as facts above. Verification of ONS 2024 travel-volume and CAA 2023 route-level claims was aborted by an account spend limit; those figures are treated as unverified and excluded from load-bearing decisions (the order rests on verified Census/diaspora data plus the user's pinned Ecuador-first constraint).
