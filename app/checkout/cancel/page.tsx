import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center md:px-6">
      <h1 className="font-display text-4xl text-white">Checkout cancelled</h1>
      <p className="mt-4 text-zinc-400">
        No charge was made. Your cart is still available — open the cart to try again.
      </p>
      <Link
        href="/shop"
        className="mt-10 inline-block rounded-full border border-white/20 px-8 py-3.5 font-semibold text-white hover:bg-white/10"
      >
        Back to shop
      </Link>
    </div>
  );
}
