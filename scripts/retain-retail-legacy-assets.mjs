import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const manifest = JSON.parse(await readFile(new URL("./retail-legacy-assets.json", import.meta.url)));
assert.equal(manifest.source, "https://smashcones.com");
let preserved = 0;
for (const [path, metadata] of Object.entries(manifest.assets)) {
  const relative = decodeURIComponent(path).replace(/^\//, "");
  assert.match(relative, /^_next\/static\/[A-Za-z0-9_./\[\]-]+$/);
  assert(!relative.includes(".."), "Asset traversal prohibited");
  assert.match(metadata.sha256, /^[a-f0-9]{64}$/);
  const target = resolve(".open-next/assets", relative);
  let bytes;
  try { bytes = await readFile(target); } catch (error) {
    if (error.code !== "ENOENT") throw error;
    const response = await fetch(new URL(path, manifest.source), { signal: AbortSignal.timeout(20000) });
    assert.equal(response.status, 200, `Missing legacy asset ${path}`);
    assert.equal(response.headers.get("content-type")?.split(";")[0], metadata.type, path);
    bytes = Buffer.from(await response.arrayBuffer());
  }
  assert.equal(bytes.length, metadata.bytes, path);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), metadata.sha256, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes, { flag: "w" });
  preserved++;
}
console.log(`Legacy retail hashed assets verified: ${preserved}`);
