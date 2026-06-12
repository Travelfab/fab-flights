# fab.flights

WhatsApp-first landing site for flights from the UK to Latin America
(Ecuador, Colombia, Brasil, Panamá, Perú). Spanish-only v1. Pure static
Astro — no database, no server runtime. Leads convert via `wa.me`
click-to-chat links with pre-filled per-destination messages (which double
as lead attribution).

## Stack

- [Astro 5](https://astro.build) — static output
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Zero client-side JavaScript

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # outputs static site to dist/
pnpm preview
```

## Edit content

- **Business details + WhatsApp number**: `src/config.ts`
  (`whatsappNumber` is digits-only international format, e.g. `447911123456`)
- **Destination guides**: `src/content/destinations/*.md` — frontmatter
  drives the cards/CTAs; markdown body is the guide. `factsVerified: false`
  marks guides whose route/airline specifics still need the research pass
  (see `TODO research pass` comments inside each file).

## Deploy (Coolify on EX44)

1. Push to GitHub → Coolify app (static build pack): build `pnpm build`,
   publish directory `dist/`.
2. Domain `fab.flights` — Cloudflare zone already exists:
   - **Keep the MX/Email Routing records** (active mail forwarding).
   - Add `A @ → 37.27.103.117` (proxied) + `CNAME www → fab.flights` (proxied).
   - **Remove the parked edge redirect rule** (301 → travelfab.co.uk) or the
     site will never be reached.
3. SSL: CF proxied + Traefik on EX44, same pattern as travelfab/mycuba.

## Launch checklist

- [ ] Real WhatsApp Business number in `src/config.ts`
- [ ] Fact-check pass on all 5 guides (`factsVerified: true` when done)
- [ ] Owner copy review (tone/wording)
- [ ] Coolify app created + GitHub auto-deploy wired
- [ ] CF DNS records added, parking redirect rule removed
- [ ] Live test of every `wa.me` link from a phone
