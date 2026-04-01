import { NextResponse } from "next/server";
import { Webhook } from "svix";

export const dynamic = "force-dynamic";

type ResendWebhookPayload = {
  type?: string;
  created_at?: string;
  data?: Record<string, unknown>;
};

/**
 * Resend → delivery webhooks (Svix-signed). Configure URL in Resend Dashboard:
 * `https://<your-domain>/api/webhooks/resend`
 *
 * Set `RESEND_WEBHOOK_SECRET` to the signing secret (`whsec_…`) from the webhook.
 */
export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "RESEND_WEBHOOK_SECRET not configured" },
      { status: 503 },
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing Svix signature headers" },
      { status: 400 },
    );
  }

  const payload = await req.text();

  let evt: ResendWebhookPayload;
  try {
    const wh = new Webhook(secret);
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ResendWebhookPayload;
  } catch (e) {
    console.warn("[resend-webhook] verify failed", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const type = evt.type ?? "unknown";
  console.info("[resend-webhook]", type, evt.created_at ?? "");

  switch (type) {
    case "email.sent":
    case "email.delivered":
    case "email.delivery_delayed":
    case "email.complained":
    case "email.bounced":
    case "email.opened":
    case "email.clicked":
      // Hook: forward to analytics, suppress bounces from future sends, etc.
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
