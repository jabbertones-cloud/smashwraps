import { chopThreePackImageForSlug } from "@/lib/chop-images";

export type FlavorId = "iced-watermelon" | "passion-fruit" | "pineapple" | "vanilla";
export type GramSize = "1g" | "2g";

/** Cali-style length × tube OD — matches retail packaging (109×11 = 1g, 109×14 = 2g). */
export const CHOP_PHYSICAL_SPEC = {
  "1g": { lengthMm: 109, tubeOdMm: 11 },
  "2g": { lengthMm: 109, tubeOdMm: 14 },
} as const;

/** Short site-wide line for meta / hero (both sizes in one sentence). */
export const CHOP_SPECS_GLOBAL_SUMMARY =
  "1g = 109×11mm · 2g = 109×14mm (length × tube OD, Cali-style)";

export function chopRetailBoxCopy(grams: GramSize): string {
  const s = CHOP_PHYSICAL_SPEC[grams];
  return `One box = one retail unit with 3 Chops (three 109mm Cali-style tubes; ${s.lengthMm}×${s.tubeOdMm}mm). Flavor in the capsule tip — not sprayed on the sheet. Patent pending. This site sells single boxes only, not by the case.`;
}

export type Product = {
  slug: string;
  name: string;
  flavorLabel: string;
  flavorId: FlavorId;
  grams: GramSize;
  /** Display price when Stripe not configured */
  priceCents: number;
  currency: "usd";
  description: string;
  image: string;
  /** Env key for Stripe Product id (`prod_…`) — must match the Product attached to the Price. */
  stripeProductEnvKey: string;
  stripePriceEnvKey: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "iced-watermelon-1g",
    name: "The CHOP — Iced Watermelon (1g)",
    flavorLabel: "ICED WATERMELON",
    flavorId: "iced-watermelon",
    grams: "1g",
    priceCents: 475,
    currency: "usd",
    description: `Iced Watermelon flavor. ${chopRetailBoxCopy("1g")}`,
    image: chopThreePackImageForSlug("iced-watermelon-1g"),
    stripeProductEnvKey: "STRIPE_PRODUCT_ICED_WATERMELON_1G",
    stripePriceEnvKey: "STRIPE_PRICE_ICED_WATERMELON_1G",
  },
  {
    slug: "iced-watermelon-2g",
    name: "The CHOP — Iced Watermelon (2g)",
    flavorLabel: "ICED WATERMELON",
    flavorId: "iced-watermelon",
    grams: "2g",
    priceCents: 500,
    currency: "usd",
    description: `Iced Watermelon flavor. ${chopRetailBoxCopy("2g")}`,
    image: chopThreePackImageForSlug("iced-watermelon-2g"),
    stripeProductEnvKey: "STRIPE_PRODUCT_ICED_WATERMELON_2G",
    stripePriceEnvKey: "STRIPE_PRICE_ICED_WATERMELON_2G",
  },
  {
    slug: "passion-fruit-1g",
    name: "The CHOP — Passion Fruit (1g)",
    flavorLabel: "PASSION FRUIT",
    flavorId: "passion-fruit",
    grams: "1g",
    priceCents: 475,
    currency: "usd",
    description: `Passion Fruit flavor. ${chopRetailBoxCopy("1g")}`,
    image: chopThreePackImageForSlug("passion-fruit-1g"),
    stripeProductEnvKey: "STRIPE_PRODUCT_PASSION_FRUIT_1G",
    stripePriceEnvKey: "STRIPE_PRICE_PASSION_FRUIT_1G",
  },
  {
    slug: "passion-fruit-2g",
    name: "The CHOP — Passion Fruit (2g)",
    flavorLabel: "PASSION FRUIT",
    flavorId: "passion-fruit",
    grams: "2g",
    priceCents: 500,
    currency: "usd",
    description: `Passion Fruit flavor. ${chopRetailBoxCopy("2g")}`,
    image: chopThreePackImageForSlug("passion-fruit-2g"),
    stripeProductEnvKey: "STRIPE_PRODUCT_PASSION_FRUIT_2G",
    stripePriceEnvKey: "STRIPE_PRICE_PASSION_FRUIT_2G",
  },
  {
    slug: "pineapple-1g",
    name: "The CHOP — Pineapple (1g)",
    flavorLabel: "PINEAPPLE",
    flavorId: "pineapple",
    grams: "1g",
    priceCents: 475,
    currency: "usd",
    description: `Pineapple flavor. ${chopRetailBoxCopy("1g")}`,
    image: chopThreePackImageForSlug("pineapple-1g"),
    stripeProductEnvKey: "STRIPE_PRODUCT_PINEAPPLE_1G",
    stripePriceEnvKey: "STRIPE_PRICE_PINEAPPLE_1G",
  },
  {
    slug: "pineapple-2g",
    name: "The CHOP — Pineapple (2g)",
    flavorLabel: "PINEAPPLE",
    flavorId: "pineapple",
    grams: "2g",
    priceCents: 500,
    currency: "usd",
    description: `Pineapple flavor. ${chopRetailBoxCopy("2g")}`,
    image: chopThreePackImageForSlug("pineapple-2g"),
    stripeProductEnvKey: "STRIPE_PRODUCT_PINEAPPLE_2G",
    stripePriceEnvKey: "STRIPE_PRICE_PINEAPPLE_2G",
  },
  {
    slug: "vanilla-1g",
    name: "The CHOP — Vanilla (1g)",
    flavorLabel: "VANILLA",
    flavorId: "vanilla",
    grams: "1g",
    priceCents: 475,
    currency: "usd",
    description: `Vanilla flavor. ${chopRetailBoxCopy("1g")}`,
    image: chopThreePackImageForSlug("vanilla-1g"),
    stripeProductEnvKey: "STRIPE_PRODUCT_VANILLA_1G",
    stripePriceEnvKey: "STRIPE_PRICE_VANILLA_1G",
  },
  {
    slug: "vanilla-2g",
    name: "The CHOP — Vanilla (2g)",
    flavorLabel: "VANILLA",
    flavorId: "vanilla",
    grams: "2g",
    priceCents: 500,
    currency: "usd",
    description: `Vanilla flavor. ${chopRetailBoxCopy("2g")}`,
    image: chopThreePackImageForSlug("vanilla-2g"),
    stripeProductEnvKey: "STRIPE_PRODUCT_VANILLA_2G",
    stripePriceEnvKey: "STRIPE_PRICE_VANILLA_2G",
  },
];

