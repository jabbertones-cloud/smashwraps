import { NextResponse } from "next/server";
import { z } from "zod";
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

  const html = buildWelcomeEmailHtml();
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
