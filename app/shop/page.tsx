import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop — Single packs",
  description:
    "Pick a flavor and size (1g or 2g). 3 Chops per pack — 110mm rice paper tubes.",
  openGraph: {
    title: "Shop — Smash Wraps",
    description: "Flavor capsule infused rice paper tubes.",
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
                <Image
                  src={p.image}
                  alt=""
                  fill
                  className="object-contain p-6 transition group-hover:scale-[1.03]"
                  sizes="(max-width:1024px) 100vw, 33vw"
                  unoptimized
                />
              </div>
              <div className="border-t border-white/10 p-5">
                <p className="font-display text-lg text-white">{p.name}</p>
                <p className="mt-1 text-sm text-zinc-500">{priceLabel(p.priceCents)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
