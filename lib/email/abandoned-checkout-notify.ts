import "server-only";
import type Stripe from "stripe";
import { encodeCartRecovery, type RecoveryLine } from "@/lib/cart-recovery";
import { getSiteUrl } from "@/lib/email/site";
import { sendResendEmail } from "@/lib/email/send-resend";
import { buildCartReminderEmailHtml } from "@/lib/email/templates/transactional";
import { findProductByStripePriceId } from "@/lib/products";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Fires on `checkout.session.expired` when the shopper entered an email but didn’t pay.
 * Same cart-recovery link pattern as manual “Email my cart” — fully automated trigger.
 */
export async function sendAbandonedStripeCheckoutEmail(input: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
  stripeAccount?: string;
  stripeEventId: string;
}): Promise<void> {
  const opts = input.stripeAccount
    ? { stripeAccount: input.stripeAccount }
    : undefined;

  const full = await input.stripe.checkout.sessions.retrieve(
    input.session.id,
    { expand: ["line_items.data.price"] },
    opts,
  );

  const email =
    full.customer_details?.email || full.customer_email || null;
  if (!email) {
    console.info(
      "[email] abandoned_checkout skip: no email on expired session",
      full.id,
    );
    return;
  }

  if (full.payment_status === "paid") {
    console.info("[email] abandoned_checkout skip: already paid", full.id);
    return;
  }

  const items = full.line_items?.data;
  if (!items?.length) {
    console.info("[email] abandoned_checkout skip: no line items", full.id);
    return;
  }

  const lines: RecoveryLine[] = [];
  const rows: { title: string; quantity: number; lineTotal: string }[] = [];
  let subtotalCents = 0;

  for (const li of items) {
    const qty = li.quantity ?? 1;
    const price = li.price;
    const priceId = typeof price === "string" ? price : price?.id;
    if (!priceId) continue;
    const catalog = findProductByStripePriceId(priceId);
    if (!catalog) continue;
    lines.push({ slug: catalog.slug, quantity: qty });
    const lineCents =
      typeof li.amount_total === "number"
        ? li.amount_total
        : catalog.priceCents * qty;
    subtotalCents += lineCents;
    rows.push({
      title: catalog.name,
      quantity: qty,
      lineTotal: fmt.format(lineCents / 100),
    });
  }

  if (!lines.length) {
    console.info("[email] abandoned_checkout skip: no catalog lines", full.id);
    return;
  }

  const site = getSiteUrl();
  const token = encodeCartRecovery(lines);
  const recoveryUrl = `${site}/?cart=${encodeURIComponent(token)}`;

  const html = buildCartReminderEmailHtml({
    recoveryUrl,
    lines: rows,
    subtotal: fmt.format(subtotalCents / 100),
    reminderSource: "stripe_expired",
  });

  await sendResendEmail({
    to: email,
    subject: "Smash Wraps — your cart is still waiting",
    html,
    tags: [
      { name: "category", value: "transactional" },
      { name: "type", value: "abandoned_checkout_stripe" },
    ],
    idempotencyKey: `stripe_evt_${input.stripeEventId}_abandoned_checkout`,
  });
}
