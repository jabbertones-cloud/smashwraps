import { NextResponse } from "next/server";
import { z } from "zod";
import { encodeCartRecovery } from "@/lib/cart-recovery";
import { getSiteUrl } from "@/lib/email/site";
import { sendResendEmail } from "@/lib/email/send-resend";
import { buildCartReminderEmailHtml } from "@/lib/email/templates/transactional";
import { getProductBySlug, PRODUCT_SLUG_SET } from "@/lib/products";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(320),
  lines: z
    .array(
      z.object({
        slug: z.string(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(24),
});

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export async function POST(req: Request) {
  let body: z.infer<typeof schema>;
  try {
    body = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 });
  }

  const lines = body.lines.filter((l) => PRODUCT_SLUG_SET.has(l.slug));
  if (!lines.length) {
    return NextResponse.json({ ok: false, message: "No valid items" }, { status: 400 });
  }

  let subtotalCents = 0;
  const rows: { title: string; quantity: number; lineTotal: string }[] = [];
  for (const l of lines) {
    const p = getProductBySlug(l.slug);
    if (!p) continue;
    const lineCents = p.priceCents * l.quantity;
    subtotalCents += lineCents;
    rows.push({
      title: p.name,
      quantity: l.quantity,
      lineTotal: fmt.format(lineCents / 100),
    });
  }

  const token = encodeCartRecovery(lines);
  const site = getSiteUrl();
  const recoveryUrl = `${site}/?cart=${encodeURIComponent(token)}`;

  const html = buildCartReminderEmailHtml({
    recoveryUrl,
    lines: rows,
    subtotal: fmt.format(subtotalCents / 100),
  });

  const result = await sendResendEmail({
    to: body.email,
    subject: "Smash Wraps — your cart link",
    html,
    tags: [
      { name: "category", value: "transactional" },
      { name: "type", value: "cart_reminder" },
    ],
  });

  if (!result.ok && "skipped" in result && result.skipped) {
    return NextResponse.json({
      ok: true,
      configured: false,
      message:
        "Cart saved locally. Configure RESEND_API_KEY + RESEND_FROM_EMAIL to email reminders.",
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
