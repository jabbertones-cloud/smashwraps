import "server-only";
import type Stripe from "stripe";
import { sendResendEmail } from "@/lib/email/send-resend";
import { buildOrderThankYouEmailHtml } from "@/lib/email/templates/transactional";
import { findProductByStripePriceId } from "@/lib/products";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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

  for (const li of items) {
    const qty = li.quantity ?? 1;
    const price = li.price;
    const priceId = typeof price === "string" ? price : price?.id;
    if (!priceId) continue;
    const product = findProductByStripePriceId(priceId);
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
  });

  await sendResendEmail({
    to: email,
    subject: "We got your order — Smash Wraps",
    html,
    tags: [
      { name: "category", value: "transactional" },
      { name: "type", value: "post_purchase" },
    ],
    idempotencyKey: input.stripeEventId
      ? `stripe_evt_${input.stripeEventId}_post_purchase`
      : `post_purchase_session_${input.session.id}`,
  });
}
