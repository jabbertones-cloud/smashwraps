import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/site-url";

const siteUrl = getCanonicalSiteUrl();

/**
 * AEO/GEO: allow HTML, static assets, /llms.txt (LLM factual policy file), and sitemap.
 * Block API + checkout flows from bulk crawling (thin/transactional).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: new URL(siteUrl).host,
  };
}
