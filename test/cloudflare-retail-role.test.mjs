import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("retail build deliberately drops fallback assetPrefix", () => {
  const source = read("next.config.ts");
  assert.match(source, /SMASHCONES_WORKER_ROLE\s*===\s*"retail"/);
  assert.match(source, /smashwraps\.smatdesigns\.workers\.dev/);
});

test("retail is its own Cloudflare Worker with protected bindings", () => {
  const config = JSON.parse(read("wrangler.retail.jsonc"));
  assert.equal(config.name, "smashwraps-retail");
  const fallback = JSON.parse(read("wrangler.jsonc"));
  assert.deepEqual(
    Object.fromEntries(Object.entries(config).filter(([key]) => key !== "name")),
    Object.fromEntries(Object.entries(fallback).filter(([key]) => key !== "name")),
    "The retail config must only differ by its Worker name",
  );

  assert.equal(config.keep_vars, true);
  assert.equal(config.assets.directory, ".open-next/assets");
  assert.equal(config.assets.binding, "ASSETS");
  assert.equal(config.routes, undefined);
  assert.equal(config.vars?.NEXT_PUBLIC_SITE_URL, "https://smashcones.com");
  assert.equal(JSON.stringify(config).includes("STRIPE_SECRET_KEY"), false);
});

test("building retail requires explicit role and never auto-deploys", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.match(pkg.scripts["worker:build:retail"], /^SMASHCONES_WORKER_ROLE=retail /);
  assert.match(pkg.scripts["worker:preview:retail"], /wrangler dev --config wrangler\.retail\.jsonc/);
  assert.equal(pkg.scripts["worker:deploy:retail"], undefined);
});
