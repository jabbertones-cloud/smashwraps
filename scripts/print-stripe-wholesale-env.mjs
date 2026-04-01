#!/usr/bin/env node
/**
 * Print STRIPE_WHOLESALE_PRODUCT_* / STRIPE_WHOLESALE_PRICE_* from existing Stripe objects.
 * Same discovery rules as print-stripe-catalog-env.mjs (metadata.smashwraps_slug or exact name).
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

const CATALOG = [
  {
    slug: "wholesale-case-iced-watermelon-1g",
    name: "The CHOP — Iced Watermelon (1g) — Case (12 units)",
    cents: 4200,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_ICED_WATERMELON_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_ICED_WATERMELON_1G",
  },
  {
    slug: "wholesale-case-iced-watermelon-2g",
    name: "The CHOP — Iced Watermelon (2g) — Case (12 units)",
    cents: 4500,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_ICED_WATERMELON_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_ICED_WATERMELON_2G",
  },
  {
    slug: "wholesale-case-passion-fruit-1g",
    name: "The CHOP — Passion Fruit (1g) — Case (12 units)",
    cents: 4200,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PASSION_FRUIT_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PASSION_FRUIT_1G",
  },
  {
    slug: "wholesale-case-passion-fruit-2g",
    name: "The CHOP — Passion Fruit (2g) — Case (12 units)",
    cents: 4500,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PASSION_FRUIT_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PASSION_FRUIT_2G",
  },
  {
    slug: "wholesale-case-pineapple-1g",
    name: "The CHOP — Pineapple (1g) — Case (12 units)",
    cents: 4200,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PINEAPPLE_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PINEAPPLE_1G",
  },
  {
    slug: "wholesale-case-pineapple-2g",
    name: "The CHOP — Pineapple (2g) — Case (12 units)",
    cents: 4500,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_PINEAPPLE_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_PINEAPPLE_2G",
  },
  {
    slug: "wholesale-case-vanilla-1g",
    name: "The CHOP — Vanilla (1g) — Case (12 units)",
    cents: 4200,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_VANILLA_1G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_VANILLA_1G",
  },
  {
    slug: "wholesale-case-vanilla-2g",
    name: "The CHOP — Vanilla (2g) — Case (12 units)",
    cents: 4500,
    productEnvKey: "STRIPE_WHOLESALE_PRODUCT_VANILLA_2G",
    priceEnvKey: "STRIPE_WHOLESALE_PRICE_VANILLA_2G",
  },
];

async function listAllProducts(stripe, requestOptions) {
  const all = [];
  let startingAfter;
  for (;;) {
    const params = { limit: 100, active: true };
    if (startingAfter) params.starting_after = startingAfter;
    const page = await stripe.products.list(params, requestOptions);
    all.push(...page.data);
    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1].id;
  }
  return all;
}

function findProductForSlug(products, slug, exactName) {
  const byMeta = products.find(
    (p) => p.metadata && p.metadata.smashwraps_slug === slug,
  );
  if (byMeta) return byMeta;
  return products.find((p) => p.name === exactName);
}

async function pickPrice(stripe, productId, expectedCents, requestOptions) {
  let startingAfter;
  const prices = [];
  for (;;) {
    const params = {
      product: productId,
      active: true,
      limit: 100,
    };
    if (startingAfter) params.starting_after = startingAfter;
    const page = await stripe.prices.list(params, requestOptions);
    prices.push(...page.data);
    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1].id;
  }
  const usdOneTime = prices.filter(
    (pr) =>
      pr.currency === "usd" &&
      pr.type === "one_time" &&
      pr.unit_amount != null,
  );
  const exact = usdOneTime.find((pr) => pr.unit_amount === expectedCents);
  if (exact) return exact;
  if (usdOneTime.length === 1) return usdOneTime[0];
  return usdOneTime[0];
}

async function runWithOptions(stripe, label, requestOptions) {
  const products = await listAllProducts(stripe, requestOptions);
  const lines = [];
  const missing = [];

  for (const row of CATALOG) {
    const prod = findProductForSlug(products, row.slug, row.name);
    if (!prod) {
      missing.push(row.slug);
      continue;
    }
    const price = await pickPrice(
      stripe,
      prod.id,
      row.cents,
      requestOptions,
    );
    if (!price) {
      missing.push(`${row.slug} (no price)`);
      continue;
    }
    lines.push(`${row.productEnvKey}=${prod.id}`);
    lines.push(`${row.priceEnvKey}=${price.id}`);
  }

  return { label, lines, missing, count: CATALOG.length - missing.length };
}

async function main() {
  loadEnvFiles();

  const platformOnly = process.argv.includes("--platform-only");
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    console.error("Missing STRIPE_SECRET_KEY.");
    process.exit(1);
  }

  const connectId = process.env.STRIPE_CONNECT_ACCOUNT_ID?.trim();
  const stripe = new Stripe(secret, {
    apiVersion: "2025-02-24.acacia",
    typescript: false,
  });

  const attempts = [];
  if (!platformOnly && connectId?.startsWith("acct_")) {
    attempts.push({
      label: `connected account ${connectId}`,
      opts: { stripeAccount: connectId },
    });
  }
  attempts.push({ label: "platform account", opts: undefined });

  let best = null;
  for (const { label, opts } of attempts) {
    try {
      const result = await runWithOptions(stripe, label, opts);
      if (
        !best ||
        result.missing.length < best.missing.length ||
        (result.missing.length === best.missing.length &&
          result.lines.length > best.lines.length)
      ) {
        best = result;
      }
      if (result.missing.length === 0) {
        best = result;
        break;
      }
    } catch (e) {
      console.error(`[${label}] ${e?.message || e}`);
    }
  }

  if (!best || best.lines.length === 0) {
    console.error(
      "Could not resolve wholesale catalog from Stripe. Run npm run stripe:seed:wholesale first.",
    );
    process.exit(1);
  }

  console.log(`# Source: ${best.label}`);
  if (best.missing.length) {
    console.log(`# Missing SKUs: ${best.missing.join(", ")}`);
  }
  console.log("");
  console.log(best.lines.join("\n"));
  console.log("");
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
