import type { Product } from "@/lib/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smashwraps.com";

export function productJsonLd(product: Product) {
  const url = `${siteUrl}/products/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${siteUrl}${product.image}`,
    brand: {
      "@type": "Brand",
      name: "Smash Wraps",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: product.currency.toUpperCase(),
      price: (product.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Smash Wraps",
      },
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Smash Wraps",
    url: siteUrl,
    description:
      "Smash Wraps makes The CHOP — flavor capsule infused rice paper tubes (3 Chops per pack, 110mm). Flavors include Iced Watermelon, Passion Fruit, Pineapple, and Vanilla in 1g and 2g sizes.",
    brand: {
      "@type": "Brand",
      name: "Smash Wraps",
    },
  };
}

/** Home page — pairs with Organization for SEO/AEO. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Smash Wraps",
    url: siteUrl,
    description:
      "Official Smash Wraps store: The CHOP rice paper tubes with flavor in the capsule tip. Direct checkout via Stripe.",
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "Smash Wraps",
      url: siteUrl,
    },
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
