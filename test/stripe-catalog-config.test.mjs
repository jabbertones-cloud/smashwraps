import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const vars = Object.fromEntries(
  readFileSync(new URL("../.env.example", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => /^STRIPE_(?:WHOLESALE_)?(?:PRODUCT|PRICE)_[A-Z0-9_]+=/.test(line))
    .map((line) => line.split("=", 2)),
);

test("all 16 retail and wholesale price/product IDs have valid provider shapes", () => {
  const ids = Object.entries(vars);
  assert.equal(ids.length, 32);
  for (const [name, id] of ids) {
    const prefix = name.includes("_PRICE_") ? "price" : "prod";
    assert.match(id, new RegExp(`^${prefix}_[A-Za-z0-9]+$`), name);
  }
});

test("verified Passion Fruit 1g wholesale Price ID matches the catalog", () => {
  assert.equal(vars.STRIPE_WHOLESALE_PRICE_PASSION_FRUIT_1G, "price_1THLuWIokkmXI2SVVTyJE3wi");
});
