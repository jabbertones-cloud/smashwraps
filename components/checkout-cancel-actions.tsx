"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

/** One-tap return to cart after abandoning hosted checkout (fewer clicks than bag icon only). */
export function CheckoutCancelActions() {
  const { openCart, items } = useCart();
  const hasItems = items.length > 0;

  return (
    <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
      {hasItems ? (
        <Button type="button" className="sm:min-w-[200px]" onClick={openCart}>
          Continue to checkout
        </Button>
      ) : null}
      <Link
        href="/shop"
        className={`inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-8 py-3.5 font-semibold text-white hover:bg-white/10 ${
          hasItems ? "sm:min-w-[200px]" : ""
        }`}
      >
        {hasItems ? "Keep browsing" : "Back to shop"}
      </Link>
    </div>
  );
}
