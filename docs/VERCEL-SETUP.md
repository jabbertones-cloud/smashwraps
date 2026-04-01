# Vercel setup (Smash Wraps)

**Cursor** (or any editor) only edits code and talks to **GitHub**. Deployments are **GitHub → Vercel**: Vercel clones the repo and runs `npm install` + `npm run build`. Nothing in Cursor needs to be “connected” to Vercel for this to work.

## Live project

- **Production:** [https://smashwraps.vercel.app](https://smashwraps.vercel.app)
- **Dashboard:** [scott-mantheys-projects / smashwraps](https://vercel.com/scott-mantheys-projects/smashwraps)
- **`.vercel/project.json`** is committed so the repo points at this project.

`NEXT_PUBLIC_SITE_URL` is set to `https://smashwraps.vercel.app` for **Production** (redeploy after changing).

If **`vercel git connect`** errors about Login Connection: your CLI is logged in as a different Vercel user than the browser (`vercel whoami`). Run `vercel logout`, then `vercel login` with the same email as [vercel.com/account](https://vercel.com/account), then run `vercel git connect` again — or connect the repo under **Project → Git** in the dashboard (works with GitHub `jabbertones-cloud` already linked).

## 1. One-time: link GitHub to Vercel

1. Sign in at [vercel.com](https://vercel.com) (GitHub SSO is fine).
2. **Settings → Git** (or during first import): install the **Vercel** GitHub app if prompted.
3. Under **GitHub**, grant access to the **`jabbertones-cloud`** org and the **`smashwraps`** repository (or “All repositories” if you prefer).

## 2. Create the project

1. Open [vercel.com/new](https://vercel.com/new).
2. **Import** `jabbertones-cloud/smashwraps`.
3. **Framework preset:** Next.js (auto-detected).
4. **Root directory:** `.` (leave default — repo root is the Next app).
5. **Build / Output:** defaults from `vercel.json` (`npm run build`).

Do **not** change the root to a subfolder unless you move the app.

## 3. Environment variables

Before or after the first deploy, open **Project → Settings → Environment Variables** and add every name from **`.env.example`**, with real values for **Production** (and **Preview** if you use test Stripe keys there).

Minimum for a working storefront:

| Name | Notes |
|------|--------|
| `NEXT_PUBLIC_SITE_URL` | Production URL, e.g. `https://smashwraps.com` or your `*.vercel.app` URL until the domain is attached |
| `STRIPE_SECRET_KEY` | Platform secret key |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook signing secret |
| `STRIPE_CONNECT_ACCOUNT_ID` | `acct_1THIPiIokkmXI2SV` |
| All `STRIPE_PRICE_*` | `price_...` IDs from the connected account |

Optional org JSON-LD: `NEXT_PUBLIC_ORG_*` — see `README.md`.

Redeploy after changing env vars so static pages pick up `NEXT_PUBLIC_*` values.

## 4. Stripe webhook

In [Stripe Dashboard](https://dashboard.stripe.com) (platform account):

1. **Developers → Webhooks → Add endpoint**
2. URL: `https://<your-production-domain>/api/webhooks/stripe`
3. Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET` on Vercel.
4. Enable events needed for your checkout flow; for Connect, include connected-account events if you use them.

## 5. Custom domain

**Project → Settings → Domains** → add `smashwraps.com` (or your domain) and set DNS as Vercel shows. Then set `NEXT_PUBLIC_SITE_URL` to that URL and **Redeploy**.

## 6. Optional: CLI on your machine

```bash
npm i -g vercel@latest
cd /path/to/smashwraps   # this repo root
vercel link              # attach folder to the Vercel project
vercel env pull .env.local   # optional: copy env to local dev
```

The live site still deploys from **git pushes** if Git integration is enabled; CLI is for previews and env sync.

## Troubleshooting

- **Build fails on “tracing” / missing files:** This repo sets `outputFileTracingRoot` only when **not** on Vercel (local monorepo). Standalone GitHub deploys use the default tracing.
- **Wrong repo / org not listed:** Re-check GitHub app permissions for `jabbertones-cloud`.
- **401 / Stripe errors in prod:** Almost always missing or wrong env vars on Vercel (Production).
