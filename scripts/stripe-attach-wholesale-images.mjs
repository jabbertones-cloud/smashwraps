#!/usr/bin/env node
/**
 * Point Stripe wholesale Product `images` at the same live `/images/...` URLs as the storefront (already hosted on your public origin).
 * See stripe-attach-product-images.mjs for behavior; this file maps wholesale SKUs to those paths.
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

const IMAGE_PATH_BY_SLUG = {
  "wholesale-case-iced-watermelon-1g": "/images/IcedWatermelonChops.png",
  "wholesale-case-iced-watermelon-2g": "/images/IcedWatermelonChops.png",
  "wholesale-case-passion-fruit-1g": "/images/PassionFruitChops.png",
  "wholesale-case-passion-fruit-2g": "/images/PassionFruitChops.png",
  "wholesale-case-pineapple-1g": "/images/PineappleChops.png",
  "wholesale-case-pineapple-2g": "/images/PineappleChops.png",
  "wholesale-case-vanilla-1g": "/images/VanillaChops.png",
  "wholesale-case-vanilla-2g": "/images/VanillaChops.png",
};

const CATALOG_NAMES = {
  "wholesale-case-iced-watermelon-1g":
    "The CHOP — Iced Watermelon (1g) — Case (12 units)",
  "wholesale-case-iced-watermelon-2g":
    "The CHOP — Iced Watermelon (2g) — Case (12 units)",
  "wholesale-case-passion-fruit-1g":
    "The CHOP — Passion Fruit (1g) — Case (12 units)",
  "wholesale-case-passion-fruit-2g":
    "The CHOP — Passion Fruit (2g) — Case (12 units)",
  "wholesale-case-pineapple-1g": "The CHOP — Pineapple (1g) — Case (12 units)",
  "wholesale-case-pineapple-2g": "The CHOP — Pineapple (2g) — Case (12 units)",
  "wholesale-case-vanilla-1g": "The CHOP — Vanilla (1g) — Case (12 units)",
  "wholesale-case-vanilla-2g": "The CHOP — Vanilla (2g) — Case (12 units)",
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
      "Set NEXT_PUBLIC_SITE_URL or STRIPE_IMAGE_SITE_URL (https://…).",
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
      ? "[dry-run] Would set wholesale product images from:"
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

    const idem = `smashwraps-wholesale-product-images-${slug}`;
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
