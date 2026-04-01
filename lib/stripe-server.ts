import "server-only";
import Stripe from "stripe";

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key, { apiVersion: "2025-02-24.acacia", typescript: true });
}

/**
 * Stripe Connect: when set, pass this as the second argument to API methods so they
 * run in the context of the Smash Wraps connected account (products/prices live there).
 */
export function getStripeConnectRequestOptions():
  | Stripe.RequestOptions
  | undefined {
  const id = process.env.STRIPE_CONNECT_ACCOUNT_ID?.trim();
  if (!id || !id.startsWith("acct_")) return undefined;
  return { stripeAccount: id };
}
