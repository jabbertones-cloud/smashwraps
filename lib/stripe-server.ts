import "server-only";
import type { Product } from "@/lib/products";
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

/**
 * Confirms the Stripe Price object matches the catalog (amount + one-time USD).
 * Guards against mis-set env vars pointing at the wrong Price in Stripe.
 */
export async function assertStripePriceMatchesCatalog(
  stripe: Stripe,
  priceId: string,
  product: Product,
  requestOptions?: Stripe.RequestOptions,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const price = await stripe.prices.retrieve(priceId, requestOptions);
  if (price.currency !== "usd") {
    return { ok: false, message: "Stripe price must be USD for this storefront." };
  }
  if (price.recurring) {
    return { ok: false, message: "Subscription prices are not allowed for this storefront." };
  }
  if (price.unit_amount !== product.priceCents) {
    return {
      ok: false,
      message: `Stripe Price ${priceId} (${price.unit_amount ?? "?"}¢) does not match catalog for ${product.slug} (${product.priceCents}¢). Fix env or Stripe.`,
    };
  }
  return { ok: true };
}
