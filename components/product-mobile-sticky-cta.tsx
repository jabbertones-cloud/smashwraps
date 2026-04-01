"use client";

import { AddToCartButton } from "@/components/add-to-cart-button";

/** Thumb-zone add-to-cart on small viewports; hidden lg+ where inline CTA is in view. */
export function ProductMobileStickyCta({
  slug,
  label,
  priceFormatted,
}: {
  slug: string;
  label: string;
  priceFormatted: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-white/10 bg-[#050505]/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
      <div className="section-inner flex items-center gap-3 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{label}</p>
          <p className="font-mono text-sm text-zinc-300">{priceFormatted}</p>
        </div>
        <AddToCartButton
          slug={slug}
          className="min-w-0 shrink-0 px-6 sm:min-w-[min(200px,42vw)]"
        />
      </div>
    </div>
  );
}
