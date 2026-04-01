#!/usr/bin/env bash
# Copy real product PNGs from your shared Cursor assets into public/images/.
# Usage (from repo root): npm run images:sync
# Override source: SMASHWRAP_ASSETS_SOURCE=/path/to/assets npm run images:sync

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/images"
SOURCE="${SMASHWRAP_ASSETS_SOURCE:-}"

if [[ -z "$SOURCE" || ! -d "$SOURCE" ]]; then
  # Default: Cursor project assets for this workspace (macOS path)
  DEFAULT="$HOME/.cursor/projects/Users-scottmanthey-claw-architect/assets"
  if [[ -d "$DEFAULT" ]]; then
    SOURCE="$DEFAULT"
  else
    echo "Set SMASHWRAP_ASSETS_SOURCE to the folder containing the shared PNGs (e.g. .../assets)." >&2
    exit 1
  fi
fi

echo "Source: $SOURCE"
echo "Output:  $OUT"
mkdir -p "$OUT"

copy() {
  local src="$1" dest="$2"
  if [[ ! -f "$SOURCE/$src" ]]; then
    echo "MISSING (skip): $SOURCE/$src" >&2
    return 0
  fi
  cp -f "$SOURCE/$src" "$OUT/$dest"
  echo "ok $dest"
}

# Hero strip + PDP master cases (JPEG → .jpg; lib/chop-images.ts)
copy "AllCaseBoxesChops_2-06b5f723-5238-4e3f-8cc0-1b3bd80d883b.png" "AllCaseBoxesChops.jpg"
copy "1gIcedWatermelonChopsCase-b1982a98-921d-444b-ac2b-b6b31d0e31e6.png" "1gIcedWatermelonChopsCase.jpg"
copy "2gIcedWatermelonChopsCase-c15846c4-7e69-459e-b72c-076281f9a84f.png" "2gIcedWatermelonChopsCase.jpg"
copy "1gCasePassionFruitChops-3556e936-c59d-4606-8a0a-38e027e172a3.png" "1gCasePassionFruitChops.jpg"
copy "2gCasePassionFruitChops-45932d90-df7b-4d17-bd4c-e93296c8c41c.png" "2gCasePassionFruitChops.jpg"
copy "1gCasePineappleChops-5b1b5907-08dd-424c-a2da-0dc13080ef08.png" "1gCasePineappleChops.jpg"
copy "2gCasePineappleChops-ef2a5a1e-20ac-4fc8-895a-46ef9b77ae2c.png" "2gCasePineappleChops.jpg"
copy "1gCaseVanillaChops-9753df2c-6334-4387-bb63-3ee866b9752c.png" "1gCaseVanillaChops.jpg"
copy "2gCaseVanillaChops-008eb0ef-8737-4876-be97-4455e2e8f0ca.png" "2gCaseVanillaChops.jpg"

# 3-pack box shots (single unit the customer buys)
copy "IcedWatermelonChops-aa20dc6c-5a40-4bdc-93bd-cf4620686a5f.png" "IcedWatermelonChops.png"
copy "PassionFruitChops-10182ecc-82d0-4472-9fd6-dda0273e4a41.png" "PassionFruitChops.png"
copy "PineappleChops-2cbf61d8-104e-4cb1-9dcd-957ee0378887.png" "PineappleChops.png"
copy "VanillaChops-55690dd6-74e8-404f-b60b-ad6d290333bd.png" "VanillaChops.png"

# How-it-works + logo (if present under same assets folder)
copy "Screenshot_2026-04-01_at_12.41.23_AM-6c1a004b-8d52-43de-9ffa-3f22461f790b.png" "how-smash-capsule.png"
# Brand + flavor art: transparent / black-background–friendly (2026-04 drop)
copy "image-afea60f7-8e37-4963-a5d7-044b2d61e088.png" "smash-wraps-logo.png"

# Flavor logos (lib/chop-images FLAVOR_LOGO)
copy "image-8620f140-95c7-4b5d-92a8-aceb783a1a01.png" "flavor-iced-watermelon.png"
copy "image-e41dd7cb-e529-4e42-bbbc-2308e2aee7cc.png" "flavor-passion-fruit.png"
copy "image-47177dcc-bbdc-466c-a1d7-8d5a6e9e6200.png" "flavor-pineapple.png"
copy "image-2e0d3e8c-517a-4125-bdab-7d83459bea99.png" "flavor-vanilla.png"

echo "Done. Commit public/images if files changed, then deploy."
