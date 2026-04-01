import type { Metadata } from "next";
import Link from "next/link";
import { AssetImage } from "@/components/asset-image";
import { notFound } from "next/navigation";
import Script from "next/script";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductViewTracker } from "@/components/analytics/product-view-tracker";
import { chopMasterCaseImageForSlug } from "@/lib/chop-images";
import { ProductRelated } from "@/components/product-related";
import { PRODUCTS, getProductBySlug, type Product } from "@/lib/products";
import { productJsonLd } from "@/lib/json-ld";
import { getCanonicalSiteUrl } from "@/lib/site-url";
import { ProductMobileStickyCta } from "@/components/product-mobile-sticky-cta";
import {
  RETAIL_FREE_SHIPPING_THRESHOLD_CENTS,
  RETAIL_SHIPPING_FLAT_CENTS,
} from "@/lib/shipping";

const siteUrl = getCanonicalSiteUrl();

type Props = { params: Promise<{ slug: string }> };

function buildProductMetaDescription(product: Product): string {
  const first = product.description.split(".")[0]?.trim() ?? product.name;
  const suffix = " Single 3-pack box · Secure US checkout.";
  const combined = `${first}.${suffix}`;
  return combined.length > 158 ? `${combined.slice(0, 155)}…` : combined;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product" };
  const url = `${siteUrl}/products/${product.slug}`;
  const title = `${product.flavorLabel} ${product.grams} · The CHOP rice paper tubes | Smash Wraps`;
  const description = buildProductMetaDescription(product);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: `${siteUrl}${product.image}`, width: 800, height: 800 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}${product.image}`],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = productJsonLd(product);
  const masterCaseSrc = chopMasterCaseImageForSlug(product.slug);
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

  const freeShipMin = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(RETAIL_FREE_SHIPPING_THRESHOLD_CENTS / 100);

  return (
    <>
      <ProductViewTracker product={product} />
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
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-12 md:px-6 md:py-16 lg:pb-12">
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
          <div className="space-y-6">
            <figure className="space-y-2">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                <AssetImage
                  src={product.image}
                  alt={`${product.name} — single 3-pack retail box (what we ship)`}
                  fill
                  className="object-contain p-8"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <figcaption className="text-center text-xs text-zinc-500">
                What you buy — one 3-pack box ({product.grams})
              </figcaption>
            </figure>
            <figure className="space-y-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 md:aspect-[16/10]">
                <AssetImage
                  src={masterCaseSrc}
                  alt={`${product.flavorLabel} — retail master case display reference (${product.grams})`}
                  fill
                  className="object-contain p-4 md:p-6"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <figcaption className="text-center text-xs text-zinc-500">
                Store display reference — master case (not sold by the case here)
              </figcaption>
            </figure>
          </div>
          <div>
            <p className="font-display text-sm tracking-[0.35em] text-smash-yellow">
              The CHOP
            </p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-white md:text-5xl">
              {product.flavorLabel} · {product.grams}
            </h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-zinc-400 md:text-lg">
              {product.description}
            </p>
            <p className="mt-6 font-mono text-3xl text-white">{price}</p>
            <p className="mt-2 text-sm text-zinc-500">
              US shipping{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(RETAIL_SHIPPING_FLAT_CENTS / 100)}{" "}
              per order · free when subtotal is {freeShipMin} or more. Taxes where applicable
              at checkout.
            </p>
            <p className="mt-3 text-xs text-zinc-600">
              Patent pending · Flavor in the capsule tip for a consistent profile from first
              chop to last.
            </p>
            <div className="mt-8 hidden lg:block">
              <AddToCartButton slug={product.slug} />
            </div>
            <p className="mt-8 text-xs text-zinc-600">
              Adults 21+ where required. Follow your local laws.
            </p>
            <p className="mt-4 text-xs text-zinc-600">
              <Link href="/legal/shipping" className="underline hover:text-zinc-400">
                Shipping
              </Link>
              {" · "}
              <Link href="/legal/returns" className="underline hover:text-zinc-400">
                Returns
              </Link>
              {" · "}
              <Link href="/faq" className="underline hover:text-zinc-400">
                FAQ
              </Link>
            </p>
          </div>
        </div>
        <ProductRelated currentSlug={product.slug} />
      </div>
      <ProductMobileStickyCta
        slug={product.slug}
        label={`${product.flavorLabel} · ${product.grams}`}
        priceFormatted={price}
      />
    </>
  );
}
