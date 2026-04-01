import { chopMasterCaseImageForSlug } from "@/lib/chop-images";
import type { FlavorId } from "@/lib/products";

/** Retail SKU slug without prefix — matches `iced-watermelon-1g` style. */
export type RetailSkuSlug =
  | "iced-watermelon-1g"
  | "iced-watermelon-2g"
  | "passion-fruit-1g"
  | "passion-fruit-2g"
  | "pineapple-1g"
  | "pineapple-2g"
  | "vanilla-1g"
  | "vanilla-2g";

export type WholesaleProduct = {
  /** Stable id for checkout + Stripe metadata */
  slug: string;
  name: string;
  flavorId: FlavorId;
  flavorLabel: string;
  retailSku: RetailSkuSlug;
  grams: "1g" | "2g";
  /** Retail three-pack boxes per master case (8 inner packs × 3 tubes = 24 Chops) */
  retailThreePackBoxesPerMasterCase: number;
  /** Wholesale price per master case (USD cents) */
  priceCents: number;
  currency: "usd";
  /** Suggested retail if each three-pack sold at MSRP × boxes in case (cents) */
  suggestedRetailCaseCents: number;
  description: string;
  /** Master case photography — same paths as PDP `CHOP_MASTER_CASE_BY_SLUG` */
  image: string;
  stripeProductEnvKey: string;
  stripePriceEnvKey: string;
};

/** One master case = 8 inner retail three-pack boxes; each box = 3 tubes (Chops). */
export const RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE = 8;
export const TUBES_PER_RETAIL_BOX = 3;
export const CHOPS_PER_MASTER_CASE =
  RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE * TUBES_PER_RETAIL_BOX;

/** Wholesale list: $19 / master case (1g), $20 / master case (2g) — all flavors. */
export const WHOLESALE_WS_1G_CENTS = 19_00;
export const WHOLESALE_WS_2G_CENTS = 20_00;

/** Suggested retail uses site MSRP × 8 three-packs (see `lib/products.ts`). */
const MSRP_THREE_PACK_1G_CENTS = 475;
const MSRP_THREE_PACK_2G_CENTS = 500;

const packExplainer =
  "One master case = 8 retail three-pack boxes (8 × 3 tubes = 24 Chops). Wholesale: $19 per master case (1g) and $20 (2g). Licensed retailers.";

function masterCaseName(flavorLong: string, grams: "1g" | "2g"): string {
  return `The CHOP — ${flavorLong} (${grams}) — Master case (8× three-packs, 24 Chops)`;
}

function suggestedRetailForGrams(grams: "1g" | "2g"): number {
  const per =
    grams === "1g" ? MSRP_THREE_PACK_1G_CENTS : MSRP_THREE_PACK_2G_CENTS;
  return per * RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE;
}

