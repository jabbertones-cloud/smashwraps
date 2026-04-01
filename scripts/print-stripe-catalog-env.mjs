#!/usr/bin/env node
/**
 * Print STRIPE_PRODUCT_* / STRIPE_PRICE_* lines from existing Stripe Products + Prices.
 * Matches by metadata.smashwraps_slug (from seed), else exact product name from catalog.
 *
 * Usage (from smashwraps-retail):
 *   STRIPE_SECRET_KEY=sk_... node scripts/print-stripe-catalog-env.mjs
 *   STRIPE_SECRET_KEY=sk_... STRIPE_CONNECT_ACCOUNT_ID=acct_... node scripts/print-stripe-catalog-env.mjs
 *
 * --platform-only  List on the platform account (no Stripe-Account header).
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
    slug: "iced-watermelon-1g",
    name: "The CHOP — Iced Watermelon (1g)",
    cents: 475,
    stripeProductEnvKey: "STRIPE_PRODUCT_ICED_WATERMELON_1G",
    stripePriceEnvKey: "STRIPE_PRICE_ICED_WATERMELON_1G",
  },
  {
    slug: "iced-watermelon-2g",
    name: "The CHOP — Iced Watermelon (2g)",
    cents: 500,
    stripeProductEnvKey: "STRIPE_PRODUCT_ICED_WATERMELON_2G",
    stripePriceEnvKey: "STRIPE_PRICE_ICED_WATERMELON_2G",
  },
  {
    slug: "passion-fruit-1g",
    name: "The CHOP — Passion Fruit (1g)",
    cents: 475,
    stripeProductEnvKey: "STRIPE_PRODUCT_PASSION_FRUIT_1G",
    stripePriceEnvKey: "STRIPE_PRICE_PASSION_FRUIT_1G",
  },
  {
    slug: "passion-fruit-2g",
    name: "The CHOP — Passion Fruit (2g)",
    cents: 500,
    stripeProductEnvKey: "STRIPE_PRODUCT_PASSION_FRUIT_2G",
    stripePriceEnvKey: "STRIPE_PRICE_PASSION_FRUIT_2G",
  },
  {
    slug: "pineapple-1g",
    name: "The CHOP — Pineapple (1g)",
    cents: 475,
    stripeProductEnvKey: "STRIPE_PRODUCT_PINEAPPLE_1G",
    stripePriceEnvKey: "STRIPE_PRICE_PINEAPPLE_1G",
  },
  {
    slug: "pineapple-2g",
    name: "The CHOP — Pineapple (2g)",
    cents: 500,
    stripeProductEnvKey: "STRIPE_PRODUCT_PINEAPPLE_2G",
    stripePriceEnvKey: "STRIPE_PRICE_PINEAPPLE_2G",
  },
  {
    slug: "vanilla-1g",
    name: "The CHOP — Vanilla (1g)",
    cents: 475,
    stripeProductEnvKey: "STRIPE_PRODUCT_VANILLA_1G",
    stripePriceEnvKey: "STRIPE_PRICE_VANILLA_1G",
  },
  {
    slug: "vanilla-2g",
    name: "The CHOP — Vanilla (2g)",
    cents: 500,
    stripeProductEnvKey: "STRIPE_PRODUCT_VANILLA_2G",
    stripePriceEnvKey: "STRIPE_PRICE_VANILLA_2G",
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
    lines.push(`${row.stripeProductEnvKey}=${prod.id}`);
    lines.push(`${row.stripePriceEnvKey}=${price.id}`);
  }

  return { label, lines, missing, count: CATALOG.length - missing.length };
}

async function main() {
  loadEnvFiles();

  const platformOnly = process.argv.includes("--platform-only");
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    console.error(
      "Missing STRIPE_SECRET_KEY. Set it or add to .env.local.",
    );
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
      "Could not resolve catalog from Stripe. Check account, Connect ID, and product metadata/names.",
    );
    process.exit(1);
  }

  console.log(`# Source: ${best.label}`);
  if (best.missing.length) {
    console.log(
      `# Missing SKUs: ${best.missing.join(", ")}`,
    );
  }
  console.log("");
  console.log(best.lines.join("\n"));
  console.log("");
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
