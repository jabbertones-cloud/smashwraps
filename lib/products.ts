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
  stripePriceEnvKey: string;
};

const pack = "3 Chops per pack · 110mm rice paper tubes · flavor capsule in the tip. Patent pending.";

export const PRODUCTS: Product[] = [
  {
    slug: "iced-watermelon-1g",
    name: "The CHOP — Iced Watermelon (1g)",
    flavorLabel: "ICED WATERMELON",
    flavorId: "iced-watermelon",
    grams: "1g",
    priceCents: 1200,
    currency: "usd",
    description: `Iced Watermelon flavor. ${pack}`,
    image: "/images/iced-watermelon-1g-2g-packs.svg",
    stripePriceEnvKey: "STRIPE_PRICE_ICED_WATERMELON_1G",
  },
  {
    slug: "iced-watermelon-2g",
    name: "The CHOP — Iced Watermelon (2g)",
    flavorLabel: "ICED WATERMELON",
    flavorId: "iced-watermelon",
    grams: "2g",
    priceCents: 1400,
    currency: "usd",
    description: `Iced Watermelon flavor. ${pack}`,
    image: "/images/iced-watermelon-1g-2g-packs.svg",
    stripePriceEnvKey: "STRIPE_PRICE_ICED_WATERMELON_2G",
  },
  {
    slug: "passion-fruit-1g",
    name: "The CHOP — Passion Fruit (1g)",
    flavorLabel: "PASSION FRUIT",
    flavorId: "passion-fruit",
    grams: "1g",
    priceCents: 1200,
    currency: "usd",
    description: `Passion Fruit flavor. ${pack}`,
    image: "/images/passion-fruit-1g-2g-packs.svg",
    stripePriceEnvKey: "STRIPE_PRICE_PASSION_FRUIT_1G",
  },
  {
    slug: "passion-fruit-2g",
    name: "The CHOP — Passion Fruit (2g)",
    flavorLabel: "PASSION FRUIT",
    flavorId: "passion-fruit",
    grams: "2g",
    priceCents: 1400,
    currency: "usd",
    description: `Passion Fruit flavor. ${pack}`,
    image: "/images/passion-fruit-1g-2g-packs.svg",
    stripePriceEnvKey: "STRIPE_PRICE_PASSION_FRUIT_2G",
  },
  {
    slug: "pineapple-1g",
    name: "The CHOP — Pineapple (1g)",
    flavorLabel: "PINEAPPLE",
    flavorId: "pineapple",
    grams: "1g",
    priceCents: 1200,
    currency: "usd",
    description: `Pineapple flavor. ${pack}`,
    image: "/images/pineapple-1g-2g-packs.svg",
    stripePriceEnvKey: "STRIPE_PRICE_PINEAPPLE_1G",
  },
  {
    slug: "pineapple-2g",
    name: "The CHOP — Pineapple (2g)",
    flavorLabel: "PINEAPPLE",
    flavorId: "pineapple",
    grams: "2g",
    priceCents: 1400,
    currency: "usd",
    description: `Pineapple flavor. ${pack}`,
    image: "/images/pineapple-1g-2g-packs.svg",
    stripePriceEnvKey: "STRIPE_PRICE_PINEAPPLE_2G",
  },
  {
    slug: "vanilla-1g",
    name: "The CHOP — Vanilla (1g)",
    flavorLabel: "VANILLA",
    flavorId: "vanilla",
    grams: "1g",
    priceCents: 1200,
    currency: "usd",
    description: `Vanilla flavor. ${pack}`,
    image: "/images/vanilla-1g-2g-packs.svg",
    stripePriceEnvKey: "STRIPE_PRICE_VANILLA_1G",
  },
  {
    slug: "vanilla-2g",
    name: "The CHOP — Vanilla (2g)",
    flavorLabel: "VANILLA",
    flavorId: "vanilla",
    grams: "2g",
    priceCents: 1400,
    currency: "usd",
    description: `Vanilla flavor. ${pack}`,
    image: "/images/vanilla-1g-2g-packs.svg",
    stripePriceEnvKey: "STRIPE_PRICE_VANILLA_2G",
  },
];

const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));

export function getProductBySlug(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function getStripePriceId(product: Product): string | undefined {
  const v = process.env[product.stripePriceEnvKey];
  return v && v.startsWith("price_") ? v : undefined;
}
