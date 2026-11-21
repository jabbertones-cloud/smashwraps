# Smashcones missing CSS/JS: Cloudflare legacy route split

Production finding, 2026-11-20:

- The `smashcones.com/*` and `www.smashcones.com/*` fallback routes execute the `smashwraps` Worker.
- More-specific `/_next/*`, `/shop*`, `/products/*`, `/checkout/*` and `/api/*` routes execute the separate `smashwraps-retail` Worker.
- Those two Workers have *different* immutable Next build manifests. The fallback Worker's homepage references CSS `03df95605575044f.css`, while the retail Worker can only serve CSS from its own build, such as `33dbc1aae83d095a.css`.
- Fetching the homepage's CSS from the retail route returns HTML 404. Its width overflowed to 1,208 px on a simulated 390 px viewport.
- A real-browser test of the homepage with stylesheet `https://smashwraps.smatdesigns.workers.dev/_next/static/css/03df95605575044f.css` returned `load=true` and restored 390 px document width.

## Contained recovery

Next.js `assetPrefix` sends the `smashwraps` HTML's generated `/_next/static/*` requests to the **same deployed Worker and asset version**, using its stable Cloudflare workers.dev origin. The existing `smashwraps-retail` checkout, product, Shop, API and webhook routing is not changed; payments and their secrets remain on the retail Worker. The OpenNext build and Cloudflare asset manifests are generated together. All hosting stays on Cloudflare.

## Acceptance and later cleanup

Verify HTML `<link rel=stylesheet>` / `<script>` use the workers.dev asset origin on fallback routes. Check CSS/JS 200, 390 px homepage/About/FAQ widths, both domains, Shop/product assets from retail, and GET health of payment endpoints without making any transaction. For durable consolidation, move static paths and public pages onto one canonical Worker only after safely reconciling retail bindings (including write-only Stripe webhook secret) and verifying checkout contracts. Do **not** change or delete `/_next/*`, `/api/*` or `/checkout/*` routes without that reconciliation.
