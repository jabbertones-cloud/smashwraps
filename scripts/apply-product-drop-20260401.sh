#!/usr/bin/env bash
# One-time mapping: Cursor asset UUIDs → public/images canonical names (Apr 2025 retail box renders).
# Re-run after dropping updated files into ~/.cursor/.../assets with the same UUID filenames.

set -euo pipefail
ASSETS="${SMASHWRAP_ASSETS_SOURCE:-$HOME/.cursor/projects/Users-scottmanthey-claw-architect/assets}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/images"
mkdir -p "$OUT"

[[ -d "$ASSETS" ]] || { echo "Missing assets dir: $ASSETS" >&2; exit 1; }

cp -f "$ASSETS/image-a6375aa4-9075-44c8-a3dd-33f1610253fc.png" "$OUT/1gCaseVanillaChops.png"
cp -f "$ASSETS/image-1357c59f-1b47-439c-8808-f474b5dfc1a2.png" "$OUT/2gCaseVanillaChops.png"
cp -f "$ASSETS/image-091b0890-6160-4e90-b04b-843476aedcd6.png" "$OUT/1gCasePassionFruitChops.png"
cp -f "$ASSETS/image-65c4b199-1604-4ae7-8a06-8ff196014624.png" "$OUT/2gCasePassionFruitChops.png"
cp -f "$ASSETS/image-08432847-a24b-47b0-bd44-919c25dd6e94.png" "$OUT/1gIcedWatermelonChopsCase.png"
cp -f "$ASSETS/image-c7e4fe80-b20a-4a4b-98d5-3f4a70e06245.png" "$OUT/2gIcedWatermelonChopsCase.png"
cp -f "$ASSETS/image-01b328c1-c7d2-4858-9e8e-df1e8662756b.png" "$OUT/1gCasePineappleChops.png"
cp -f "$ASSETS/image-8fef4d94-6f15-4906-a13a-4dedbe168449.png" "$OUT/2gCasePineappleChops.png"

# Master multi-flavor case (hero + PDP first image) — from brand asset pack
if [[ -f "$ASSETS/AllCaseBoxesChops-1b9b8035-e210-4abe-b9b4-106c248970b1.png" ]]; then
  cp -f "$ASSETS/AllCaseBoxesChops-1b9b8035-e210-4abe-b9b4-106c248970b1.png" "$OUT/AllCaseBoxesChops.png"
fi
echo "Applied retail box drop → $OUT"
