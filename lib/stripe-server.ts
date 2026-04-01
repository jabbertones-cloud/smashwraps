import "server-only";
import type { Product } from "@/lib/products";
import Stripe from "stripe";

/** Shared shape for retail + wholesale catalog rows validated against Stripe Price. */
export type StripeCatalogRow = {
  slug: string;
  priceCents: number;
  stripeProductEnvKey: string;
  stripePriceEnvKey: string;
};

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
 * Confirms the Stripe Price belongs to the expected Product, amount, and currency.
 * Requires both `prod_…` and `price_…` in env so a swapped Price ID cannot point at another Product.
 */
export async function assertStripePriceMatchesCatalogRow(
  stripe: Stripe,
  priceId: string,
  expectedProductId: string,
  row: StripeCatalogRow,
  requestOptions?: Stripe.RequestOptions,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const price = await stripe.prices.retrieve(priceId, requestOptions);
  const linkedProductId =
    typeof price.product === "string" ? price.product : price.product?.id;
  if (!linkedProductId || linkedProductId !== expectedProductId) {
    return {
      ok: false,
      message: `Stripe Price ${priceId} is not attached to Product ${expectedProductId} (linked: ${linkedProductId ?? "none"}). Fix ${row.stripePriceEnvKey} / ${row.stripeProductEnvKey}.`,
    };
  }
  if (price.currency !== "usd") {
    return { ok: false, message: "Stripe price must be USD for this storefront." };
  }
  if (price.recurring) {
    return { ok: false, message: "Subscription prices are not allowed for this storefront." };
  }
  if (price.unit_amount !== row.priceCents) {
    return {
      ok: false,
      message: `Stripe Price ${priceId} (${price.unit_amount ?? "?"}¢) does not match catalog for ${row.slug} (${row.priceCents}¢). Fix env or Stripe.`,
    };
  }
  return { ok: true };
}

export async function assertStripePriceMatchesCatalog(
  stripe: Stripe,
  priceId: string,
  expectedProductId: string,
  product: Product,
  requestOptions?: Stripe.RequestOptions,
): Promise<{ ok: true } | { ok: false; message: string }> {
  return assertStripePriceMatchesCatalogRow(
    stripe,
    priceId,
    expectedProductId,
    {
      slug: product.slug,
      priceCents: product.priceCents,
      stripeProductEnvKey: product.stripeProductEnvKey,
      stripePriceEnvKey: product.stripePriceEnvKey,
    },
    requestOptions,
  );
}
