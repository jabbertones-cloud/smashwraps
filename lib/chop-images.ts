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
/** Multi-flavor master case strip — fallback only; file is JPEG (use .jpg extension). */
export const CHOP_HERO_ALL_CASE_BOXES = "/images/AllCaseBoxesChops.jpg";

/** Educational graphic: crush capsule in filter (brand art). */
export const HOW_SMASH_CAPSULE = "/images/how-smash-capsule.png";

/**
 * Retail display / master case for this SKU (1g vs 2g) — top image on PDP.
 * Not the multi-flavor `AllCaseBoxesChops` strip.
 */
export const CHOP_MASTER_CASE_BY_SLUG: Record<string, string> = {
  "iced-watermelon-1g": "/images/1gIcedWatermelonChopsCase.png",
  "iced-watermelon-2g": "/images/2gIcedWatermelonChopsCase.png",
  "passion-fruit-1g": "/images/1gCasePassionFruitChops.png",
  "passion-fruit-2g": "/images/2gCasePassionFruitChops.png",
  "pineapple-1g": "/images/1gCasePineappleChops.png",
  "pineapple-2g": "/images/2gCasePineappleChops.png",
  "vanilla-1g": "/images/1gCaseVanillaChops.png",
  "vanilla-2g": "/images/2gCaseVanillaChops.png",
};

/**
 * Single 3-pack box (what the customer buys) — cart, OG, shop cards, bottom PDP.
 * One art file per flavor; shared for 1g/2g unless you add separate assets later.
 */
export const CHOP_THREE_PACK_BY_SLUG: Record<string, string> = {
  "iced-watermelon-1g": "/images/IcedWatermelonChops.png",
  "iced-watermelon-2g": "/images/IcedWatermelonChops.png",
  "passion-fruit-1g": "/images/PassionFruitChops.png",
  "passion-fruit-2g": "/images/PassionFruitChops.png",
  "pineapple-1g": "/images/PineappleChops.png",
  "pineapple-2g": "/images/PineappleChops.png",
  "vanilla-1g": "/images/VanillaChops.png",
  "vanilla-2g": "/images/VanillaChops.png",
};

export function chopMasterCaseImageForSlug(slug: string): string {
  return CHOP_MASTER_CASE_BY_SLUG[slug] ?? CHOP_HERO_ALL_CASE_BOXES;
}

/** Primary product photo: one 3-pack box (not the floor display case). */
export function chopThreePackImageForSlug(slug: string): string {
  return CHOP_THREE_PACK_BY_SLUG[slug] ?? CHOP_HERO_ALL_CASE_BOXES;
}

/** @deprecated Use chopThreePackImageForSlug — name kept for older imports. */
export function chopPackImageForSlug(slug: string): string {
  return chopThreePackImageForSlug(slug);
}
