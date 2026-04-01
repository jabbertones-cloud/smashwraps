#!/usr/bin/env bash
# Create all Stripe Products + Prices for the retail catalog (matches lib/products.ts).
# Reads STRIPE_SECRET_KEY (and optional STRIPE_CONNECT_ACCOUNT_ID) from .env.local
# via scripts/stripe-seed-chop-products.mjs — same as npm run stripe:seed.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.local ]] && [[ -z "${STRIPE_SECRET_KEY:-}" ]]; then
  echo "Missing credentials: copy .env.example to .env.local and set STRIPE_SECRET_KEY."
  echo "For Connect checkout, also set STRIPE_CONNECT_ACCOUNT_ID so seed targets that account."
  exit 1
fi

echo "Seeding Stripe: 8 products + 8 prices (see lib/products.ts)..."
exec node scripts/stripe-seed-chop-products.mjs "$@"
