import { NextResponse } from "next/server";
import { z } from "zod";
import { sendResendEmail } from "@/lib/email/send-resend";
import {
  buildWholesaleInquiryInternalHtml,
  buildWholesaleInquiryThankYouHtml,
} from "@/lib/email/templates/transactional";

const bodySchema = z.object({
  businessName: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(40).optional(),
  message: z.string().max(4000).optional(),
});

export async function POST(req: Request) {
  let parsed: z.infer<typeof bodySchema>;
  try {
    const json = await req.json();
    parsed = bodySchema.parse(json);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }

  const notifyTo = process.env.WHOLESALE_INQUIRY_TO_EMAIL?.trim();
  const thankYouHtml = buildWholesaleInquiryThankYouHtml({
    businessName: parsed.businessName,
  });

  const userSend = await sendResendEmail({
    to: parsed.email,
    subject: "We received your wholesale inquiry — Smash Wraps",
    html: thankYouHtml,
    tags: [
      { name: "category", value: "transactional" },
      { name: "type", value: "wholesale_inquiry_user" },
    ],
  });

  if (notifyTo) {
    const internalHtml = buildWholesaleInquiryInternalHtml(parsed);
    await sendResendEmail({
      to: notifyTo,
      subject: `[Wholesale inquiry] ${parsed.businessName}`,
      html: internalHtml,
      replyTo: parsed.email,
      tags: [
        { name: "category", value: "transactional" },
        { name: "type", value: "wholesale_inquiry_internal" },
      ],
    });
  }

  if (!userSend.ok && "skipped" in userSend && userSend.skipped) {
    return NextResponse.json(
      {
        ok: true,
        message:
          "Thanks — add RESEND_API_KEY and RESEND_FROM_EMAIL to send confirmation email.",
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Check your inbox for a confirmation.",
  });
}
