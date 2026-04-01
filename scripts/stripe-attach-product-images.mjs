#!/usr/bin/env node
/**
 * Point Stripe Product `images` at the live asset URLs the site already serves (lib/chop-images.ts paths under /public → `https://<origin>/images/...`).
 * Those files are public on production; Stripe’s API stores the same HTTPS URLs shoppers already load.
 *
 * Usage (from smashwraps-retail, with .env.local):
 *   npm run stripe:images
 *   npm run stripe:images:dry
 *
 * Env: STRIPE_SECRET_KEY; NEXT_PUBLIC_SITE_URL = your deployed origin (must match where `/images/*` is live). Optional STRIPE_CONNECT_ACCOUNT_ID.
 * Optional: STRIPE_IMAGE_SITE_URL if the image origin differs from NEXT_PUBLIC_SITE_URL.
 *
 * --platform-only  Update products on the platform account (no Connect header).
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

/** Same paths as CHOP_THREE_PACK_BY_SLUG in lib/chop-images.ts */
const IMAGE_PATH_BY_SLUG = {
  "iced-watermelon-1g": "/images/IcedWatermelonChops.png",
  "iced-watermelon-2g": "/images/IcedWatermelonChops.png",
  "passion-fruit-1g": "/images/PassionFruitChops.png",
  "passion-fruit-2g": "/images/PassionFruitChops.png",
  "pineapple-1g": "/images/PineappleChops.png",
  "pineapple-2g": "/images/PineappleChops.png",
  "vanilla-1g": "/images/VanillaChops.png",
  "vanilla-2g": "/images/VanillaChops.png",
};

const CATALOG_NAMES = {
  "iced-watermelon-1g": "The CHOP — Iced Watermelon (1g)",
  "iced-watermelon-2g": "The CHOP — Iced Watermelon (2g)",
  "passion-fruit-1g": "The CHOP — Passion Fruit (1g)",
  "passion-fruit-2g": "The CHOP — Passion Fruit (2g)",
  "pineapple-1g": "The CHOP — Pineapple (1g)",
  "pineapple-2g": "The CHOP — Pineapple (2g)",
  "vanilla-1g": "The CHOP — Vanilla (1g)",
  "vanilla-2g": "The CHOP — Vanilla (2g)",
};

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

function absoluteImageUrl(siteOrigin, path) {
  const base = siteOrigin.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function main() {
  loadEnvFiles();

  const dry = process.argv.includes("--dry-run");
  const platformOnly = process.argv.includes("--platform-only");

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret && !dry) {
    console.error("Missing STRIPE_SECRET_KEY (or use --dry-run).");
    process.exit(1);
  }

  const siteRaw =
    process.env.STRIPE_IMAGE_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteRaw) {
    console.error(
      "Set NEXT_PUBLIC_SITE_URL or STRIPE_IMAGE_SITE_URL to your public https origin (e.g. https://smashcones.com).",
    );
    process.exit(1);
  }
  if (!/^https:\/\//i.test(siteRaw)) {
    console.error("Site URL must start with https://");
    process.exit(1);
  }

  const connectId = process.env.STRIPE_CONNECT_ACCOUNT_ID?.trim();
  const stripe = secret
    ? new Stripe(secret, { apiVersion: "2025-02-24.acacia", typescript: false })
    : null;

  const attempts = [];
  if (!platformOnly && connectId?.startsWith("acct_")) {
    attempts.push({
      label: `connected account ${connectId}`,
      opts: { stripeAccount: connectId },
    });
  }
  attempts.push({ label: "platform account", opts: undefined });

  let products = [];
  let usedLabel = "";
  let usedOpts = undefined;

  if (!dry) {
    let best = null;
    for (const { label, opts } of attempts) {
      const list = await listAllProducts(stripe, opts);
      const found = Object.keys(IMAGE_PATH_BY_SLUG).filter(
        (slug) => findProductForSlug(list, slug, CATALOG_NAMES[slug]),
      ).length;
      if (!best || found > best.found) {
        best = { list, label, opts, found };
      }
      if (found === Object.keys(IMAGE_PATH_BY_SLUG).length) {
        products = list;
        usedLabel = label;
        usedOpts = opts;
        break;
      }
    }
    if (!products.length && best) {
      products = best.list;
      usedLabel = best.label;
      usedOpts = best.opts;
    }
  }

  console.log(
    dry
      ? "[dry-run] Would set product images from:"
      : `Using Stripe API (${usedLabel}) — image base:`,
  );
  console.log(`${siteRaw}\n`);

  for (const slug of Object.keys(IMAGE_PATH_BY_SLUG)) {
    const path = IMAGE_PATH_BY_SLUG[slug];
    const url = absoluteImageUrl(siteRaw, path);
    const name = CATALOG_NAMES[slug];

    if (dry) {
      console.log(`  ${slug}`);
      console.log(`    ${url}`);
      continue;
    }

    const prod = findProductForSlug(products, slug, name);
    if (!prod) {
      console.error(`SKIP ${slug}: product not found on ${usedLabel}`);
      continue;
    }

    const idem = `smashwraps-retail-product-images-${slug}`;
    await stripe.products.update(
      prod.id,
      { images: [url] },
      { ...(usedOpts || {}), idempotencyKey: idem },
    );
    console.log(`OK  ${slug} → ${prod.id}`);
    console.log(`    ${url}\n`);
  }

  if (dry) {
    console.log("\nRun without --dry-run after STRIPE_SECRET_KEY is set.");
  }
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
