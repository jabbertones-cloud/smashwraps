import type { Product } from "@/lib/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smashwraps.com";

function parseOrgSameAs(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => {
      try {
        const u = new URL(s);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    });
}

/** Optional single ContactPoint for E-E-A-T; omit if no contact fields set. */
function buildOrgContactPoint():
  | {
      "@type": "ContactPoint";
      contactType: string;
      email?: string;
      telephone?: string;
      url?: string;
    }
  | undefined {
  const email = process.env.NEXT_PUBLIC_ORG_CONTACT_EMAIL?.trim();
  const telephone = process.env.NEXT_PUBLIC_ORG_CONTACT_PHONE?.trim();
  const url = process.env.NEXT_PUBLIC_ORG_CONTACT_URL?.trim();
  const contactType =
    process.env.NEXT_PUBLIC_ORG_CONTACT_TYPE?.trim() || "customer support";
  if (!email && !telephone && !url) return undefined;
  const cp: {
    "@type": "ContactPoint";
    contactType: string;
    email?: string;
    telephone?: string;
    url?: string;
  } = {
    "@type": "ContactPoint",
    contactType,
  };
  if (email) cp.email = email;
  if (telephone) cp.telephone = telephone;
  if (url) cp.url = url;
  return cp;
}

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
  const sameAs = parseOrgSameAs(process.env.NEXT_PUBLIC_ORG_SAME_AS);
  const contactPoint = buildOrgContactPoint();

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
    ...(sameAs.length ? { sameAs } : {}),
    ...(contactPoint ? { contactPoint } : {}),
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
