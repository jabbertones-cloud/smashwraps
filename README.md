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
