# Cloudflare + Vercel for `smashcones.com`

Open your zone in the Cloudflare dashboard: **Websites** → **smashcones.com**.

## 1. Add the domain in Vercel first

1. Open [Vercel → smashwraps → Settings → Domains](https://vercel.com/scott-mantheys-projects/smashwraps/settings/domains).
2. Add **`smashcones.com`** and **`www.smashcones.com`**.
3. Vercel will show the exact DNS records to create (prefer those over generic examples below).

## 2. DNS in Cloudflare

Go to **smashcones.com** → **DNS** → **Records**.

Typical setup (confirm against what Vercel displays for your project):

| Type | Name | Target | Proxy |
|------|------|--------|--------|
| **A** | `@` | `76.76.21.21` | DNS only (grey cloud) recommended for apex, or Proxied if you need Cloudflare features |
| **CNAME** | `www` | `cname.vercel-dns.com` | Often Proxied is OK |

**Note:** Vercel sometimes shows a **CNAME** for the apex via “CNAME flattening” depending on flow—use the records Vercel gives you after you add the domain.

- If you use **Proxied** (orange cloud): **SSL/TLS** → set mode to **Full (strict)** so the browser → Cloudflare → Vercel chain is encrypted end-to-end.
- If something mis-resolves, temporarily set records to **DNS only** (grey), verify the site loads on Vercel, then re-enable proxy.

## 3. After DNS propagates

1. In Vercel, wait until the domain shows **Valid Configuration**.
2. Set **`NEXT_PUBLIC_SITE_URL`** to `https://smashcones.com` (or `https://www.smashcones.com` if that’s canonical—pick one and redirect the other in Vercel **Domains**).
3. **Redeploy** the project so metadata, OG URLs, and sitemap use the new host.
4. In **Stripe** (checkout success/cancel URLs) and **webhooks**, update any hardcoded `smashwraps.vercel.app` URLs if you added them manually.

## 4. Optional Cloudflare tweaks for Next.js

- **Speed → Optimization:** Rocket Loader can conflict with React; keep it **off** for this site.
- **SSL/TLS → Edge Certificates:** enable **Always Use HTTPS**.
- **Caching:** For HTML, avoid aggressive cache rules that serve stale document shells; static assets on `/_next/static/` are safe to cache.

We cannot log into your Cloudflare or Vercel account from the repo—apply the steps above in those dashboards.
