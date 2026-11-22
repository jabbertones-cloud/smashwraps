# Smashcones Cloudflare release runbook

Source: `jabbertones-cloud/smashwraps` (GitHub). The repository exists;
source control and deployment are separate.

## Cloudflare Workers deployment

`smashcones.com` uses existing Cloudflare Worker routes, not a single universal Worker.
The fallback `smashwraps` Worker owns landing pages, FAQ, and About. The separate
`smashwraps-retail` Worker owns Shop, products, checkout, API and `/_next/*`.
Do not redirect, delete, or replace retail routes to publish a landing-page edit.

1. Merge a reviewed, tested PR to `main` and record the exact Git SHA.
2. On the authorized build runner, run `npm ci` and `npm run worker:build`.
3. Read live Worker bindings and routes **by name** before upload; compare with
   required runtime variables and the previous version. Never print secret values.
4. Publish only the correct Worker after verifying that its configuration preserves
   bindings and that `/_next` references resolve to the correct asset manifest.
5. Check the version in Cloudflare and HTTP 200 for each CSS/JS URL referenced by
   live HTML, plus homepage, Shop, product, checkout and API read-only behavior.
6. Keep the previous Worker version as rollback; do not transact real payments in tests.

**Release blocker:** This repo's `wrangler.jsonc` targets `smashwraps`, **not**
`smashwraps-retail`. A plain `npm run worker:deploy` therefore cannot be assumed
safe for the retail routes. See `docs/CLOUDFLARE-SMASHCONES.md` for split-route
preflight and the existing runtime-secret inventory. Never copy a webhook secret
from one Worker to another or substitute a guessed value.
