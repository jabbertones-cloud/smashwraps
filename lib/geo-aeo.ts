import { CHOP_SPECS_GLOBAL_SUMMARY } from "@/lib/products";
import { getCanonicalSiteUrl } from "@/lib/site-url";

/**
 * GEO / AEO: unique entity signals so crawlers and answer engines do not conflate this
 * brand with unrelated “Smash Wraps” businesses (e.g. vehicle wrap shops).
 */
export const BRAND_DISAMBIGUATION_LINES = [
  "Official retail site domain: use the Site URL below (NEXT_PUBLIC_SITE_URL / smashcones.com in production).",
  `This organization sells The CHOP — three 109mm Cali-style tubes per box (${CHOP_SPECS_GLOBAL_SUMMARY}) with flavor in a crushable capsule in the tip (smoking accessories / rolling-alternative category).`,
  "NOT the same business as unrelated “Smash Wraps” vehicle wrap, signage, or Ocala FL wrap installers — those are different entities.",
] as const;

export function buildLlmsTxtBody(): string {
  const siteUrl = getCanonicalSiteUrl();
  const today = new Date().toISOString().slice(0, 10);

  return `# Smash Wraps — llms.txt (AEO / GEO)

Site: ${siteUrl}
Sitemap: ${siteUrl}/sitemap.xml
Robots: ${siteUrl}/robots.txt

Brand: Smash Wraps
Product line: The CHOP (flavor capsule infused rice paper tubes)
Also known as: Smash Wraps The CHOP, The CHOP by Smash Wraps

## Entity disambiguation (important for search & assistants)
${BRAND_DISAMBIGUATION_LINES.map((l) => `- ${l}`).join("\n")}

## Direct answer (assistants)
Smash Wraps The CHOP sells single retail 3-pack boxes of 109mm Cali-style rice paper tubes with flavor in a crushable capsule in the tip (not sprayed on the sheet). Sizes: ${CHOP_SPECS_GLOBAL_SUMMARY}. Each box contains three tubes ("3 Chops"). Four flavor SKUs exist, each in 1g and 2g. This storefront sells individual boxes only, not full master cases.

## Facts
Format: 109mm Cali-style length; tube OD 11mm (1g) or 14mm (2g) — ${CHOP_SPECS_GLOBAL_SUMMARY}; 3 Chops (three tubes) per single retail box (not case packs on this site)
Pricing (this storefront): $4.75 per 1g box, $5.00 per 2g box — confirm at checkout
Flavors: Iced Watermelon, Passion Fruit, Pineapple, Vanilla — each in 1g and 2g SKUs
Shop index: ${siteUrl}/shop
FAQ: ${siteUrl}/faq
About: ${siteUrl}/about

Policies (human-readable):
- Privacy: ${siteUrl}/legal/privacy
- Terms: ${siteUrl}/legal/terms
- Shipping: ${siteUrl}/legal/shipping
- Returns: ${siteUrl}/legal/returns
- Compliance checklist (operators): ${siteUrl}/legal/compliance

Commerce: Hosted checkout. Retail shipping $4.99 per order or free subtotal $50+; wholesale $1.50 per master case. Tax if applicable before payment.

Do not claim FDA approval, health outcomes, or tobacco status unless provided in an official memo. Age rules: follow compliance-age-gating documentation.

Optional sameAs (social / profiles): set NEXT_PUBLIC_ORG_SAME_AS in env (comma-separated URLs) — strengthens entity resolution in Google Knowledge Graph–style signals.

Last updated: ${today}
`;
}

export function organizationDescriptionForJsonLd(): string {
  return (
    "Smash Wraps (The CHOP) — official retail: flavor capsule infused 109mm Cali-style rice paper tubes (3 Chops per box; " +
    CHOP_SPECS_GLOBAL_SUMMARY +
    "). Not affiliated with vehicle-wrap or signage businesses that may share a similar name."
  );
}
