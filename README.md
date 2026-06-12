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

## Launch checklist — LAUNCHED 2026-06-12 ✅

- [x] Real WhatsApp Business number in `src/config.ts` (442071481727)
- [x] Fact-check pass on all 5 guides (routes verified 2026-06-12)
- [ ] Owner copy review (tone/wording) — post-launch polish welcome
- [x] Coolify app created (`b7xkbnyrrdw5qbxmd71z91d0` on EX44, project "Fab Flights") + GitHub push-to-deploy webhook wired & proven
- [x] CF DNS cut over (A → 37.27.103.117 proxied), parking redirect removed, www→root 301 added
- [ ] Live test of every `wa.me` link from a phone — owner to do

### Deploy notes (learned the hard way)

- Nixpacks builds with **pnpm 9** (from lockfile v9) — `pnpm-workspace.yaml`
  MUST have a `packages` field or pnpm 9 errors `packages field missing`.
  pnpm 9 ignores the `allowBuilds` key (pnpm 11 local needs it).
- Don't use corepack in the install command: Node 22.11's bundled corepack
  has stale signing keys AND can't launch pnpm 11
  (`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`).
- EX44 origin is firewalled to Cloudflare ranges — test through CF, not
  direct-to-origin.
- Coolify API token `claude-fab-flights-deploy` exists for automation
  (revoke/manage in Coolify → Security → API tokens).
