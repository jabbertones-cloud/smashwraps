import type { Metadata } from "next";
import Link from "next/link";

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
      <p className="font-display text-sm tracking-[0.35em] text-smash-yellow">
        Thank you
      </p>
      <h1 className="mt-4 font-display text-4xl text-white">Order received</h1>
      <p className="mt-4 text-zinc-400">
        You will receive a confirmation email from Stripe when payment is complete.
        {sessionId ? (
          <>
            {" "}
            Reference:{" "}
            <span className="font-mono text-xs text-zinc-500">{sessionId}</span>
          </>
        ) : null}
      </p>
      <p className="mt-6 text-sm text-zinc-500">
        Fulfillment emails and inventory sync can be wired to the webhook handler in
        production.
      </p>
      <Link
        href="/shop"
        className="mt-10 inline-block rounded-full bg-smash-yellow px-8 py-3.5 font-semibold text-black hover:bg-yellow-300"
      >
        Continue shopping
      </Link>
    </div>
  );
}
