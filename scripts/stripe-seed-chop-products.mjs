#!/usr/bin/env node
/**
 * Create Stripe Products + Prices for Smash Wraps retail SKUs (matches lib/products.ts).
 *
 * Uses STRIPE_SECRET_KEY from the environment. If STRIPE_CONNECT_ACCOUNT_ID is set
 * (acct_...), creates objects on that connected account (same as checkout).
 *
 * Checkout requires BOTH `prod_…` and `price_…` per SKU in env — the server verifies
 * the Price is attached to that Product (no client-sent amounts).
 *
 * Usage:
 *   cd smashwraps-retail
 *   npm run stripe:seed:dry
 *   npm run stripe:seed
 *
 * Idempotency: POST requests use idempotency keys so a safe re-run does not duplicate
 * products if the first attempt partially succeeded (within Stripe’s window).
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

const SKUS = [
  {
    slug: "iced-watermelon-1g",
    name: "The CHOP — Iced Watermelon (1g)",
    priceCents: 475,
    productEnvKey: "STRIPE_PRODUCT_ICED_WATERMELON_1G",
    priceEnvKey: "STRIPE_PRICE_ICED_WATERMELON_1G",
  },
  {
    slug: "iced-watermelon-2g",
    name: "The CHOP — Iced Watermelon (2g)",
    priceCents: 500,
    productEnvKey: "STRIPE_PRODUCT_ICED_WATERMELON_2G",
    priceEnvKey: "STRIPE_PRICE_ICED_WATERMELON_2G",
  },
  {
    slug: "passion-fruit-1g",
    name: "The CHOP — Passion Fruit (1g)",
    priceCents: 475,
    productEnvKey: "STRIPE_PRODUCT_PASSION_FRUIT_1G",
    priceEnvKey: "STRIPE_PRICE_PASSION_FRUIT_1G",
  },
  {
    slug: "passion-fruit-2g",
    name: "The CHOP — Passion Fruit (2g)",
    priceCents: 500,
    productEnvKey: "STRIPE_PRODUCT_PASSION_FRUIT_2G",
    priceEnvKey: "STRIPE_PRICE_PASSION_FRUIT_2G",
  },
  {
    slug: "pineapple-1g",
    name: "The CHOP — Pineapple (1g)",
    priceCents: 475,
    productEnvKey: "STRIPE_PRODUCT_PINEAPPLE_1G",
    priceEnvKey: "STRIPE_PRICE_PINEAPPLE_1G",
  },
  {
    slug: "pineapple-2g",
    name: "The CHOP — Pineapple (2g)",
    priceCents: 500,
    productEnvKey: "STRIPE_PRODUCT_PINEAPPLE_2G",
    priceEnvKey: "STRIPE_PRICE_PINEAPPLE_2G",
  },
  {
    slug: "vanilla-1g",
    name: "The CHOP — Vanilla (1g)",
    priceCents: 475,
    productEnvKey: "STRIPE_PRODUCT_VANILLA_1G",
    priceEnvKey: "STRIPE_PRICE_VANILLA_1G",
  },
  {
    slug: "vanilla-2g",
    name: "The CHOP — Vanilla (2g)",
    priceCents: 500,
    productEnvKey: "STRIPE_PRODUCT_VANILLA_2G",
    priceEnvKey: "STRIPE_PRICE_VANILLA_2G",
  },
];

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
        `[dry-run] ${sku.name} — $${(sku.priceCents / 100).toFixed(2)}`,
      );
      console.log(`          ${sku.productEnvKey}=prod_…`);
      console.log(`          ${sku.priceEnvKey}=price_…`);
    }
    console.log(
      "\nRun npm run stripe:seed after STRIPE_SECRET_KEY is set (see README).",
    );
    return;
  }

  const stripe = new Stripe(secret, {
    apiVersion: "2025-06-30",
    typescript: false,
  });

  const lines = [];

  for (const sku of SKUS) {
    const idemProduct = `smashwraps-retail-seed-product-${sku.slug}`;
    const idemPrice = `smashwraps-retail-seed-price-${sku.slug}`;

    const product = await stripe.products.create(
      {
        name: sku.name,
        metadata: {
          smashwraps_slug: sku.slug,
          storefront: "smashwraps-retail",
        },
      },
      { ...requestOptions, idempotencyKey: idemProduct },
    );

    const price = await stripe.prices.create(
      {
        product: product.id,
        currency: "usd",
        unit_amount: sku.priceCents,
        metadata: {
          smashwraps_slug: sku.slug,
          storefront: "smashwraps-retail",
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
