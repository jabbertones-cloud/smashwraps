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
# equivalent: checks .env.local exists or key is exported, then seeds all SKUs
npm run stripe:seed:all
```

The script creates one Product + one one-time USD Price per SKU (1g = $4.75, 2g = $5.00), prints **`STRIPE_PRODUCT_*=prod_…`** and **`STRIPE_PRICE_*=price_…`** for Vercel or `.env.local`, and uses idempotency keys so a partial failure can be retried safely.

**Product images on Stripe:** All art paths in `lib/chop-images.ts` resolve to **live, public `https://…/images/...` URLs** on your deployed site. `npm run stripe:images` sets each Stripe Product’s `images` field to those exact URLs (same files the PDP and shop load). Set **`NEXT_PUBLIC_SITE_URL`** to that deployed origin (or **`STRIPE_IMAGE_SITE_URL`** if the image host differs).

```bash
npm run stripe:images:dry   # print the URLs that will be sent to Stripe
npm run stripe:images       # PATCH each Product.images on Stripe (STRIPE_SECRET_KEY + Connect when set)
```

**Print existing Product/Price IDs for env:** `npm run stripe:print-env`

### Wholesale (`/wholesale`)

**Not in the sitemap** — page uses `robots: { index: false }` and is omitted from `app/sitemap.ts` (share link / buyers only). UI matches the rest of the site (dark, Bebas, flavor logos); the Skyn Patch repo was not in this workspace, so layout follows the existing retail shop patterns.

- **Catalog:** `lib/wholesale-products.ts` — 8 case SKUs (12 retail boxes per case). Example wholesale: **$42 / case (1g)**, **$45 / case (2g)**; suggested retail / case shown for reference.
- **Stripe:** `STRIPE_WHOLESALE_PRODUCT_*` + `STRIPE_WHOLESALE_PRICE_*` in `.env.example`. Create with:
  - `npm run stripe:seed:wholesale:dry` / `npm run stripe:seed:wholesale`
  - `npm run stripe:print-env:wholesale` — dump IDs from an existing account
  - `npm run stripe:images:wholesale:dry` / `npm run stripe:images:wholesale` — same live `/images/...` URLs as retail, on wholesale Products
- **Checkout:** `POST /api/checkout/wholesale` (allowlisted wholesale slugs only).
- **Email:** Post-purchase + abandoned Checkout resolve wholesale line items by Price ID; inquiry form posts to **`/api/email/wholesale-inquiry`** (confirmation to buyer; optional **`WHOLESALE_INQUIRY_TO_EMAIL`** for internal copy).

If a secret key was ever pasted into chat or a ticket, **rotate it** in the Dashboard.

### Payments security (Stripe)

- **Secrets stay server-side:** `STRIPE_SECRET_KEY` and all `STRIPE_PRODUCT_*` / `STRIPE_PRICE_*` (and wholesale `STRIPE_WHOLESALE_*`) values are **never** exposed to the browser — only read in API routes.
- **No client-chosen prices:** Checkout accepts **only** known product `slug` + quantity. The server maps each slug → allowlisted **Product + Price** IDs from env; clients cannot pass arbitrary `price_…` or amounts.
- **Catalog vs Stripe:** On each checkout, the server **retrieves** each Price, confirms it is attached to the expected **Product** (`prod_…`), then checks **amount + USD + one-time** match `lib/products.ts`. Wrong or swapped env fails closed (fix env or Stripe before taking orders).
- **Webhooks:** `/api/webhooks/stripe` uses **`STRIPE_WEBHOOK_SECRET`**; optional **`/api/webhooks/stripe/thin`** uses **`STRIPE_WEBHOOK_SECRET_THIN`** (same handler). Both verify **`Stripe-Signature`** — do not disable verification.
- **Cart storage:** `localStorage` lines are sanitized to known slugs and quantity caps so tampered data cannot create odd client state (the server still enforces on checkout).

```bash
npm install
npm run dev
```

## Deploy (Vercel)

**First-time setup:** see **`docs/VERCEL-SETUP.md`** — connect the `jabbertones-cloud` GitHub org to Vercel, import `jabbertones-cloud/smashwraps`, add env vars. The app is configured with root **`vercel.json`**; Cursor/IDE only pushes to GitHub; Vercel deploys from Git.

