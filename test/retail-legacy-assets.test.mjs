import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const manifest = JSON.parse(readFileSync(new URL("../scripts/retail-legacy-assets.json", import.meta.url)));
test("legacy asset inventory uses explicit immutable hashes and fixed Cloudflare origin", () => {
  assert.equal(manifest.source, "https://smashcones.com");
  assert.equal(Object.keys(manifest.assets).length, 22);
  for (const [path, meta] of Object.entries(manifest.assets)) {
    const relative = decodeURIComponent(path).slice(1);
    assert.match(relative, /^_next\/static\/[A-Za-z0-9_./\[\]-]+$/);
    assert(!relative.includes(".."));
    assert.match(meta.sha256, /^[a-f0-9]{64}$/);
    assert(meta.bytes > 0 && meta.bytes < 2_000_000);
  }
});

test("if generated retail bundle exists, all previous asset bytes are preserved", () => {
  if (!existsSync(".open-next/worker.js")) return;
  for (const [path, meta] of Object.entries(manifest.assets)) {
    const file = ".open-next/assets/" + decodeURIComponent(path).slice(1);
    assert(existsSync(file), file);
    const buffer = readFileSync(file);
    assert.equal(buffer.length, meta.bytes, path);
    assert.equal(createHash("sha256").update(buffer).digest("hex"), meta.sha256, path);
  }
});
