import type { FlavorId } from "@/lib/products";

/**
 * Product art paths — PNGs in `public/images/` (case-sensitive on Linux/Vercel).
 * Replace files in place to update photography; paths stay stable for SEO and PDPs.
 */

/** Flavor logos for shop / how sections (often white background in source art). */
export const FLAVOR_LOGO: Record<FlavorId, string> = {
  "iced-watermelon": "/images/flavor-iced-watermelon.png",
  "passion-fruit": "/images/flavor-passion-fruit.png",
  pineapple: "/images/flavor-pineapple.png",
  vanilla: "/images/flavor-vanilla.png",
};
/** Multi-flavor master case / display (same asset on home hero + PDP first image). */
export const CHOP_HERO_ALL_CASE_BOXES = "/images/AllCaseBoxesChops.png";

/** PDP: large master case shot — not the DTC line item; pairs with per-SKU 3-pack image. */
export const PDP_MASTER_CASE_IMAGE = CHOP_HERO_ALL_CASE_BOXES;

/** Educational graphic: crush capsule in filter (brand art). */
export const HOW_SMASH_CAPSULE = "/images/how-smash-capsule.png";

/** Box / product shot per product slug (1g vs 2g); filenames from legacy asset names. */
export const CHOP_PACK_IMAGE_BY_SLUG: Record<string, string> = {
  "iced-watermelon-1g": "/images/1gIcedWatermelonChopsCase.png",
  "iced-watermelon-2g": "/images/2gIcedWatermelonChopsCase.png",
  "passion-fruit-1g": "/images/1gCasePassionFruitChops.png",
  "passion-fruit-2g": "/images/2gCasePassionFruitChops.png",
  "pineapple-1g": "/images/1gCasePineappleChops.png",
  "pineapple-2g": "/images/2gCasePineappleChops.png",
  "vanilla-1g": "/images/1gCaseVanillaChops.png",
  "vanilla-2g": "/images/2gCaseVanillaChops.png",
};

export function chopPackImageForSlug(slug: string): string {
  return CHOP_PACK_IMAGE_BY_SLUG[slug] ?? "/images/AllCaseBoxesChops.png";
}
