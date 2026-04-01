import type { MetadataRoute } from "next";
import { getCanonicalSiteUrl } from "@/lib/site-url";

const siteUrl = getCanonicalSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