export const WHOLESALE_PRODUCTS: WholesaleProduct[] = [
  {
    slug: "wholesale-iced-watermelon-1g",
    name: masterCaseName("Iced Watermelon", "1g"),
    flavorId: "iced-watermelon",
    flavorLabel: "ICED WATERMELON",
    retailSku: "iced-watermelon-1g",
    grams: "1g",
    retailThreePackBoxesPerMasterCase: RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE,
    priceCents: WHOLESALE_WS_1G_CENTS,
    currency: "usd",
    suggestedRetailCaseCents: suggestedRetailForGrams("1g"),
    description: `Iced Watermelon — wholesale master case. ${packExplainer}`,
    image: chopMasterCaseImageForSlug("iced-watermelon-1g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_ICED_WATERMELON_1G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_ICED_WATERMELON_1G",
  },
  {
    slug: "wholesale-iced-watermelon-2g",
    name: masterCaseName("Iced Watermelon", "2g"),
    flavorId: "iced-watermelon",
    flavorLabel: "ICED WATERMELON",
    retailSku: "iced-watermelon-2g",
    grams: "2g",
    retailThreePackBoxesPerMasterCase: RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE,
    priceCents: WHOLESALE_WS_2G_CENTS,
    currency: "usd",
    suggestedRetailCaseCents: suggestedRetailForGrams("2g"),
    description: `Iced Watermelon — wholesale master case. ${packExplainer}`,
    image: chopMasterCaseImageForSlug("iced-watermelon-2g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_ICED_WATERMELON_2G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_ICED_WATERMELON_2G",
  },
  {
    slug: "wholesale-passion-fruit-1g",
    name: masterCaseName("Passion Fruit", "1g"),
    flavorId: "passion-fruit",
    flavorLabel: "PASSION FRUIT",
    retailSku: "passion-fruit-1g",
    grams: "1g",
    retailThreePackBoxesPerMasterCase: RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE,
    priceCents: WHOLESALE_WS_1G_CENTS,
    currency: "usd",
    suggestedRetailCaseCents: suggestedRetailForGrams("1g"),
    description: `Passion Fruit — wholesale master case. ${packExplainer}`,
    image: chopMasterCaseImageForSlug("passion-fruit-1g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_PASSION_FRUIT_1G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_PASSION_FRUIT_1G",
  },
  {
    slug: "wholesale-passion-fruit-2g",
    name: masterCaseName("Passion Fruit", "2g"),
    flavorId: "passion-fruit",
    flavorLabel: "PASSION FRUIT",
    retailSku: "passion-fruit-2g",
    grams: "2g",
    retailThreePackBoxesPerMasterCase: RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE,
    priceCents: WHOLESALE_WS_2G_CENTS,
    currency: "usd",
    suggestedRetailCaseCents: suggestedRetailForGrams("2g"),
    description: `Passion Fruit — wholesale master case. ${packExplainer}`,
    image: chopMasterCaseImageForSlug("passion-fruit-2g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_PASSION_FRUIT_2G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_PASSION_FRUIT_2G",
  },
  {
    slug: "wholesale-pineapple-1g",
    name: masterCaseName("Pineapple", "1g"),
    flavorId: "pineapple",
    flavorLabel: "PINEAPPLE",
    retailSku: "pineapple-1g",
    grams: "1g",
    retailThreePackBoxesPerMasterCase: RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE,
    priceCents: WHOLESALE_WS_1G_CENTS,
    currency: "usd",
    suggestedRetailCaseCents: suggestedRetailForGrams("1g"),
    description: `Pineapple — wholesale master case. ${packExplainer}`,
    image: chopMasterCaseImageForSlug("pineapple-1g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_PINEAPPLE_1G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_PINEAPPLE_1G",
  },
  {
    slug: "wholesale-pineapple-2g",
    name: masterCaseName("Pineapple", "2g"),
    flavorId: "pineapple",
    flavorLabel: "PINEAPPLE",
    retailSku: "pineapple-2g",
    grams: "2g",
    retailThreePackBoxesPerMasterCase: RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE,
    priceCents: WHOLESALE_WS_2G_CENTS,
    currency: "usd",
    suggestedRetailCaseCents: suggestedRetailForGrams("2g"),
    description: `Pineapple — wholesale master case. ${packExplainer}`,
    image: chopMasterCaseImageForSlug("pineapple-2g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_PINEAPPLE_2G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_PINEAPPLE_2G",
  },
  {
    slug: "wholesale-vanilla-1g",
    name: masterCaseName("Vanilla", "1g"),
    flavorId: "vanilla",
    flavorLabel: "VANILLA",
    retailSku: "vanilla-1g",
    grams: "1g",
    retailThreePackBoxesPerMasterCase: RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE,
    priceCents: WHOLESALE_WS_1G_CENTS,
    currency: "usd",
    suggestedRetailCaseCents: suggestedRetailForGrams("1g"),
    description: `Vanilla — wholesale master case. ${packExplainer}`,
    image: chopMasterCaseImageForSlug("vanilla-1g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_VANILLA_1G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_VANILLA_1G",
  },
  {
    slug: "wholesale-vanilla-2g",
    name: masterCaseName("Vanilla", "2g"),
    flavorId: "vanilla",
    flavorLabel: "VANILLA",
    retailSku: "vanilla-2g",
    grams: "2g",
    retailThreePackBoxesPerMasterCase: RETAIL_THREE_PACK_BOXES_PER_MASTER_CASE,
    priceCents: WHOLESALE_WS_2G_CENTS,
    currency: "usd",
    suggestedRetailCaseCents: suggestedRetailForGrams("2g"),
    description: `Vanilla — wholesale master case. ${packExplainer}`,
    image: chopMasterCaseImageForSlug("vanilla-2g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_VANILLA_2G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_VANILLA_2G",
  },
];

export const WHOLESALE_PRODUCT_SLUGS = WHOLESALE_PRODUCTS.map((p) => p.slug) as [
  string,
  ...string[],
];

export const WHOLESALE_SLUG_SET: ReadonlySet<string> = new Set(
  WHOLESALE_PRODUCTS.map((p) => p.slug),
);

const bySlug = new Map(WHOLESALE_PRODUCTS.map((p) => [p.slug, p]));

/** Older builds used `wholesale-case-*`; Stripe metadata uses `wholesale-*`. */
const LEGACY_WHOLESALE_SLUG: Record<string, string> = Object.fromEntries(
  WHOLESALE_PRODUCTS.map((p) => [`wholesale-case-${p.slug.replace(/^wholesale-/, "")}`, p.slug]),
);

export function normalizeWholesaleSlug(slug: string): string {
  return LEGACY_WHOLESALE_SLUG[slug] ?? slug;
}

export function getWholesaleProductBySlug(slug: string): WholesaleProduct | undefined {
  return bySlug.get(normalizeWholesaleSlug(slug));
}

export function getWholesaleStripeProductId(p: WholesaleProduct): string | undefined {
  const v = process.env[p.stripeProductEnvKey];
  return v && v.startsWith("prod_") ? v : undefined;
}

export function getWholesaleStripePriceId(p: WholesaleProduct): string | undefined {
  const v = process.env[p.stripePriceEnvKey];
  return v && v.startsWith("price_") ? v : undefined;
}

export function findWholesaleProductByStripePriceId(
  priceId: string,
): WholesaleProduct | undefined {
  for (const p of WHOLESALE_PRODUCTS) {
    if (getWholesaleStripePriceId(p) === priceId) return p;
  }
  return undefined;
}
