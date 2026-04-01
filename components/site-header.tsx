"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { AssetImage } from "@/components/asset-image";
import { BRAND_LOGO_SRC } from "@/lib/brand";

export function SiteHeader() {
  const { items, openCart } = useCart();
  const count = items.reduce((n, l) => n + l.quantity, 0);

  return (
    <header className="sticky top-0 z-[100] border-b border-white/[0.08] bg-[#050505]/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-6">
        <Link
          href="/"
          className="group flex max-w-[min(100%,min(85vw,320px))] shrink-0 items-center rounded-lg p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-smash-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
        >
          <AssetImage
            src={BRAND_LOGO_SRC}
            alt="Smash Wraps"
            width={400}
            height={298}
            className="h-12 w-auto object-contain object-left drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)] sm:h-14 md:h-[4.25rem]"
            priority
          />
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
            className="min-h-11 gap-2 border-white/20 uppercase tracking-wider"
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
