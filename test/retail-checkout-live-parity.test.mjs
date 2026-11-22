import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
const source = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("retail API maintains live attempt-scoped v2 checkout contract", () => {
  const api = source("app/api/checkout/route.ts");
  assert.match(api, /checkoutAttemptId:\s*z\.string\(\)\.uuid\(\)/);
  assert.match(api, /checkoutAttemptId:\s*parsed\.checkoutAttemptId/);
  assert.match(api, /checkout_retail_\$\{cartHash\}_v2/);
  assert.match(api, /checkout_attempt_id:\s*parsed\.checkoutAttemptId/);
  assert.doesNotMatch(api, /automatic_payment_methods/);
});

test("cart client reuses a native UUID on retry, resets after redirect", () => {
  const client = source("components/cart-drawer.tsx");
  assert.match(client, /useRef<string\s*\|\s*null>\(null\)/);
  assert.match(client, /checkoutAttemptId\.current\s*\?\?=\s*crypto\.randomUUID\(\)/);
  assert.match(client, /checkoutAttemptId:\s*checkoutAttemptId\.current/);
  assert.match(client, /checkoutAttemptId\.current\s*=\s*null/);
});

test("wholesale uses buyer-attempt-scoped v2 idempotency", () => {
  const api = source("app/api/checkout/wholesale/route.ts");
  assert.match(api, /checkoutAttemptId:\s*z\.string\(\)\.uuid\(\)/);
  assert.match(api, /checkoutAttemptId:\s*parsed\.checkoutAttemptId/);
  assert.match(api, /checkout_wholesale_\$\{wholesaleCartHash\}_v2/);
  assert.match(api, /checkout_attempt_id:\s*parsed\.checkoutAttemptId/);
  assert.doesNotMatch(api, /automatic_payment_methods/);
  const client = source("components/wholesale-sales-sheet.tsx");
  assert.match(client, /checkoutAttemptId\.current\s*\?\?=\s*crypto\.randomUUID\(\)/);
  assert.match(client, /checkoutAttemptId:\s*checkoutAttemptId\.current/);
  assert.match(client, /checkoutAttemptId\.current\s*=\s*null/);
});
