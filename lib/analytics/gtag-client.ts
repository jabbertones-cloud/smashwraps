"use client";

import type { Ga4Item } from "@/lib/analytics/ga4-ecommerce";

/** GA4 events; `gtag` is injected by `GoogleAnalytics` from `@next/third-parties/google`. */
export function sendGa4Event(
  name: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}

export function trackViewItemList(items: Ga4Item[], listName: string): void {
  sendGa4Event("view_item_list", {
    item_list_name: listName,
    items,
  });
}

export function trackViewItem(product: Ga4Item): void {
  sendGa4Event("view_item", {
    currency: "USD",
    value: product.price * product.quantity,
    items: [product],
  });
}

export function trackAddToCart(items: Ga4Item[], valueCents: number): void {
  sendGa4Event("add_to_cart", {
    currency: "USD",
    value: valueCents / 100,
    items,
  });
}

/**
 * Fires `begin_checkout` then runs `redirect` from `event_callback` when supported,
 * otherwise after a short fallback so the hit can dispatch before navigation.
 */
export function trackBeginCheckoutThenRedirect(
  items: Ga4Item[],
  valueCents: number,
  redirect: () => void,
): void {
  const payload: Record<string, unknown> = {
    currency: "USD",
    value: valueCents / 100,
    items,
    event_callback: redirect,
  };

  if (typeof window === "undefined") {
    redirect();
    return;
  }

  let finished = false;
  const safeRedirect = () => {
    if (finished) return;
    finished = true;
    redirect();
  };

  const fallback = window.setTimeout(() => safeRedirect(), 2000);

  const wrapped: Record<string, unknown> = {
    ...payload,
    event_callback: () => {
      window.clearTimeout(fallback);
      safeRedirect();
    },
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", "begin_checkout", wrapped);
  } else {
    window.clearTimeout(fallback);
    redirect();
  }
}

export type PurchasePayload = {
  transaction_id: string;
  value: number;
  tax?: number;
  shipping?: number;
  currency: string;
  items: Ga4Item[];
};

export function trackPurchase(payload: PurchasePayload): void {
  sendGa4Event("purchase", {
    transaction_id: payload.transaction_id,
    value: payload.value,
    currency: payload.currency,
    tax: payload.tax,
    shipping: payload.shipping,
    items: payload.items,
  });
}
