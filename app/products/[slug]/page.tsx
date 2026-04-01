import type { Metadata } from "next";
import Link from "next/link";
import { AssetImage } from "@/components/asset-image";
import { notFound } from "next/navigation";
import Script from "next/script";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { CHOP_FLAVOR_FLAT_IMAGE } from "@/lib/chop-images";
import { PRODUCTS, getProductBySlug } from "@/lib/products";
import { productJsonLd } from "@/lib/json-ld";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://smashwraps.com";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product" };
  const url = `${siteUrl}/products/${product.slug}`;
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description: product.description,
      url,
      images: [{ url: `${siteUrl}${product.image}`, width: 800, height: 800 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [`${siteUrl}${product.image}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = productJsonLd(product);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${siteUrl}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${siteUrl}/products/${product.slug}`,
      },
    ],
  };

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.priceCents / 100);

  return (
    <>
      <Script
        id="ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <nav className="text-xs text-zinc-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/shop" className="hover:text-white">
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-zinc-300">{product.flavorLabel}</li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
              <AssetImage
                src={product.image}
                alt={`${product.name} — single box (3-pack)`}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
              <AssetImage
                src={CHOP_FLAVOR_FLAT_IMAGE[product.flavorId]}
                alt={`${product.flavorLabel} — The CHOP product`}
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
          <div>
            <p className="font-display text-sm tracking-[0.35em] text-smash-yellow">
              The CHOP
            </p>
            <h1 className="mt-2 font-display text-4xl text-white md:text-5xl">
              {product.flavorLabel} · {product.grams}
            </h1>
            <p className="mt-4 text-lg text-zinc-400">{product.description}</p>
            <p className="mt-8 font-mono text-3xl text-white">{price}</p>
            <p className="mt-2 text-sm text-zinc-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-8">
              <AddToCartButton slug={product.slug} />
            </div>
            <p className="mt-8 text-xs text-zinc-600">
              For adults 21+ where required. Product classification and claims per
              compliance memo — not legal advice on this page.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
