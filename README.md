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
- **`STRIPE_PRODUCT_*` + `STRIPE_PRICE_*`** — one **Product** (`prod_…`) and **Price** (`price_…`) per SKU. The server checks the Price is attached to that Product and matches the catalog amount — you do not send raw dollar amounts from the client. With Connect enabled, create these on the **connected account** (same as checkout).

**Create products & prices via the Stripe API (recommended):** put `STRIPE_SECRET_KEY` (and usually `STRIPE_CONNECT_ACCOUNT_ID`) in `.env.local`, then:

```bash
cd smashwraps-retail
# optional preview (no API calls)
npm run stripe:seed:dry

# needs STRIPE_SECRET_KEY in .env.local (and usually STRIPE_CONNECT_ACCOUNT_ID)
npm run stripe:seed
```

The script creates one Product + one one-time USD Price per SKU (1g = $4.75, 2g = $5.00), prints **`STRIPE_PRODUCT_*=prod_…`** and **`STRIPE_PRICE_*=price_…`** for Vercel or `.env.local`, and uses idempotency keys so a partial failure can be retried safely.

If a secret key was ever pasted into chat or a ticket, **rotate it** in the Dashboard.

### Payments security (Stripe)

- **Secrets stay server-side:** `STRIPE_SECRET_KEY` and all `STRIPE_PRODUCT_*` / `STRIPE_PRICE_*` values are **never** exposed to the browser — only read in API routes.
- **No client-chosen prices:** Checkout accepts **only** known product `slug` + quantity. The server maps each slug → allowlisted **Product + Price** IDs from env; clients cannot pass arbitrary `price_…` or amounts.
- **Catalog vs Stripe:** On each checkout, the server **retrieves** each Price, confirms it is attached to the expected **Product** (`prod_…`), then checks **amount + USD + one-time** match `lib/products.ts`. Wrong or swapped env fails closed (fix env or Stripe before taking orders).
- **Webhooks:** `/api/webhooks/stripe` verifies the **`Stripe-Signature`** with `STRIPE_WEBHOOK_SECRET` — do not disable signature verification.
- **Cart storage:** `localStorage` lines are sanitized to known slugs and quantity caps so tampered data cannot create odd client state (the server still enforces on checkout).

```bash
npm install
npm run dev
```

## Deploy (Vercel)

**First-time setup:** see **`docs/VERCEL-SETUP.md`** — connect the `jabbertones-cloud` GitHub org to Vercel, import `jabbertones-cloud/smashwraps`, add env vars. The app is configured with root **`vercel.json`**; Cursor/IDE only pushes to GitHub; Vercel deploys from Git.

- Set `NEXT_PUBLIC_SITE_URL` to the production URL (on Vercel: `https://smashwraps.vercel.app` until a custom domain is attached).
- Optional E-E-A-T (Organization JSON-LD on home): `NEXT_PUBLIC_ORG_SAME_AS` (comma-separated URLs), and any of `NEXT_PUBLIC_ORG_CONTACT_EMAIL`, `NEXT_PUBLIC_ORG_CONTACT_PHONE`, `NEXT_PUBLIC_ORG_CONTACT_URL`, `NEXT_PUBLIC_ORG_CONTACT_TYPE`. Redeploy after changing env so static pages pick up the new values.
- Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CONNECT_ACCOUNT_ID`, and all `STRIPE_PRICE_*` variables.
- Configure a **platform** webhook pointing to `https://<your-domain>/api/webhooks/stripe` and use its signing secret as `STRIPE_WEBHOOK_SECRET`. In the webhook destination settings, enable events from **connected accounts** if you want `checkout.session.completed` for Connect checkouts (see Stripe Connect webhook docs).

## Images

**Product images:** The repo includes **placeholder PNGs** (900×900) for all paths in **`lib/chop-images.ts`** so nothing 404s. Replace them in **`public/images/`** with your photography (**same filenames**), or run `npm run images:placeholders` to regenerate neutral placeholders. See **`public/images/ASSET-FILENAMES.txt`** for the list.

## Fonts (brand-font todo)

Headlines use **Bebas Neue** and body **DM Sans** via `next/font` (Google). For a licensed SMASH wordmark font, add files under `public/fonts` and register with `next/font/local` in `app/layout.tsx`.

## Optional media

Hero and How tiles can swap to video or lifestyle photography when assets exist (`optional-media-note.tsx`, `how-section.tsx`).

## Docs

- `docs/compliance-age-gating.md` — counsel / Stripe checklist
- `docs/seo-research-brief.md` — SERP research template
- `docs/MIROFISH-TRIBEV2-AUDIT.md` — design/copy case study vs MiroFish + TRIBE v2 framework
- `docs/SWARM-SEO-RUNBOOK.md` — Mission Control / goal-based SEO research from claw-architect
- `DEPLOY-GITHUB.md` — push to [jabbertones-cloud/smashwraps](https://github.com/jabbertones-cloud/smashwraps)
- `docs/VERCEL-SETUP.md` — import repo on Vercel, env vars, webhook, domain
- `docs/CLOUDFLARE-SMASHCONES.md` — DNS + SSL for `smashcones.com` on Cloudflare with Vercel
