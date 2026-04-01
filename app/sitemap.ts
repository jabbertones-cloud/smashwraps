import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { getCanonicalSiteUrl } from "@/lib/site-url";

const siteUrl = getCanonicalSiteUrl();

/** Priority hints: home + shop + PDPs first; legal/support pages slightly lower. Wholesale is noindex and omitted. */
const STATIC_PRIORITY: Record<string, number> = {
  "": 1,
  "/shop": 0.95,
  "/faq": 0.85,
  "/about": 0.75,
  "/legal/privacy": 0.5,
  "/legal/terms": 0.5,
  "/legal/shipping": 0.55,
  "/legal/returns": 0.55,
  "/legal/compliance": 0.55,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/shop",
    "/faq",
    "/about",
    "/legal/privacy",
    "/legal/terms",
    "/legal/shipping",
    "/legal/returns",
    "/legal/compliance",
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: STATIC_PRIORITY[path] ?? 0.7,
  }));

  for (const p of PRODUCTS) {
    entries.push({
      url: `${siteUrl}/products/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  return entries;
}
