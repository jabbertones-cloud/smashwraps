import type { Metadata } from "next";
import { CheckoutCancelActions } from "@/components/checkout-cancel-actions";
import { CheckoutCancelRemind } from "@/components/checkout-cancel-remind";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center md:px-6">
      <h1 className="font-display text-4xl text-white">Checkout cancelled</h1>
      <p className="mt-4 text-zinc-400">
        No charge was made. Your cart is still saved in this browser — continue below or open the bag
        icon when you’re ready.
      </p>
      <CheckoutCancelActions />
      <CheckoutCancelRemind />
    </div>
  );
}
