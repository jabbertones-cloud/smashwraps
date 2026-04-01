import { getSiteUrl } from "@/lib/email/site";
import { ctaButton, emailShell } from "@/lib/email/templates/wrap";

/**
 * Post-signup drips (1h / 24h / 72h). Arm `a` vs `b` differs copy for A/B metrics.
 * Unsubscribe link is required for CAN-SPAM-style marketing sends when configured.
 */

export function buildDripEmailHtml(input: {
  step: "drip_1h" | "drip_24h" | "drip_72h";
  arm: "a" | "b";
  unsubscribeUrl: string | null;
}): string {
  const url = getSiteUrl();
  const shop = `${url}/shop`;

  const copy = dripCopy(input.step, input.arm);
  const unsub =
    input.unsubscribeUrl != null
      ? `<p style="font-size:12px;color:#52525b;margin-top:20px;"><a href="${escapeAttr(input.unsubscribeUrl)}" style="color:#71717a;">Unsubscribe from marketing</a></p>`
      : `<p style="font-size:12px;color:#52525b;margin-top:20px;">To stop marketing emails, reply with “unsubscribe” or use the contact on our site.</p>`;

  const body = `
    <p>${copy.lead}</p>
    <p>${copy.detail}</p>
    ${ctaButton(shop, "Shop The CHOP")}
    ${unsub}
  `;

  return emailShell({
    title: copy.title,
    preheader: copy.preheader,
    bodyHtml: body,
  });
}

function dripCopy(
  step: "drip_1h" | "drip_24h" | "drip_72h",
  arm: "a" | "b",
): { title: string; preheader: string; lead: string; detail: string } {
  if (step === "drip_1h") {
    return arm === "a"
      ? {
          title: "Still browsing?",
          preheader: "Smash Wraps — flavor in the capsule tip",
          lead: "<strong>Quick reminder:</strong> each retail box has <strong>three 110mm Chops</strong> — pick a flavor, then <strong>1g or 2g</strong>.",
          detail:
            "Checkout is secure. Shipping and tax show before you pay.",
        }
      : {
          title: "Your flavor lineup",
          preheader: "The CHOP — 3 Chops per box",
          lead: "<strong>Iced Watermelon, Passion Fruit, Pineapple, Vanilla</strong> — all in stock while supplies last.",
          detail: "If you left something in cart, open the shop and your selections load on-site.",
        };
  }
  if (step === "drip_24h") {
    return arm === "a"
      ? {
          title: "Restocks & real talk",
          preheader: "Smash Wraps — what’s in the box",
          lead: "We send <strong>restocks</strong>, product notes, and occasional offers — nothing spammy.",
          detail: `Questions? See <a href="${getSiteUrl()}/faq" style="color:#facc15;">FAQ</a> or <a href="${getSiteUrl()}/about" style="color:#facc15;">About</a> for wholesale.`,
        }
      : {
          title: "Why The CHOP?",
          preheader: "Flavor inside the tip — not sprayed on the sheet",
          lead: "Built for adults <strong>21+</strong> where required — clear labeling, shipping rules in <strong>Shipping</strong>.",
          detail: "This list is for people who want the product straight — no hype, just the Chops.",
        };
  }
  return arm === "a"
    ? {
        title: "Last nudge (for now)",
        preheader: "Smash Wraps — shop when you’re ready",
        lead: "No pressure — when you want <strong>The CHOP</strong>, we’re here. One box = three Chops.",
        detail: "Store buyers: use About for case talk — this checkout stays single-box retail.",
      }
    : {
        title: "We’ll keep it quiet",
        preheader: "Smash Wraps — see you when you’re ready",
        lead: "This is our <strong>72h</strong> check-in. After this, we’ll only email what you signed up for (news + offers).",
        detail: `Browse anytime: <a href="${getSiteUrl()}/shop" style="color:#facc15;">shop</a>.`,
      };
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}
