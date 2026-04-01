#!/usr/bin/env bash
# Cursor asset UUIDs → public/images canonical names (retail master-case PNGs).
# Re-run after dropping updated files into ~/.cursor/.../assets.

set -euo pipefail
ASSETS="${SMASHWRAP_ASSETS_SOURCE:-$HOME/.cursor/projects/Users-scottmanthey-claw-architect/assets}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/images"
mkdir -p "$OUT"

[[ -d "$ASSETS" ]] || { echo "Missing assets dir: $ASSETS" >&2; exit 1; }

cp -f "$ASSETS/AllCaseBoxesChops_2-06b5f723-5238-4e3f-8cc0-1b3bd80d883b.png" "$OUT/AllCaseBoxesChops.jpg"
cp -f "$ASSETS/1gIcedWatermelonChopsCase-9c6b1b01-0e58-42d3-82ba-a48f8d59730f.png" "$OUT/1gIcedWatermelonChopsCase.png"
cp -f "$ASSETS/2gIcedWatermelonChopsCase-3c89188f-a6e5-4a96-83bd-e3e7f35f1729.png" "$OUT/2gIcedWatermelonChopsCase.png"
cp -f "$ASSETS/1gCasePassionFruitChops-1abf6746-fb7b-4fd7-974e-538e055785e9.png" "$OUT/1gCasePassionFruitChops.png"
cp -f "$ASSETS/2gCasePassionFruitChops-08f232b6-254b-48c3-bccf-64ae8576e14a.png" "$OUT/2gCasePassionFruitChops.png"
cp -f "$ASSETS/1gCasePineappleChops-5d8b8b02-33a6-4384-b452-0e900872bde6.png" "$OUT/1gCasePineappleChops.png"
cp -f "$ASSETS/2gCasePineappleChops-18d23da1-cc23-491a-a54b-54d11728b9f9.png" "$OUT/2gCasePineappleChops.png"
cp -f "$ASSETS/1gCaseVanillaChops-c73961ae-c54b-4966-81a7-a521b182026d.png" "$OUT/1gCaseVanillaChops.png"
cp -f "$ASSETS/2gCaseVanillaChops-855e0f2f-3276-4980-bba2-9a8bfe4c33e2.png" "$OUT/2gCaseVanillaChops.png"

echo "Applied retail master-case drop → $OUT"
