import { chopThreePackImageForSlug } from "@/lib/chop-images";

export type FlavorId = "iced-watermelon" | "passion-fruit" | "pineapple" | "vanilla";
export type GramSize = "1g" | "2g";

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

const pack =
  "One box = one retail unit with 3 Chops (three 110mm tubes). Flavor in the capsule tip — not sprayed on the sheet. Patent pending. This site sells single boxes only, not by the case.";

export const PRODUCTS: Product[] = [
  {
    slug: "iced-watermelon-1g",
    name: "The CHOP — Iced Watermelon (1g)",
    flavorLabel: "ICED WATERMELON",
    flavorId: "iced-watermelon",
    grams: "1g",
    priceCents: 475,
    currency: "usd",
    description: `Iced Watermelon flavor. ${pack}`,
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
    description: `Iced Watermelon flavor. ${pack}`,
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
    description: `Passion Fruit flavor. ${pack}`,
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
    description: `Passion Fruit flavor. ${pack}`,
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
    description: `Pineapple flavor. ${pack}`,
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
    description: `Pineapple flavor. ${pack}`,
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
    description: `Vanilla flavor. ${pack}`,
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
    description: `Vanilla flavor. ${pack}`,
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

export function getStripeProductId(product: Product): string | undefined {
  const v = process.env[product.stripeProductEnvKey];
  return v && v.startsWith("prod_") ? v : undefined;
}

export function getStripePriceId(product: Product): string | undefined {
  const v = process.env[product.stripePriceEnvKey];
  return v && v.startsWith("price_") ? v : undefined;
}
