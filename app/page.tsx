import type { Metadata } from "next";
import Script from "next/script";
import { Hero } from "@/components/hero";
import { HowSection } from "@/components/how-section";
import { ShopSection } from "@/components/shop-section";
import { organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";
import { getCanonicalSiteUrl } from "@/lib/site-url";

const siteUrl = getCanonicalSiteUrl();

/** Homepage canonical + OG url — strengthens entity match for smashcones.com / NEXT_PUBLIC_SITE_URL. */
export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
  openGraph: { url: siteUrl },
};

export default function HomePage() {
  const org = organizationJsonLd();
  const site = websiteJsonLd();
  return (
    <>
      <Script
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }}
      />
      <Hero />
      <ShopSection />
      <HowSection />
    </>
  );
}
