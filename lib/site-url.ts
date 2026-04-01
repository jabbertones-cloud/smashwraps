/**
 * NEXT_PUBLIC_SITE_URL is often set to a bare hostname (e.g. smashcones.com) in Vercel.
 * `new URL()` and metadataBase require a full origin with scheme.
 */

/** Default when NEXT_PUBLIC_SITE_URL is unset — production retail is smashcones.com. */
const DEFAULT_CANONICAL = "https://smashcones.com";

/** Ensures a usable absolute URL; prepends https:// when the env is host-only. */
export function normalizePublicSiteUrl(raw: string): string {
  let s = raw.trim().replace(/\/$/, "");
  if (!/^https?:\/\//i.test(s)) {
    s = `https://${s}`;
  }
  return s;
}

/** Metadata, OG, sitemap, JSON-LD, email links. */
export function getCanonicalSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_CANONICAL;
  return normalizePublicSiteUrl(raw);
}

/** Stripe success/cancel URLs — localhost when unset (local dev). */
export function getCheckoutSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "http://localhost:3000";
  return normalizePublicSiteUrl(raw);
}
