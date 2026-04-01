import "server-only";

import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe-server";

export function constructStripeEventOrResponse(
  body: string,
  sig: string | null,
  whSecret: string,
): { event: Stripe.Event } | { response: NextResponse } {
  if (!sig) {
    return { response: NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 }) };
  }

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, sig, whSecret);
    return { event };
  } catch {
    return { response: NextResponse.json({ error: "Invalid signature" }, { status: 400 }) };
  }
}
