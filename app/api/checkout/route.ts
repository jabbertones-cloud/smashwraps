import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import { getStripe, getStripeConnectRequestOptions } from "@/lib/stripe-server";
import { getProductBySlug, getStripePriceId } from "@/lib/products";

const bodySchema = z.object({
  lineItems: z.array(
    z.object({
      slug: z.string(),
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const lineItems: { price: string; quantity: number }[] = [];

  for (const line of parsed.lineItems) {
    const product = getProductBySlug(line.slug);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${line.slug}` },
        { status: 400 },
      );
    }
    const price = getStripePriceId(product);
    if (!price) {
      return NextResponse.json(
        {
          error: `Stripe Price ID not configured for ${product.slug}. Set ${product.stripePriceEnvKey} in the environment.`,
        },
        { status: 400 },
      );
    }
    lineItems.push({ price, quantity: line.quantity });
  }

  const stripe = getStripe();
  const connectOpts = getStripeConnectRequestOptions();

  const sessionPayload: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: lineItems,
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    automatic_tax: { enabled: false },
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: ["US"] },
    phone_number_collection: { enabled: true },
    metadata: {
      source: "smashwraps-retail",
    },
  };

  const session = connectOpts
    ? await stripe.checkout.sessions.create(sessionPayload, connectOpts)
    : await stripe.checkout.sessions.create(sessionPayload);

  if (!session.url) {
    return NextResponse.json(
      { error: "Checkout session missing redirect URL" },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
