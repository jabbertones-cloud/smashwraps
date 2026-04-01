import { getSiteUrl } from "@/lib/email/site";
import { ctaButton, emailShell } from "@/lib/email/templates/wrap";

/**
 * Copy is tuned to MiroFish-style trust/friction reduction + TRIBE v2 website cohorts
 * (see docs/MIROFISH-TRIBEV2-AUDIT.md — Email flows section).
 * Keep claims factual; compliance owns product claims.
 */

export function buildWelcomeEmailHtml(arm: "a" | "b" = "a"): string {
  const url = getSiteUrl();
  const intro =
    arm === "a"
      ? `<p><strong>You're subscribed.</strong> We’ll email restocks, product news, and occasional offers for <strong>The CHOP</strong> — flavor in the capsule tip, not sprayed on the sheet.</p>`
      : `<p><strong>Welcome.</strong> You’re on the list for <strong>The CHOP</strong> — we’ll share restocks, short product notes, and occasional offers. No fluff.</p>`;
  const body = `
    ${intro}
    <p>One box = <strong>3 Chops</strong> (110mm tubes). Pick a flavor, then 1g or 2g.</p>
    ${ctaButton(`${url}/shop`, "Shop all flavors")}
    <p style="font-size:13px;color:#71717a;margin-top:20px;line-height:1.5;">Buying for a store or need case pricing? See the <a href="${url}/wholesale" style="color:#facc15;">wholesale sales sheet</a> (not indexed — link only).</p>
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
  /** Wholesale checkout uses `/wholesale` recovery instead of cart token. */
  recoveryContext?: "retail" | "wholesale";
}): string {
  const url = getSiteUrl();
  const rows = input.lines
    .map(
      (l) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #27272a;color:#fafafa;">${escape(l.title)} × ${l.quantity}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #27272a;">${escape(l.lineTotal)}</td></tr>`,
    )
    .join("");
  const isWholesale = input.recoveryContext === "wholesale";
  const intro =
    input.reminderSource === "stripe_expired"
      ? isWholesale
        ? `<p>Your <strong>wholesale checkout session timed out</strong> before payment — <strong>nothing was charged</strong>. Here’s your line summary. Return to the sales sheet to try again; <strong>shipping and tax</strong> appear before you pay.</p>`
        : `<p>Your <strong>checkout session timed out</strong> before payment — <strong>nothing was charged</strong>. Here’s what was in your cart. <strong>Shipping and tax</strong> show before you pay.</p>`
      : isWholesale
        ? `<p>You asked for a reminder. Here’s your wholesale line summary. <strong>Shipping and tax</strong> are shown at checkout — payment is secure.</p>`
        : `<p>You asked for a reminder. Here’s what was in your cart. <strong>Shipping and tax</strong> are shown before you pay — checkout is secure.</p>`;
  const body = `
    ${intro}
    <table role="presentation" width="100%" style="margin:12px 0 8px;font-size:14px;">${rows}
    <tr><td style="padding-top:12px;font-weight:600;">Subtotal</td><td align="right" style="padding-top:12px;font-weight:600;">${escape(input.subtotal)}</td></tr>
    </table>
    ${ctaButton(
      input.recoveryUrl,
      isWholesale ? "Open wholesale sales sheet" : "Open site & restore cart",
    )}
    <p style="font-size:13px;color:#71717a;margin-top:16px;line-height:1.5;">${
      isWholesale
        ? `Reorder on the <a href="${url}/wholesale" style="color:#facc15;">wholesale page</a> (share link only — not in search).`
        : `On your phone? Use the button above — your cart loads on our site. Or browse: <a href="${url}/shop" style="color:#facc15;">${escape(url.replace(/^https?:\/\//, ""))}/shop</a>`
    }</p>
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
  orderKind?: "retail" | "wholesale";
}): string {
  const url = getSiteUrl();
  const wholesale = input.orderKind === "wholesale";
  const rows = input.lines
    .map(
      (l) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #27272a;">${escape(l.title)} × ${l.quantity}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #27272a;">${escape(l.lineTotal)}</td></tr>`,
    )
    .join("");
  const body = `
    <p><strong>Thank you.</strong> Your payment went through — you’ll receive the official receipt by email at this address.</p>
    ${
      wholesale
        ? `<p style="margin-top:8px;font-size:13px;color:#a1a1aa;">This was a <strong>wholesale master case</strong> order (8× three-packs per case — see sales sheet). Fulfillment follows the same shipping policies unless your account team says otherwise.</p>`
        : ""
    }
    <p style="margin-top:12px;">Order summary:</p>
    <table role="presentation" width="100%" style="margin:12px 0;font-size:14px;">${rows}
    <tr><td style="padding-top:12px;font-weight:600;">Total</td><td align="right" style="padding-top:12px;font-weight:600;">${escape(input.subtotal)}</td></tr>
    </table>
    <p style="font-size:12px;color:#71717a;line-height:1.5;">Questions about shipping or returns? See <a href="${url}/legal/shipping" style="color:#facc15;">Shipping</a> and <a href="${url}/legal/returns" style="color:#facc15;">Returns</a>, or <a href="${url}/about" style="color:#facc15;">contact</a> via About.</p>
    <p style="font-size:11px;color:#52525b;word-break:break-all;">Order reference: ${escape(input.sessionId)}</p>
    ${ctaButton(wholesale ? `${url}/wholesale` : `${url}/shop`, wholesale ? "Wholesale sheet" : "Shop again")}
  `;
  return emailShell({
    title: wholesale ? "We got your wholesale order" : "We got your order",
    preheader: wholesale
      ? "Smash Wraps wholesale — confirmation inside"
      : "Smash Wraps — confirmation and summary inside",
    bodyHtml: body,
  });
}

export function buildWholesaleInquiryThankYouHtml(input: {
  businessName: string;
}): string {
  const url = getSiteUrl();
  const body = `
    <p>Hi — thanks for reaching out from <strong>${escape(input.businessName)}</strong>.</p>
    <p>We received your wholesale message. A member of our team will follow up by email when we can.</p>
    <p style="font-size:13px;color:#71717a;">You can also build a case order on our <a href="${url}/wholesale" style="color:#facc15;">wholesale sales sheet</a> when you’re ready.</p>
  `;
  return emailShell({
    title: "Wholesale inquiry received",
    preheader: "Smash Wraps — we’ll follow up",
    bodyHtml: body,
  });
}

export function buildWholesaleInquiryInternalHtml(input: {
  businessName: string;
  email: string;
  phone?: string;
  message?: string;
}): string {
  const body = `
    <p><strong>New wholesale inquiry</strong></p>
    <table role="presentation" style="font-size:14px;line-height:1.6;">
      <tr><td style="padding:4px 0;color:#a1a1aa;">Business</td><td>${escape(input.businessName)}</td></tr>
      <tr><td style="padding:4px 0;color:#a1a1aa;">Email</td><td>${escape(input.email)}</td></tr>
      ${
        input.phone
          ? `<tr><td style="padding:4px 0;color:#a1a1aa;">Phone</td><td>${escape(input.phone)}</td></tr>`
          : ""
      }
    </table>
    ${
      input.message
        ? `<p style="margin-top:12px;"><strong>Message</strong></p><p style="white-space:pre-wrap;">${escape(input.message)}</p>`
        : ""
    }
  `;
  return emailShell({
    title: "Wholesale lead",
    preheader: input.businessName,
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
