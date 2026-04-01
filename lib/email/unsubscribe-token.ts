import { createHmac, timingSafeEqual } from "node:crypto";

import "server-only";

function secret(): string | null {
  return process.env.EMAIL_UNSUBSCRIBE_SECRET?.trim() || null;
}

export function canIssueUnsubscribeLinks(): boolean {
  return Boolean(secret());
}

/** HMAC-signed payload — link to GET /api/email/unsubscribe?t= */
export function createUnsubscribeToken(contactId: string): string | null {
  const s = secret();
  if (!s) return null;
  const payload = Buffer.from(JSON.stringify({ sub: contactId, v: 1 }), "utf8").toString(
    "base64url",
  );
  const sig = createHmac("sha256", s).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  const s = secret();
  if (!s) return null;
  const dot = token.indexOf(".");
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", s).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub?: string;
      v?: number;
    };
    return typeof data.sub === "string" ? data.sub : null;
  } catch {
    return null;
  }
}
