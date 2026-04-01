import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, getStripeConnectRequestOptions } from "@/lib/stripe-server";

/**
 * Returns GA4-safe purchase fields from a completed Checkout Session.
 * Used only for client-side `purchase` events (revenue matches Stripe).
 */
export async function GET(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  const opts = getStripeConnectRequestOptions();

  try {
    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      { expand: ["line_items.data.price.product"] },
      opts,
    );

    if (session.status !== "complete") {
      return NextResponse.json({ error: "Session not complete" }, { status: 400 });
    }

    const lineItems = session.line_items?.data ?? [];

    let shippingFromLinesCents = 0;
    const items: {
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const li of lineItems) {
      const price = li.price;
      const product = price?.product;
      let itemName = li.description ?? "Item";
      if (typeof product === "object" && product && "name" in product) {
        itemName = (product as Stripe.Product).name || itemName;
      }
      const unitAmount = price?.unit_amount ?? 0;
      const qty = li.quantity ?? 1;
      const lineCents = unitAmount * qty;
      const isShipping =
        /shipping/i.test(itemName) ||
        /shipping/i.test(li.description ?? "");

      if (isShipping) {
        shippingFromLinesCents += lineCents;
        continue;
      }

      items.push({
        item_id: price?.id ?? "unknown",
        item_name: itemName,
        price: unitAmount / 100,
        quantity: qty,
      });
    }

    const amountTotal = session.amount_total ?? 0;
    const tax = session.total_details?.amount_tax ?? 0;
    const shippingFromStripe = session.total_details?.amount_shipping ?? 0;
    const shippingCents =
      shippingFromStripe > 0 ? shippingFromStripe : shippingFromLinesCents;

    return NextResponse.json({
      transaction_id: session.id,
      value: amountTotal / 100,
      currency: (session.currency ?? "usd").toUpperCase(),
      tax: tax / 100,
      shipping: shippingCents / 100,
      items,
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
