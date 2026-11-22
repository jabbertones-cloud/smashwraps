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

## Retail-only release role (two independent Workers)

The informational build defaults to `smashwraps` and retains its own
`assetPrefix`. Retail uses `SMASHCONES_WORKER_ROLE=retail npm run worker:build`
(or `npm run worker:build:retail`) and `wrangler.retail.jsonc`, which targets
only `smashwraps-retail`. The runtime route `/_next/*`
belongs to the retail Worker. Never deploy a retail build to `smashwraps`,
or an informational build to `smashwraps-retail`.

Before a retail rollout, compare its remote bindings and existing live version,
run both regression suites and the 390px browser smoke, verify that the retail
HTML references only retail assets, and upload a tagged Worker version with
`--strict --keep-vars` for preview. Uploading is not activation. Preserve the
existing `STRIPE_WEBHOOK_SECRET` without viewing or copying its value. Do not
change Stripe account bindings, enable charges, or make a real Checkout session
without completing the authorized payment review in issue #28.

Use `wrangler versions deploy` only after exact-MAIN verification and record
both the previous retail Worker version and the new one for rollback. The
informational Worker must remain on its independently verified version.

## Retail checkout compatibility recovered from live Cloudflare code

Before activating a new retail Worker, the August 5, 2026 active version
`0d9b682d-ccef-45bc-90d5-80dee14323d1` was downloaded with authorized
Cloudflare Worker Script Read access and inspected locally (the raw Worker
bundle, ~9.2 MB, is intentionally **not** committed). SHA-256 of the raw
multipart API response: `d6eba32b5b330bdb94295e438567e272cc8f4a3724446bf8f847a42b6316d605`.

Its retail checkout requires `checkoutAttemptId` as a UUID, reuses a browser
`crypto.randomUUID()` value on retry, includes that value in the cart/subtotal/
shipping SHA-256 idempotency fingerprint, labels the resulting Stripe key
`checkout_retail_<hash>_v2`, resets the attempt after a successful redirect,
and includes `checkout_attempt_id` in metadata. Its wholesale flow retains
`checkout_wholesale_<hash>_v1`. The production payloads do not include an
`automatic_payment_methods` field. The source repository had diverged to
retail v1 without the attempt ID; `test:checkout-parity` prevents reversion.

The code-parity check **does not** establish that Stripe can accept charges.
The existing live account reports `chargesEnabled=false`, and the retail
Worker has no `STRIPE_SECRET_KEY`. Keep Stripe setup and merchant review in
issue #28 and do not create any production payment session for release testing.

## Legacy hashed static-asset continuity (2026-11-22)

Cloudflare version skew can break browser tabs opened before a new Worker version
takes over: https://developers.cloudflare.com/workers/versions-and-deployments/version-skew/
The active August 5 retail HTML across Shop, Wholesale, checkout and eight
product pages references 22 distinct hashed assets (JS, CSS and fonts).
The exact allowlisted URLs, byte counts, and SHA-256 hashes are recorded in
scripts/retail-legacy-assets.json (795,866 bytes total). The dedicated retail
build runs official OpenNext, then scripts/retain-retail-legacy-assets.mjs,
and verifies every preserved file. The downloaded bytes come only from the
existing Cloudflare-hosted smashcones.com origin, and are checked against
the committed manifest. No old executable Worker code or secrets are copied
into source control.

Cloudflare asset manifests are per version. Keeping old hashed assets in the
new version supports already-open tabs. It does not eliminate propagation
risk for new HTML briefly served by a different edge during deployment.
Do not claim zero version skew without a two-phase manifest rollout.
Record old/new asset HTTP status during live acceptance and retain rollback.
The informational Worker has a separate asset origin.
