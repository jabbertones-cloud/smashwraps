import "server-only";

import type Stripe from "stripe";
import { sendAbandonedStripeCheckoutEmail } from "@/lib/email/abandoned-checkout-notify";
import { sendPostPurchaseThankYou } from "@/lib/email/post-order-notify";
import { getStripe } from "@/lib/stripe-server";

/**
 * Shared handler after `constructEvent` — main and `/thin` webhook routes use the same logic.
 */
export async function handleStripeWebhookEvent(event: Stripe.Event): Promise<void> {
  if (event.account) {
    console.info("[stripe] event.account", event.account, event.type);
  }

  const stripe = getStripe();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.info("[stripe] checkout.session.completed", session.id, session.payment_status);
      try {
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
      console.info("[stripe] checkout.session.expired", session.id);
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
      console.warn("[stripe] payment_intent.payment_failed", pi.id);
      break;
    }
    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      console.warn("[stripe] charge.dispute.created", dispute.id);
      break;
    }
    default:
      break;
  }
}
