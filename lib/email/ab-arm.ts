import { createHash } from "node:crypto";

/** Deterministic A/B arm from email + salt (holdout-safe vs random per request). */
export function assignWelcomeAbArm(email: string): "a" | "b" {
  const salt = process.env.EMAIL_AB_SALT?.trim() || "smashwraps-welcome-v1";
  const h = createHash("sha256").update(salt).update(email.toLowerCase()).digest();
  return h[0]! < 128 ? "a" : "b";
}
