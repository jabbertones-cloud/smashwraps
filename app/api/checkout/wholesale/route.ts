import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import {
  assertStripePriceMatchesCatalogRow,
  getStripe,
  getStripeConnectRequestOptions,
} from "@/lib/stripe-server";
import {
  getWholesaleProductBySlug,
  getWholesaleStripePriceId,
  getWholesaleStripeProductId,
  normalizeWholesaleSlug,
  WHOLESALE_PRODUCT_SLUGS,
} from "@/lib/wholesale-products";
import {
  computeWholesaleShippingCents,
  sumWholesaleMasterCases,
  WHOLESALE_SHIPPING_LINE_NAME,
} from "@/lib/shipping";
import { getCheckoutSiteOrigin } from "@/lib/site-url";

const bodySchema = z.object({
  lineItems: z.array(
    z.object({
      slug: z.enum(WHOLESALE_PRODUCT_SLUGS),
      quantity: z.number().int().min(1).max(99),
    }),
  ),
});

export async function POST(req: Request) {
  let parsed: z.infer<typeof bodySchema>;
  try {
    const json = (await req.json()) as {
      lineItems?: { slug: string; quantity: number }[];
    };
    if (json?.lineItems?.length) {
      json.lineItems = json.lineItems.map((li) => ({
        ...li,
        slug: normalizeWholesaleSlug(li.slug),
      }));
    }
    parsed = bodySchema.parse(json);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!parsed.lineItems.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payments not configured (STRIPE_SECRET_KEY)" },
      { status: 503 },
    );
  }

  const siteUrl = getCheckoutSiteOrigin();
  const lineItems: { price: string; quantity: number }[] = [];

  const stripe = getStripe();
  const connectOpts = getStripeConnectRequestOptions();
  const verifiedPriceKeys = new Set<string>();

  for (const line of parsed.lineItems) {
    const product = getWholesaleProductBySlug(line.slug);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${line.slug}` },
        { status: 400 },
      );
    }
    const price = getWholesaleStripePriceId(product);
    const stripeProductId = getWholesaleStripeProductId(product);
    if (!price || !stripeProductId) {
      return NextResponse.json(
        {
          error: `Stripe Product + Price IDs not configured for ${product.slug}. Set ${product.stripeProductEnvKey} and ${product.stripePriceEnvKey}. Run npm run stripe:seed:wholesale.`,
        },
        { status: 400 },
      );
    }
    const verifyKey = `${product.slug}:${price}`;
    if (!verifiedPriceKeys.has(verifyKey)) {
      verifiedPriceKeys.add(verifyKey);
      const check = await assertStripePriceMatchesCatalogRow(
        stripe,
        price,
        stripeProductId,
        {
          slug: product.slug,
          priceCents: product.priceCents,
          stripeProductEnvKey: product.stripeProductEnvKey,
          stripePriceEnvKey: product.stripePriceEnvKey,
        },
        connectOpts,
      );
      if (!check.ok) {
        return NextResponse.json({ error: check.message }, { status: 500 });
      }
    }
    lineItems.push({ price, quantity: line.quantity });
  }

  const masterCaseCount = sumWholesaleMasterCases(parsed.lineItems);
  const shippingCents = computeWholesaleShippingCents(masterCaseCount);

  const sessionLineItems: Stripe.Checkout.SessionCreateParams["line_items"] = [
    ...lineItems.map((li) => ({ price: li.price, quantity: li.quantity })),
  ];
  if (shippingCents > 0) {
    sessionLineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: WHOLESALE_SHIPPING_LINE_NAME,
          description: `${masterCaseCount} master case${masterCaseCount === 1 ? "" : "s"} × $1.50`,
        },
        unit_amount: shippingCents,
      },
      quantity: 1,
    });
  }

  // Deterministic idempotency key — same cart (SKUs, quantities, master cases,
  // shipping) always produces the same key. A network retry of the same
  // request will dedupe at Stripe; a modified cart produces a new session.
  const crypto = require("crypto");
  const wholesaleCartHash = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        lineItems: parsed.lineItems,
        masterCaseCount,
        shippingCents,
      }),
    )
    .digest("hex")
    .substring(0, 24);
  const idempotencyKey = `checkout_wholesale_${wholesaleCartHash}_v1`;

  const sessionPayload: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: sessionLineItems,
    automatic_payment_methods: { enabled: true },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/wholesale`,
    // Section 15 (stripe-guru v2): automatic_tax on every revenue path. B2B
    // resale customers typically supply a resale exemption certificate via
    // Stripe's customer_tax_exempt flow; that still requires automatic_tax to
    // be enabled so Stripe can honor the exemption. Disabling it is never the
    // right answer — tax-exempt customers still need zero-rate tax lines in
    // the invoice so downstream accounting reconciles cleanly.
    automatic_tax: { enabled: true },
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: ["US"] },
    phone_number_collection: { enabled: true },
    metadata: {
      source: "smashwraps-retail",
      channel: "wholesale",
      wholesale_master_cases: String(masterCaseCount),
      wholesale_shipping_cents: String(shippingCents),
    },
  };

  const session = connectOpts
    ? await stripe.checkout.sessions.create(sessionPayload, {
        ...connectOpts,
        idempotencyKey,
      })
    : await stripe.checkout.sessions.create(sessionPayload, { idempotencyKey });

  if (!session.url) {
    return NextResponse.json(
      { error: "Checkout session missing redirect URL" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
