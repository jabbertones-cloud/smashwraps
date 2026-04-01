/**
 * Storefront shipping rules (must match checkout API line items).
 * Retail: flat per order; free at/above threshold. Wholesale: per master case.
 */

export const RETAIL_SHIPPING_FLAT_CENTS = 499; // $4.99
/** Subtotal at or above this (pre-shipping) qualifies for free retail shipping. */
export const RETAIL_FREE_SHIPPING_THRESHOLD_CENTS = 5000; // $50.00
export const WHOLESALE_SHIPPING_PER_MASTER_CASE_CENTS = 150; // $1.50

/** Stripe product line name for analytics filtering. */
export const RETAIL_SHIPPING_LINE_NAME = "Standard shipping";
export const WHOLESALE_SHIPPING_LINE_NAME = "Wholesale shipping";

export function computeRetailShippingCents(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  if (subtotalCents >= RETAIL_FREE_SHIPPING_THRESHOLD_CENTS) return 0;
  return RETAIL_SHIPPING_FLAT_CENTS;
}

export function sumWholesaleMasterCases(
  lineItems: { quantity: number }[],
): number {
  return lineItems.reduce((n, l) => n + l.quantity, 0);
}

export function computeWholesaleShippingCents(totalMasterCases: number): number {
  if (totalMasterCases <= 0) return 0;
  return totalMasterCases * WHOLESALE_SHIPPING_PER_MASTER_CASE_CENTS;
}
