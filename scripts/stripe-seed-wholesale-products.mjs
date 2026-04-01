#!/usr/bin/env node
/**
 * Create Stripe Products + Prices for wholesale cases (matches lib/wholesale-products.ts).
 * One case = 12 retail units. Same Connect / env pattern as stripe-seed-chop-products.mjs.
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
    slug: "wholesale-case-iced-watermelon-1g",
    name: "The CHOP — Iced Watermelon (1g) — Case (12 units)",
    priceCents: 4200,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_ICED_WATERMELON_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_ICED_WATERMELON_1G",
  },
  {
    slug: "wholesale-case-iced-watermelon-2g",
    name: "The CHOP — Iced Watermelon (2g) — Case (12 units)",
    priceCents: 4500,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_ICED_WATERMELON_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_ICED_WATERMELON_2G",
  },
  {
    slug: "wholesale-case-passion-fruit-1g",
    name: "The CHOP — Passion Fruit (1g) — Case (12 units)",
    priceCents: 4200,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PASSION_FRUIT_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PASSION_FRUIT_1G",
  },
  {
    slug: "wholesale-case-passion-fruit-2g",
    name: "The CHOP — Passion Fruit (2g) — Case (12 units)",
    priceCents: 4500,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PASSION_FRUIT_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PASSION_FRUIT_2G",
  },
  {
    slug: "wholesale-case-pineapple-1g",
    name: "The CHOP — Pineapple (1g) — Case (12 units)",
    priceCents: 4200,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PINEAPPLE_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PINEAPPLE_1G",
  },
  {
    slug: "wholesale-case-pineapple-2g",
    name: "The CHOP — Pineapple (2g) — Case (12 units)",
    priceCents: 4500,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PINEAPPLE_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PINEAPPLE_2G",
  },
  {
    slug: "wholesale-case-vanilla-1g",
    name: "The CHOP — Vanilla (1g) — Case (12 units)",
    priceCents: 4200,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_VANILLA_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_VANILLA_1G",
  },
  {
    slug: "wholesale-case-vanilla-2g",
    name: "The CHOP — Vanilla (2g) — Case (12 units)",
    priceCents: 4500,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_VANILLA_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_VANILLA_2G",
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
        `[dry-run] ${sku.name} — $${(sku.priceCents / 100).toFixed(2)} / case`,
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
    const idemPrice = `smashwraps-wholesale-seed-price-${sku.slug}`;

    const product = await stripe.products.create(
      {
        name: sku.name,
        metadata: {
          smashwraps_slug: sku.slug,
          storefront: "smashwraps-retail",
          channel: "wholesale",
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
