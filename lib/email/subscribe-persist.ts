import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { emailContacts, emailSends } from "@/lib/db/schema";
import { assignWelcomeAbArm } from "@/lib/email/ab-arm";
import { sendResendEmail } from "@/lib/email/send-resend";
import { buildWelcomeEmailHtml } from "@/lib/email/templates/transactional";
import { inngest } from "@/lib/inngest/client";

export type SubscribePersistResult =
  | { mode: "no_database" }
  | {
      mode: "database";
      isNewContact: boolean;
      contactId: string;
      abArm: "a" | "b";
      /** Set when `isNewContact` — whether Resend accepted the welcome send. */
      welcomeSent?: boolean;
    };

/**
 * Upsert contact, send welcome + log when new; schedule Inngest drips for first opt-in only.
 */
export async function persistSubscribeAndAutomate(input: {
  email: string;
  source?: string;
}): Promise<SubscribePersistResult> {
  if (!db) {
    return { mode: "no_database" };
  }

  const normalized = input.email.toLowerCase().trim();
  const abArm = assignWelcomeAbArm(normalized);

  const [existing] = await db
    .select()
    .from(emailContacts)
    .where(eq(emailContacts.email, normalized))
    .limit(1);

  if (existing) {
    await db
      .update(emailContacts)
      .set({
        source: input.source ?? existing.source,
        traits: {
          ...(existing.traits as Record<string, unknown>),
          source: input.source ?? (existing.traits as { source?: string })?.source,
        },
        updatedAt: new Date(),
      })
      .where(eq(emailContacts.id, existing.id));

    return {
      mode: "database",
      isNewContact: false,
      contactId: existing.id,
      abArm: existing.abArm === "b" ? "b" : "a",
      welcomeSent: undefined,
    };
  }

  const [inserted] = await db
    .insert(emailContacts)
    .values({
      email: normalized,
      source: input.source ?? null,
      traits: { source: input.source ?? null },
      abArm,
    })
    .returning();

  if (!inserted) {
    throw new Error("email_contacts insert returned no row");
  }

  const html = buildWelcomeEmailHtml(abArm);
  const welcomeResult = await sendResendEmail({
    to: normalized,
    subject: "You're on the list — Smash Wraps",
    html,
    tags: [
      { name: "category", value: "marketing" },
      { name: "source", value: input.source ?? "unknown" },
      { name: "ab_arm", value: abArm },
    ],
    idempotencyKey: `welcome_${inserted.id}`,
  });

  if (welcomeResult.ok) {
    await db.insert(emailSends).values({
      contactId: inserted.id,
      kind: "welcome",
      resendMessageId: welcomeResult.id ?? null,
      meta: { abArm },
    });
  }

  const eventKey = process.env.INNGEST_EVENT_KEY?.trim();
  if (eventKey && welcomeResult.ok) {
    try {
      await inngest.send({
        name: "email/welcome-drip.scheduled",
        data: {
          contactId: inserted.id,
          email: normalized,
          subscribedAt:
            inserted.createdAt instanceof Date
              ? inserted.createdAt.toISOString()
              : new Date(inserted.createdAt).toISOString(),
        },
      });
    } catch (e) {
      console.error("[subscribe] Inngest send failed:", e);
    }
  } else if (!eventKey) {
    console.warn(
      "[subscribe] INNGEST_EVENT_KEY unset — drips not scheduled (set key + deploy /api/inngest).",
    );
  }

  return {
    mode: "database",
    isNewContact: true,
    contactId: inserted.id,
    abArm,
    welcomeSent: welcomeResult.ok,
  };
}