/** Allowlisted slugs — checkout only accepts these; Stripe Price IDs come from server env per slug. */
export const PRODUCT_SLUGS = PRODUCTS.map((p) => p.slug) as [string, ...string[]];

export const PRODUCT_SLUG_SET: ReadonlySet<string> = new Set(PRODUCTS.map((p) => p.slug));

const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));

export function getProductBySlug(slug: string): Product | undefined {
  return bySlug.get(slug);
}

/** PDP internal linking: same flavor (other gram) first, then other flavors. */
export function getRelatedProducts(slug: string, limit = 4): Product[] {
  const current = getProductBySlug(slug);
  if (!current) return [];
  const sameFlavorOtherGram = PRODUCTS.filter(
    (p) => p.flavorId === current.flavorId && p.slug !== slug,
  );
  const otherFlavors = PRODUCTS.filter(
    (p) => p.flavorId !== current.flavorId && p.slug !== slug,
  );
  return [...sameFlavorOtherGram, ...otherFlavors].slice(0, limit);
}

export function getStripeProductId(product: Product): string | undefined {
  const v = process.env[product.stripeProductEnvKey];
  return v && v.startsWith("prod_") ? v : undefined;
}

export function getStripePriceId(product: Product): string | undefined {
  const v = process.env[product.stripePriceEnvKey];
  return v && v.startsWith("price_") ? v : undefined;
}

/** Resolve catalog product from Stripe Price id (webhooks / checkout lines). */
export function findProductByStripePriceId(priceId: string): Product | undefined {
  for (const p of PRODUCTS) {
    if (getStripePriceId(p) === priceId) return p;
  }
  return undefined;
}
