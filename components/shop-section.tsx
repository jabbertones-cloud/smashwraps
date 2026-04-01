"use client";

import Link from "next/link";
import { AssetImage } from "@/components/asset-image";
import { getFlavorGroups } from "@/lib/flavors";
import { FLAVOR_LOGO } from "@/lib/chop-images";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";

function priceLabel(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function ShopSection() {
  const groups = getFlavorGroups();
  const { add } = useCart();

  return (
    <section id="shop" className="relative bg-[#080808]">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="mb-14 text-center md:mb-16">
          <p className="font-display text-sm tracking-[0.35em] text-smash-yellow">
            Single box
          </p>
          <h2 className="mt-2 font-display text-4xl text-white md:text-6xl md:tracking-wide">
            3-PACK BOXES
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">
            One box = one flavor, one size (1g or 2g),{" "}
            <strong className="text-zinc-200">3 Chops</strong> inside.{" "}
            <span className="text-zinc-300">$4.75</span> (1g) ·{" "}
            <span className="text-zinc-300">$5.00</span> (2g) per box — not sold by the
            case here. Open a product for details.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {groups.map(({ flavorId, meta, products }) => (
            <article
              key={flavorId}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-zinc-950 shadow-xl shadow-black/40 transition duration-300 ${meta.border}`}
            >
              <div
                className="card-shine absolute inset-0 opacity-0 transition group-hover:opacity-100"
                aria-hidden
              />
              <div className="relative aspect-[4/5] overflow-hidden bg-black/50">
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition group-hover:opacity-100"
                  aria-hidden
                />
                <AssetImage
                  src={products[0].image}
                  alt={`${meta.title} — 1g and 2g boxes`}
                  fill
                  className="z-10 object-contain p-5 transition duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative flex flex-1 flex-col border-t border-white/[0.06] p-5 pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-3 ring-1 ring-white/5">
                    <AssetImage
                      src={FLAVOR_LOGO[flavorId]}
                      alt={`${meta.title} flavor logo`}
                      width={200}
                      height={200}
                      className="mx-auto h-12 w-auto object-contain sm:h-14"
                    />
                  </div>
                </div>
                <h3
                  className={`text-center font-display text-2xl tracking-[0.06em] ${meta.accent}`}
                >
                  {meta.title}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
                  Capsule infused · 3 per box
                </p>
                <div className="mt-5 flex gap-2">
                  {products.map((p) => (
                    <div key={p.slug} className="flex flex-1 flex-col gap-1">
                      <Link
                        href={`/products/${p.slug}`}
                        className="rounded-xl border border-white/15 bg-white/[0.03] py-2.5 text-center text-sm font-bold text-white transition hover:bg-white/10"
                      >
                        {p.grams}
                      </Link>
                      <span className="text-center text-[10px] text-zinc-500">
                        {priceLabel(p.priceCents)}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        className="w-full text-[11px]"
                        onClick={() => add(p.slug, 1)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-14 text-center text-sm text-zinc-500">
          <Link href="/shop" className="text-smash-yellow underline hover:text-yellow-300">
            View all products
          </Link>{" "}
          · Secure checkout.
        </p>
      </div>
    </section>
  );
}
