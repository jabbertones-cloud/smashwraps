#!/usr/bin/env bash
# Create Stripe Products + Prices for wholesale cases only (lib/wholesale-products.ts).
# Retail catalog uses stripe:seed / seed-stripe-catalog.sh — that does NOT create wholesale SKUs.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.local ]] && [[ -z "${STRIPE_SECRET_KEY:-}" ]]; then
  echo "Missing credentials: copy .env.example to .env.local and set STRIPE_SECRET_KEY."
  echo "For Connect, set STRIPE_CONNECT_ACCOUNT_ID so wholesale products are created on that account."
  exit 1
fi

echo "Seeding Stripe wholesale: 8 case products + 8 prices (see lib/wholesale-products.ts)..."
exec node scripts/stripe-seed-wholesale-products.mjs "$@"