- Set `NEXT_PUBLIC_SITE_URL` to the production URL (on Vercel: `https://smashwraps.vercel.app` until a custom domain is attached).
- Optional E-E-A-T (Organization JSON-LD on home): `NEXT_PUBLIC_ORG_SAME_AS` (comma-separated URLs), and any of `NEXT_PUBLIC_ORG_CONTACT_EMAIL`, `NEXT_PUBLIC_ORG_CONTACT_PHONE`, `NEXT_PUBLIC_ORG_CONTACT_URL`, `NEXT_PUBLIC_ORG_CONTACT_TYPE`. Redeploy after changing env so static pages pick up the new values.
- Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CONNECT_ACCOUNT_ID`, all retail `STRIPE_PRICE_*` variables, and wholesale `STRIPE_WHOLESALE_*` if you use `/wholesale`.
- Configure a **platform** webhook pointing to `https://<your-domain>/api/webhooks/stripe` and use its signing secret as `STRIPE_WEBHOOK_SECRET`. Subscribe at least to **`checkout.session.completed`** and **`checkout.session.expired`** (abandoned Checkout email). In the webhook destination settings, enable events from **connected accounts** if you want those events for Connect checkouts (see Stripe Connect webhook docs).

## Images

**Product images:** The repo includes **placeholder PNGs** (900×900) for all paths in **`lib/chop-images.ts`** so nothing 404s. Replace them in **`public/images/`** with your photography (**same filenames**), or run `npm run images:placeholders` to regenerate neutral placeholders. See **`public/images/ASSET-FILENAMES.txt`** for the list.

## Fonts (brand-font todo)

Headlines use **Bebas Neue** and body **DM Sans** via `next/font` (Google). For a licensed SMASH wordmark font, add files under `public/fonts` and register with `next/font/local` in `app/layout.tsx`.

## Optional media

Hero and How tiles can swap to video or lifestyle photography when assets exist (`how-section.tsx`).

## Email (Resend)

Optional but recommended for launch: **welcome** (footer + success page), **cart recovery** (link restores cart via `?cart=`), **checkout-cancel nudge**, and **post-purchase thank-you** (Stripe webhook). Configure `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (verified domain). Optional: **`RESEND_WEBHOOK_SECRET`** for `POST /api/webhooks/resend` (delivery events; Svix-signed). Stripe webhooks should include **`checkout.session.completed`** and **`checkout.session.expired`** (abandoned Checkout → recovery email when email was entered). See **`docs/EMAIL-FLOWS.md`**.

**Marketing automation (optional):** With **`DATABASE_URL`** (e.g. Neon), `POST /api/email/subscribe` persists contacts, assigns a deterministic **A/B arm**, logs sends, and — when **`INNGEST_EVENT_KEY`** is set and the welcome send succeeds — schedules **1h / 24h / 72h** drips via **Inngest** (`/api/inngest`). Set **`EMAIL_UNSUBSCRIBE_SECRET`** so drip emails include a signed link to **`GET /api/email/unsubscribe`**. Run `npm run db:push` after provisioning Postgres. Local Inngest: `npx inngest-cli@latest dev`.

## Docs

- `docs/compliance-age-gating.md` — counsel / Stripe checklist
- `docs/EMAIL-FLOWS.md` — funnels, cart abandonment, post-purchase, env
- `docs/seo-research-brief.md` — SERP research template
- `docs/MIROFISH-TRIBEV2-AUDIT.md` — design/copy case study vs MiroFish + TRIBE v2 framework
- `docs/SWARM-SEO-RUNBOOK.md` — Mission Control / goal-based SEO research from claw-architect
- `DEPLOY-GITHUB.md` — push to [jabbertones-cloud/smashwraps](https://github.com/jabbertones-cloud/smashwraps)
- `docs/VERCEL-SETUP.md` — import repo on Vercel, env vars, webhook, domain
- `docs/CLOUDFLARE-SMASHCONES.md` — DNS + SSL for `smashcones.com` on Cloudflare with Vercel
