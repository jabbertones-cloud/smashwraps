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

# Hero strip (still JPEG for home hero) + PDP / wholesale master cases (PNG; lib/chop-images.ts)
copy "AllCaseBoxesChops_2-06b5f723-5238-4e3f-8cc0-1b3bd80d883b.png" "AllCaseBoxesChops.jpg"
copy "1gIcedWatermelonChopsCase-9c6b1b01-0e58-42d3-82ba-a48f8d59730f.png" "1gIcedWatermelonChopsCase.png"
copy "2gIcedWatermelonChopsCase-3c89188f-a6e5-4a96-83bd-e3e7f35f1729.png" "2gIcedWatermelonChopsCase.png"
copy "1gCasePassionFruitChops-1abf6746-fb7b-4fd7-974e-538e055785e9.png" "1gCasePassionFruitChops.png"
copy "2gCasePassionFruitChops-08f232b6-254b-48c3-bccf-64ae8576e14a.png" "2gCasePassionFruitChops.png"
copy "1gCasePineappleChops-5d8b8b02-33a6-4384-b452-0e900872bde6.png" "1gCasePineappleChops.png"
copy "2gCasePineappleChops-18d23da1-cc23-491a-a54b-54d11728b9f9.png" "2gCasePineappleChops.png"
copy "1gCaseVanillaChops-c73961ae-c54b-4966-81a7-a521b182026d.png" "1gCaseVanillaChops.png"
copy "2gCaseVanillaChops-855e0f2f-3276-4980-bba2-9a8bfe4c33e2.png" "2gCaseVanillaChops.png"

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
