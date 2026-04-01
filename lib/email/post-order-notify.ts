import "server-only";
import type Stripe from "stripe";
import { sendResendEmail } from "@/lib/email/send-resend";
import {
  buildOrderFulfillmentNotifyHtml,
  buildOrderThankYouEmailHtml,
} from "@/lib/email/templates/transactional";
import { findProductByStripePriceId } from "@/lib/products";
import { findWholesaleProductByStripePriceId } from "@/lib/wholesale-products";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Ship-to from Checkout (shipping_details preferred). */
function formatAddressBlockHtml(session: Stripe.Checkout.Session): string {
  const ship = session.shipping_details;
  if (ship?.address) {
    return addressLinesHtml(ship.name, ship.address);
  }
  const cd = session.customer_details;
  if (cd?.address) {
    return addressLinesHtml(cd.name ?? null, cd.address);
  }
  return "<em>No address on this session — check Stripe Dashboard for details.</em>";
}

function addressLinesHtml(
  name: string | null | undefined,
  addr: Stripe.Address,
): string {
  const parts: string[] = [];
  if (name) parts.push(`<strong>${escapeHtml(name)}</strong>`);
  if (addr.line1) parts.push(escapeHtml(addr.line1));
  if (addr.line2) parts.push(escapeHtml(addr.line2));
  const cityState = [addr.city, addr.state, addr.postal_code].filter(Boolean).join(" ");
  if (cityState) parts.push(escapeHtml(cityState));
  if (addr.country) parts.push(escapeHtml(addr.country));
  return parts.join("<br/>");
}

/**
 * Branded thank-you email after Stripe reports a paid checkout (webhook).
 * Stripe still sends its own receipt; this is incremental brand touch + line recap.
 */
export async function sendPostPurchaseThankYou(input: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
  stripeAccount?: string;
  /** Stripe `Event.id` — Resend idempotency so webhook retries don’t duplicate email */
  stripeEventId?: string;
}): Promise<void> {
  const email =
    input.session.customer_details?.email ||
    input.session.customer_email ||
    null;
  if (!email) {
    console.info("[email] post_purchase skip: no email on session", input.session.id);
    return;
  }

  if (input.session.payment_status !== "paid") {
    console.info(
      "[email] post_purchase skip: payment_status",
      input.session.payment_status,
      input.session.id,
    );
    return;
  }

  const opts = input.stripeAccount
    ? { stripeAccount: input.stripeAccount }
    : undefined;

  const full = await input.stripe.checkout.sessions.retrieve(
    input.session.id,
    { expand: ["line_items.data.price"] },
    opts,
  );

  const items = full.line_items?.data;
  if (!items?.length) {
    console.warn("[email] post_purchase: no line items", input.session.id);
    return;
  }

  const lines: { title: string; quantity: number; lineTotal: string }[] = [];
  let anyWholesale = false;

  for (const li of items) {
    const qty = li.quantity ?? 1;
    const price = li.price;
    const priceId = typeof price === "string" ? price : price?.id;
    if (!priceId) continue;
    const retail = findProductByStripePriceId(priceId);
    const wholesale = findWholesaleProductByStripePriceId(priceId);
    if (wholesale) anyWholesale = true;
    const product = retail ?? wholesale;
    const title = product?.name ?? "Item";
    const lineCents =
      typeof li.amount_total === "number"
        ? li.amount_total
        : (typeof price === "object" && price?.unit_amount != null
            ? price.unit_amount * qty
            : (product?.priceCents ?? 0) * qty);
    lines.push({
      title,
      quantity: qty,
      lineTotal: fmt.format(lineCents / 100),
    });
  }

  const subtotal =
    full.amount_total != null
      ? fmt.format(full.amount_total / 100)
      : fmt.format(0);

  const html = buildOrderThankYouEmailHtml({
    lines,
    subtotal,
    sessionId: full.id,
    orderKind: anyWholesale ? "wholesale" : "retail",
  });

  await sendResendEmail({
    to: email,
    subject: anyWholesale
      ? "We got your wholesale order — Smash Wraps"
      : "We got your order — Smash Wraps",
    html,
    tags: [
      { name: "category", value: "transactional" },
      { name: "type", value: "post_purchase" },
    ],
    idempotencyKey: input.stripeEventId
      ? `stripe_evt_${input.stripeEventId}_post_purchase`
      : `post_purchase_session_${input.session.id}`,
  });

  const fulfillmentTo = process.env.ORDER_FULFILLMENT_NOTIFY_EMAIL?.trim();
  if (fulfillmentTo) {
    const fulfillHtml = buildOrderFulfillmentNotifyHtml({
      lines,
      subtotal,
      sessionId: full.id,
      orderKind: anyWholesale ? "wholesale" : "retail",
      customerEmail: email,
      customerName: full.customer_details?.name,
      customerPhone: full.customer_details?.phone,
      addressBlockHtml: formatAddressBlockHtml(full),
    });
    await sendResendEmail({
      to: fulfillmentTo,
      subject: `[Smash Wraps] New ${anyWholesale ? "wholesale" : "retail"} order — ${full.id.slice(-8)}`,
      html: fulfillHtml,
      tags: [
        { name: "category", value: "transactional" },
        { name: "type", value: "fulfillment_notify" },
      ],
      idempotencyKey: input.stripeEventId
        ? `stripe_evt_${input.stripeEventId}_fulfillment`
        : `fulfillment_session_${full.id}`,
      replyTo: email,
    });
  }
}
