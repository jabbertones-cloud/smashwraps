import { Resend } from "resend";
import { getResendFrom } from "@/lib/email/site";

export type SendResult =
  | { ok: true; id?: string }
  | { ok: false; skipped: true }
  | { ok: false; error: string };

/**
 * Sends via Resend when RESEND_API_KEY and RESEND_FROM_EMAIL are set.
 * If not configured, logs once and returns skipped (safe for local dev).
 */
export async function sendResendEmail(input: {
  to: string;
  subject: string;
  html: string;
  /** Resend tags for dashboard filtering */
  tags?: { name: string; value: string }[];
  /**
   * Dedupes sends for 24h (Stripe webhook retries, double posts).
   * Use stable keys like `stripe_evt_<eventId>_post_purchase`.
   */
  idempotencyKey?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = getResendFrom();
  if (!apiKey || !from) {
    console.warn(
      "[email] Skipping send: set RESEND_API_KEY and RESEND_FROM_EMAIL (verified domain).",
    );
    return { ok: false, skipped: true };
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send(
    {
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      tags: input.tags,
    },
    input.idempotencyKey
      ? { idempotencyKey: input.idempotencyKey.slice(0, 256) }
      : undefined,
  );

  if (error) {
    console.error("[email] Resend error:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data?.id };
}
