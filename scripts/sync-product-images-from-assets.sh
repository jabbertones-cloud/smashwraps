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

# Pack / hero + PDP / shop (filenames must match lib/chop-images.ts)
copy "AllCaseBoxesChops-1b9b8035-e210-4abe-b9b4-106c248970b1.png" "AllCaseBoxesChops.png"
copy "1gCasePassionFruitChops-730e1ba7-7ea6-4bd2-9a32-eb52dcde021c.png" "1gCasePassionFruitChops.png"
copy "1gCasePineappleChops-b65a3522-118d-47f7-b13a-8c743fa4eb44.png" "1gCasePineappleChops.png"
copy "1gCaseVanillaChops-626d1ecb-6173-4289-b126-91e3a4fb8445.png" "1gCaseVanillaChops.png"
copy "1gIcedWatermelonChopsCase-400ee8b8-a7f9-4e0d-9236-0339a248a781.png" "1gIcedWatermelonChopsCase.png"
copy "2gCasePassionFruitChops-33291e49-9f6b-4410-ac1d-0a44fee5d38a.png" "2gCasePassionFruitChops.png"
copy "2gCasePineappleChops-45ff8399-a620-4b29-9fe2-dffd792b3f84.png" "2gCasePineappleChops.png"
copy "2gCaseVanillaChops-ac7ee087-1596-4414-a36c-e8c11b8dd8db.png" "2gCaseVanillaChops.png"
copy "2gIcedWatermelonChopsCase-dfe0c1ca-4e9a-45a6-b251-e358100960fd.png" "2gIcedWatermelonChopsCase.png"
copy "IcedWatermelonChops-aa20dc6c-5a40-4bdc-93bd-cf4620686a5f.png" "IcedWatermelonChops.png"
copy "PassionFruitChops-10182ecc-82d0-4472-9fd6-dda0273e4a41.png" "PassionFruitChops.png"
copy "PineappleChops-2cbf61d8-104e-4cb1-9dcd-957ee0378887.png" "PineappleChops.png"
copy "VanillaChops-55690dd6-74e8-404f-b60b-ad6d290333bd.png" "VanillaChops.png"

# How-it-works + logo (if present under same assets folder)
copy "Screenshot_2026-04-01_at_12.41.23_AM-6c1a004b-8d52-43de-9ffa-3f22461f790b.png" "how-smash-capsule.png"
copy "image-d1f40155-a6f2-4df6-820c-6a91688ef471.png" "smash-wraps-logo.png"

echo "Done. Commit public/images if files changed, then deploy."
