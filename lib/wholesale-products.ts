import { chopThreePackImageForSlug } from "@/lib/chop-images";
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
  /** Units per case (three-pack boxes) */
  unitsPerCase: number;
  /** Wholesale price per case (USD cents) */
  priceCents: number;
  currency: "usd";
  /** Suggested retail value for the same case qty (12 × single-box MSRP), cents */
  suggestedRetailCaseCents: number;
  description: string;
  image: string;
  stripeProductEnvKey: string;
  stripePriceEnvKey: string;
};

const CASE = 12;

const pack =
  "Each wholesale line is one case of 12 retail boxes (12 three-packs / 36 Chops total per case). Flavor in the capsule tip. For licensed retailers.";

export const WHOLESALE_PRODUCTS: WholesaleProduct[] = [
  {
    slug: "wholesale-case-iced-watermelon-1g",
    name: "The CHOP — Iced Watermelon (1g) — Case (12 units)",
    flavorId: "iced-watermelon",
    flavorLabel: "ICED WATERMELON",
    retailSku: "iced-watermelon-1g",
    grams: "1g",
    unitsPerCase: CASE,
    priceCents: 42_00,
    currency: "usd",
    suggestedRetailCaseCents: 57_00,
    description: `Iced Watermelon — wholesale case. ${pack}`,
    image: chopThreePackImageForSlug("iced-watermelon-1g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_ICED_WATERMELON_1G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_ICED_WATERMELON_1G",
  },
  {
    slug: "wholesale-case-iced-watermelon-2g",
    name: "The CHOP — Iced Watermelon (2g) — Case (12 units)",
    flavorId: "iced-watermelon",
    flavorLabel: "ICED WATERMELON",
    retailSku: "iced-watermelon-2g",
    grams: "2g",
    unitsPerCase: CASE,
    priceCents: 45_00,
    currency: "usd",
    suggestedRetailCaseCents: 60_00,
    description: `Iced Watermelon — wholesale case. ${pack}`,
    image: chopThreePackImageForSlug("iced-watermelon-2g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_ICED_WATERMELON_2G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_ICED_WATERMELON_2G",
  },
  {
    slug: "wholesale-case-passion-fruit-1g",
    name: "The CHOP — Passion Fruit (1g) — Case (12 units)",
    flavorId: "passion-fruit",
    flavorLabel: "PASSION FRUIT",
    retailSku: "passion-fruit-1g",
    grams: "1g",
    unitsPerCase: CASE,
    priceCents: 42_00,
    currency: "usd",
    suggestedRetailCaseCents: 57_00,
    description: `Passion Fruit — wholesale case. ${pack}`,
    image: chopThreePackImageForSlug("passion-fruit-1g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_PASSION_FRUIT_1G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_PASSION_FRUIT_1G",
  },
  {
    slug: "wholesale-case-passion-fruit-2g",
    name: "The CHOP — Passion Fruit (2g) — Case (12 units)",
    flavorId: "passion-fruit",
    flavorLabel: "PASSION FRUIT",
    retailSku: "passion-fruit-2g",
    grams: "2g",
    unitsPerCase: CASE,
    priceCents: 45_00,
    currency: "usd",
    suggestedRetailCaseCents: 60_00,
    description: `Passion Fruit — wholesale case. ${pack}`,
    image: chopThreePackImageForSlug("passion-fruit-2g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_PASSION_FRUIT_2G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_PASSION_FRUIT_2G",
  },
  {
    slug: "wholesale-case-pineapple-1g",
    name: "The CHOP — Pineapple (1g) — Case (12 units)",
    flavorId: "pineapple",
    flavorLabel: "PINEAPPLE",
    retailSku: "pineapple-1g",
    grams: "1g",
    unitsPerCase: CASE,
    priceCents: 42_00,
    currency: "usd",
    suggestedRetailCaseCents: 57_00,
    description: `Pineapple — wholesale case. ${pack}`,
    image: chopThreePackImageForSlug("pineapple-1g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_PINEAPPLE_1G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_PINEAPPLE_1G",
  },
  {
    slug: "wholesale-case-pineapple-2g",
    name: "The CHOP — Pineapple (2g) — Case (12 units)",
    flavorId: "pineapple",
    flavorLabel: "PINEAPPLE",
    retailSku: "pineapple-2g",
    grams: "2g",
    unitsPerCase: CASE,
    priceCents: 45_00,
    currency: "usd",
    suggestedRetailCaseCents: 60_00,
    description: `Pineapple — wholesale case. ${pack}`,
    image: chopThreePackImageForSlug("pineapple-2g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_PINEAPPLE_2G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_PINEAPPLE_2G",
  },
  {
    slug: "wholesale-case-vanilla-1g",
    name: "The CHOP — Vanilla (1g) — Case (12 units)",
    flavorId: "vanilla",
    flavorLabel: "VANILLA",
    retailSku: "vanilla-1g",
    grams: "1g",
    unitsPerCase: CASE,
    priceCents: 42_00,
    currency: "usd",
    suggestedRetailCaseCents: 57_00,
    description: `Vanilla — wholesale case. ${pack}`,
    image: chopThreePackImageForSlug("vanilla-1g"),
    stripeProductEnvKey: "STRIPE_WHOLESALE_PRODUCT_VANILLA_1G",
    stripePriceEnvKey: "STRIPE_WHOLESALE_PRICE_VANILLA_1G",
  },
  {
    slug: "wholesale-case-vanilla-2g",
    name: "The CHOP — Vanilla (2g) — Case (12 units)",
    flavorId: "vanilla",
    flavorLabel: "VANILLA",
    retailSku: "vanilla-2g",
    grams: "2g",
    unitsPerCase: CASE,
    priceCents: 45_00,
    currency: "usd",
    suggestedRetailCaseCents: 60_00,
    description: `Vanilla — wholesale case. ${pack}`,
    image: chopThreePackImageForSlug("vanilla-2g"),
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

export function getWholesaleProductBySlug(slug: string): WholesaleProduct | undefined {
  return bySlug.get(slug);
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
