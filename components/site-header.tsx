"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { items, openCart } = useCart();
  const count = items.reduce((n, l) => n + l.quantity, 0);

  return (
    <header className="sticky top-0 z-[100] border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
        <Link href="/" className="group font-display text-2xl tracking-[0.08em] text-white md:text-3xl">
          <span className="border-b-2 border-transparent transition group-hover:border-smash-yellow">
            SMASH
          </span>
          <span className="text-zinc-500"> WRAPS</span>
        </Link>
        <nav className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 md:gap-8 md:text-sm">
          <Link href="/shop" className="transition hover:text-white">
            Shop
          </Link>
          <Link href="/#how" className="hidden transition hover:text-white sm:inline">
            The Chop
          </Link>
          <Link href="/faq" className="hidden transition hover:text-white md:inline">
            FAQ
          </Link>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 border-white/20 uppercase tracking-wider"
            onClick={openCart}
            aria-label={`Open cart${count ? `, ${count} items` : ""}`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="rounded-full bg-smash-yellow px-1.5 text-[10px] font-bold text-black">
                {count}
              </span>
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}
