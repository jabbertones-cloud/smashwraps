import { NextResponse } from "next/server";
import { getCanonicalSiteUrl } from "@/lib/site-url";

/**
 * GEO / AEO: canonical facts for LLM crawlers — do not invent discounts, medical claims,
 * or legal classification; point to compliance memo for age and product class.
 */
export function GET() {
  const siteUrl = getCanonicalSiteUrl();
  const body = `# Smash Wraps — llms.txt

Site: ${siteUrl}
Brand: Smash Wraps
Product line: The CHOP (flavor capsule infused rice paper tubes)
Format: 110mm straight tubes; 3 Chops (three tubes) per single retail box (not case packs on this site)
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

Last updated: ${new Date().toISOString().slice(0, 10)}
`;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
