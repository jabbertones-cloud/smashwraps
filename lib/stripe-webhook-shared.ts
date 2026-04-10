import "server-only";

import type Stripe from "stripe";
import { sendAbandonedStripeCheckoutEmail } from "@/lib/email/abandoned-checkout-notify";
import { sendPostPurchaseThankYou } from "@/lib/email/post-order-notify";
import { getStripe } from "@/lib/stripe-server";
import { sql } from "@vercel/postgres";

/**
 * CRITICAL: Database-backed idempotency for webhook events.
 * Stripe guarantees "at-least-once" delivery; events normally arrive 2-3 times in production.
 * This check ensures deduplication persists across process restarts and is shared across instances.
 *
 * MONITORING CHECKLIST:
 * - Alert if stripe_webhook_events.outcome = 'error' for > 5 events in 10 min
 * - Alert if checkout.session.completed events stop (payment pipeline may be down)
 * - Alert if charge.dispute.created fires (chargeback — needs human attention within 7 days)
 * - Stripe notifies at stripe@example.com after 3 days of webhook delivery failures
 * - Track processed event count as a health metric (should grow steadily, not flat)
 */

/**
 * Ensure the webhook deduplication table exists (idempotent, safe on every startup).
 */
async function ensureWebhookDeduplicationTable(): Promise<void> {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS processed_stripe_events (
        stripe_event_id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        processed_at TIMESTAMP DEFAULT NOW()
      )
    `;
  } catch (err) {
    console.error("[stripe-webhook] Failed to ensure dedup table exists:", err);
    // Non-fatal: webhook processing continues with degraded dedup
  }
}

/**
 * Shared handler after `constructEvent` — main and `/thin` webhook routes use the same logic.
 */
export async function handleStripeWebhookEvent(event: Stripe.Event): Promise<void> {
  // Ensure table exists on first webhook (or after table is dropped/recreated)
  await ensureWebhookDeduplicationTable();

  // DATABASE-BACKED DEDUP: Atomic insert-or-skip pattern prevents double-processing across restarts/instances
  try {
    const result = await sql`
      INSERT INTO processed_stripe_events (stripe_event_id, event_type, processed_at)
      VALUES (${event.id}, ${event.type}, NOW())
      ON CONFLICT (stripe_event_id) DO NOTHING
    `;

    if (result.rowCount === 0) {
      console.info("[stripe] Duplicate event (already processed)", event.id);
      return;
    }
  } catch (error) {
    // If dedup fails even after table creation, log a warning but continue processing
    // (graceful degradation during DB issues; some duplicate processing may occur)
    console.warn("[stripe] Dedup check failed", {
      event_id: event.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  if (event.account) {
    console.info("[stripe] event.account", event.account, event.type);
  }

  const stripe = getStripe();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.info("[stripe] checkout.session.completed", session.id, session.payment_status);
      try {
        // NOTE: session.line_items is null in webhook event payload (Stripe design).
        // sendPostPurchaseThankYou proactively re-fetches the session with expand
        // to load line items. This pattern avoids blocking the webhook response.
        await sendPostPurchaseThankYou({
          session,
          stripe,
          stripeAccount: event.account ?? undefined,
          stripeEventId: event.id,
        });
      } catch (e) {
        console.error("[email] post_purchase failed", e);
      }
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.info("[stripe] checkout.session.expired", session.id, session.payment_status);

      // CRITICAL: Guard against sending abandoned cart email to customers who already paid.
      // checkout.session.expired fires even if payment was captured but fulfillment happened separately.
      if (session.payment_status === "paid") {
        console.info(
          "[stripe] Skipping abandoned email for PAID session",
          session.id,
          "— customer already converted"
        );
        break;
      }

      try {
        await sendAbandonedStripeCheckoutEmail({
          session,
          stripe,
          stripeAccount: event.account ?? undefined,
          stripeEventId: event.id,
        });
      } catch (e) {
        console.error("[email] abandoned_checkout failed", e);
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.warn("[stripe] payment_intent.payment_failed", {
        payment_intent_id: pi.id,
        customer_id: pi.customer,
        amount_cents: pi.amount,
        currency: pi.currency,
        last_error_code: pi.last_payment_error?.code,
        last_error_message: pi.last_payment_error?.message,
        last_error_type: pi.last_payment_error?.type,
        charge_id: pi.last_payment_error?.charge,
      });
      // TODO: Send alert to ops/payment team if critical failure type
      break;
    }
    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      console.error("[stripe] charge.dispute.created", {
        dispute_id: dispute.id,
        charge_id: dispute.charge,
        reason: dispute.reason,
        amount_cents: dispute.amount,
        currency: dispute.currency,
        status: dispute.status,
        evidence_due_by: new Date(dispute.evidence_due_by * 1000).toISOString(),
      });
      // CRITICAL: Alert payment team and ops. Disputes require evidence submission within deadline.
      // TODO: Integrate with Slack/PagerDuty for immediate notification.
      break;
    }
    case "payment_intent.canceled": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.warn("[stripe] payment_intent.canceled", {
        payment_intent_id: pi.id,
        customer_id: pi.customer,
        amount_cents: pi.amount,
        currency: pi.currency,
        cancellation_reason: pi.cancellation_reason,
      });
      // TODO: Update order status to "canceled" if order exists in DB
      // TODO: Optionally send cancellation notification to customer
      break;
    }
    case "customer.subscription.trial_will_end": {
      const subscription = event.data.object as Stripe.Subscription;
      console.info("[stripe] customer.subscription.trial_will_end", {
        subscription_id: subscription.id,
        customer_id: subscription.customer,
        trial_end: new Date(subscription.trial_end! * 1000).toISOString(),
      });
      // TODO: Send trial-ending reminder email (e.g., 3 days before trial ends)
      // This handler is a placeholder for future subscription product launches
      break;
    }
    default:
      break;
  }
}
