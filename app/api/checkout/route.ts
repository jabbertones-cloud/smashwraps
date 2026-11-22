import crypto from "node:crypto";
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

const MAX_CHECKOUT_BODY_BYTES = 16 * 1024;

const bodySchema = z.object({
  checkoutAttemptId: z.string().uuid(),
  lineItems: z.array(
    z.object({
      slug: z.enum(PRODUCT_SLUGS),
      quantity: z.number().int().min(1).max(99),
    }),
  ).max(PRODUCT_SLUGS.length),
});

export async function POST(req: Request) {
  let parsed: z.infer<typeof bodySchema>;
  try {
    const length = Number(req.headers.get("content-length"));
    if (length > MAX_CHECKOUT_BODY_BYTES) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }
    const reader = req.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_CHECKOUT_BODY_BYTES) {
        await reader.cancel();
        return NextResponse.json({ error: "Request body too large" }, { status: 413 });
      }
      chunks.push(value);
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    parsed = bodySchema.parse(JSON.parse(new TextDecoder().decode(body)));
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

  // Preserve the deployed v2 contract: stable attempt ID for retries, plus
  // cart, subtotal and shipping. A fresh checkout attempt gets a fresh key.
  // Do NOT include Date.now() here: that defeats idempotency (every retry would
  // bill separately if Stripe's response was lost mid-flight).
  const cartHash = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        checkoutAttemptId: parsed.checkoutAttemptId,
        lineItems: parsed.lineItems,
        subtotalCents,
        shippingCents,
      }),
    )
    .digest("hex")
    .substring(0, 24);
  const idempotencyKey = `checkout_retail_${cartHash}_v2`;

  const sessionPayload = {
    mode: "payment",
    line_items: sessionLineItems,
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    // Section 15 (stripe-guru v2): automatic_tax must be ON for every revenue
    // path. Retail wraps ship cross-state; without Stripe Tax computing the
    // destination tax we're out of compliance in every registered state.
    // Prerequisite: the Product rows this checkout references must have
    // `tax_code` set (e.g. `txcd_99999999` general tangible) and all non-zero
    // Prices must have `tax_behavior` ("exclusive" or "inclusive").
    automatic_tax: { enabled: true },
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: ["US"] },
    phone_number_collection: { enabled: true },
    metadata: {
      source: "smashwraps-retail",
      checkout_attempt_id: parsed.checkoutAttemptId,
      retail_subtotal_cents: String(subtotalCents),
      retail_shipping_cents: String(shippingCents),
      // TODO: Add order_id, customer_id, or user_session_id for reconciliation if user is logged in
    },
  } as Stripe.Checkout.SessionCreateParams;

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
