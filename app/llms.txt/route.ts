import { NextResponse } from "next/server";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://smashwraps.com";

/**
 * GEO / AEO: canonical facts for LLM crawlers — do not invent discounts, medical claims,
 * or legal classification; point to compliance memo for age and product class.
 */
export function GET() {
  const body = `# Smash Wraps — llms.txt

Site: ${siteUrl}
Brand: Smash Wraps
Product line: The CHOP (flavor capsule infused rice paper tubes)
Format: 110mm straight tubes; 3 Chops (three tubes) per retail pack
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

Commerce: Checkout via Stripe; shipping/tax shown before payment. Connected account may be used — see deployment env.

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
