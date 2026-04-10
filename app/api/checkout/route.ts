import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import {
  assertStripePriceMatchesCatalog,
  getStripe,
  getStripeConnectRequestOptions,
} from "@/lib/stripe-server";
import {
  getProductBySlug,
  getStripePriceId,
  getStripeProductId,
  PRODUCT_SLUGS,
} from "@/lib/products";
import {
  computeRetailShippingCents,
  RETAIL_SHIPPING_LINE_NAME,
} from "@/lib/shipping";
import { getCheckoutSiteOrigin } from "@/lib/site-url";

const bodySchema = z.object({
  lineItems: z.array(
    z.object({
      slug: z.enum(PRODUCT_SLUGS),
      quantity: z.number().int().min(1).max(99),
    }),
  ),
});

export async function POST(req: Request) {
  let parsed: z.infer<typeof bodySchema>;
  try {
    const json = await req.json();
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
  let subtotalCents = 0;

  const stripe = getStripe();
  const connectOpts = getStripeConnectRequestOptions();
  const verifiedPriceKeys = new Set<string>();

  for (const line of parsed.lineItems) {
    const product = getProductBySlug(line.slug);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${line.slug}` },
        { status: 400 },
      );
    }
    const price = getStripePriceId(product);
    const stripeProductId = getStripeProductId(product);
    if (!price || !stripeProductId) {
      return NextResponse.json(
        {
          error: `Stripe Product + Price IDs not configured for ${product.slug}. Set ${product.stripeProductEnvKey} (prod_…) and ${product.stripePriceEnvKey} (price_…). Run npm run stripe:seed or paste from Dashboard.`,
        },
        { status: 400 },
      );
    }
    const verifyKey = `${product.slug}:${price}`;
    if (!verifiedPriceKeys.has(verifyKey)) {
      verifiedPriceKeys.add(verifyKey);
      const check = await assertStripePriceMatchesCatalog(
        stripe,
        price,
        stripeProductId,
        product,
        connectOpts,
      );
      if (!check.ok) {
        return NextResponse.json({ error: check.message }, { status: 503 });
      }
    }
    lineItems.push({ price, quantity: line.quantity });
    subtotalCents += product.priceCents * line.quantity;
  }

  const shippingCents = computeRetailShippingCents(subtotalCents);

  const sessionLineItems: Stripe.Checkout.SessionCreateParams["line_items"] = [
    ...lineItems.map((li) => ({ price: li.price, quantity: li.quantity })),
  ];
  if (shippingCents > 0) {
    sessionLineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: RETAIL_SHIPPING_LINE_NAME,
          description:
            "Flat rate per order · free shipping on orders of $50 or more (before shipping)",
        },
        unit_amount: shippingCents,
      },
      quantity: 1,
    });
  }

  // CRITICAL: Generate deterministic idempotency key to prevent duplicate sessions on timeout retry.
  // Use hash of cart contents so same cart = same idempotency key.
  const crypto = require("crypto");
  const cartHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(parsed.lineItems))
    .digest("hex")
    .substring(0, 12); // Stripe idempotency key max 255 chars
  const idempotencyKey = `checkout_${Date.now()}_${cartHash}`;

  const sessionPayload: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: sessionLineItems,
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    automatic_tax: { enabled: false },
    automatic_payment_methods: { enabled: true },
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: ["US"] },
    phone_number_collection: { enabled: true },
    metadata: {
      source: "smashwraps-retail",
      retail_subtotal_cents: String(subtotalCents),
      retail_shipping_cents: String(shippingCents),
      // TODO: Add order_id, customer_id, or user_session_id for reconciliation if user is logged in
    },
  };

  const session = connectOpts
    ? await stripe.checkout.sessions.create(sessionPayload, {
        ...connectOpts,
        idempotencyKey,
      })
    : await stripe.checkout.sessions.create(sessionPayload, {
        idempotencyKey,
      });

  if (!session.url) {
    return NextResponse.json(
      { error: "Checkout session missing redirect URL" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
