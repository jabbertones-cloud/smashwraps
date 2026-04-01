import { NextResponse } from "next/server";
import { z } from "zod";

import { isEmailConfigured } from "@/lib/email/site";
import { persistSubscribeAndAutomate } from "@/lib/email/subscribe-persist";
import { sendResendEmail } from "@/lib/email/send-resend";
import { buildWelcomeEmailHtml } from "@/lib/email/templates/transactional";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(320),
  source: z.enum(["footer", "success", "cancel", "cart", "hero"]).optional(),
});

export async function POST(req: Request) {
  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid email" }, { status: 400 });
  }

  const persisted = await persistSubscribeAndAutomate({
    email: body.email,
    source: body.source,
  });

  if (persisted.mode === "database") {
    if (!persisted.isNewContact) {
      return NextResponse.json({
        ok: true,
        configured: isEmailConfigured(),
        alreadySubscribed: true,
      });
    }

    if (!persisted.welcomeSent) {
      return NextResponse.json({
        ok: true,
        configured: false,
        message:
          "Thanks. Add RESEND_API_KEY and RESEND_FROM_EMAIL to send confirmation emails. Your signup was saved.",
        dripsScheduled: false,
      });
    }

    return NextResponse.json({
      ok: true,
      configured: true,
      dripsScheduled: Boolean(process.env.INNGEST_EVENT_KEY?.trim()),
    });
  }

  const html = buildWelcomeEmailHtml("a");
  const result = await sendResendEmail({
    to: body.email,
    subject: "You're on the list — Smash Wraps",
    html,
    tags: [
      { name: "category", value: "marketing" },
      { name: "source", value: body.source ?? "unknown" },
    ],
  });

  if (!result.ok && "skipped" in result && result.skipped) {
    return NextResponse.json({
      ok: true,
      configured: false,
      message:
        "Thanks. Add RESEND_API_KEY and RESEND_FROM_EMAIL to send confirmation emails.",
    });
  }
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: "Could not send email. Try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, configured: true });
}
