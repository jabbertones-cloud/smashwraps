import type { Metadata } from "next";
import Link from "next/link";
import { GaPurchaseTracker } from "@/components/analytics/ga-purchase-tracker";
import { EmailCaptureForm } from "@/components/email-capture-form";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const sp = await searchParams;
  const sessionId = sp.session_id;

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center md:px-6">
      <GaPurchaseTracker sessionId={sessionId} />
      <p className="font-display text-sm tracking-[0.35em] text-smash-yellow">
        Thank you
      </p>
      <h1 className="mt-4 font-display text-4xl text-white">Order received</h1>
      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-smash-yellow px-8 py-3.5 font-semibold text-black hover:bg-yellow-300"
      >
        Continue shopping
      </Link>
      <p className="mt-6 text-zinc-400">
        You’ll get a payment receipt by email. We may send a short order summary from us too.
        {sessionId ? (
          <>
            {" "}
            Reference:{" "}
            <span className="font-mono text-xs text-zinc-500">{sessionId}</span>
          </>
        ) : null}
      </p>
      <p className="mt-4 text-sm text-zinc-500">
        We’ll reach out only if we need something for fulfillment. Save your confirmation for your
        records.
      </p>
      <div className="mt-14 border-t border-white/10 pt-10 text-left">
        <p className="mb-3 text-center font-display text-xs tracking-[0.25em] text-zinc-500">
          Get restock &amp; drop alerts
        </p>
        <EmailCaptureForm source="success" />
      </div>
    </div>
  );
}
