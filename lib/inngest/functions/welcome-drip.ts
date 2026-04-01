import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { emailContacts, emailSends, type EmailContactKind } from "@/lib/db/schema";
import { sendResendEmail } from "@/lib/email/send-resend";
import { buildDripEmailHtml } from "@/lib/email/templates/drips";
import { createUnsubscribeToken } from "@/lib/email/unsubscribe-token";
import { inngest } from "@/lib/inngest/client";

type DripStep = Extract<EmailContactKind, "drip_1h" | "drip_24h" | "drip_72h">;

function dripSubject(step: DripStep): string {
  if (step === "drip_1h") return "Still thinking about The CHOP?";
  if (step === "drip_24h") return "A quick note from Smash Wraps";
  return "We’ll leave the light on — Smash Wraps";
}

async function sendOneDrip(input: {
  contactId: string;
  email: string;
  step: DripStep;
  abArm: "a" | "b";
}): Promise<{ sent: boolean; reason?: string }> {
  if (!db) return { sent: false, reason: "no_db" };

  const [contact] = await db
    .select()
    .from(emailContacts)
    .where(eq(emailContacts.id, input.contactId))
    .limit(1);

  if (!contact) return { sent: false, reason: "contact_not_found" };
  if (contact.unsubscribedAt) return { sent: false, reason: "unsubscribed" };

  const [existing] = await db
    .select({ id: emailSends.id })
    .from(emailSends)
    .where(and(eq(emailSends.contactId, input.contactId), eq(emailSends.kind, input.step)))
    .limit(1);
  if (existing) return { sent: false, reason: "already_sent" };

  const unsubTok = createUnsubscribeToken(input.contactId);
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://smashcones.com";
  const unsubscribeUrl =
    unsubTok != null ? `${site}/api/email/unsubscribe?t=${encodeURIComponent(unsubTok)}` : null;

  const html = buildDripEmailHtml({
    step: input.step,
    arm: input.abArm,
    unsubscribeUrl,
  });

  const idem = `drip_${input.contactId}_${input.step}`;
  const result = await sendResendEmail({
    to: input.email,
    subject: dripSubject(input.step),
    html,
    tags: [
      { name: "category", value: "marketing" },
      { name: "drip", value: input.step },
      { name: "ab_arm", value: input.abArm },
    ],
    idempotencyKey: idem,
  });

  if (!result.ok && "skipped" in result && result.skipped) {
    return { sent: false, reason: "resend_not_configured" };
  }
  if (!result.ok) {
    return { sent: false, reason: "resend_error" };
  }

  await db.insert(emailSends).values({
    contactId: input.contactId,
    kind: input.step,
    resendMessageId: result.id ?? null,
    meta: { abArm: input.abArm },
  });

  return { sent: true };
}

export const welcomeDrip = inngest.createFunction(
  {
    id: "marketing-welcome-drip",
    name: "Welcome drip (1h / 24h / 72h)",
    retries: 3,
    triggers: [{ event: "email/welcome-drip.scheduled" }],
  },
  async ({ event, step }) => {
    const { contactId, email, subscribedAt } = event.data as {
      contactId: string;
      email: string;
      subscribedAt: string;
    };

    const t0 = new Date(subscribedAt);
    if (Number.isNaN(t0.getTime())) {
      return { ok: false, error: "invalid_subscribedAt" };
    }

    const contact = await step.run("load-contact", async () => {
      if (!db) return null;
      const rows = await db
        .select()
        .from(emailContacts)
        .where(eq(emailContacts.id, contactId))
        .limit(1);
      return rows[0] ?? null;
    });

    if (!contact) {
      return { ok: false, error: "contact_missing" };
    }
    if (contact.unsubscribedAt) {
      return { ok: true, skipped: "unsubscribed_before_drip" };
    }

    const abArm = contact.abArm === "b" ? "b" : "a";

    await step.sleepUntil("until-1h", new Date(t0.getTime() + 60 * 60 * 1000));
    await step.run("drip-1h", async () =>
      sendOneDrip({ contactId, email, step: "drip_1h", abArm }),
    );

    await step.sleepUntil("until-24h", new Date(t0.getTime() + 24 * 60 * 60 * 1000));
    await step.run("drip-24h", async () =>
      sendOneDrip({ contactId, email, step: "drip_24h", abArm }),
    );

    await step.sleepUntil("until-72h", new Date(t0.getTime() + 72 * 60 * 60 * 1000));
    const last = await step.run("drip-72h", async () =>
      sendOneDrip({ contactId, email, step: "drip_72h", abArm }),
    );

    return { ok: true, last };
  },
);
