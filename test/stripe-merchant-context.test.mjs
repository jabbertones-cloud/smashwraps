import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import {
  SMASH_WRAPS_STRIPE_ACCOUNT_ID,
  isSmashWrapsAccountContextConfigured,
  requireSmashWrapsAccountContext,
} from "../lib/stripe-account-guard.ts";

const source = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("only the catalog-verified Smash Wraps account is accepted", () => {
  assert.equal(requireSmashWrapsAccountContext(SMASH_WRAPS_STRIPE_ACCOUNT_ID), SMASH_WRAPS_STRIPE_ACCOUNT_ID);
  assert.equal(requireSmashWrapsAccountContext(` ${SMASH_WRAPS_STRIPE_ACCOUNT_ID} `), SMASH_WRAPS_STRIPE_ACCOUNT_ID);
  for (const account of [undefined, "", "acct_othermerchant", "acct_1SNWTGREP1weX7Ss", "acct_1THIPiIokkmXI2SVother"]) {
    assert.equal(isSmashWrapsAccountContextConfigured(account), false);
    assert.throws(() => requireSmashWrapsAccountContext(account), /stripe_account_context_missing_or_mismatched/);
  }
});

test("Stripe client always uses the designated merchant rather than falling back to platform", () => {
  const api = source("lib/stripe-server.ts");
  assert.match(api, /stripeAccount:\s*requireSmashWrapsAccountContext\(process\.env\.STRIPE_CONNECT_ACCOUNT_ID\)/);
  assert.doesNotMatch(api, /return undefined;/);
});

test("retail, wholesale and analytics fail closed when merchant context is missing or wrong", () => {
  for (const route of ["app/api/checkout/route.ts", "app/api/checkout/wholesale/route.ts", "app/api/checkout/session-for-analytics/route.ts"]) {
    const api = source(route);
    assert.match(api, /isSmashWrapsAccountContextConfigured\(process\.env\.STRIPE_CONNECT_ACCOUNT_ID\)/, route);
    assert.match(api, /process\.env\.STRIPE_SECRET_KEY/, route);
    assert.match(api, /status:\s*503/, route);
  }
});

test("both checkout channels exclude platform fallback and preserve explicit idempotency", () => {
  for (const route of ["app/api/checkout/route.ts", "app/api/checkout/wholesale/route.ts"]) {
    const api = source(route);
    assert.doesNotMatch(api, /const session = connectOpts\s*\?/, route);
    assert.match(api, /stripe\.checkout\.sessions\.create\(sessionPayload,\s*\{\s*\.\.\.connectOpts,\s*idempotencyKey/, route);
  }
  assert.match(source("app/api/checkout/route.ts"), /checkout_retail_\$\{cartHash\}_v2/);
});
