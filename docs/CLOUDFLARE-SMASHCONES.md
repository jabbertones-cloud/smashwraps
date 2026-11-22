# Smashcones Cloudflare Workers deployment and route authority

`https://smashcones.com` and `https://www.smashcones.com` are served through
Cloudflare Workers and managed DNS/TLS. Maintain the existing route table.

## Live route ownership (verified November 2026)

| URLs | Existing Worker | Safe deployment boundary |
| --- | --- | --- |
| `/`, `/faq`, `/about` and fallback pages | `smashwraps` | Existing `wrangler.jsonc` |
| `/shop*`, `/products/*`, `/wholesale`, `/checkout/*`, `/api/*`, `/_next/*` | `smashwraps-retail` | **Separate release requiring binding audit** |

The two Workers were built with different hashed Next assets. The `smashwraps`
Next.js `assetPrefix` intentionally requests its own CSS/JS directly from
`https://smashwraps.smatdesigns.workers.dev/_next/static/*`. The retail
Worker owns direct `https://smashcones.com/_next/static/*` requests.
Do not remove this routing exception until the two runtimes have been
consolidated with checkout and webhook regression coverage.

## Binding and rollout preflight

1. Read the current version and route inventory using Wrangler. Record version IDs.
2. Compare the existing Worker bindings to the candidate's explicit variables.
   The last inspected retail Worker had `ASSETS`, site/GA variables and a
   protected `STRIPE_WEBHOOK_SECRET` secret. That **does not prove** checkout,
   email, product-price or tax configuration is complete. Investigate before deploying.
3. Keep existing dashboard variables with `keep_vars=true` where configured.
   Cloudflare documents that secrets survive a Worker deployment, but binding
   changes and accidentally targeting a different Worker still require review.
4. Build the exact PR HEAD with `npm ci` and `npm run worker:build`, including
   the matching `.open-next/assets` manifest. Do not cross-mix Worker assets.
5. Run the bundle preview and test CSS/JS, navigation, product images, age gate,
   mobile 390px layout and error pages. Read-only GETs against checkout and
   webhooks must not make live Stripe sessions or trigger order updates.
6. After merge, rebuild exact MAIN, upload/deploy only the intended named
   Worker after release gates, and verify the new Cloudflare version and live
   CSS/JS referenced by the matching HTML. Keep an explicit rollback version.

## Verified source references

- Cloudflare Wrangler configuration: https://developers.cloudflare.com/workers/wrangler/configuration/
- Cloudflare versioned static assets: https://developers.cloudflare.com/workers/static-assets/
- Official OpenNext adapter: https://opennext.js.org/cloudflare/howtos/assets
- Initial route incident: `2026-11-20-smashcones-assets-incident.md`

Production deployment does not originate from an editor or a generic Git push.
GitHub is source control; Cloudflare Worker builds and deployments require an
explicit authorized release and live readback.
