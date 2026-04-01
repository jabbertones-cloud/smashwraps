import Link from "next/link";
import { AssetImage } from "@/components/asset-image";
import { getRelatedProducts, type Product } from "@/lib/products";

function priceLabel(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function ProductRelated({ currentSlug }: { currentSlug: string }) {
  const related = getRelatedProducts(currentSlug, 4);
  if (related.length === 0) return null;

  return (
    <section
      className="mt-16 border-t border-white/10 pt-12"
      aria-labelledby="related-products-heading"
    >
      <h2
        id="related-products-heading"
        className="font-display text-2xl tracking-wide text-white md:text-3xl"
      >
        More flavors &amp; sizes
      </h2>
      <p className="mt-2 max-w-prose text-sm text-zinc-500">
        Same retail format — one 3-pack box per SKU.{" "}
        <Link href="/shop" className="text-smash-yellow underline hover:text-yellow-300">
          Shop all products
        </Link>
        .
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((p) => (
          <li key={p.slug}>
            <RelatedCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RelatedCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex max-w-full gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-smash-yellow/35 hover:bg-white/[0.04]"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
        <AssetImage
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-1"
          sizes="64px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-semibold tracking-wide text-white group-hover:text-smash-yellow">
          {product.flavorLabel}
        </p>
        <p className="text-xs text-zinc-500">{product.grams}</p>
        <p className="mt-1 font-mono text-xs text-zinc-300">
          {priceLabel(product.priceCents)}
        </p>
      </div>
    </Link>
  );
}
