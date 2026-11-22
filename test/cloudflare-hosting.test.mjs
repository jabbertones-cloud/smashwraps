import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const text = (path) => readFileSync(path, "utf8");

test("no obsolete tracking component or direct dependency", () => {
  const pkg = JSON.parse(text("package.json"));
  assert.equal(pkg.dependencies?.["@vercel/analytics"], undefined);
  assert.doesNotMatch(text("app/providers.tsx"), /@vercel\/analytics|<Analytics\s*\/>/);
  assert.match(text("app/layout.tsx"), /<MarketingTags\s*\/>/);
});

test("only Cloudflare deployment configuration is retained", () => {
  for (const path of ["vercel.json", ".vercel/project.json", "docs/VERCEL-SETUP.md"])
    assert.equal(existsSync(path), false, `${path} must not be tracked`);
  const wrangler = JSON.parse(text("wrangler.jsonc"));
  assert.equal(wrangler.name, "smashwraps");
  assert.equal(wrangler.keep_vars, true);
  assert.equal(wrangler.assets.directory, ".open-next/assets");
  assert.equal(wrangler.assets.binding, "ASSETS");
});

test("informational assets stay bound to their own Worker", () => {
  assert.match(text("next.config.ts"), /\?\s*undefined\s*:\s*"https:\/\/smashwraps\.smatdesigns\.workers\.dev"/);
  assert.match(text("docs/CLOUDFLARE-SMASHCONES.md"), /smashwraps-retail/);
});
