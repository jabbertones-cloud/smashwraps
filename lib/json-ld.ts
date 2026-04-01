import type { Product } from "@/lib/products";
import { organizationDescriptionForJsonLd } from "@/lib/geo-aeo";
import { getCanonicalSiteUrl } from "@/lib/site-url";

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
  const siteUrl = getCanonicalSiteUrl();
  const url = `${siteUrl}/products/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    sku: product.slug,
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
  const siteUrl = getCanonicalSiteUrl();
  const sameAs = parseOrgSameAs(process.env.NEXT_PUBLIC_ORG_SAME_AS);
  const contactPoint = buildOrgContactPoint();
  const orgId = `${siteUrl}#organization`;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: "Smash Wraps",
    alternateName: [
      "Smash Wraps The CHOP",
      "The CHOP by Smash Wraps",
    ],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/images/smash-wraps-logo.png`,
    },
    description: organizationDescriptionForJsonLd(),
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
  const siteUrl = getCanonicalSiteUrl();
  const orgId = `${siteUrl}#organization`;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    name: "Smash Wraps — The CHOP",
    alternateName: ["Smash Wraps official store", "The CHOP retail"],
    url: siteUrl,
    description:
      "Official Smash Wraps store: The CHOP rice paper tubes with flavor in the capsule tip. Secure checkout on site.",
    inLanguage: "en-US",
    publisher: { "@id": orgId },
  };
}

/** Shop index — helps search engines and answer engines discover all PDP URLs. */
export function shopItemListJsonLd(products: Product[]) {
  const siteUrl = getCanonicalSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Smash Wraps — The CHOP retail SKUs",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      item: `${siteUrl}/products/${p.slug}`,
    })),
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
