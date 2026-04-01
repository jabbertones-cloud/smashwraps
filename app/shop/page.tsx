import type { Metadata } from "next";
import Link from "next/link";
import { AssetImage } from "@/components/asset-image";
import { FLAVOR_LOGO } from "@/lib/chop-images";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop — Single 3-pack boxes",
  description:
    "Pick a flavor and size (1g or 2g). One box = 3 Chops. $4.75 (1g) and $5.00 (2g) per box — not sold by the case.",
  openGraph: {
    title: "Shop — Smash Wraps",
    description:
      "Single retail boxes: 3 Chops per box, 110mm rice paper tubes. $4.75 / $5.00.",
  },
};

function priceLabel(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <h1 className="font-display text-4xl text-white md:text-5xl">Shop</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Every SKU is a dedicated product page with structured data for search and
        assistants.
      </p>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/products/${p.slug}`}
              className="group block overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition hover:border-smash-yellow/40"
            >
              <div className="relative aspect-[4/3] bg-black/40">
                <AssetImage
                  src={p.image}
                  alt=""
                  fill
                  className="object-contain p-6 transition group-hover:scale-[1.03]"
                  sizes="(max-width:1024px) 100vw, 33vw"
                />
              </div>
              <div className="border-t border-white/10 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="shrink-0 rounded-lg border border-white/10 bg-white p-1.5">
                    <AssetImage
                      src={FLAVOR_LOGO[p.flavorId]}
                      alt=""
                      width={80}
                      height={80}
                      className="h-10 w-10 object-contain"
                      aria-hidden
                    />
                  </div>
                  <p className="font-display text-lg text-white">{p.name}</p>
                </div>
                <p className="mt-1 text-sm text-zinc-500">{priceLabel(p.priceCents)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
