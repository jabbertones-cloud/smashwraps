import { NextResponse } from "next/server";
import { z } from "zod";
import { sendResendEmail } from "@/lib/email/send-resend";
import { buildRemindMeLaterHtml } from "@/lib/email/templates/transactional";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(320),
});

export async function POST(req: Request) {
  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid email" }, { status: 400 });
  }

  const html = buildRemindMeLaterHtml();
  const result = await sendResendEmail({
    to: body.email,
    subject: "Smash Wraps — take another look",
    html,
    tags: [
      { name: "category", value: "marketing" },
      { name: "type", value: "checkout_cancel_nudge" },
    ],
  });

  if (!result.ok && "skipped" in result && result.skipped) {
    return NextResponse.json({
      ok: true,
      configured: false,
      message: "Thanks. Configure Resend to receive this reminder by email.",
    });
  }
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: "Could not send email." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, configured: true });
}
