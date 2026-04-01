import { NextResponse } from "next/server";
import { handleStripeWebhookEvent } from "@/lib/stripe-webhook-shared";
import { constructStripeEventOrResponse } from "@/lib/stripe-webhook-verify";

export const dynamic = "force-dynamic";

/**
 * Second webhook endpoint (e.g. fewer events or separate signing secret in Stripe Dashboard).
 * Set `STRIPE_WEBHOOK_SECRET_THIN` to this destination’s signing secret.
 */
export async function POST(req: Request) {
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET_THIN;
  if (!whSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET_THIN not configured" },
      { status: 503 },
    );
  }

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  const verified = constructStripeEventOrResponse(body, sig, whSecret);
  if ("response" in verified) return verified.response;

  await handleStripeWebhookEvent(verified.event);
  return NextResponse.json({ received: true });
}
