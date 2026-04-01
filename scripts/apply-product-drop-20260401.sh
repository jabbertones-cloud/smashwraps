#!/usr/bin/env bash
# Cursor asset UUIDs → public/images canonical names (retail master-case JPEGs).
# Re-run after dropping updated files into ~/.cursor/.../assets.

set -euo pipefail
ASSETS="${SMASHWRAP_ASSETS_SOURCE:-$HOME/.cursor/projects/Users-scottmanthey-claw-architect/assets}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/images"
mkdir -p "$OUT"

[[ -d "$ASSETS" ]] || { echo "Missing assets dir: $ASSETS" >&2; exit 1; }

cp -f "$ASSETS/AllCaseBoxesChops_2-06b5f723-5238-4e3f-8cc0-1b3bd80d883b.png" "$OUT/AllCaseBoxesChops.jpg"
cp -f "$ASSETS/1gIcedWatermelonChopsCase-b1982a98-921d-444b-ac2b-b6b31d0e31e6.png" "$OUT/1gIcedWatermelonChopsCase.jpg"
cp -f "$ASSETS/2gIcedWatermelonChopsCase-c15846c4-7e69-459e-b72c-076281f9a84f.png" "$OUT/2gIcedWatermelonChopsCase.jpg"
cp -f "$ASSETS/1gCasePassionFruitChops-3556e936-c59d-4606-8a0a-38e027e172a3.png" "$OUT/1gCasePassionFruitChops.jpg"
cp -f "$ASSETS/2gCasePassionFruitChops-45932d90-df7b-4d17-bd4c-e93296c8c41c.png" "$OUT/2gCasePassionFruitChops.jpg"
cp -f "$ASSETS/1gCasePineappleChops-5b1b5907-08dd-424c-a2da-0dc13080ef08.png" "$OUT/1gCasePineappleChops.jpg"
cp -f "$ASSETS/2gCasePineappleChops-ef2a5a1e-20ac-4fc8-895a-46ef9b77ae2c.png" "$OUT/2gCasePineappleChops.jpg"
cp -f "$ASSETS/1gCaseVanillaChops-9753df2c-6334-4387-bb63-3ee866b9752c.png" "$OUT/1gCaseVanillaChops.jpg"
cp -f "$ASSETS/2gCaseVanillaChops-008eb0ef-8737-4876-be97-4455e2e8f0ca.png" "$OUT/2gCaseVanillaChops.jpg"

echo "Applied retail master-case drop → $OUT"
