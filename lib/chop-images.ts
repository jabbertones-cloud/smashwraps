/**
 * Product art paths — PNGs in `public/images/` (case-sensitive on Linux/Vercel).
 * Replace files in place to update photography; paths stay stable for SEO and PDPs.
 */
export const CHOP_HERO_ALL_CASE_BOXES = "/images/AllCaseBoxesChops.png";

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

/** Flavor “flat” chop product shots (no case) — one per flavor. */
export const CHOP_FLAVOR_FLAT_IMAGE: Record<
  "iced-watermelon" | "passion-fruit" | "pineapple" | "vanilla",
  string
> = {
  "iced-watermelon": "/images/IcedWatermelonChops.png",
  "passion-fruit": "/images/PassionFruitChops.png",
  pineapple: "/images/PineappleChops.png",
  vanilla: "/images/VanillaChops.png",
};

export function chopPackImageForSlug(slug: string): string {
  return CHOP_PACK_IMAGE_BY_SLUG[slug] ?? "/images/AllCaseBoxesChops.png";
}
