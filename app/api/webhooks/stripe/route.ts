import { NextResponse } from "next/server";
import { handleStripeWebhookEvent } from "@/lib/stripe-webhook-shared";
import { constructStripeEventOrResponse } from "@/lib/stripe-webhook-verify";

export const dynamic = "force-dynamic";

/**
 * CRITICAL WEBHOOK SECURITY:
 * - Uses request.text() to preserve raw body for signature verification
 * - Validates webhook secret mode matches API key mode
 * - Returns 200 immediately; event processing is async-queued
 *
 * MONITORING CHECKLIST:
 * - Alert if stripe_webhook_events.outcome = 'error' for > 5 events in 10 min (payment flow broken)
 * - Alert if checkout.session.completed events stop for > 30 min (customers can't complete orders)
 * - Alert if charge.dispute.created fires (chargeback — requires evidence submission within 7 days per event)
 * - Alert if webhook delivery failures exceed 3 consecutive days (Stripe will disable endpoint after ~14 days)
 * - Monitor processed_stripe_events.count as health metric (should grow steadily, flat = potential issue)
 * - Track payment_intent.payment_failed rate (spikes indicate fraud, payment method changes, or config issues)
 */
export async function POST(req: Request) {
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!whSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 503 },
    );
  }

  // CRITICAL: Validate webhook secret mode matches key mode
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && whSecret.startsWith("whsec_test_")) {
    console.error("FATAL: Using test webhook secret (whsec_test_*) in production");
    return NextResponse.json(
      { error: "Webhook secret misconfigured" },
      { status: 503 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  const verified = constructStripeEventOrResponse(body, sig, whSecret);
  if ("response" in verified) return verified.response;

  // CRITICAL: Return 200 immediately (within 20-30s requirement), queue event async.
  // Email sending and other side effects must not block webhook response.
  // Stripe webhook timeout = endpoint marked failed after retries.
  handleStripeWebhookEvent(verified.event).catch((err) => {
    console.error("[stripe-webhook] async event processing failed", err);
  });

  return NextResponse.json({ received: true });
}
