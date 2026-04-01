import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://smashwraps.com";

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
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
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
