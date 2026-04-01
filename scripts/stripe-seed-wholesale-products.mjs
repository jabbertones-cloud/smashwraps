#!/usr/bin/env node
/**
 * Create Stripe Products + Prices for wholesale master cases (matches lib/wholesale-products.ts).
 * One master case = 8 retail three-packs (24 Chops). WS $19 (1g) / $20 (2g) per case, all flavors.
 * Price idempotency key includes v3 — re-run after a price change creates new Price objects; point env at new price_ ids from `npm run stripe:print-env:wholesale`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import Stripe from "stripe";

function loadEnvFiles() {
  for (const name of [".env.local", ".env"]) {
    const p = join(process.cwd(), name);
    if (!existsSync(p)) continue;
    const raw = readFileSync(p, "utf8");
    for (let line of raw.split("\n")) {
      line = line.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const k = line.slice(0, eq).trim();
      let v = line.slice(eq + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

/** Must match `name` in lib/wholesale-products.ts exactly (used by print-stripe-wholesale-env). */
const SKUS = [
  {
    slug: "wholesale-iced-watermelon-1g",
    name: "The CHOP — Iced Watermelon (1g) — Master case (8× three-packs, 24 Chops)",
    priceCents: 1900,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_ICED_WATERMELON_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_ICED_WATERMELON_1G",
  },
  {
    slug: "wholesale-iced-watermelon-2g",
    name: "The CHOP — Iced Watermelon (2g) — Master case (8× three-packs, 24 Chops)",
    priceCents: 2000,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_ICED_WATERMELON_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_ICED_WATERMELON_2G",
  },
  {
    slug: "wholesale-passion-fruit-1g",
    name: "The CHOP — Passion Fruit (1g) — Master case (8× three-packs, 24 Chops)",
    priceCents: 1900,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PASSION_FRUIT_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PASSION_FRUIT_1G",
  },
  {
    slug: "wholesale-passion-fruit-2g",
    name: "The CHOP — Passion Fruit (2g) — Master case (8× three-packs, 24 Chops)",
    priceCents: 2000,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PASSION_FRUIT_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PASSION_FRUIT_2G",
  },
  {
    slug: "wholesale-pineapple-1g",
    name: "The CHOP — Pineapple (1g) — Master case (8× three-packs, 24 Chops)",
    priceCents: 1900,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PINEAPPLE_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PINEAPPLE_1G",
  },
  {
    slug: "wholesale-pineapple-2g",
    name: "The CHOP — Pineapple (2g) — Master case (8× three-packs, 24 Chops)",
    priceCents: 2000,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PINEAPPLE_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PINEAPPLE_2G",
  },
  {
    slug: "wholesale-vanilla-1g",
    name: "The CHOP — Vanilla (1g) — Master case (8× three-packs, 24 Chops)",
    priceCents: 1900,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_VANILLA_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_VANILLA_1G",
  },
  {
    slug: "wholesale-vanilla-2g",
    name: "The CHOP — Vanilla (2g) — Master case (8× three-packs, 24 Chops)",
    priceCents: 2000,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_VANILLA_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_VANILLA_2G",
  },
];

const PRODUCT_DESCRIPTION =
  "Wholesale master case: 8 retail three-pack boxes (24 Chops). $19/case (1g) or $20/case (2g).";

const DRY = process.argv.includes("--dry-run");

async function main() {
  loadEnvFiles();

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret && !DRY) {
    console.error(
      "Missing STRIPE_SECRET_KEY. Set it or add it to .env.local in smashwraps-retail.",
    );
    process.exit(1);
  }

  const connectId = process.env.STRIPE_CONNECT_ACCOUNT_ID?.trim();
  const requestOptions =
    connectId && connectId.startsWith("acct_")
      ? { stripeAccount: connectId }
      : undefined;

  if (connectId) {
    console.log(`Using Stripe Connect account: ${connectId}\n`);
  } else {
    console.log(
      "No STRIPE_CONNECT_ACCOUNT_ID — creating on the platform account.\n",
    );
  }

  if (DRY) {
    for (const sku of SKUS) {
      console.log(
        `[dry-run] ${sku.name} — $${(sku.priceCents / 100).toFixed(2)} / master case`,
      );
      console.log(`          ${sku.productEnvKey}=prod_…`);
      console.log(`          ${sku.priceEnvKey}=price_…`);
    }
    console.log("\nRun npm run stripe:seed:wholesale after STRIPE_SECRET_KEY is set.");
    return;
  }

  const stripe = new Stripe(secret, {
    apiVersion: "2025-02-24.acacia",
    typescript: false,
  });

  const lines = [];

  for (const sku of SKUS) {
    const idemProduct = `smashwraps-wholesale-seed-product-${sku.slug}`;
    const idemPrice = `smashwraps-wholesale-seed-price-${sku.slug}-v3-mc`;

    const product = await stripe.products.create(
      {
        name: sku.name,
        description: PRODUCT_DESCRIPTION,
        metadata: {
          smashwraps_slug: sku.slug,
          storefront: "smashwraps-retail",
          channel: "wholesale",
        },
      },
      { ...requestOptions, idempotencyKey: idemProduct },
    );

    await stripe.products.update(
      product.id,
      {
        name: sku.name,
        description: PRODUCT_DESCRIPTION,
      },
      requestOptions,
    );

    const price = await stripe.prices.create(
      {
        product: product.id,
        currency: "usd",
        unit_amount: sku.priceCents,
        metadata: {
          smashwraps_slug: sku.slug,
          storefront: "smashwraps-retail",
          channel: "wholesale",
        },
      },
      { ...requestOptions, idempotencyKey: idemPrice },
    );

    console.log(`OK  ${sku.slug}`);
    console.log(`    product: ${product.id}`);
    console.log(`    price:   ${price.id} ($${(sku.priceCents / 100).toFixed(2)})`);
    console.log(`    ${sku.productEnvKey}=${product.id}`);
    console.log(`    ${sku.priceEnvKey}=${price.id}\n`);

    lines.push(`${sku.productEnvKey}=${product.id}`);
    lines.push(`${sku.priceEnvKey}=${price.id}`);
  }

  if (lines.length) {
    console.log("--- Add these to Vercel (or .env.local) ---\n");
    console.log(lines.join("\n"));
    console.log("");
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
