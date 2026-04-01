import "server-only";
import type Stripe from "stripe";
import { encodeCartRecovery, type RecoveryLine } from "@/lib/cart-recovery";
import { getSiteUrl } from "@/lib/email/site";
import { sendResendEmail } from "@/lib/email/send-resend";
import { buildCartReminderEmailHtml } from "@/lib/email/templates/transactional";
import { findProductByStripePriceId } from "@/lib/products";
import { findWholesaleProductByStripePriceId } from "@/lib/wholesale-products";

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
  let sawRetail = false;
  let sawWholesale = false;

  for (const li of items) {
    const qty = li.quantity ?? 1;
    const price = li.price;
    const priceId = typeof price === "string" ? price : price?.id;
    if (!priceId) continue;
    const retail = findProductByStripePriceId(priceId);
    const wholesale = findWholesaleProductByStripePriceId(priceId);
    const catalog = retail ?? wholesale;
    if (!catalog) continue;
    if (retail) {
      sawRetail = true;
      lines.push({ slug: retail.slug, quantity: qty });
    } else {
      sawWholesale = true;
    }
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

  if (!rows.length) {
    console.info("[email] abandoned_checkout skip: no catalog lines", full.id);
    return;
  }

  const site = getSiteUrl();
  const wholesaleOnly = sawWholesale && !sawRetail;
  const mixed = sawWholesale && sawRetail;

  let recoveryUrl: string;
  let recoveryContext: "retail" | "wholesale";
  if (mixed || wholesaleOnly) {
    recoveryUrl = `${site}/wholesale`;
    recoveryContext = "wholesale";
  } else {
    if (!lines.length) {
      console.info("[email] abandoned_checkout skip: no retail recovery lines", full.id);
      return;
    }
    const token = encodeCartRecovery(lines);
    recoveryUrl = `${site}/?cart=${encodeURIComponent(token)}`;
    recoveryContext = "retail";
  }

  const html = buildCartReminderEmailHtml({
    recoveryUrl,
    lines: rows,
    subtotal: fmt.format(subtotalCents / 100),
    reminderSource: "stripe_expired",
    recoveryContext,
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
