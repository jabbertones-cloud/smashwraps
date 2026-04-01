import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { emailContacts } from "@/lib/db/schema";
import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe-token";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("t");
  if (!token?.trim()) {
    return NextResponse.json({ ok: false, message: "Missing token" }, { status: 400 });
  }

  const contactId = verifyUnsubscribeToken(token.trim());
  if (!contactId) {
    return NextResponse.json({ ok: false, message: "Invalid link" }, { status: 400 });
  }

  if (!db) {
    return NextResponse.json(
      { ok: false, message: "Unsubscribe requires DATABASE_URL" },
      { status: 503 },
    );
  }

  const now = new Date();
  await db
    .update(emailContacts)
    .set({ unsubscribedAt: now, updatedAt: now })
    .where(eq(emailContacts.id, contactId));

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Unsubscribed</title></head>
<body style="font-family:system-ui,sans-serif;background:#0a0a0a;color:#e4e4e7;padding:32px;max-width:520px;margin:0 auto;">
<p>You’re unsubscribed from Smash Wraps marketing emails.</p>
<p><a href="/" style="color:#facc15;">Back to site</a></p>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
