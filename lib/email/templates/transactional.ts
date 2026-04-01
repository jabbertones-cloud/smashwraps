import { getSiteUrl } from "@/lib/email/site";
import { ctaButton, emailShell } from "@/lib/email/templates/wrap";

/**
 * Copy is tuned to MiroFish-style trust/friction reduction + TRIBE v2 website cohorts
 * (see docs/MIROFISH-TRIBEV2-AUDIT.md — Email flows section).
 * Keep claims factual; compliance owns product claims.
 */

export function buildWelcomeEmailHtml(): string {
  const url = getSiteUrl();
  const body = `
    <p><strong>You're subscribed.</strong> We’ll email restocks, product news, and occasional offers for <strong>The CHOP</strong> — flavor in the capsule tip, not sprayed on the sheet.</p>
    <p>One box = <strong>3 Chops</strong> (110mm tubes). Pick a flavor, then 1g or 2g.</p>
    ${ctaButton(`${url}/shop`, "Shop all flavors")}
    <p style="font-size:13px;color:#71717a;margin-top:20px;line-height:1.5;">Buying for a store or need case quantities? Use <a href="${url}/about" style="color:#facc15;">About</a> to reach us — this checkout is single boxes only.</p>
    <p style="font-size:12px;color:#52525b;margin-top:16px;">Adults <strong>21+</strong> where required. Unsubscribe from marketing anytime via the link in those emails.</p>
  `;
  return emailShell({
    title: "You're on the list",
    preheader: "Smash Wraps — restocks, news, and shop link inside",
    bodyHtml: body,
  });
}

export function buildCartReminderEmailHtml(input: {
  recoveryUrl: string;
  lines: { title: string; quantity: number; lineTotal: string }[];
  subtotal: string;
  /** `stripe_expired` = automated after Checkout session expired (webhook). */
  reminderSource?: "manual" | "stripe_expired";
}): string {
  const url = getSiteUrl();
  const rows = input.lines
    .map(
      (l) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #27272a;color:#fafafa;">${escape(l.title)} × ${l.quantity}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #27272a;">${escape(l.lineTotal)}</td></tr>`,
    )
    .join("");
  const intro =
    input.reminderSource === "stripe_expired"
      ? `<p>Your <strong>checkout session timed out</strong> before payment — <strong>nothing was charged</strong>. Here’s what was in your cart. <strong>Shipping and tax</strong> show at secure <strong>Stripe</strong> checkout.</p>`
      : `<p>You asked for a reminder. Here’s what was in your cart. <strong>Shipping and tax</strong> are shown before you pay — checkout is <strong>secure (Stripe)</strong>.</p>`;
  const body = `
    ${intro}
    <table role="presentation" width="100%" style="margin:12px 0 8px;font-size:14px;">${rows}
    <tr><td style="padding-top:12px;font-weight:600;">Subtotal</td><td align="right" style="padding-top:12px;font-weight:600;">${escape(input.subtotal)}</td></tr>
    </table>
    ${ctaButton(input.recoveryUrl, "Open site & restore cart")}
    <p style="font-size:13px;color:#71717a;margin-top:16px;line-height:1.5;">On your phone? Use the button above — your cart loads on our site. Or browse: <a href="${url}/shop" style="color:#facc15;">${escape(url.replace(/^https?:\/\//, ""))}/shop</a></p>
  `;
  const title =
    input.reminderSource === "stripe_expired"
      ? "Checkout timed out"
      : "Your cart — link inside";
  const pre =
    input.reminderSource === "stripe_expired"
      ? `Smash Wraps — session expired · ${input.subtotal} subtotal`
      : `Smash Wraps — cart · ${input.subtotal}`;
  return emailShell({
    title,
    preheader: pre,
    bodyHtml: body,
  });
}

export function buildOrderThankYouEmailHtml(input: {
  lines: { title: string; quantity: number; lineTotal: string }[];
  subtotal: string;
  sessionId: string;
}): string {
  const url = getSiteUrl();
  const rows = input.lines
    .map(
      (l) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #27272a;">${escape(l.title)} × ${l.quantity}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #27272a;">${escape(l.lineTotal)}</td></tr>`,
    )
    .join("");
  const body = `
    <p><strong>Thank you.</strong> Your payment went through — <strong>Stripe</strong> sends the official receipt to this address.</p>
    <p style="margin-top:12px;">Order summary:</p>
    <table role="presentation" width="100%" style="margin:12px 0;font-size:14px;">${rows}
    <tr><td style="padding-top:12px;font-weight:600;">Total</td><td align="right" style="padding-top:12px;font-weight:600;">${escape(input.subtotal)}</td></tr>
    </table>
    <p style="font-size:12px;color:#71717a;line-height:1.5;">Questions about shipping or returns? See <a href="${url}/legal/shipping" style="color:#facc15;">Shipping</a> and <a href="${url}/legal/returns" style="color:#facc15;">Returns</a>, or <a href="${url}/about" style="color:#facc15;">contact</a> via About.</p>
    <p style="font-size:11px;color:#52525b;word-break:break-all;">Order reference: ${escape(input.sessionId)}</p>
    ${ctaButton(`${url}/shop`, "Shop again")}
  `;
  return emailShell({
    title: "We got your order",
    preheader: "Smash Wraps — confirmation and summary inside",
    bodyHtml: body,
  });
}

/** Checkout abandoned on Stripe — user requested a nudge from /checkout/cancel. */
export function buildRemindMeLaterHtml(): string {
  const url = getSiteUrl();
  const body = `
    <p>No charge was made. When you’re ready, you’ll pick a <strong>flavor</strong> and <strong>1g or 2g</strong> — each retail box has <strong>three 110mm Chops</strong>, flavor in the capsule tip.</p>
    <p style="font-size:13px;color:#71717a;">Unsure about shipping or eligibility? Read <a href="${url}/faq" style="color:#facc15;">FAQ</a> first.</p>
    ${ctaButton(`${url}/shop`, "Go to shop")}
  `;
  return emailShell({
    title: "Still thinking it over?",
    preheader: "Smash Wraps — no payment taken",
    bodyHtml: body,
  });
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
