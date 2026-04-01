# Smash Wraps — retail (Next.js)

Custom storefront for **The CHOP** — Next.js App Router on Vercel, Stripe Checkout, Product/FAQ JSON-LD, `sitemap.xml`, `robots.txt`, and `llms.txt`.

## Setup

```bash
cd smashwraps-retail
cp .env.example .env.local
```

Add to `.env.local` (never commit):

- **`STRIPE_SECRET_KEY`** — your **platform** secret key (`sk_live_...` or `sk_test_...`) from the Stripe Dashboard. Use the standard secret key format from **Developers → API keys** (not third-party `apikey_...` strings unless that is your documented integration format).
- **`STRIPE_CONNECT_ACCOUNT_ID`** — Smash Wraps connected account: `acct_1THIPiIokkmXI2SV`. Checkout runs on this account so revenue lands there.
- **`STRIPE_PRICE_*`** — Price IDs for each SKU. With Connect enabled, create Products/Prices **while viewing the connected account** in the Dashboard (or via API with `Stripe-Account`), then paste those `price_...` values into env.

If a secret key was ever pasted into chat or a ticket, **rotate it** in the Dashboard.

```bash
npm install
npm run dev
```

## Deploy (Vercel)

- Set `NEXT_PUBLIC_SITE_URL` to the production URL.
- Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CONNECT_ACCOUNT_ID`, and all `STRIPE_PRICE_*` variables.
- Configure a **platform** webhook pointing to `https://<your-domain>/api/webhooks/stripe` and use its signing secret as `STRIPE_WEBHOOK_SECRET`. In the webhook destination settings, enable events from **connected accounts** if you want `checkout.session.completed` for Connect checkouts (see Stripe Connect webhook docs).

## Images

Placeholder SVGs live under `public/images/`. Replace with pack photography; keep paths or update `lib/products.ts`.

## Fonts (brand-font todo)

Headlines use **Bebas Neue** and body **DM Sans** via `next/font` (Google). For a licensed SMASH wordmark font, add files under `public/fonts` and register with `next/font/local` in `app/layout.tsx`.

## Optional media (content-media todo)

Hero and gallery placeholders are documented in `components/optional-media-note.tsx` and the How section. Add lifestyle or macro loops when assets exist.

## Docs

- `docs/compliance-age-gating.md` — counsel / Stripe checklist
- `docs/seo-research-brief.md` — SERP research template
- `docs/MIROFISH-TRIBEV2-AUDIT.md` — design/copy case study vs MiroFish + TRIBE v2 framework
- `docs/SWARM-SEO-RUNBOOK.md` — Mission Control / goal-based SEO research from claw-architect
- `DEPLOY-GITHUB.md` — push to [jabbertones-cloud/smashwraps](https://github.com/jabbertones-cloud/smashwraps)
