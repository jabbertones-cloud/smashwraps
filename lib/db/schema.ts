import { jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

/** Marketing list contact — traits JSON for segments; ab_arm for experiments. Store email lowercased. */
export const emailContacts = pgTable("email_contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source"),
  traits: jsonb("traits").$type<Record<string, unknown>>().notNull().default({}),
  abArm: text("ab_arm").notNull().default("a"),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** One row per successful send (welcome + drip steps) — idempotency + metrics. */
export const emailSends = pgTable(
  "email_sends",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => emailContacts.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    resendMessageId: text("resend_message_id"),
    meta: jsonb("meta").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    contactKindUq: uniqueIndex("email_sends_contact_kind_uq").on(t.contactId, t.kind),
  }),
);

export type EmailContactKind =
  | "welcome"
  | "drip_1h"
  | "drip_24h"
  | "drip_72h";
